const i2c = require('i2c-bus');

// LSM6DS3 I2C Address
const LSM6DS3_ADDR = 0x6B; // Change this if your LSM6DS3 has a different address

// LSM6DS3 Register Addresses
const CTRL1_XL_REG = 0x10; // Accelerometer Control Register
const CTRL2_G_REG = 0x11; // Gyroscope Control Register
const OUTX_L_G_REG = 0x22; // Gyroscope X-axis Low Byte Data Register
const OUTX_L_XL_REG = 0x28; // Accelerometer X-axis Low Byte Data Register

// I2C bus number (usually 1 on the Raspberry Pi, but may vary on your system)

class LSM6DS3 {
  constructor() {
    this.i2cBus = null;
    this.accelRange = 2; // 2g range by default
    this.gyroRange = 250; // 250 degrees per second range by default
  }

  async initialize() {
    try {
      this.i2cBus = await i2c.openPromisified(0);
      // Configure the sensor
      await this.i2cBus.writeByte(LSM6DS3_ADDR, CTRL1_XL_REG, 0x60); // Enable accelerometer, 416Hz data rate
      await this.i2cBus.writeByte(LSM6DS3_ADDR, CTRL2_G_REG, 0x60); // Enable gyroscope, 416Hz data rate
    } catch (err) {
      throw new Error(`Error initializing LSM6DS3: ${err}`);
    }
  }

  async readAccel() {
    try {
        const data = Buffer.alloc(6);
        await this.i2cBus.readI2cBlock(LSM6DS3_ADDR, OUTX_L_XL_REG, 6, data);
      const x = data.readInt16LE(0) * this.accelRange / 32768.0;
      const y = data.readInt16LE(2) * this.accelRange / 32768.0;
      const z = data.readInt16LE(4) * this.accelRange / 32768.0;
      return { x, y, z };
    } catch (err) {
      throw new Error(`Error reading accelerometer data: ${err}`);
    }
  }

  async readGyro() {
    try {
        const data = Buffer.alloc(6);
      await this.i2cBus.readI2cBlock(LSM6DS3_ADDR, OUTX_L_G_REG, 6, data);
      const x = data.readInt16LE(0) * this.gyroRange / 32768.0;
      const y = data.readInt16LE(2) * this.gyroRange / 32768.0;
      const z = data.readInt16LE(4) * this.gyroRange / 32768.0;
      return { x, y, z };
    } catch (err) {
      throw new Error(`Error reading gyroscope data: ${err}`);
    }
  }

  async close() {
    if (this.i2cBus) {
      await this.i2cBus.close();
      this.i2cBus = null;
    }
  }
}

// Example usage:
(async () => {
  const lsm6ds3 = new LSM6DS3();
  try {
    await lsm6ds3.initialize();

    setInterval(async () => {
      const accelData = await lsm6ds3.readAccel();
      const gyroData = await lsm6ds3.readGyro();
      // Print to the same line
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Accel: x:${accelData.x.toFixed(2)} y:${accelData.y.toFixed(2)} z:${accelData.z.toFixed(2)} | Gyro: x:${gyroData.x.toFixed(2)} y:${gyroData.y.toFixed(2)} z:${gyroData.z.toFixed(2)}`);
    }, 100);

    // Keep the program running to continue reading sensor data
  } catch (err) {
    console.error(err);
  }
})();