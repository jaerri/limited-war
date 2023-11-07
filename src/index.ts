import * as PIXI from "pixi.js";
import { Point, FederatedPointerEvent } from "pixi.js";
import * as TWEEN from "tweedle.js";
import { Entity, Unit } from "./entity";

const app = new PIXI.Application<HTMLCanvasElement>({
    autoDensity: true,
    width: 640,
    height: 360
});
document.body.insertBefore(app.view, document.body.firstChild?.nextSibling as ChildNode | null);
let bg = new PIXI.Sprite(PIXI.Texture.WHITE)
bg.width = app.screen.width;
bg.height = app.screen.height;
bg.eventMode = 'dynamic';
bg.tint = "0x000000";
app.stage.addChild(bg);

let unit = new Unit();

for (let i=0; i<50; i++) {
    let soldier = new Entity(
        new PIXI.Graphics()
        .lineStyle(2, 0xFF0000)
        .drawRect(0, 0, 20, 20)
    );
    unit.soldiers.push(soldier);
    app.stage.addChild(soldier.obj);
}

let p1: Point | null;
bg.on("pointerdown", (e: FederatedPointerEvent) => {
    p1 = e.global.clone();
});
bg.on("pointerup", (e: FederatedPointerEvent) => {
    if (p1 === null) return;
    unit.moveFormation(p1, e.global);
    p1 = null;
});

app.ticker.add((dt) => {
    TWEEN.Group.shared.update(dt);
});

function removeSol() {
    let random = Math.floor(Math.random()*unit.soldiers.length);
    unit.soldiers[random].obj.destroy();
    unit.soldiers.splice(random, 1);
}
function addSol() {
    let soldier = new Entity(
        new PIXI.Graphics()
        .lineStyle(2, 0xFF0000)
        .drawRect(0, 0, 20, 20)
    );
    unit.soldiers.push(soldier);
    app.stage.addChild(soldier.obj);
}
function disperse() {
    for (let sol of unit.soldiers) {
        sol.mover.move(app.view.width*Math.random(), app.view.height*Math.random());
    }
}
(window as any).removeSol = removeSol;
(window as any).addSol = addSol;
(window as any).disperse = disperse;