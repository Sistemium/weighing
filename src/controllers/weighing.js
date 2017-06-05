const iconvLite = require('iconv-lite');
const net = require('net');

const port = parseInt(process.env.WEIGHING_PORT) || 8090;
const host = process.env.WEIGHING_HOST || 'localhost';

module.exports.list = list;


function *list() {

  try {
    this.type = 'application/json; charset=utf-8';
    this.body = yield weighingPromise();
  } catch (e) {
    throw(e);
  }

}


function weighingPromise () {

  return new Promise((resolve, reject) => {

    const socket = net.connect(port, host, () => {

      let request = `GET /GetParamsJson HTTP/1.1\r\nHost: ${host}\r\n\r\n`;

      socket.end(request);

      socket.pipe(iconvLite.decodeStream('win1251'))
        .collect((err, decodedBody) => {

          if (err) {
            return reject(err);
          }

          let response = decodedBody.replace(/^[^{]+/, '');
          response = response.replace(/[^}]+$/g, '');

          resolve(response);

        });

    });

    socket.on('error', reject);

  });

}
