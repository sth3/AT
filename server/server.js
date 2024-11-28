const express = require("express");
//const dotenv = require('dotenv');

//dotenv.config();

const port = process.env.PORT || 3000;
//const pathPrint = process.env.PATH_PRINT_REPORTS ;
//const pathDone = process.env.PATH_DONE_REPORTS ;
//console.log("🚀 ~ pathDone:", pathDone)

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const api = require("./api.js");
// const dealsRouter = require('./routes/deals');
// const componentsRouter = require('./routes/components');
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const fs = require("fs");
const { exec } = require("child_process");
const {  
  print,
  getPrinters,
  getDefaultPrinter,
} = require("pdf-to-printer");
var tcpPortUsed = require("tcp-port-used");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
const app = express();
app.use(connectLiveReload());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:4200",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", api);
// app.use('/deals', dealsRouter);
// app.use('/components',componentsRouter);
getPrinters().then(console.log)
const options = {
  printer: "ET9C934EE7F5C0",
};




app.get("/", (req, res) => {
    
    //getPrinters().then(console.log);
    getDefaultPrinter().then(console.log)
    const folderPath = "C:\\inetpub\\ftproot\\nodeRed\\reports"; // Update this with your folder path
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return res.status(500).send("Internal Server Error");
      }
      const pdfFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".pdf"
      );

      const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || ITEMS_PER_PAGE;
  const paginatedData = paginateData(pdfFiles, currentPage, itemsPerPage);
  const totalPages = Math.ceil(pdfFiles.length / itemsPerPage); 
      res.render("index", { pdfFiles,paginatedData,
        currentPage,
        itemsPerPage,
        totalPages });
    });
});

app.get("/print/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(
    "C:\\inetpub\\ftproot\\nodeRed\\reports",
    fileName
  ); // Update this with your folder path

   getPrinters().then(console.log);
  //getDefaultPrinter().then(console.log);
  // const options = {
  //     printer: "HP LaserJet Professional P1606dn",
  //   };
  //print(filePath)
  //res.redirect("/") 

  const filePathDone = path.join(
    "C:\\inetpub\\ftproot\\nodeRed\\done",
    fileName
  ); // Update this with your folder path
  
//toto ak chces po tlaceni posunut do druhej zlozky
  fs.rename(filePath, filePathDone, function (err) {
    if (err) throw err;
    console.log("Successfully renamed - AKA moved!")
    print(filePathDone,options)
    .then(console.log(fileName),res.redirect("/") 
    );
  });

  
});

var watching = false;
fs.watch('C:\\inetpub\\ftproot\\nodeRed\\reports', (eventType, fileName) => {
    if(watching) return;
    if(eventType === 'change')watching = true;
    
    console.log(eventType);    
    console.log(fileName);
     let i = 0;
    if (fileName && eventType === 'change'){
        console.log("🚀 ~ fs.watch ~ fileName 120:", fileName)
                   
              const filePath = path.join(
              "C:\\inetpub\\ftproot\\nodeRed\\reports",
              fileName
            ); 
                       
            print(filePath, options)
           
        }
        setTimeout(() => {
            watching = false;
        }, 100);
    })


    const ITEMS_PER_PAGE = 2;

// Function to paginate data
function paginateData(data, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}
        


