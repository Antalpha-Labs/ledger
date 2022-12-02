import argparse
import asyncio
from datetime import datetime
from decimal import Decimal
from typing import Union
from enum import Enum

import eth_utils
import leancloud
from leancloud import LeanCloudError
from web3 import Web3
from environs import Env


env = Env()
# load env
env.read_env('.env')
APP_ID = env.str('APP_ID')
APP_KEY = env.str('APP_KEY')
WEB3_INFURA_PROJECT_ID = env.str('WEB3_INFURA_PROJECT_ID')
leancloud.init(APP_ID, APP_KEY)

# add your blockchain connection information
infura_url = f'https://arbitrum-mainnet.infura.io/v3/{WEB3_INFURA_PROJECT_ID}'
web3 = Web3(Web3.HTTPProvider(infura_url))

# const
# contract address
nft_swap_addr = '0x09986b4e255b3c548041a30a2ee312fe176731c2'
swap_addr = '0xf904469497e6a179a9d47a7b468e4be42ec56e65'
MAGIC = '0x539bde0d7dbd336b79148aa742883198bbf60342'
ELM = '0x45d55eadf0ed5495b369e040af0717eafae3b731'
NFT_TOKENS = ['0x7480224ec2b98f28cee3740c80940a2f489bf352', '0x381227255ef6c5d85966b78d13e4b4a4c8719b5e']  # 英雄、遗物合约

# table name
OVERALL_ACTIVITY = 'OverallActivity'
DISTANCE = 'Distance'
user_addr = None

latest_sync_block = {}


class GameID(Enum):
    ELLERIA = 1
    BRIDGEWORLD = 2


# 查找event应该从合约第一笔调用的区块开始，减少查询量
start_block_map = {
    swap_addr: 21196141,
    nft_swap_addr: 25107634,
    MAGIC: 20402884,
}


def parse_input(types: list, input_data: str):
    input_bytes = bytes.fromhex(input_data[10:])
    params = Web3().codec.decode_abi(types, input_bytes)
    return params


def parse_event_data(types, data):
    if len(data) <= 2:
        raise ValueError("event data is invalid")
    return Web3().codec.decode_abi(types, bytes.fromhex(data[2:]))


def make_db_record(hash_block, hash_tx, quantity, type):
    global user_addr
    # handle block
    block_info = web3.eth.getBlock(hash_block)
    unixTimestamp = block_info['timestamp']
    blockno = block_info['number']
    date_time = datetime.fromtimestamp(unixTimestamp)

    db_record = {
        'identifier': GameID.ELLERIA.value,
        'blockno': blockno,
        'address': user_addr,
        'txHash': hash_tx.hex(),
        'unixTimestamp': unixTimestamp,
        'dateTime': date_time,
        'quantity': '{0:f}'.format(quantity),
        'type': type,
    }
    return db_record


# handle event
def handle_swap_event(event):
    print(f"swap event handle：{event['transactionHash'].hex()}")
    latest_sync_block[swap_addr] = event['blockNumber']
    hash_tx = event['transactionHash']
    hash_block = event['blockHash']
    data = event['data']
    event_data = parse_event_data(['uint256', 'uint256', 'uint256', 'uint256'], data)

    # handle transcation
    types = ['uint256', 'uint256', 'address[]', 'address', 'uint256']
    tx = web3.eth.getTransaction(hash_tx)
    input = tx['input']
    params = parse_input(types, input)
    input_token, output_token = params[2]
    if input_token == MAGIC and output_token == ELM:
        type = 2  # 1 for profit, 2 for loss
        quantity = Decimal(event_data[1]) / Decimal(1e18)
    elif input_token == ELM and output_token == MAGIC:
        type = 1
        quantity = Decimal(event_data[3]) / Decimal(1e18)
    else:
        return

    db_record = make_db_record(hash_block, hash_tx, quantity, type)
    # save to leancloud
    save_to_db(db_record)


def handle_nft_swap_event(event):
    global user_addr
    latest_sync_block[nft_swap_addr] = event['blockNumber']
    hash_tx = event['transactionHash']
    hash_block = event['blockHash']
    data = event['data']
    event_data = parse_event_data(['address', 'address', 'address', 'uint256', 'uint64', 'uint128', 'address'], data)
    seller, buyer, nftAddress, _, quantity, pricePerItem, paymentToken = event_data
    if nftAddress in NFT_TOKENS and paymentToken == MAGIC:
        if user_addr == seller:
            type = 1
        elif user_addr == buyer:
            type = 2
        else:
            type = None
    else:
        return

    if not type:
        return

    total_quantity = quantity * pricePerItem
    # 需扣除平台抽成与版税
    final_quantity = Decimal(total_quantity - total_quantity * 0.025 - total_quantity * 0.05) / Decimal(1e18)
    db_record = make_db_record(hash_block, hash_tx, final_quantity, type)
    # save to leancloud
    save_to_db(db_record)


def handle_world_boss_event(event):
    print(f"world boss event handle：{event['transactionHash'].hex()}")
    hash_tx = event['transactionHash']
    hash_block = event['blockHash']
    latest_sync_block[MAGIC] = event['blockNumber']
    event_data = parse_event_data(['uint256'], event['data'])
    amount = event_data[0]
    quantity = Decimal(amount) / Decimal(1e18)
    db_record = make_db_record(hash_block, hash_tx, quantity, 1)
    save_to_db(db_record)


handle_func_map = {
    'elm_swap': handle_swap_event,
    'nft_swap': handle_nft_swap_event,
    'world_boss': handle_world_boss_event
}


