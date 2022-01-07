const jsonServer = require('json-server');

const PORT = 5000;
const SOURCE_FILE = './db.json';

const server = jsonServer.create();
const router = jsonServer.router(SOURCE_FILE);
const middlewares = jsonServer.defaults();

// Добавить заголовки что бы браузер не переживал по поводу CORS
// (запуск с флажком --no-cors почему-то не дал должного результата)
server.use('/*', function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

server.use(middlewares);
server.use(router);
server.listen(PORT, () => {
    console.log(`JSON Server serving '${SOURCE_FILE}' on port:${PORT}`);
});
