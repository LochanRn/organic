const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var graph = require('./graph');
var host = '192.168.1.39';
var port = 3304;
var allowData = false;
var allowPlot = false;  
 
var setupServer = function(port) {
    console.log("setting up things")
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg) => {
        console.log(allowPlot);
        if(allowPlot){
            processMessage(msg);
            console.log("yo");
        }
    });
    server.bind(port);

    // required listners
    $('#updStatus').click(function() {
        // console.log(allowPlot);
        graph.plotLayout();
        allowPlot = true;
        host = $("#bioIp").val().split(":")[0];
        port = $("#bioIp").val().split(":")[1];

        if($("#updStatus").text() == "Start" ||$("#updStatus").text() == "Connect" ){
            $(this).html('Stop');
            allowData = true;
            allowPlot = true;
        } else if ($("#updStatus").text() == "Stop") {
            $(this).html('Start');
            allowData = false;
            allowPlot = false;
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
