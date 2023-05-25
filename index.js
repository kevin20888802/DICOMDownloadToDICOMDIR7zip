const readline = require('readline');
const CFind = require('./libs/CFind.js');
const CMove = require('./libs/CMove.js');
const QIDO = require('./libs/QIDO.js');
const WADO = require('./libs/WADO.js');
const createDICOMDIR = require('./libs/createDICOMDIR.js');
const DICOMDIRFilesTo7zip = require('./libs/DICOMDIRFilesTo7zip.js');

const dotenv = require('dotenv');

// 載入 .env 檔案
dotenv.config();

// 從 .env 檔案讀取變數
const {
  DICOM_WEB_HOST,
  DICOM_WEB_URL,
  DICOM_WEB_PORT,
  DICOM_WEB_HTTP,
  DIMSE_SELF_AETITLE,
  DIMSE_SELF_PORT,
  DIMSE_CALLER_IP,
  DIMSE_CALLER_AETITLE,
  DIMSE_CALLER_PORT
} = process.env;

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

async function main() {
	const patID = await getUserInput('Patient ID:');
	const accNo = await getUserInput('Accession Number:');
	console.log('1. C-Find');
	console.log('2. QIDO');
	console.log('3. C-Move');
	console.log('4. Wado');

	const option = await getUserInput('Please enter an option: ');

	switch (option) {
	case '1':
	  await CFind("P", {'0008,0052':'PATIENT','0010,0020':`${patID}`, '0008,0050':`${accNo}`}, DIMSE_CALLER_IP, DIMSE_CALLER_AETITLE, DIMSE_CALLER_PORT);
	  break;
	case '2':
	  await QIDO(`${DICOM_WEB_HTTP}://${DICOM_WEB_HOST}:${DICOM_WEB_PORT}/${DICOM_WEB_URL}`,{'PatientID':patID,'AccessionNumber':accNo});
	  break;
	case '3':
	  await CMove(DIMSE_SELF_AETITLE, DIMSE_SELF_PORT, "P", {'0008,0052':'PATIENT','0010,0020':`${patID}`, '0008,0050':`${accNo}`}, DIMSE_CALLER_IP, DIMSE_CALLER_AETITLE, DIMSE_CALLER_PORT);
	  break;
	case '4':
	  await WADO(DICOM_WEB_HTTP,DICOM_WEB_HOST,DICOM_WEB_PORT,DICOM_WEB_URL,patID,accNo);
	  break;
	default:
	  console.log('Invalid option.');
	}
	createDICOMDIR();
	DICOMDIRFilesTo7zip(`${patID}_${accNo}_DICOMDIRFiles`);
}

main();