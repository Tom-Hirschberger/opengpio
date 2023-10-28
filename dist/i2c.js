"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I2c = void 0;
const i2c_bus_1 = __importDefault(require("i2c-bus"));
class I2c {
    constructor(busNumber, address) {
        this.busNumber = busNumber;
        this.address = address;
        this.bus = i2c_bus_1.default.openPromisified(this.busNumber);
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const bus = yield this.bus;
            const { buffer } = yield bus.i2cWrite(this.address, data.length, data);
            return buffer;
        });
    }
    read(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const bus = yield this.bus;
            const { buffer } = yield bus.i2cRead(this.address, data.length, data);
            return buffer;
        });
    }
}
exports.I2c = I2c;
