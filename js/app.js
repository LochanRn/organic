var control = require('./keyboard');
var link = require('./communication');

var DATA_RATE = 1; //ms

control.initKeyboard();
link.setupServer(23913,23912);

setInterval(function() {
    var data = control.processKeys();
    // console.log(data);
    link.sendData(data, 0);
}, DATA_RATE);

$('#close').click(function(){
    $('#Graph').html(``);    
    console.log('closed');
})