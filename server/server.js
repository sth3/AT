const express = require('express')
const port = process.env.PORT || 3000;
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const api = require('./api.js');
// const dealsRouter = require('./routes/deals');
// const componentsRouter = require('./routes/components');
const cors = require("cors");
const path = require("path");

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api', api);
// app.use('/deals', dealsRouter);
// app.use('/components',componentsRouter);

