class Parser {
    static getPacketId(packet) {
        var packetHeaderString = packet.slice(0, 2).toString('hex');;
        var packetHeaderBin = Parser.hex2bin(packetHeaderString);
        var packetHeaderPacketIdBin = packetHeaderBin.slice(0, packetHeaderBin.length - 2);
        return parseInt(packetHeaderPacketIdBin, 2);
    }

    static hex2bin(hex){
        return (parseInt(hex, 16).toString(2)).padStart(8, '0');
    }
}

module.exports = Parser;