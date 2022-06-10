/**
 * @file Creates a local HTTP server to serve the app.
 */
import getPort from 'get-port';
import http from 'http';
import path from 'path';
import serve from 'serve-handler';

const server = http.createServer((req, res) => serve(req, res, {
  public: path.resolve('.', 'EMRALD_Site'),
}));

getPort({ port: 3000 }).then((port) => {
  server.listen(port, () => {
    console.log(`Running local server on port ${port}.`);
  });
});
