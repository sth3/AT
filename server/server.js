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
  printer: "ET9C934EE7F5C0", // názov z CMD/PowerShell, nie IP
};


const folderPath = "C:\\inetpub\\ftproot\\nodeRed\\reports";
const donePath = "C:\\inetpub\\ftproot\\nodeRed\\done";

// 📄 Zobrazenie zoznamu PDF súborov + stránkovanie
app.get("/", (req, res) => {
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

    res.render("index", {
      pdfFiles,
      paginatedData,
      currentPage,
      itemsPerPage,
      totalPages,
    });
  });
});

// 🖨️ Tlač vybraného súboru + presun do DONE
app.get("/print/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(folderPath, fileName);
  const filePathDone = path.join(donePath, fileName);

  fs.rename(filePath, filePathDone, (err) => {
    if (err) {
      console.error("Rename error:", err);
      return res.status(500).send("Failed to move file.");
    }

    print(filePathDone, options)
      .then(() => {
        console.log("Printed:", fileName);
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Print error:", err);
        res.status(500).send("Printing failed.");
      });
  });
});

function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Vytvorený priečinok:", folderPath);
  }
}

function isFileReady(filePath, callback) {
  fs.open(filePath, "r+", (err, fd) => {
    if (err) return callback(false);
    fs.close(fd, () => callback(true));
  });
}

const reportsFolder = "C:\\inetpub\\ftproot\\nodeRed\\reports";
const doneFolder = "C:\\inetpub\\ftproot\\nodeRed\\done";

ensureFolderExists(doneFolder);

let watching = false;

fs.watch(reportsFolder, (eventType, fileName) => {
  if (watching || !fileName || eventType !== "change") return;
  watching = true;

  const filePath = path.join(reportsFolder, fileName);
  const filePathDone = path.join(doneFolder, fileName);

  console.log("Zistený nový/zmenený súbor:", fileName);

  let attempts = 0;
  const maxAttempts = 10;
  const delayMs = 500;

  // const checkAndPrint = () => {
  //   if (attempts >= maxAttempts) {
  //     console.error(`Súbor ${fileName} nie je pripravený po ${maxAttempts} pokusoch.`);
  //     watching = false;
  //     return;
  //   }

  //   isFileReady(filePath, (ready) => {
  //     if (!ready) {
  //       attempts++;
  //       console.log(`Pokus ${attempts}/${maxAttempts} – súbor nie je pripravený.`);
  //       return setTimeout(checkAndPrint, delayMs);
  //     }

      // Súbor je pripravený
      print(filePath, options)
        .then(() => {
          console.log("Tlač dokončená:", fileName);
          fs.rename(filePath, filePathDone, (err) => {
            if (err) {
              console.error("Chyba pri presune súboru:", err);
            } else {
              console.log("📁 Súbor presunutý do 'done':", fileName);
            }
            watching = false;
          });
        })
        .catch((err) => {
          console.error("❌ Chyba pri tlači:", err);
          watching = false;
        });
//     });
//   };

//   // Spusti kontrolu
//   setTimeout(checkAndPrint, delayMs);
});
    const ITEMS_PER_PAGE = 2;

// Function to paginate data
function paginateData(data, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}
        


