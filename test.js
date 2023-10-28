const i2c = require('i2c-bus');
// HMC5883L Controller.

i2c.openPromisified(0).then(async i2c => {
    const devices = await i2c.scan()
    console.log(devices)

});
