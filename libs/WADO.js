const fs = require('fs');
const path = require('path');

function sendHttpGetRequest(url) {
  const http = url.startsWith('https') ? require('https') : require('http');
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(data));
      });

      response.on('error', (error) => {
		  console.log(url);
        reject(error);
      });
    });
  });
}

function sendFileDownloadRequest(studyUID,seriesUID,objectUID,url) {
  const http = url.startsWith('https') ? require('https') : require('http');
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      const filename = `./dicomFiles/${studyUID}_${seriesUID}_${objectUID}.dcm`;
      const writer = fs.createWriteStream(filename);

      response.pipe(writer);

      writer.on('finish', () => {
        writer.close();
        resolve(filename);
      });

      writer.on('error', (error) => {
		  console.log(url);
        reject(error);
      });
    });
  });
}

async function WADO(dicomWeb_http,dicomWeb_Host,dicomWeb_port,dicomWeb_url, patientId, accessionNumber) {
  const url = `${dicomWeb_http}://${dicomWeb_Host}:${dicomWeb_port}${dicomWeb_url}?PatientID=${patientId}&AccessionNumber=${accessionNumber}`;

  try {
    const studies_json = await sendHttpGetRequest(url);

    for (const study of studies_json) {
      if (study.hasOwnProperty('00081190')) {
        const series_url = `${study['00081190']['Value'][0]}/series`;
		console.log(series_url);
        const series_json = await sendHttpGetRequest(series_url);

        for (const series of series_json) {
          if (series.hasOwnProperty('00081190')) {
            const instances_url = `${series['00081190']['Value'][0]}/instances`;
            const instances_json = await sendHttpGetRequest(instances_url);

            for (const instance of instances_json) {
              if (
                instance.hasOwnProperty('0020000D') &&
                instance.hasOwnProperty('0020000E') &&
                instance.hasOwnProperty('00080018')
              ) {
                const studyUID = instance['0020000D']['Value'][0];
                const seriesUID = instance['0020000E']['Value'][0];
                const objectUID = instance['00080018']['Value'][0];

                const downloadUrl = `http://localhost/api/dicom/wado?requestType=WADO&studyUID=${studyUID}&seriesUID=${seriesUID}&objectUID=${objectUID}&contentType=application/dicom`;
                const filename = await sendFileDownloadRequest(studyUID,seriesUID,objectUID,downloadUrl);

                console.log(`Downloaded file: ${filename}`);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

module.exports = WADO;