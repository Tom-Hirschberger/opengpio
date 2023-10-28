const i2c = require('i2c-bus');
// const endianness = require('endianness')


const PCA9685_ADDR = 0x40; // 64
// const ALL_CALL_ADDR = 0x70; 112 // Address all PCA9685s on the I2C bus

i2c.openPromisified(0).then(async i2c => {
    const devices = await i2c.scan()
    console.log(devices)

    // Set the frequency of the PWM signal, 1000 Hz will do as a start

    // Set the PWM duty cycle of the channel
    // To set the duty cycle, we need to write to the LEDn_ON_L and LEDn_ON_H registers
    // The LEDn_ON_L register contains the 8 least significant bits of the duty cycle
    // The LEDn_ON_H register contains the 4 most significant bits of the duty cycle
    // The LEDn_OFF_L and LEDn_OFF_H registers work the same way, but they control when the output is turned off

    // Set the PWM duty cycle of channel 1 to 50%
    // https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf
    /**
        The turn-on time of each LED driver output and the duty cycle of PWM can be controlled
        independently using the LEDn_ON and LEDn_OFF registers.
        There will be two 12-bit registers per LED output. These registers will be programmed by
        the user. Both registers will hold a value from 0 to 4095. One 12-bit register will hold a
        value for the ON time and the other 12-bit register will hold the value for the OFF time. The
        ON and OFF times are compared with the value of a 12-bit counter that will be running
        continuously from 0000h to 0FFFh (0 to 4095 decimal).
     */
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;
    const PRE_SCALE = 0xFE;

    async function setHz(hz = 50){
        // Go into sleep mode. Force low power mode to allow frequency changes
        await goToSleep();
        
        // Write the prescale value
        const prescale = Math.round(25000000 / (4096 * hz)) - 1;
        await i2c.writeByte(PCA9685_ADDR, PRE_SCALE, prescale);
        await sleep(50);

        // Switch to normal mode
        await i2c.writeByte(PCA9685_ADDR, MODE1, parseInt("10000001", 2));
        await sleep(50);

        const read = await i2c.readByte(PCA9685_ADDR, MODE1);
        const mode = pad(dec2bin(read),8);
        console.log(mode);
        if(mode !== '00000001') console.warn('Mode is not 00000001')
    }

    async function startup(hz = 50){

        // await i2c.writeByte(PCA9685_ADDR, MODE1, parseInt("00010001", 2));
        // await sleep(50);
        // const prescale = Math.round(25000000 / (4096 * hz)) - 1;
        // await i2c.writeByte(PCA9685_ADDR, PRE_SCALE, prescale);
        // await sleep(50);
        // await i2c.writeByte(PCA9685_ADDR, MODE1, parseInt("00000001", 2));
        // await sleep(50);
    

        // Turn off sleep mode
        // await i2c.writeByte(PCA9685_ADDR, MODE1, parseInt("00000001", 2));
        // await sleep(50);
    }


    // Set the frequency of the PWM signal, 50 Hz
    // Go to sleep first
    

    // await i2c.writeByte(PCA9685_ADDR, MODE1, 0x01);
    // await i2c.writeByte(PCA9685_ADDR, MODE2, 0x04);


    // Set LED0_ON_L to 50% duty cycle
    // await i2c.writeByte(PCA9685_ADDR, LED0_ON_H, pToParts(0)[0]);
    // await i2c.writeByte(PCA9685_ADDR, LED0_ON_L, pToParts(0)[1]);

    // let i = 0;
    // setInterval(async () => {
    //     await i2c.writeByte(PCA9685_ADDR, LED0_OFF_H, pToParts(i)[0]);
    //     await i2c.writeByte(PCA9685_ADDR, LED0_OFF_L, pToParts(i)[1]);
    //     i += 0.1;
    //     if (i > 1) i = 0;
    // },100)

    async function setDutyCycle(stop){
        const [stopH, stopL] = pToParts(stop);

        // Start on from 0 no delay
        await i2c.writeByte(PCA9685_ADDR, LED0_ON_H, 0);
        await i2c.writeByte(PCA9685_ADDR, LED0_ON_L, 0); 

        // Set the off time
        await i2c.writeByte(PCA9685_ADDR, LED0_OFF_H, stopH);
        await i2c.writeByte(PCA9685_ADDR, LED0_OFF_L, stopL);
    }


    async function goToSleep(){
        await i2c.writeByte(PCA9685_ADDR, MODE1, parseInt("00010001", 2));
        await sleep(50);
    }

    function getSpeed(position = 0.5){
        if(position > 0.44 && position < 0.56) {
            position = 0.5; // Force to center position.
        }

        if(position < 0) position = 0;
        if(position > 1) position = 1;

        console.log(position)
        return map(position);
    }


    switch(1){
        case 0: // Sleep
            await goToSleep();
            break;
        case 1: // Arm
            await setHz();
            await setDutyCycle(map(0.5)) // Set to center position to arm
            await sleep(2500); // Wait for arming.
            console.log('Armed');
            break;
        case 2: // Go to speed
            await setDutyCycle(getSpeed(1));
            break;
        case 3: // Cycle speed
            let i = 0.5;
            let phase = true;
            setInterval(async () => {
                await setDutyCycle(getSpeed(i));

                if(phase) {
                    i += 0.01;
                }else{
                    i -= 0.01;
                }
                if(i >= 1) phase = false;
                if(i <= 0) phase = true;
            }, 100);
            break;
        default:
            break;
    }



    // await setDutyCycle(0, 0.2)
    // await sleep(1000); 
    // await setDutyCycle(0, 0.1)
    // await sleep(1000);
    // await setDutyCycle(0, 0.15)
});

function map(current,  out_min = 0.05, out_max = 0.1, in_min = 0, in_max = 1) {
    const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return mapped;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pToHex(p) {
    const hex = parseInt(Math.floor(p * 4095)).toString(16);
    return hex;
}

function hexToParts(hex) {
    const hexArray = hex.split('');
    const L = hexArray.splice(-2).join(''); // Last 2 elements
    const H = hexArray.join(''); // First elements 
    return [parseInt(H || '0', 16), parseInt(L, 16)];
}

function pToParts(p){
    return hexToParts(pToHex(p));
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

// Pad a string with leading zeros
function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function scaleNumberBetween(number, min, max) {
    return (number - min) / (max - min);
}

// function crc8(bytes) {
//     bytes = Buffer.from(bytes, 'hex')
//     const polynomial = 0x31
//     let rem = 0xFF

//     bytes.forEach(byte => {
//         rem ^= byte
//         for (let i = 0; i < 8; i++) {
//             if (rem & 0x80) {
//                 rem = (rem << 1) ^ polynomial
//             } else {
//                 rem = rem << 1
//             }
//         }

//         rem &= 0xFF
//     })

//     return rem.toString(16);
// }