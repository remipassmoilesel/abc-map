import * as http from 'http';

// RECEPTION SERVER FOR FRONT TESTS

console.log("Starting test server on port 5555");

function exitLater(exitCode: number) {
    setTimeout(() => {
        process.exit(exitCode);
    }, 400);
}

function processExit(bodyStr: string) {

    const rawStats = bodyStr.match('test-stats=(.+)');

    if (rawStats.length < 2) {
        console.error('Invalid output');
        exitLater(1)
    }

    else {
        const stats = JSON.parse(rawStats[1]);
        if (stats.failed > 0) {
            console.error('Some tests failed.');
            process.exit(1);
        } else {
            console.error('All tests succeed.');
            process.exit(0);
        }
    }

}

const srv = http.createServer((request, response) => {
    const {headers, method, url} = request;
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {

        const bodyStr = Buffer.concat(body).toString();
        console.log(bodyStr);

        processExit(bodyStr);

        response.statusCode = 200;
        response.end();
    });
});

// now that server is running
srv.listen(5555, '127.0.0.1');