const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var graph = require('./graph');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var lineReader = require('line-reader');

var host = '127.0.0.1';
var port = 3304;
var allowData = false;
var allowPlot = false;  
var lineNum = -1;

var fileConnect = './data/data.csv';
var filePlot = './data/data.csv';

var writer = csvWriter();
var writer = csvWriter({ headers: ['_','CO2','CH4','C3H8','NG','SPEC']});

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
        // console.log(host + " " + port);
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
        if(allowPlot)
        {
            lineNum++;
            var msg = line.split(",");
            msg = msg.slice(0,6);
            console.log(lineNum);
            console.log(msg);
            graph.plotGraph(msg);
        }
        else return;
    });
}

$('#plotGraph').click(function(){
    graph.plotLayout();
    if ($(this).hasClass('btn-warning')) {
        $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
        console.log("its working");
        allowPlot = true;
        lineNum = -1;
        formFileName();
        processMessageData();
    } else if ($(this).text() == "Stop") {
        $(this).removeClass('btn-success').addClass('btn-warning').html('Plot');
        allowPlot = false;
        console.log("process stopped");
    }
});

var sendData = function(data, override) { // data should be string
    if (allowData || override) {
        var message = new Buffer(data);
        host = $("#bioIp").val().split(":")[0];
        port = $("#bioIp").val().split(":")[1];
        server.send(message, 0, message.length, port, host, function(err, bytes) {
            console.log(message,host,port);
            if (err) console.error(err);
        });
    }
}

var processMessage = function(message) {
    var msgDec = "";
    for (var i = 0; i < message.length; i++) {
        msgDec += (String.fromCharCode(message[i]));
    }
    console.log(msgDec);
    // if(msgDec[0] == '$'){
    //     var msg = msgDec.split(",");
    //     var sensorValues = msg.slice(0,6);
    //     writer.write(sensorValues, (err)=>{
    //         if (err) {
    //             console.log(err.message);
    //         }
    //     });
    //     console.log(sensorValues);
    //     graph.plotGraph(sensorValues);
    // }
}

var formFileName = function(){
    var x = $("#fileName").val();
    var y = $("#plotFileName").val();
    fileConnect = './data/'+x;
    filePlot = './data/'+y;
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;