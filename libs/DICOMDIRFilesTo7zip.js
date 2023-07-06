// 引入必要的模組
const sevenBin = require('7zip-bin');
const Seven = require('node-7z');
const fs = require('fs-extra');
const path = require('path');

// 將DICOMDIR檔案壓縮成7zip格式的函式
async function DICOMDIRFilesTo7zip(archiveName) {
	console.log("Creating 7ZIP");
  try {
	// 取得7zip的路徑
	const pathTo7zip = sevenBin.path7za;

	// 檢查壓縮檔案是否已存在，若存在則先刪除
	const archiveExists = await fs.pathExists(`./output/${archiveName}.7z`);
    if (archiveExists) {
      await fs.remove(`./output/${archiveName}.7z`);
      console.log('已删除現有的壓缩文件');
    }

	// 建立壓縮檔案並加入檔案
    const myStream = await Seven.add(`./output/${archiveName}.7z`, './tmp/*',{
		recursive: true,
		$bin: pathTo7zip
	});
    
	// 等待壓縮完成
    await new Promise((resolve, reject) => {
      myStream.on('end', resolve);
      myStream.on('error', reject);
    });
	
    // 刪除tmp資料夾中的所有檔案
    await fs.emptyDir('./tmp');
    
    console.log('操作完成');
  } catch (error) {
    console.error('出現錯誤:', error);
  }
}

// 導出函式以供其他模組使用
module.exports = DICOMDIRFilesTo7zip;
