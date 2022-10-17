const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const AV = require('leancloud-storage');
const ethers = require('ethers');

dotenv.config({path: '.env.local'});

const argv = process.argv;
const LEANCLOUD_APPID = process.env.LEANCLOUD_APPID;
const LEANCLOUD_APPKEY = process.env.LEANCLOUD_APPKEY;
const CONTRACT_MAGIC_SWAP = '0x23805449f91bb2d2054d9ba288fdc8f09b5eac79';
const CONTRACT_TROVE_MARKETPLACE = '0x09986b4e255b3c548041a30a2ee312fe176731c2';
const CONTRACT_TREASUREDAO_MARKETPLACE_MULTISIG = '0xdb6ab450178babcf0e467c1f3b436050d907e233';

const ELLERIA_CONTRACT_CREATOR_FEE = '0x69832af74774bae99d999e7f74fe3f7d5833bf84';
const ELLERIA_WB = '0x84c8bd99df40626f6d9cb9a1e71d2f65278d75fa';
const ELLERIA_ELM = '0x45D55EADf0ED5495B369E040aF0717eaFaE3b731';
const ELLERIA_HEROS = '0x7480224ec2b98f28cee3740c80940a2f489bf352';
const ELLERIA_RELICS = '0x381227255ef6c5d85966b78d13e4b4a4c8719b5e';

const TARGET_ADDRESS = '0xd735e0259a4e48366f517cff39ebec16518b2d1c'; // 演示地址

const BRIDGEWORLD_LEGION = '0xfe8c1ac365ba6780aec5a985d989b327c27670a1';
const BRIDGEWORLD_TREASURES = '0xebba467ecb6b21239178033189ceae27ca12eadf';
const BRIDGEWORLD_CONSUMABLES = '0xf3d00a2559d84de7ac093443bcaada5f4ee4165c';
const BRIDGEWORLD_KEY = '0xf0a35ba261ece4fc12870e5b7b9e7790202ef9b5';
const BRIDGEWORLD_BALANCER_CRYSTAL = '0xbfeba04384cecfaf0240b49163ed418f82e43d3a';

AV.init({
  appId: LEANCLOUD_APPID,
  appKey: LEANCLOUD_APPKEY
});

const Game = AV.Object.extend('Game');
const OverallActivity = AV.Object.extend('OverallActivity');

function createOverallActivityRow(obj){
  const overallActivity = new OverallActivity();
  overallActivity.set('identifier', obj.identifier);
  overallActivity.set('address', obj.address);
  overallActivity.set('txHash',obj.txHash);
  overallActivity.set('blockn',obj.blockn);
  overallActivity.set('unixTimestamp', obj.unixTimestamp);
  overallActivity.set('dateTime', obj.dateTime);
  overallActivity.set('quantity', obj.quantity);
  overallActivity.set('type', obj.type);
  return overallActivity;
}

function createGameRow(obj){
  const game = new Game();
  game.set('identifier', obj.identifier);
  game.set('name', obj.name);
  return game;
}

async function run(){
  const elleria = createGameRow({
    identifier: 1,
    name: 'elleria'
  });
  const bridgeworld = createGameRow({
    identifier: 2,
    name: 'bridgeworld'
  });

  try{
    const result = await AV.Object.saveAll([elleria, bridgeworld]);
    console.log('Game 保存成功',result);
  } catch(e){
    console.log('Game 保存错误', e);
  } 
}

if (argv[2] && argv[2] === 'game'){
  run();
}

function readCSV(csvPath){
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvPath).pipe(csv()).on('data', (data) => {
      results.push(data);
    }).on('end', () => {
      resolve(results);
    });
  });
}

