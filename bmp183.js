/*
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const VersalinkDevice = require('versalink-device');
const device = require('@agilatech/bmp183');

module.exports = class Bmp183 extends VersalinkDevice {
    
    constructor(options) {
        
        // The bus/file must be defined. If not supplied in options, then default to /dev/spidev1.0
        const bus  = options['bus'] || "/dev/spidev1.0";

        // defaults to sea-level, which is very inaccurate for anything besides sea-level
        const altitude = options['altitude'] || 0; 
        const mode     = options['mode'] || 3;  // defaults to ultra-high-res mode
        
        const hardware = new device.Bmp183(bus, altitude, mode);
        
        super(hardware, options);
        
    }
    
    addDeviceFunctionsToStates(config, onAllow, offAllow) {
        
        onAllow.push('change-mode');
        config.map('change-mode', this.changeMode, [{name:'mode'}]);
    }
    
    changeMode(mode, callback) {
        const success = this.hardware.operatingMode(mode);
        
        if (success) {
            this.info("New BMP183 Operating Mode:" + mode, {"mode":mode});
        }
        
        callback();
    }
    
}

