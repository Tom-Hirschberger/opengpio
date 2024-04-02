"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Device_1 = require("../classes/Device");
class RaspberryPi_ZeroW extends Device_1.Device {
}
_a = RaspberryPi_ZeroW;
//as of 
//- https://datasheets.raspberrypi.com/rpizero/raspberry-pi-zero-w-reduced-schematics.pdf
//- https://www.raspberrypi.com/documentation/computers/raspberry-pi.html
//- https://pinout.xyz/ (in [] brackets if different)
//- and the output of gpioinfo (in brackets () if different)
RaspberryPi_ZeroW.board = {
    3: { chip: 0, line: 2 },
    5: { chip: 0, line: 3 },
    7: { chip: 0, line: 4 },
    8: { chip: 0, line: 14 },
    10: { chip: 0, line: 15 },
    11: { chip: 0, line: 17 },
    12: { chip: 0, line: 18 },
    13: { chip: 0, line: 27 },
    15: { chip: 0, line: 22 },
    16: { chip: 0, line: 23 },
    18: { chip: 0, line: 24 },
    19: { chip: 0, line: 10 },
    21: { chip: 0, line: 9 },
    22: { chip: 0, line: 25 },
    23: { chip: 0, line: 11 },
    24: { chip: 0, line: 8 },
    26: { chip: 0, line: 7 },
    27: { chip: 0, line: 0 },
    28: { chip: 0, line: 1 },
    29: { chip: 0, line: 5 },
    31: { chip: 0, line: 6 },
    32: { chip: 0, line: 12 },
    33: { chip: 0, line: 13 },
    35: { chip: 0, line: 19 },
    36: { chip: 0, line: 16 },
    37: { chip: 0, line: 26 },
    38: { chip: 0, line: 20 },
    40: { chip: 0, line: 21 } //GPIO21 and PCM_DOUT [PCM DOUT]
};
RaspberryPi_ZeroW.bcm = {
    GPIO0: _a.board[27],
    ID_SD: _a.board[27],
    ID_SDA: _a.board[27],
    EEPROM_SDA: _a.board[27],
    GPIO1: _a.board[28],
    ID_SC: _a.board[28],
    ID_SCL: _a.board[28],
    EEPROM_SCL: _a.board[28],
    GPIO2: _a.board[3],
    SDA: _a.board[3],
    SDA1: _a.board[3],
    I2C1_SDA: _a.board[3],
    GPIO3: _a.board[5],
    SCL: _a.board[5],
    SCL1: _a.board[5],
    I2C1_SCL: _a.board[5],
    GPIO4: _a.board[7],
    GPIO_GCLK: _a.board[7],
    GPCLK0: _a.board[7],
    GPIO5: _a.board[29],
    GPIO6: _a.board[31],
    GPIO7: _a.board[26],
    CE1: _a.board[26],
    SPI_CE1_N: _a.board[26],
    SPI0_CE1: _a.board[26],
    GPIO8: _a.board[24],
    CE0: _a.board[24],
    SPI_CE0_N: _a.board[24],
    SPI0_CE0: _a.board[24],
    GPIO9: _a.board[21],
    MISO: _a.board[21],
    SPI_MISO: _a.board[21],
    SPI0_MISO: _a.board[21],
    GPIO10: _a.board[19],
    MOSI: _a.board[19],
    SPI_MOSI: _a.board[19],
    SPI0_MOSI: _a.board[19],
    GPIO11: _a.board[23],
    SCLK: _a.board[23],
    SPI_SCLK: _a.board[23],
    SPI0_SCLK: _a.board[23],
    GPIO12: _a.board[32],
    PWM0: _a.board[32],
    GPIO13: _a.board[33],
    PWM1: _a.board[33],
    GPIO14: _a.board[8],
    TXD1: _a.board[8],
    UART_TX: _a.board[8],
    GPIO15: _a.board[10],
    RXD1: _a.board[10],
    UART_RX: _a.board[10],
    GPIO16: _a.board[36],
    GPIO17: _a.board[11],
    GPIO18: _a.board[12],
    PCM_CLK: _a.board[12],
    GPIO19: _a.board[35],
    PCM_FS: _a.board[35],
    GPIO20: _a.board[38],
    PCM_DIN: _a.board[38],
    GPIO21: _a.board[40],
    PCM_DOUT: _a.board[40],
    GPIO22: _a.board[15],
    GPIO23: _a.board[16],
    GPIO24: _a.board[18],
    GPIO25: _a.board[22],
    GPIO26: _a.board[37],
    GPIO27: _a.board[13]
};
exports.default = RaspberryPi_ZeroW;