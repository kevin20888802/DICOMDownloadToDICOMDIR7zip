var fs = require('fs'),
    spawn = require('child_process').spawn,
    out = fs.openSync('./out.log', 'a'),
    err = fs.openSync('./out.log', 'a');
	
function CFind(qrLevel, k, ip, aecTitle, aecPort) {
  // 建立執行檔的路徑
  const executablePath = './findscu.exe';

  // 建立命令行參數
  const args = [
    '-aec',
    aecTitle,
    `-${qrLevel}`
  ];

  // 迭代處理輸入參數 k
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

  // 執行命令行指令
  const findscu = spawn(executablePath, args, {
    detached: true,
    stdio: [ 'ignore', out, err ]
	});


  // 等待執行檔結束後才結束此函數
  return new Promise((resolve) => {
    findscu.on('close', () => {
		
		
		// 顯示執行檔的輸出內容
		const data = fs.readFileSync('./out.log', 'utf8');
		console.log(data);
		
      resolve();
    });
  });
}

module.exports = CFind;