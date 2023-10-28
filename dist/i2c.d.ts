/// <reference types="node" />
export declare class I2c {
    private busNumber;
    private address;
    private bus;
    constructor(busNumber: number, address: number);
    write(data: Buffer): Promise<Buffer>;
    read(data: Buffer): Promise<Buffer>;
}
