const i2c = require('i2c-bus');

// HMC5883L registers
const ADDRESS = 0x1E;
const CONFIG_REGISTER_A = 0x00;
const CONFIG_REGISTER_B = 0x01;
const MODE_REGISTER = 0x02;
const DATA_REGISTER_BEGIN = 0x03;

// Open the i2c-bus
const i2cBus = i2c.openSync(0); // Use 1 for Raspberry Pi 3 and above, 0 for earlier versions

// Initialize the HMC5883L
function initHMC5883L() {
  // Configuration values (can be customized as per requirement)
  const samples = 0x00; // 1 sample per measurement
  const dataRate = 0x03; // 75 Hz data output rate
  const gain = 0x01; // Gain setting: +/- 1.3 Ga

  // Configuration Register A
  const configAValue = (samples << 5) | (dataRate << 2);

  // Configuration Register B
  const configBValue = gain << 5;

  // Set Configuration Register A and B
  i2cBus.writeByteSync(ADDRESS, CONFIG_REGISTER_A, configAValue);
  i2cBus.writeByteSync(ADDRESS, CONFIG_REGISTER_B, configBValue);

  // Set mode to continuous measurement
  i2cBus.writeByteSync(ADDRESS, MODE_REGISTER, 0x00);
}

// Read data from the HMC5883L
function readHMC5883LData() {
  const buffer = Buffer.alloc(6);
  i2cBus.readI2cBlockSync(ADDRESS, DATA_REGISTER_BEGIN, 6, buffer);

  // Convert the raw data to magnetic field values (X, Y, Z)
  const magneticField = {
    x: buffer.readInt16BE(0),
    z: buffer.readInt16BE(2),
    y: buffer.readInt16BE(4),
  };

  return magneticField;
}

// Close the i2c-bus when exiting the application
process.on('SIGINT', () => {
  i2cBus.closeSync();
  process.exit();
});

// Initialize the HMC5883L on startup
initHMC5883L();

// Example usage: Read and display data every 1 second
setInterval(() => {
  const magneticField = readHMC5883LData();
  console.log('Magnetic Field (X, Y, Z):', magneticField);
}, 1000);