async function dbRun(){
  try{
    const csvPath = path.resolve(__dirname,'./db/export-token-elleria.csv');
    const db = await readCSV(csvPath);
    const reorganization = {};

    for (const iterator of db) {
      const {
        Txhash,
      } = iterator;
      if (!reorganization[Txhash]){
        reorganization[Txhash] = [];
      }
      const cur = reorganization[Txhash];
      cur.push(iterator);
    }

    const keys = Object.keys(reorganization);

    for (const key of keys) {
      const values = reorganization[key];
      let isSupport = true;
      let quantity = ethers.utils.parseEther('0');
      let identifier = 2;
      let type = 2;
      let txHash = key;
      let blockn = '';
      let unixTimestamp = '';
      let dateTime = '';
      values.forEach((value) => {
        const {
          Blockno,
          UnixTimestamp,
          DateTime,
          To,
          Quantity,
        } = value;
        if (To === ELLERIA_CONTRACT_CREATOR_FEE){
          identifier = 1;
        }
        if (To === TARGET_ADDRESS){
          type = 1;
        }
        const currentQuantity = ethers.utils.parseEther(Quantity || '0');
        quantity = quantity.add(currentQuantity);
        blockn = Blockno;
        unixTimestamp = UnixTimestamp;
        dateTime = DateTime;
      });
      console.log(values);
      if (txHash === '0xe838d5b3838627c80c7483b37ed48263e03a44d8dc6125c5178034d488cb34a6'){
        console.log(values);
        console.log(ethers.utils.formatEther(quantity));
      }
      if (isSupport){
        // 这是从 arb 上下载的 0xe838d5b3838627c80c7483b37ed48263e03a44d8dc6125c5178034d488cb34a6 数据
        const test = [
          {
            Txhash: '0xe838d5b3838627c80c7483b37ed48263e03a44d8dc6125c5178034d488cb34a6',
            Blockno: '28978205',
            UnixTimestamp: '1665191773',
            DateTime: '2022-10-08 01:16:13',
            From: '0xd735e0259a4e48366f517cff39ebec16518b2d1c',
            To: '0xdb6ab450178babcf0e467c1f3b436050d907e233',
            Quantity: '0.85',
            Method: 'Buy Items'
          },
          {
            Txhash: '0xe838d5b3838627c80c7483b37ed48263e03a44d8dc6125c5178034d488cb34a6',
            Blockno: '28978205',
            UnixTimestamp: '1665191773',
            DateTime: '2022-10-08 01:16:13',
            From: '0xd735e0259a4e48366f517cff39ebec16518b2d1c',
            To: '0x69832af74774bae99d999e7f74fe3f7d5833bf84',
            Quantity: '1.7',
            Method: 'Buy Items'
          },
          {
            Txhash: '0xe838d5b3838627c80c7483b37ed48263e03a44d8dc6125c5178034d488cb34a6',
            Blockno: '28978205',
            UnixTimestamp: '1665191773',
            DateTime: '2022-10-08 01:16:13',
            From: '0xd735e0259a4e48366f517cff39ebec16518b2d1c',
            To: '0x8f2b63841b815efd1e00c43c543d32685a7184a6',
            Quantity: '31.45',
            Method: 'Buy Items'
          }
        ]
      }
    }
  } catch(e){

  }
}

async function mockRun(){
  const mockdata = [
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0xe838d5b3838627c80c7483b37ed48263e03a44d8dc6125c5178034d488cb34a6',
      quantity: '34.0',
      blockno: '28978205',
      unixTimestamp: '1665191773',
      dateTime: '2022-10-08 01:16:13',
      type: 2,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0xb11a468598c93d3d3e91ead853c8e431351582c91f3971a8bef08a635a4effaa',
      quantity: '150',
      blockno: '28972053',
      unixTimestamp: '1665187297',
      dateTime: '2022-10-08 00:01:37',
      type: 2,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0x664a766a8d053b7cafcb906f8bb36657fb880e49765a6b7e12b5cf771d0940f3',
      quantity: '33.93',
      blockno: '28964216',
      unixTimestamp: '1665180856',
      dateTime: '2022-10-07 22:14:16',
      type: 2,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0xaba87d120771fa2567dc27d12a8425e22b28e12f607e8d0f8240297553e4c492',
      quantity: '37.8',
      blockno: '28953708',
      unixTimestamp: '1665173819',
      dateTime: '2022-10-07 20:16:59',
      type: 2,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0x100cb1d1cf4f13a393d6d2aaa9d34ffc8070eb7823504bbd7a227233e8a4dd0b',
      quantity: '200',
      blockno: '28942452',
      unixTimestamp: '1665167017',
      dateTime: '2022-10-07 18:23:37',
      type: 2,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0x69d8fad0fbc1794aabf4b7553e7c4bb5d13415ad3f7de2020480b8455755f1dc',
      quantity: '8.69',
      blockno: '28940515',
      unixTimestamp: '1665165953',
      dateTime: '2022-10-07 18:05:53',
      type: 2,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0xa439b32cea35ca1693b9d713aa1a7ca278f0fd3ccab07c3b40f4e027d5e478ec',
      quantity: '61.05',
      blockno: '28799125',
      unixTimestamp: '1665113039',
      dateTime: '2022-10-07 03:23:59',
      type: 1,
    },
    {
      identifier: 1,
      address: TARGET_ADDRESS,
      txHash: '0xf506cf43554d305239376c51c4e2a3dedc15529545b534c0e863fb260899ae7a',
      quantity: '699',
      blockno: '28544212',
      unixTimestamp: '1664986877',
      dateTime: '2022-10-05 16:21:17',
      type: 2,
    }
  ];
  
  try{
    const result = await AV.Object.saveAll(mockdata.map((value) => {
      return createOverallActivityRow(value)
    }));
    console.log('OverallActivity mock数据保存成功', result);
  } catch(e){
    console.log('OverallActivity 保存错误', e);
  } 
}

if (argv[2] && argv[2] === 'cleaning'){
  // dbRun();
  // mockRun();
}