import lib from './lib'
import { ChildProcess, fork } from 'child_process'

export enum Edge {
    Rising = 0,
    Falling = 1,
    Both = 2
}

export class Gpio {
    private child: ChildProcess | undefined = undefined;
    constructor(private device: Device, private pin: keyof Device['gpio']) { }
    private get raster(): Raster {
        return this.device.gpio[this.pin]
    }

    get(): boolean {
        return lib.get(this.raster.chip, this.raster.line)
    }
    set(value: boolean): void {
        lib.set(this.raster.chip, this.raster.line, value)
    }

    pwm(dutyCycle: number, frequency: number = 50): ChildProcess {
        if(this.child) this.child.kill();
        this.child = fork(`${__dirname}/runner.js`);
        this.child.send(['pwm', this.raster.chip, this.raster.line, dutyCycle, frequency]);
        return this.child;
    }
    
    pwmSync(dutyCycle: number, frequency: number = 50): void {
        lib.pwm(this.raster.chip, this.raster.line, dutyCycle, frequency)
    }

    watch(callback: (value: boolean) => void, edge: Edge = Edge.Both): ChildProcess {
        if(this.child) this.child.kill();
        this.child = fork(`${__dirname}/runner.js`);
        this.child.send(['watch', this.raster.chip, this.raster.line, edge]);
        this.child.on('message', callback);
        return this.child;
    }

    watchSync(callback: (value: boolean) => void, edge: Edge = Edge.Both): void {
        lib.watch(this.raster.chip, this.raster.line, edge, callback);
    }
}