


## 实践过程


### Server 端实现

```
const http = require('http');

const server = http.createServer((req, res) => {
  console.log('request received');
  console.warn(req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
})

server.listen(8088);
```
- 这里我们让它监听 8088 端口，因为默认的 80端口，可能会存在占用


### Client 端实现 简单实现

```
const net = require('net');
const client = net.createConnection({ port: 8088 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('POST / HTTP/1.1\r\n');
  client.write('HOST: 127.0.0.1\r\n');
  client.write('Content-Length: 9\r\n');
  client.write('Content-Type: application/x-www-form-urlencoded\r\n');
  client.write('\r\n');
  client.write('name=elle');
  client.write('\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
