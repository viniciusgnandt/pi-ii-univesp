const http = require("http");
const fs = require("fs");
const path = require("path");
const { getQRCode } = require("./qrHandler");

// Cria um servidor HTTP para servir a página HTML na porta 9000
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    // Responde com o conteúdo da página HTML
    fs.readFile(path.join(__dirname, "../frontend/index.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.write("Erro ao carregar a página.");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === "/qr") {
    // Serve o QR code em base64 para a página HTML
    const qrCodeImage = getQRCode();
    if (qrCodeImage) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(qrCodeImage);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("QR Code não encontrado.");
      res.end();
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("Página não encontrada.");
    res.end();
  }
});

// Inicia o servidor na porta 9000
server.listen(9000, () => {
  console.log("Servidor rodando em http://localhost:9000");
});


