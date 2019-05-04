var control = require('./keyboard');
var link = require('./communication');
var graph = require('./graph');

var DATA_RATE = 1; //ms

control.initKeyboard();
link.setupServer(23911);

setInterval(function() {
    var data = control.processKeys();
    link.sendData("<" + data[0] + data[1] + ">", 0);
}, DATA_RATE);

$('#plotGraph').click(function(){
    if ($(this).hasClass('btn-warning')) {
        $(this).removeClass('btn-warning').addClass('btn-success').html('Stop');
    } else if ($(this).text() == "Stop") {
        $(this).removeClass('btn-success').addClass('btn-warning').html('Plot');
    }
});