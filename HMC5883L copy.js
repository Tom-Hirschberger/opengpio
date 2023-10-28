const i2c = require('i2c-bus');
// HMC5883L Controller.
const ADDRESS = 0x1E;
const CONFIG_A = 0x00;
const CONFIG_B = 0x01;
const MODE = 0x02;
const X_MSB = 0x03;
const X_LSB = 0x04;
const Z_MSB = 0x05;
const Z_LSB = 0x06;
const Y_MSB = 0x07;
const Y_LSB = 0x08;
const STATUS = 0x09;
const ID_A = 0x0A;
const ID_B = 0x0B;
const ID_C = 0x0C;
const DECLINATION = 0.22;
const GAIN = 0x01;
const SAMPLES = 0x01;
const RATE = 0x00;
const MEASUREMENT_MODE = 0x00;
const MEASUREMENT_BIAS = 0x00;
const MEASUREMENT_GAIN = 0x01;
const MEASUREMENT_RATE = 0x00;
const MEASUREMENT_SAMPLES = 0x01;

i2c.openPromisified(0).then(async i2c => {
    const devices = await i2c.scan()
    console.log(devices)

    // await i2c.writeByte(ADDRESS, CONFIG_A, 0x3C);
    await i2c.writeByte(ADDRESS, CONFIG_A, parseInt('01110000',2));
    await i2c.writeByte(ADDRESS, CONFIG_B, parseInt('00100000',2));
    await i2c.writeByte(ADDRESS, MODE, parseInt('00000000',2));
    // await i2c.writeByte(ADDRESS, CONFIG_B, (GAIN << 5));

    // Read the data
    async function getData(){
        // await i2c.writeByte(ADDRESS, MODE, 0x01);
        await dataIsReady();
        const [xMsb,xLsb,yMsb, yLsb, zMsb, zLsb] = await Promise.all([
            i2c.readByte(ADDRESS, X_MSB),
             i2c.readByte(ADDRESS, X_LSB),
             i2c.readByte(ADDRESS, Y_MSB),
             i2c.readByte(ADDRESS, Y_LSB),
             i2c.readByte(ADDRESS, Z_MSB),
             i2c.readByte(ADDRESS, Z_LSB),
        ])
        
        const x = (xMsb << 8) | xLsb;
        const y = (yMsb << 8) | yLsb;
        const z = (zMsb << 8) | zLsb;
        
        // Calculate the heading
        const heading = Math.atan2(y, x);// + DECLINATION;
        const headingDegrees = (heading * 180) / Math.PI;
        // console.log(headingDegrees);

        // Get X Y Z degress
        const xDegrees = (Math.atan2(x, z)* 180) / Math.PI;
        const yDegrees = (Math.atan2(y, z)* 180) / Math.PI;
        const zDegrees = (Math.atan2(z, x)* 180) / Math.PI;
        console.log(xDegrees, yDegrees, zDegrees);
        // console.log(xMsb, xLsb, yMsb, yLsb, zMsb, zLsb)
        await sleep(1000)
        getData();
    }

    async function dataIsReady(){
        const status = await i2c.readByte(ADDRESS, STATUS);
        if(status & 0x01){
            return true;
        }else{
            await sleep(1000);
            await dataIsReady();
        }
    }

    getData();
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
