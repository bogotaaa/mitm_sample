const Parser = require("./utils/parser");

var packet = Buffer.from((21925).toString(16), 'hex');
console.log(Parser.getPacketId(packet))