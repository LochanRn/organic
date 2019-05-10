const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var graph = require('./graph');
var fs = require('fs');
var csvWriter = require('csv-write-stream');

var host = '127.0.0.1';
var port = 3304;
var allowData = false;
var allowPlot = false;  

var fileConnect = './data/data.csv';
var filePlot = './data/data.csv';

var writer = csvWriter();
var writer = csvWriter({ headers: ['_','CO2','CH4','C3H8','NG','SPEC']});
writer.pipe(fs.createWriteStream(fileConnect));

var lineReader = require('line-reader');

var setupServer = function(port) {
    console.log("setting up things")
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    
    server.on('message', (msg) => {
        if(allowPlot){
            processMessage(msg);
        }
    });
    server.bind(port);  

    // required listners
    $('#updStatus').click(function() {
        graph.plotLayout();
        host = $("#bioIp").val().split(":")[0];
        port = $("#bioIp").val().split(":")[1];
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
            allowData = true;
            allowPlot = true;
            formFileName();
            writer.pipe(fs.createWriteStream(fileConnect));
        } else if ($(this).text() == "Stop") {
           $(this).removeClass('btn-success').addClass('btn-warning').html('Connect');
            allowData = false;
            allowPlot = false;
        }
    });
 
}

var processMessageData = function(){
    lineReader.eachLine(filePlot, function(line, last) {
    var msg = line.split(",");
    msg = msg.slice(0,6);
    console.log(msg);
    graph.plotGraph(msg);
    });
}

$('#plotGraph').click(function(){
    graph.plotLayout();
    if ($(this).hasClass('btn-warning')) {
        $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
        console.log("its working");
        formFileName();
        processMessageData();
    } else if ($(this).text() == "Stop") {
        $(this).removeClass('btn-success').addClass('btn-warning').html('Plot');
        console.log("process stopped");
    }
});

var sendData = function(data, override) { // data should be string
    if (allowData || override) {
        var message = new Buffer(data);
        server.send(message, 0, message.length, port, host, function(err, bytes) {
            if (err) console.error(err);
        });
    }
}

var processMessage = function(message) {
    var msgDec = "";
    for (var i = 0; i < message.length; i++) {
        msgDec += (String.fromCharCode(message[i]));
    }
    var msg = msgDec.split(",");
    var sensorValues = msg.slice(0,6);
    writer.write(sensorValues, (err)=>{
        if (err) {
            console.log(err.message);
        }
    });
    console.log(sensorValues);
    graph.plotGraph(sensorValues);
}

var formFileName = function(){
    var x = $("#fileName").val();
    var y = $("#plotFileName").val();
    fileConnect = './data/'+x;
    filePlot = './data/'+y;
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;