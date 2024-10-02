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
    if (message.isGroupMsg === false) {
      // Verifica o início da conversa
      if (message.body.toLowerCase() === 'iniciar' || message.body.toLowerCase() === 'oi') {
        client.sendText(message.from, 'Bem-vindo(a) ao *UniAluguel*! Para começar, por favor, digite o seu CPF.');
      
      } else if (validarCPF(message.body)) {
        // Aqui faria a verificação no banco de dados
        const isRegistered = verificarCadastroNoBanco(message.body);
        
        if (isRegistered) {
          client.sendText(message.from, `CPF verificado! Bem-vindo(a) de volta, ${isRegistered.nome}. Vamos continuar?`);
        } else {
          client.sendText(message.from, 'Parece que você ainda não está cadastrado(a). Por favor, me informe os seguintes dados:\n- Nome completo\n- Data de nascimento\n- Telefone');
        }

      } else if (isSolicitandoCadastro(message.body)) {
        // Aqui você processaria o cadastro do cliente
        client.sendText(message.from, 'Cadastro realizado com sucesso! Agora, me diga, o que você está procurando? Digite o número:\n1. Casa\n2. Apartamento\n3. Chácara\n4. Outros tipos de imóveis');

      } else if (['1', '2', '3', '4'].includes(message.body)) {
        // Respostas para tipos de imóveis
        client.sendText(message.from, 'Ótimo! Agora, em qual região você gostaria de alugar o imóvel? Digite o número:\n1. Centro\n2. Zona Norte\n3. Zona Sul\n4. Zona Leste\n5. Zona Oeste');

      } else if (['1', '2', '3', '4', '5'].includes(message.body)) {
        // Respostas para escolha de região
        client.sendText(message.from, 'Qual a faixa de preço que você está disposto(a) a pagar por mês? Digite o número:\n1. Até R$ 1.000\n2. Entre R$ 1.000 e R$ 2.000\n3. Acima de R$ 2.000');

      } else if (['1', '2', '3'].includes(message.body)) {
        // Respostas para faixa de preço
        client.sendText(message.from, 'Perfeito! Posso agendar uma visita ao imóvel que você está interessado(a). Por favor, informe o melhor dia e horário para a visita.');

      } else if (message.body.toLowerCase() === 'sim' || message.body.toLowerCase() === 'não') {
        // Agendamento de visita
        if (message.body.toLowerCase() === 'sim') {
          client.sendText(message.from, 'Por favor, informe o melhor dia e horário para a visita.');
        } else {
          client.sendText(message.from, 'Sem problemas! Se precisar de mais alguma coisa, estou à disposição.');
        }

      } else {
        // Mensagem final de atendimento e avaliação
        client.sendText(message.from, 'Obrigado por utilizar o *UniAluguel*! Um atendente estará com você em breve para confirmar todos os detalhes e tirar qualquer dúvida adicional. Antes de ir, poderia nos dizer qual foi a sua experiência até aqui? Digite um número de 1 a 5, onde 1 significa "muito insatisfeito" e 5 significa "muito satisfeito".');
      }
    }
  });
};

// Funções auxiliares
function validarCPF(cpf) {
  // Adicione aqui uma função para validar o formato do CPF
  return true; // Simulação
}

function verificarCadastroNoBanco(cpf) {
  // Verificação simulada no banco de dados
  // Retorna o nome se cadastrado, senão retorna false
  return false;
}

function isSolicitandoCadastro(messageBody) {
  // Simula a verificação de informações de cadastro
  // Exemplo: Verifica se a mensagem contém nome, data de nascimento, telefone
  return true;
}

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

