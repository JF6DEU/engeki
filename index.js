const ws = require("ws").Server;
const socket = new ws({port: 3030});

socket.on("connection", (wsock) => {
    console.log("connected.");
    socket.clients.forEach((client) => {
        if(client !== wsock){
            client.send(JSON.stringify({
                log:"繋がったで",
                iserror:"1"
            }));
        }
    });
    wsock.on("message", (message) => {
        console.log("message received.");
        var received = {};
        try{
            received = JSON.parse(message);
            received.iserror = 0;
            console.log("message has no error.\n"+received);
        }catch(err){
            received = {
                iserror: 1,
                log:"送られてきたJSONおかしいぞ"
            };
            console.log("message has an error.");
        }
        socket.clients.forEach((client) => {
            if(client !== wsock){
                client.send(JSON.stringify(received));
            }
        });
    });
    wsock.on("close", () => {
        console.log("client lost.");
        socket.clients.forEach((client) => {
            if(client !== wsock){
                client.send(JSON.stringify({
                    log:"通信できなくなっｔ...(そして音信不通)",
                    iserror:"1"
                }));
            }
        });
    });
});