const readline = require('readline');
const CFind = require('./libs/CFind.js');
const CMove = require('./libs/CMove.js');
const QIDO = require('./libs/QIDO.js');
const WADO = require('./libs/WADO.js');

// 獲取使用者輸入的函式
function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// 執行 CFind 函式
async function CFindCall() {
  const qrLevel = await getUserInput('請輸入 qrLevel: ');
  const ip = await getUserInput('請輸入 IP: ');
  const aecTitle = await getUserInput('請輸入 AEC title: ');
  const aecPort = await getUserInput('請輸入 AEC port: ');

  let params = {};

  while (true) {
    const key = await getUserInput('請輸入參數鍵 -k（或輸入 "done" 開始查詢）： ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`請為 ${key} 輸入值： `);
    params[key] = value;
  }

  // 執行 CFind 函式
  await CFind(qrLevel, params, ip, aecTitle, aecPort);

  console.log('CFind 完成。');
}

// 執行 QIDO 函式
async function QIDOCall() {
  const url = await getUserInput('請輸入 URL： ');

  let queryParam = {};

  while (true) {
    const key = await getUserInput('請輸入 queryParam keys（或輸入 "done" 開始查詢）： ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`請為 ${key} 輸入值： `);
    queryParam[key] = value;
  }

  // 執行 QIDO 函式
  await QIDO(url, queryParam);

  console.log('QIDO 查詢完成。');
}

// 執行 CMove 函式
async function CMoveCall() {
  const qrLevel = await getUserInput('請輸入 qrLevel: ');
  const ip = await getUserInput('請輸入 IP: ');
  const aecTitle = await getUserInput('請輸入 AEC title: ');
  const aecPort = await getUserInput('請輸入 AEC port: ');
  const aeTitle = await getUserInput('請輸入 AE title: ');
  const aePort = await getUserInput('請輸入 AE port: ');

  let params = {};

  while (true) {
    const key = await getUserInput('請輸入參數鍵 -k（或輸入 "done" 開始查詢）： ');
    if (key === 'done') {
    break;
    }
    const value = await getUserInput(`請為 ${key} 輸入值： `);
    params[key] = value;
  }

  // 執行 CMove 函式
  await CMove(aeTitle, aePort, qrLevel, params, ip, aecTitle, aecPort);

  console.log('CMove 完成。');
}

// 執行 WADO 函式
async function WADOCall() {
  const url = await getUserInput('請輸入 URL： ');

  let queryParam = {};

  while (true) {
    const key = await getUserInput('請輸入 queryParam keys（或輸入 "done" 開始查詢）： ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`請為 ${key} 輸入值： `);
    queryParam[key] = value;
  }

  // 執行 WADO 函式
  await WADO(url, queryParam);

  console.log('WADO 查詢完成。');
}

async function main() {
  //await CFind("P", {'0008,0052':'PATIENT','0010,0010':'ENT00373'}, '127.0.0.1', 'MYSTORESCP', '6066');
  await CMove("aet2", "5678", "P", {'0008,0052':'PATIENT','0010,0010':'ENT00373'}, '127.0.0.1', 'MYSTORESCP', '6066');
  while(true) {
    console.log('選單：');
    console.log('1. C-Find');
    console.log('2. QIDO');
    console.log('3. C-Move');
    console.log('4. Wado');
    console.log('q. 退出');

    const option = await getUserInput('請輸入選項： ');

    switch (option) {
      case '1':
        await CFindCall();
        break;
      case '2':
        await QIDOCall();
        break;
      case '3':
        await CMoveCall();
        break;
      case '4':
        await WADOCall();
        break;
      case 'q':
        console.log("退出");
        break;
      default:
        console.log('無效選項。');
    }
    if(option == 'q') {
      break;
    }
  }
}

main();
