const venom = require("venom-bot");

venom.create({
    session: "botwhatsapp",
    multidevice: true,
    headless: true
})
.then((client) => start(client))
.catch((err) => console.log(err));

const start = (client) =>{
    client.onMessage((message)=>{
        console.log(message);
    })
}
