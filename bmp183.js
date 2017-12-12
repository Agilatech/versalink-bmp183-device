
const VersalinkDevice = require('@agilatech/versalink-device');
const device = require('@agilatech/bmp183');

module.exports = class Bmp183 extends VersalinkDevice {
    
    constructor(config) {
        
        // The bus/file must be defined. If not supplied in config options, then default to /dev/spidev1.0
        const bus  = config['bus'] || "/dev/spidev1.0";

        // defaults to sea-level, which is very inaccurate for anything besides sea-level
        const altitude = config['altitude'] || 0; 
        const mode     = config['mode'] || 3;  // defaults to ultra-high-res mode
        
        const hardware = new device.Bmp183(bus, altitude, mode);
        
        super(hardware, config);
        
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

