const sevenBin = require('7zip-bin');
const Seven = require('node-7z');
const fs = require('fs-extra');
const path = require('path');

async function DICOMDIRFilesTo7zip(archiveName) {
	console.log("Creating 7ZIP");
  try {
	const pathTo7zip = sevenBin.path7za
    // 压缩文件
	 const archiveExists = await fs.pathExists(`./output/${archiveName}.7z`);
    if (archiveExists) {
      await fs.remove(`./output/${archiveName}.7z`);
      console.log('已删除现有的压缩文件');
    }

	
    const myStream = await Seven.add(`./output/${archiveName}.7z`, './tmp/*',{
		recursive: true,
		$bin: pathTo7zip
	});
    
	// 等待压缩完成
    await new Promise((resolve, reject) => {
      myStream.on('end', resolve);
      myStream.on('error', reject);
    });
	
    // 删除tmp文件夹中的所有文件
    await fs.emptyDir('./tmp');
    
    console.log('操作完成');
  } catch (error) {
    console.error('出现错误:', error);
  }
}


module.exports = DICOMDIRFilesTo7zip;