const querystring = require('querystring');

function QIDO(url, queryParam) {
  const https = url.startsWith('https') ? require('https') : require('http');
  return new Promise((resolve, reject) => {
    const queryParamsString = querystring.stringify(queryParam);
    const requestUrl = `${url}?${queryParamsString}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(requestUrl, requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
			console.log(data);
          //const result = JSON.parse(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

module.exports = QIDO;