def save_to_db(record: dict, table: str = OVERALL_ACTIVITY):
    print(f"OverallActivity: {record}")
    ClassObj = leancloud.Object.extend(table)
    obj = ClassObj(**record)
    try:
        obj.save()
    except leancloud.LeanCloudError as error:
        if error.code == 137:
            print(f"warning: dup tx insert:{record['txHash']}")
        else:
            raise


def save_or_update_db(records: Union[dict, list], table: str = DISTANCE) -> None:
    global user_addr
    if isinstance(records, dict):
        records = [records]
    ClassObj = leancloud.Object.extend(table)

    try:
        objs = ClassObj.query.equal_to('address', user_addr).find()
    except LeanCloudError as ex:
        # Class or object doesn't exists at first time to save data.
        if ex.code == 101:
            objs = []
        else:
            raise

    contract_obj_map = {}
    for obj in objs:
        contract_addr = obj.get('contract')
        contract_obj_map[contract_addr] = obj

    for record in records:
        if record['contract'] not in contract_obj_map:
            ClassObj(**record).save()
        else:
            obj = contract_obj_map[record['contract']]
            obj.set('blockno', record['blockno'])
            obj.save()


async def log_loop(event_filter, poll_interval, kind):
    current_block_no = event_filter['fromBlock']
    last_block_no = web3.eth.get_block_number()
    while current_block_no < last_block_no:
        print(f"{kind} current block no:{current_block_no}")
        new_event_filter = {
            "fromBlock": current_block_no,
            "toBlock": current_block_no + 1999,
            "address": event_filter["address"],
            "topics": event_filter["topics"]
        }
        latest_sync_block[event_filter["address"].lower()] = current_block_no
        handle_func = handle_func_map[kind]
        for event in web3.eth.get_logs(new_event_filter):
            handle_func(event)
        await asyncio.sleep(poll_interval)
        current_block_no = new_event_filter['toBlock'] + 1


async def find_last_blockno(addr, contract):
    # find last trace height of block for this address
    distance_class = leancloud.Object.extend(DISTANCE)

    try:
        obj = distance_class.query.equal_to('address', addr).equal_to('contract', contract).first()
    except LeanCloudError as error:
        if error.code == 101:
            return start_block_map.get(contract, 'earliest')
        else:
            raise

    return obj.get('blockno', 'earliest')


async def trace_swap_contract(poll_interval):
    print('start trace swap contract...........................')
    global user_addr
    last_blockno = await find_last_blockno(user_addr, swap_addr)

    nonprefix_user_addr = eth_utils.remove_0x_prefix(user_addr)
    topics = [
        '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
        '0x00000000000000000000000023805449f91bb2d2054d9ba288fdc8f09b5eac79',
        f'0x000000000000000000000000{nonprefix_user_addr}'
    ]
    event_filter = {
        "fromBlock": last_blockno,
        "address": Web3.toChecksumAddress(swap_addr),
        "topics": topics
    }

    await log_loop(event_filter, poll_interval, 'elm_swap')


async def trace_nft_swap_contract(poll_interval):
    print('start trace nft swap contract...........................')
    global user_addr
    last_blockno = await find_last_blockno(user_addr, nft_swap_addr)
    topics = ['0x72d3f914473a393354e6fcd9c3cb7d2eee53924b9b856f9da274e024566292a5']
    event_filter = {
        "fromBlock": last_blockno,
        "address": Web3.toChecksumAddress(nft_swap_addr),
        "topics": topics
    }
    await log_loop(event_filter, poll_interval, 'nft_swap')


async def trace_world_boss_contract(poll_interval):
    print('start trace world boss contract...........................')
    global user_addr
    last_blockno = await find_last_blockno(user_addr, MAGIC)
    nonprefix_user_addr = eth_utils.remove_0x_prefix(user_addr)
    topics = ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x00000000000000000000000084c8bd99df40626f6d9cb9a1e71d2f65278d75fa',
              f'0x000000000000000000000000{nonprefix_user_addr}']
    event_filter = {
        "fromBlock": last_blockno,
        "address": Web3.toChecksumAddress(MAGIC),
        "topics": topics
    }
    await log_loop(event_filter, poll_interval, 'world_boss')


def valid_address(addr):
    # 检查地址是否有效
    if not web3.isAddress(addr) or eth_utils.is_binary_address(addr):
        msg = f"Not a valid address: '{addr}'."
        raise argparse.ArgumentTypeError(msg)
    return addr


# when main is called
# create a filter according to the height of the last query and look for events for the related contracts
# run an async loop
# try to run the log_loop function above every {poll_interval} seconds default is 0 second
def main(argv=None):
    global user_addr
    parser = argparse.ArgumentParser('ledger trace script')
    parser.add_argument('--version', '-v', action='version',
                        version='%(prog)s version : v 0.01', help='show the version')
    parser.add_argument('address', type=valid_address,
                        help='0x or binary address that you want to trace')
    parser.add_argument('--interval', '-i', type=int, default=0,
                        help='The time interval for pulling bills from the chain，default is 0 second')

    args = parser.parse_args(argv)
    user_addr = args.address
    poll_interval = args.interval

    loop = asyncio.get_event_loop()
    try:
        print('pull start .....................................')
        loop.run_until_complete(
            asyncio.gather(
                trace_swap_contract(poll_interval),
                trace_nft_swap_contract(poll_interval),
                trace_world_boss_contract(poll_interval)
            )
        )
    finally:
        records = []
        for contract, blockno in latest_sync_block.items():
            record = {
                'address': user_addr,
                'contract': contract,
                'blockno': blockno
            }
            records.append(record)
        try:
            save_or_update_db(records)
        finally:
            print('pull complete！')
            loop.close()


if __name__ == "__main__":
    main()
