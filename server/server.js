var express       = require('express');
var http          = require('http');
var path          = require('path');
var serveStatic   = require('serve-static');
var cors          = require('cors');

var DMX           = require('dmx');
var SerialPort    = require('serialport');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', 3000);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//at this point we need to get the Entecc input
// -- the serialPort depends on the Enttec USB-to-Serial path
var dmxPort = 'FTDIBUS\VID_0403+PID_6001+EN199124A\0000';

var DMX = new DMX();
DMX.addUniverse('unityUniverse', 'enttec-usb-dmx-pro', dmxPort);
console.log(DMX);

var port = new SerialPort(dmxPort);
port.on('data', function (data) {
  console.log('Data:', data);
});




// -- start socket outward
var userId = 0;
io.on('connection', function (socket) {

  socket.userId = userId ++;
  console.log('a user connected, user id: ' + socket.userId);

  socket.on('dmx', function(data) {
    // if (!set) {
    //   dmxArray = data;
    //   set = true;
    // } else {
    //   var changedValues = data.filter(function(item, i){
    //     return item[i] != item;
    //   })
    //   console.log(changedValues);
    // }

    // var giveAFuck = [];
    // for (var i = 0; i < 5; i++) { giveAFuck.push(data[i]); };
    // console.log({values: giveAFuck});

    //right now just trimming down the values used to five, raw data has 512 array
    io.emit('dmx', {values: data});
  })

});


http.listen(app.get('port'), () => {
  console.log("doth server has started, on: " + app.get('port'));
});
