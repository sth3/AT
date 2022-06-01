const express = require('express')
const path = require('path');
const port = process.env.PORT || 3000;
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const api = require('./api.js');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
const app = express();
app.use(connectLiveReload());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use('/api', api);
