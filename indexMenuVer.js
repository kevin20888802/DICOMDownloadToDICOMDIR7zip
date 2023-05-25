const readline = require('readline');
const CFind = require('./libs/CFind.js');
const CMove = require('./libs/CMove.js');
const QIDO = require('./libs/QIDO.js');
const WADO = require('./libs/WADO.js');

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

async function CFindCall() {
  const qrLevel = await getUserInput('Please enter qrLevel: ');
  const ip = await getUserInput('Please enter IP: ');
  const aecTitle = await getUserInput('Please enter AEC Title: ');
  const aecPort = await getUserInput('Please enter AEC Port: ');

  let params = {};

  while (true) {
    const key = await getUserInput('Please enter a parameter key (or type "done" to start query): ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`Please enter the value for ${key}: `);
    params[key] = value;
  }

  // Execute CFind function
  await CFind(qrLevel, params, ip, aecTitle, aecPort);

  console.log('CFind completed.');
}

async function QIDOCall() {
  const url = await getUserInput('Please enter URL: ');

  let queryParam = {};

  while (true) {
    const key = await getUserInput('Please enter a queryParam key (or type "done" to start query): ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`Please enter the value for ${key}: `);
    queryParam[key] = value;
  }

  // Execute QIDO function
  await QIDO(url, queryParam);

  console.log('QIDO query completed.');
}

async function CMoveCall() {
  const qrLevel = await getUserInput('Please enter qrLevel: ');
  const ip = await getUserInput('Please enter IP: ');
  const aecTitle = await getUserInput('Please enter AEC Title: ');
  const aecPort = await getUserInput('Please enter AEC Port: ');
  const aeTitle = await getUserInput('Please enter AE Title: ');
  const aePort = await getUserInput('Please enter AE Port: ');

  let params = {};

  while (true) {
    const key = await getUserInput('Please enter a parameter key (or type "done" to start query): ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`Please enter the value for ${key}: `);
    params[key] = value;
  }

  // Execute CMove function
  await CMove(aeTitle, aePort, qrLevel, params, ip, aecTitle, aecPort);

  console.log('CMove completed.');
}

async function WADOCall() {
  const url = await getUserInput('Please enter URL: ');

  let queryParam = {};

  while (true) {
    const key = await getUserInput('Please enter a queryParam key (or type "done" to start query): ');
    if (key === 'done') {
      break;
    }
    const value = await getUserInput(`Please enter the value for ${key}: `);
    queryParam[key] = value;
  }

  // Execute WADO function
  await WADO(url, queryParam);

  console.log('WADO query completed.');
}

async function main() {
	//await CFind("P", {'0008,0052':'PATIENT','0010,0010':'ENT00373'}, '127.0.0.1', 'MYSTORESCP', '6066');
	await CMove("aet2", "5678", "P", {'0008,0052':'PATIENT','0010,0010':'ENT00373'}, '127.0.0.1', 'MYSTORESCP', '6066');
  while(true) {
	  console.log('Menu:');
	  console.log('1. C-Find');
	  console.log('2. QIDO');
	  console.log('3. C-Move');
	  console.log('4. Wado');
	  console.log('q. quit');

	  const option = await getUserInput('Please enter an option: ');

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
		  console.log("quit");
		  break;
		default:
		  console.log('Invalid option.');
	  }
	  if(option == 'q') {
		break;
	  }
  }
}

main();