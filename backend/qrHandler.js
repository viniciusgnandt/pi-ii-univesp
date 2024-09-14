const fs = require("fs");

let qrCodeImage = ''; // Variável para armazenar o QR Code em base64

// Função para salvar o QR code gerado
const saveQRCode = (base64Qr) => {
  qrCodeImage = base64Qr; // Armazena o QR code em base64 para uso na página HTML

  // Salva o QR code como imagem em PNG (opcional)
  const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const response = {};

  if (matches && matches.length === 3) {
    response.type = matches[1];
    response.data = Buffer.from(matches[2], "base64");

    fs.writeFile("../frontend/assets/out.png", response.data, "binary", (err) => {
      if (err) {
        console.log(err);
      }
    });
  } else {
    console.error("Invalid input string for QR Code");
  }
};

// Função para retornar o QR Code em base64
const getQRCode = () => {
  return qrCodeImage;
};

module.exports = {
  saveQRCode,
  getQRCode,
};
