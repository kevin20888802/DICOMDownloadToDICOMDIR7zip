var fs = require('fs'),
    spawn = require('child_process').spawn,
    out = fs.openSync('./out.log', 'a'),
    err = fs.openSync('./out.log', 'a');
const path = require('path');

function CMove(aeTitle, aePort, qrLevel, k, ip, aecTitle, aecPort) {
  return new Promise((resolve, reject) => {
	const movescuPath = './movescu.exe';
    const dicomFilesPath = './dicomFiles/';

    // 构建命令行参数数组
    const args = [
      '--port', aePort,
      '-od', `${path.resolve(dicomFilesPath)}`,
      '-aet', aeTitle,
      '-aec', aecTitle,
      `-${qrLevel}`,
    ];
	console.log(path.resolve(dicomFilesPath));
	
	if (!fs.existsSync(dicomFilesPath)) {
	fs.mkdirSync(dicomFilesPath);
	console.log('dicomFilesPath folder created.');
	} else {
	// 删除 tmp 文件夹内的所有文件
	fs.readdirSync(dicomFilesPath).forEach((file) => {
	  const filePath = path.join(dicomFilesPath, file);
	  fs.unlinkSync(filePath);
	});
	console.log('Existing files in dicomFilesPath folder deleted.');
	}
	
    // 添加多个 k 参数
	Object.entries(k).forEach(([key, value]) => {
		args.push('-k');
		args.push(`${key}=${value}`);
	});

	  args.push(ip);
	  args.push(aecPort);

	fs.writeFile('./out.log', '', (err) => {
	  if (err) {
		console.error('清空log檔案時發生錯誤:', err);
		return;
	  }
	});

    const movescuProcess = spawn(movescuPath, args, {
    detached: true,
    stdio: [ 'ignore', out, err ]
	});

	// 建立輸出目錄（如果不存在）
	fs.mkdirSync(path.resolve(dicomFilesPath), { recursive: true });
	
    // 等待执行文件结束
    movescuProcess.on('close', code => {
		
		// 顯示執行檔的輸出內容
		const data = fs.readFileSync('./out.log', 'utf8');
		console.log(data);
		
      console.log(`movescu.exe 进程已退出，退出码: ${code}`);
      resolve();
    });

    movescuProcess.on('error', err => {
      console.error(`发生错误: ${err}`);
      reject(err);
    });
  });
}

module.exports = CMove;