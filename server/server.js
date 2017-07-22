var express       = require('express');
var http          = require('http');
var path          = require('path');
var serveStatic   = require('serve-static');
var cors          = require('cors');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', 3000);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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
