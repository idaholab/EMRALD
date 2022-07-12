/**
 * @file Creates the test server.
 *
 * Because of the way the EMRALD site is set up, no test runner can run tests in the way we need to run them (i.e., in normal HTML)
 * This file starts an HTTP server that serves the exact same HTML as the real app, but injects the code needed
 * to run unit tests with the Mocha and Chai libraries into the HMTL automatically.
 * Files in the tests/ directory following the pattern [name].test.js will be automatically loaded and run.
 * You can refresh the page to re-run tests after modifying any of the files, but will need to restart the server
 * to run newly created test files.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

http
  .createServer((request, response) => {
    let filePath = `.${request.url}`;
    let index = false;
    if (filePath === './') {
      index = true;
      filePath = './index.html';
    }
    filePath = path.resolve('Emrald_Site', filePath.replace(/\?.*$/, ''));

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
      default:
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        console.error(error);
        response.writeHead(400);
        response.end(error.message);
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        if (index) {
          // Find test files (*.test.js)
          const testFiles = fs
            .readdirSync('Emrald_Site/tests')
            .filter((file) => /.*\.test\.js$/.test(file));
          // Inject the test runner into index.html
          let html = content.toString('utf-8');
          const i = html.indexOf('</body>');
          html = `${html.substring(0, i)}
            <!-- Unit Testing Code -->
            <div id="mocha"></div>
            <link rel="stylesheet" href="https://unpkg.com/mocha/mocha.css" />
            <script src="https://unpkg.com/chai/chai.js"></script>
            <script src="https://unpkg.com/mocha/mocha.js"></script>
            <style>
                #mocha {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    overflow: scroll;
                    margin: 0;
                    top: 0;
                    left: 0;
                    background: white;
                    z-index: 100;
                }
            </style>
            <script class="mocha-init">
            mocha.setup('bdd');
            mocha.checkLeaks();
            </script>
            <script src="tests/util.js"></script>
            <script class="mocha-exec">
              // Wait until the sidebar is loaded
              const waiting = setInterval(() => {
                if (simApp && simApp.mainApp && simApp.mainApp.sidebar) {
                  clearInterval(waiting);
                  const tests = [${testFiles
    .map((file) => `"tests/${file}"`)
    .join(',')}];
                  let ready = 0;
                  tests.forEach((file) => {
                    const script = document.createElement('script');
                    script.setAttribute('src', file);
                    script.onload = () => {
                      ready += 1;
                    };
                    document.body.appendChild(script);
                  });
                  const scriptsWaiting = setInterval(() => {
                    if (ready === tests.length) {
                      clearInterval(scriptsWaiting);
                      mocha.run();
                    }
                  }, 100);
                }
              }, 100);
            </script>
            ${html.substring(i)}`;
          response.end(html);
        } else {
          response.end(content, 'utf-8');
        }
      }
    });
  })
  .listen(8080, () => {
    console.log('Testing server running on port 8080.');
  });
