const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const spectro = dgram.createSocket('udp4');

var graph = require('./graph');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var lineReader = require('line-reader');

var host = '192.168.1.78';
var port = 3306;
var allowData = false;
var allowPlot = false;
var allowSpectro = false;

var terminator = [65, 120, 245, 1, 66, 245, 1, 121, 67];
var terminatorIndex = 0;
var spectroValues = [{
    pixelNumber: 0,
    intensity: 0
}];

var fileConnect = './data/data.csv';
var filePlot = './data/data.csv';

var writer = csvWriter();
var writer = csvWriter({
    headers: ['_', 'CO2', 'CH4', 'C3H8', 'NG', 'SPEC']
});

var setupServer = function (portSensors, portSpectro) {
    console.log("setting up things")
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg) => {
        // console.log(msg);
        if (allowPlot) {
            processMessage(msg);
        }
    });

    server.bind(portSensors);

    spectro.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });

    spectro.on('message', (msg) => {
        // console.log(msg);
        if (allowSpectro) {
            processSpectro(msg[0]);
        }
    });
    spectro.bind(portSpectro);

    // required listners
    $('#updStatus').click(function () {
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
            allowData = true;
        } else if ($(this).text() == "Stop") {
            $(this).removeClass('btn-success').addClass('btn-warning').html('Connect');
            allowData = false;
        }
    });
    $('#updGraph').click(function () {
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
            allowPlot = true;
            $('#Graph').html(`
                <div class="row mt-1">
                    <div class="col-md-6">
                        <div id="graph1"></div>
                    </div>
                    <div class="col-md-6">
                        <div id="graph2"></div>
                    </div>
                    </div>
                    <div class="row  mt-1">
                        <div class="col-md-12">
                            <div id="graph3"></div>
                        </div>    
                    </div>
                </div>`);
            graph.plotLayout();
            formFileName();
            writer.pipe(fs.createWriteStream(fileConnect));
        } else if ($(this).text() == "Stop") {
            $(this).removeClass('btn-success').addClass('btn-warning').html('Plot');
            allowPlot = false;
            console.log('Stop');
        }
    });
    $('#updSpectro').click(function () {
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
            allowSpectro = true;
            $('#Graph').html(`
            <div class="row mt-1">
                <div class="col-md-12">
                    <div id="graph4"></div>
                </div>
            </div>`);
            graph.plotSpectrino();
        } else if ($(this).text() == "Stop") {
            $(this).removeClass('btn-success').addClass('btn-warning').html('Spectro');
            allowSpectro = false;
            console.log('spectro stopped');
        }
    });
}

var processMessageData = function () {
    lineReader.eachLine(filePlot, function (line, last) {
        if (allowPlot) {
            lineNum++;
            var msg = line.split(",");
            msg = msg.slice(0, 6);
            graph.plotGraph(msg);
        } else return;
    });
}

$('#plotGraph').click(function () {
    if ($(this).hasClass('btn-warning')) {
        $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
        console.log("its working");
        $('#Graph').html(`
            <div class="row mt-1">
                <div class="col-md-6">
                    <div id="graph1"></div>
                </div>
                <div class="col-md-6">
                    <div id="graph2"></div>
                </div>
                </div>
                <div class="row  mt-1">
                    <div class="col-md-12">
                        <div id="graph3"></div>
                </div>
            </div>`);
        graph.plotLayout();
        allowPlot = true;
        lineNum = -1;
        formFileName();
        processMessageData();
    } else if ($(this).text() == "Stop") {
        $(this).removeClass('btn-success').addClass('btn-warning').html('Sensors');
        allowPlot = false;
        console.log("process stopped");
    }
});

var sendData = function (data, override) { // data should be string
    if (allowData || override) {
        data = "<" + data + ">";
        var message = new Buffer(data);
        host = $("#bioIp").val().split(":")[0];
        port = $("#bioIp").val().split(":")[1];
        server.send(message, 0, message.length, port, host, function (err, bytes) {
            console.log(data, host, port);
            if (err) console.error(err);
        });
    }
}

var processMessage = function (message) {
    var msgDec = "";
    for (var i = 0; i < message.length; i++) {
        msgDec += (String.fromCharCode(message[i]));
    }
    console.log(msgDec);
    if (msgDec[0] == '$') {
        var msg = msgDec.split(",");
        var sensorValues = msg.slice(0, 6);
        writer.write(sensorValues, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
        console.log(sensorValues);
        graph.plotGraph(sensorValues);
    }
}

var updateSpectroValues = function (message) {
    var i = spectroValues.findIndex((val) => {
        return val.pixelNumber == message;
    });
    if (i >= 0) {
        spectroValues[i].intensity++;
        graph.plotSpecGraph(spectroValues[i]);
    } else if (i == -1) {
        spectroValues.push({
            pixelNumber: message,
            intensity: 1
        });
        graph.plotSpecGraph({
            pixelNumber: message,
            intensity: 1
        });
    }
    // console.log(i,spectroValues);
}

var processSpectro = function (message) {
    // console.log(terminatorIndex,message);
    if (message == terminator[0]) {
        terminatorIndex = 1;
    } else if (terminatorIndex && terminator[terminatorIndex] == message) {
        terminatorIndex++;
    } else {
        if (terminatorIndex) {
            terminator.slice(0, 0).forEach(function (val) {
                updateSpectroValues(val);
            });
        }
        terminatorIndex = 0;
    }
    if (terminatorIndex == terminator.length){
        terminatorIndex = 0;
        spectroValues.forEach(function(val){
            plotSpecGraph({
                pixelNumber:val,
                intensity:0
            });
        });
        console.log(spectroValues);
        spectroValues = [{
            pixelNumber:0,
            intensity:0
        }]
    }

    if (!terminatorIndex && message != 255 && message != -1) {
        updateSpectroValues(message);
    }
}

var formFileName = function () {
    var x = $("#fileName").val();
    var y = $("#plotFileName").val();
    fileConnect = './data/' + x;
    filePlot = './data/' + y;
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;