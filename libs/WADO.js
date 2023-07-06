const fs = require('fs'); // 引入Node.js的文件系統模組，用於文件操作
const path = require('path'); // 引入Node.js的路徑模組，用於處理和轉換文件路徑

function sendHttpGetRequest(url) {
  const http = url.startsWith('https') ? require('https') : require('http'); // 根據傳入的URL判斷使用http或https模組
  return new Promise((resolve, reject) => {
    http.get(url, (response) => { // 發送HTTP GET請求
      let data = '';

      response.on('data', (chunk) => { // 監聽接收到的數據
        data += chunk;
      });

      response.on('end', () => { // 監聽數據接收結束事件
        resolve(JSON.parse(data)); // 將接收到的數據解析為JSON格式並解析
      });

      response.on('error', (error) => { // 監聽錯誤事件
        console.log(url);
        reject(error); // 拒絕Promise並返回錯誤
      });
    });
  });
}

function sendFileDownloadRequest(studyUID, seriesUID, objectUID, url) {
  const http = url.startsWith('https') ? require('https') : require('http'); // 根據傳入的URL判斷使用http或https模組
  return new Promise((resolve, reject) => {
    http.get(url, (response) => { // 發送HTTP GET請求
      if (!fs.existsSync(`./dicomFiles/IMAGE/`)) { // 檢查目標目錄是否存在
        fs.mkdirSync(`./dicomFiles/IMAGE/`); // 如不存在，則創建目錄
      }

      const filename = `./dicomFiles/IMAGE/${studyUID}_${seriesUID}_${objectUID}.dcm`; // 組合文件路徑和名稱
      const writer = fs.createWriteStream(filename); // 創建寫入流

      response.pipe(writer); // 將服務器響應的數據通過管道寫入文件

      writer.on('finish', () => { // 監聽寫入結束事件
        writer.close(); // 關閉寫入流
        resolve(filename); // 完成寫入，返回文件名稱
      });

      writer.on('error', (error) => { // 監聽寫入錯誤事件
        console.log(url);
        reject(error); // 拒絕Promise並返回錯誤
      });
    });
  });
}

async function WADO(dicomWeb_http, dicomWeb_Host, dicomWeb_port, dicomWeb_url, patientId, accessionNumber) {
  const url = `${dicomWeb_http}://${dicomWeb_Host}:${dicomWeb_port}${dicomWeb_url}?PatientID=${patientId}&AccessionNumber=${accessionNumber}`; // 組合完整的URL

  try {
    const studies_json = await send下HttpGetRequest(url); // 發送HTTP GET請求並等待返回的JSON數據

    for (const study of studies_json) { // 迭代每個study
      if (study.hasOwnProperty('00081190')) { // 檢查study是否有指定的屬性
        const series_url = `${study['00081190']['Value'][0]}/series`; // 組合系列URL
        console.log(series_url);
        const series_json = await sendHttpGetRequest(series_url); // 發送HTTP GET請求並等待返回的JSON數據

        for (const series of series_json) { // 迭代每個系列
          if (series.hasOwnProperty('00081190')) { // 檢查系列是否有指定的屬性
            const instances_url = `${series['00081190']['Value'][0]}/instances`; // 組合實例URL
            const instances_json = await sendHttpGetRequest(instances_url); // 發送HTTP GET請求並等待返回的JSON數據

            for (const instance of instances_json) { // 迭代每個實例
              if (
                instance.hasOwnProperty('0020000D') &&
                instance.hasOwnProperty('0020000E') &&
                instance.hasOwnProperty('00080018')
              ) { // 檢查實例是否有指定的屬性
                const studyUID = instance['0020000D']['Value'][0]; // 獲取study UID
                const seriesUID = instance['0020000E']['Value'][0]; // 獲取series UID
                const objectUID = instance['00080018']['Value'][0]; // 獲取object UID

                const downloadUrl = `http://localhost/api/dicom/wado?requestType=WADO&studyUID=${studyUID}&seriesUID=${seriesUID}&objectUID=${objectUID}&contentType=application/dicom`; // 組合下載文件的URL
                const filename = await sendFileDownloadRequest(studyUID, seriesUID, objectUID, downloadUrl); // 發送HTTP GET請求下載文件並等待返回的文件名稱

                console.log(`Downloaded file: ${filename}`); // 輸出下載的文件名稱
              }
            }
          }
        }
      }
    }
  } catch (error) { // 捕獲錯誤
    console.error('An error occurred:', error.message); // 輸出錯誤訊息
  }
}

module.exports = WADO; // 導出WADO函數作為模組的公開接口
