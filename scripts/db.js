const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const AV = require('leancloud-storage')

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
    console.log(result);
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
    const csvPath = path.resolve(__dirname,'./db/export-token.csv');
    const db = await readCSV(csvPath);
    for (const iterator of db) {
      
    }
  } catch(e){

  }
}

if (argv[2] && argv[2] === 'cleaning'){
  dbRun();
}

/**
 * 以月做维度，提供查询，前端提交的参数为 1-12，由后端组合 start - end (date)，且 type = 1，去做组合查询
 */

/**
 * 以年做维度，提供 type = 1 的 quantity SUM
 */