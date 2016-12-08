/*
 Copyright © 2016 Agilatech. All Rights Reserved.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function testApp(server) {
  
  var bmp183DeviceQuery = server.where({name:'BMP183'});
  
  server.observe([bmp183DeviceQuery], function(bmp183Device) {

  	// Turn the device on. 
  	bmp183Device.call('turn-on', function() {
      server.info("BMP183_Sensor device switched on");
    });

  	// Stream events and their associated message are propagated periodically timed by streamPeriod
  	// The incomming message contains three fields: topic, timestamp, and data.
  	bmp183Device.streams.pressure_stream.on('data', function(message) {
      server.info("Pressure data stream " + message.topic + " : " + message.timestamp + " : " + message.data);
    });

    // If a monitored value changes, a message will be propagated with the event
    bmp183Device.streams.pressure.on('data', function(message) {
      server.info("^^ Pressure value changed " + message.topic + " : " + message.timestamp + " : " + message.data);
    });

    bmp183Device.streams.temperature_stream.on('data', function(message) {
      server.info("Temperautre data stream " + message.topic + " : " + message.timestamp + " : " + message.data);
    });

    // If a monitored value changes, a message will be propagated with the event
    bmp183Device.streams.temperature.on('data', function(message) {
      server.info("^^ Temperautre value changed " + message.topic + " : " + message.timestamp + " : " + message.data);
    });
    
    // test the change-mode command
    bmp183Device.call('change-mode', '1', function() {
      server.info("BMP183_Sensor device changed to operating mode 1");
    });
                 
  	// Above, note that we know the monitored and stream data names.  This information is also available
  	// in the device meta response at http://localhost:1107/servers/testServer/meta/BMP183_Sensor
  });
  
}
