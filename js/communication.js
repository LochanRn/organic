const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var graph = require('./graph');
var host = '192.168.1.39';
var port = 3304;
var allowData = false;
   
var setupServer = function(port) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg) => {
        // console.log(msg);
        processMessage(msg);
    });
    server.on('listening', () => {
        const address = server.address();
        // $("#station").html(`${address.address}:${address.port}`);
    });
    server.bind(port);

    // required listners
    $('#updStatus').click(function(event) {
        host = $("#bioIp").val().split(":")[0];
        port = $("#bioIp").val().split(":")[1];
        // console.log(host,port);
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-positive').html('Stop');
            allowData = true;
        } else if ($(this).hasClass('btn-positive')) {
            $(this).removeClass('btn-positive').addClass('btn-warning').html('Start');
            allowData = false;
        }
    });
}

var sendData = function(data, override) { // data should be string
    if (allowData || override) {
        var message = new Buffer(data);
        server.send(message, 0, message.length, port, host, function(err, bytes) {
            if (err) console.error(err);
            // $("#up").html(` ${bytes}b`);
            // TODO create log
        });
        // console.log(data);
    }
}

var processMessage = function(message) {
    var msgDec = " ";
	for (var i = 0; i < message.length; i++) {
		msgDec += (String.fromCharCode(message[i]));
	}
    var msg = msgDec.split(",");
    graph.plotGraph(msg);
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;
// module.exports.test = "sendData";
