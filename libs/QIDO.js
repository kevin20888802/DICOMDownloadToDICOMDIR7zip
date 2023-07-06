const querystring = require('querystring');

function QIDO(url, queryParam) {
  // 引入相應的模組
  const https = url.startsWith('https') ? require('https') : require('http');

  return new Promise((resolve, reject) => {
    // 將查詢參數轉換為字串
    const queryParamsString = querystring.stringify(queryParam);
    // 構建完整的請求URL
    const requestUrl = `${url}?${queryParamsString}`;

    // 設定請求的選項
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // 發送HTTP請求
    const req = https.request(requestUrl, requestOptions, (res) => {
      let data = '';

      // 接收回應數據的回調函數
      res.on('data', (chunk) => {
        // 將接收到的數據片段拼接起來
        data += chunk;
      });

      // 接收回應結束的回調函數
      res.on('end', () => {
        try {
          // 解析回應數據為JSON格式
          const result = JSON.parse(data);
          // 成功時解析並回傳數據
          resolve(result);
        } catch (error) {
          // 解析失敗時拋出錯誤
          reject(error);
        }
      });
    });

    // 處理請求錯誤的回調函數
    req.on('error', (error) => {
      reject(error);
    });

    // 結束請求
    req.end();
  });
}

module.exports = QIDO;
