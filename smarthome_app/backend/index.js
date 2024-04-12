const config = require('./utils/config');
const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server je pokrenut na portu ${config.PORT}`);
});