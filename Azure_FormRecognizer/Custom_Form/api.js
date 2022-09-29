const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const AzureStorageBlob = require("@azure/storage-blob");
const { BlobServiceClient } = require("@azure/storage-blob");
var cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const {
  FormRecognizerClient,
  AzureKeyCredential,
} = require("@azure/ai-form-recognizer");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");
//const { hasSubscribers } = require("diagnostic_channel");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//define o host e a porta
const hostname = "127.0.0.1";
const port = process.env.PORT || "3002";
app.set("port", port);
app.set("host", hostname);
//cria a API no host x e porta y
const server = http.createServer(app);
server.listen(port);

//permite o upload de arquivos
app.use(
  fileUpload({
    createParentPath: true,
  })
);

function verificaArquivo(file){
  var ajax = new XMLHttpRequest();

    ajax.open("GET",file,true);
    ajax.send();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4){
          var jpg = ajax.responseText;

          if(ajax.status===200) {
              console.log("A imagem " + file + " existe");
              return false;
          } else {
              console.log("A imagem " + file + " NAO existe");
              return true;
          }
      }
  }
}

//configura o header da chamada
app.use((req, res, next) => {
  console.log("Enter CORS");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.options("*", cors()); // include before other routes

//define o caminho da API para o POST
app.use("/api/analyze", (req, res, next) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  //cria um arquivo local que será extraidas as informações
  let file = req.files.file;
  uploadPath = __dirname + "\\uploads\\" + new Date().getTime() + ".jpg";
  //faz a chamada da função recognizeForm, que comunica com a API do Azure
  file.mv(uploadPath, async () => {
    recognizeForm(uploadPath).then((result) => {
      res.status(200).json({
        output: result,
      });
    });
  });
});

//cria um JSON para retornar
var jsonReturn = [];

//função que comunica com a API do Azure
async function recognizeForm(file) {
  //define dados da API Azure
  const endpoint = "https://doors1.cognitiveservices.azure.com/";
  const apiKey = "70b2796924584d8da912296e8dea613a";
  const modelId = "808eb101-c6ac-422a-9298-679c47b2a0fc";
  console.log("Entering Forms Recognizer");

  let fileStream = fs.createReadStream(file);

  const client = new FormRecognizerClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  const poller = await client.beginRecognizeCustomForms(modelId, fileStream, {
    contentType: "application/pdf",
    onProgress: (state) => {
      console.log(`status: ${state.status}`);
    },
  });

  const forms = await poller.pollUntilDone();

  //mostra no backend as informações do documento
  console.log("Forms:");
  for (const form of forms || []) {
    console.log(`${form.formType}, page range: ${form.pageRange}`);
    console.log("Pages:");
    for (const page of form.pages || []) {
      console.log(`Page number: ${page.pageNumber}`);
      console.log("Tables");
      for (const table of page.tables || []) {
        for (const cell of table.cells) {
          console.log(
            `cell (${cell.rowIndex},${cell.columnIndex}) ${cell.text}`
          );
        }
      }
    }
    console.log("Fields:");
    for (const fieldName in form.fields) {
      // each field is of type FormField
      const field = form.fields[fieldName];
      var name = field.name;
      var valor = field.value;
      var obj = `{"`+`${name}`+`": "`+`${valor}`+`"}`;
      jsonReturn.push(JSON.parse(obj));
    }
    console.log(jsonReturn);
  }
  
  fs.unlinkSync(uploadPath);
  return jsonReturn;
}

//função para retornar o  SON
async function retorna(jsonReturn){
  console.log(jsonReturn);
  return jsonReturn;
}

//define o caminho da API para o GET
app.get("/api/json", function(req, res) {
  retorna(jsonReturn).then((result) => {
      res.status(200).json({
        output: result,
      });
    });
});
