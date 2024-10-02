const venom = require("venom-bot");
const http = require("http");
const fs = require("fs");

// Variável para armazenar o QR Code em base64
let qrCodeImage = '';

// Cria o bot Venom e exporta o QR Code
venom
  .create(
    {
      session: `session_chatBot}`,
      multidevice: true,
      headless: 'new',
    },
    (base64Qr, asciiQR) => {
      console.log(asciiQR); // Loga o QR no terminal (opcional)

      qrCodeImage = base64Qr; // Armazena o QR code em base64 para uso na página HTML

      // Salva o QR code como imagem em PNG (opcional)
      const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      const response = {};

      if (matches && matches.length === 3) {
        response.type = matches[1];
        response.data = Buffer.from(matches[2], "base64");

        fs.writeFile("out.png", response.data, "binary", (err) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        console.error("Invalid input string for QR Code");
      }
    },
    undefined,
    { logQR: false }
  )
  .then((client) => start(client))
  .catch((error) => console.log(error));

// Inicia o bot Venom para escutar mensagens
const start = (client) => {
  client.onMessage((message) => {
    console.log(message);
  });
};

// Cria um servidor HTTP para servir a página HTML na porta 9000
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    // Responde com o conteúdo da página HTML
    fs.readFile("index.html", (err, data) => {
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
  } else if (req.url === "/qr" && qrCodeImage) {
    // Serve o QR code em base64 para a página HTML
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(qrCodeImage);
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
