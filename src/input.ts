import { Container, DisplayObjectEvents } from "pixi.js";

export class InputHandler {
    bg: Container;
    constructor(_bg: Container) {
        this.bg = _bg;
    }

    on(event: keyof GlobalMixins.DisplayObjectEvents, callback: () => void) {
        this.bg.on(event, callback);
    }
}
