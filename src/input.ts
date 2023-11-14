import { Container, FederatedEventEmitterTypes } from "pixi.js";

export class InputMap {
    
}

export class InputBuilder {
    
}

export class InputService {
    bg: Container;
    keyMap: Map<string, InputMap | Function>

    constructor(_bg: Container) {
        this.bg = _bg;
        
    }

    on(event: keyof GlobalMixins.FederatedEventEmitterTypes, callback: () => void) {
        this.bg.on(event, callback);
    }
}
