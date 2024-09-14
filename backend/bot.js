const venom = require("venom-bot");
const { saveQRCode } = require("./qrHandler");

// Cria o bot Venom e exporta o QR Code
venom
  .create(
    {
      session: `session_chatBot`,
      multidevice: true,
      headless: 'new',
    },
    (base64Qr, asciiQR) => {
      console.log(asciiQR); // Loga o QR no terminal (opcional)
      saveQRCode(base64Qr); // Armazena o QR code em base64
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


