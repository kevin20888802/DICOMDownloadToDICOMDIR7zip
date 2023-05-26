const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateRandomName(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function createDICOMDIR() {
	console.log("Creating DICOMDIR");
  const dicomFolderPath = './dicomFiles/';
  const dicomDirPath = path.resolve('./tmp/DICOMDIR');

  // 检查dicomFiles文件夹是否存在，如果不存在则创建它
  if (!fs.existsSync(dicomFolderPath)) {
    fs.mkdirSync(dicomFolderPath);
    console.log('dicomFiles folder created.');
  }

  // 检查tmp文件夹是否存在，如果不存在则创建它
  const tmpFolderPath = path.resolve('./tmp/');
  
	if (!fs.existsSync(tmpFolderPath)) {
		fs.mkdirSync(tmpFolderPath);
		console.log('tmp folder created.');
	} else {
	// 删除 tmp 文件夹内的所有文件
	fs.readdirSync(tmpFolderPath).forEach((file) => {
	  const filePath = path.join(tmpFolderPath, file);
	  fs.unlinkSync(filePath);
	});
	console.log('Existing files in tmp folder deleted.');
	}

  const files = fs.readdirSync(dicomFolderPath + "/IMAGE");
  files.forEach((file) => {
    const filePath = path.join(dicomFolderPath  + "/IMAGE", file);
    const randomName = generateRandomName(8).toUpperCase();
    const renamedFilePath = path.join(dicomFolderPath  + "/IMAGE", randomName);
    fs.renameSync(filePath, renamedFilePath);
  });

  const dcmmkdirPath = path.resolve('./dcmmkdir.exe');
  const command = `"${dcmmkdirPath}" --recurse --input-directory "${dicomFolderPath}" --output-file "${dicomDirPath}"`;
  try {
    execSync(command);
    console.log('dcmmkdir.exe completed successfully.');

    const files = fs.readdirSync(dicomFolderPath);
    files.forEach((file) => {
      const filePath = path.join(dicomFolderPath, file);
      const destinationPath = path.join(tmpFolderPath, file);
      fs.renameSync(filePath, destinationPath);
    });

    console.log('Files moved to tmp folder.');
  } catch (error) {
    console.error('Error executing dcmmkdir.exe:', error);
  }
}

module.exports = createDICOMDIR;