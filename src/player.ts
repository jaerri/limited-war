import { Application, Container, Sprite, Texture } from "pixi.js";

export class Player {
    
}

export class Scene extends Container {
    baseObj: Sprite

    constructor(app: Application) {
        super();

        let bg = new Sprite(Texture.WHITE)
        bg.width = app.renderer.screen.width;
        bg.height = app.renderer.screen.height;
        bg.eventMode = 'dynamic';
        bg.tint = "0x000000";
        this.baseObj = bg;
    }
}