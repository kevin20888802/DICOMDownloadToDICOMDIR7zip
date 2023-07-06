const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 產生指定長度的隨機名稱
function generateRandomName(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 建立 DICOMDIR
async function createDICOMDIR() {
  console.log("Creating DICOMDIR");

  const dicomFolderPath = './dicomFiles/';
  const dicomDirPath = path.resolve('./tmp/DICOMDIR');

  // 檢查 dicomFiles 資料夾是否存在，如果不存在則創建它
  if (!fs.existsSync(dicomFolderPath)) {
    fs.mkdirSync(dicomFolderPath);
    console.log('dicomFiles folder created.');
  }

  // 檢查 tmp 資料夾是否存在，如果不存在則創建它
  const tmpFolderPath = path.resolve('./tmp/');
  if (!fs.existsSync(tmpFolderPath)) {
    fs.mkdirSync(tmpFolderPath);
    console.log('tmp folder created.');
  } else {
    // 刪除 tmp 資料夾內的所有文件
    fs.readdirSync(tmpFolderPath).forEach((file) => {
      const filePath = path.join(tmpFolderPath, file);
      fs.unlinkSync(filePath);
    });
    console.log('Existing files in tmp folder deleted.');
  }

  // 讀取 dicomFiles/IMAGE 資料夾中的檔案列表
  const files = fs.readdirSync(dicomFolderPath + "/IMAGE");
  files.forEach((file) => {
    const filePath = path.join(dicomFolderPath + "/IMAGE", file);
    const randomName = generateRandomName(8).toUpperCase();

    // 重新命名檔案並將其移動到 dicomFiles/IMAGE 資料夾中
    const renamedFilePath = path.join(dicomFolderPath + "/IMAGE", randomName);
    fs.renameSync(filePath, renamedFilePath);
  });

  const dcmmkdirPath = path.resolve('./dcmmkdir.exe');
  const command = `"${dcmmkdirPath}" --recurse --input-directory "${dicomFolderPath}" --output-file "${dicomDirPath}"`;
  try {
    // 執行 dcmmkdir.exe 命令來建立 DICOMDIR
    execSync(command);
    console.log('dcmmkdir.exe completed successfully.');

    // 將 dicomFiles 資料夾中的檔案移動到 tmp 資料夾中
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
