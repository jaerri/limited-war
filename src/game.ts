import * as PIXI from "pixi.js";
import { Point, FederatedPointerEvent } from "pixi.js";
import * as TWEEN from "tweedle.js";
import { Entity, Soldier, Unit } from "./entity";
import { Scene } from "./player";

const app = new PIXI.Application<HTMLCanvasElement>({
    autoDensity: true,
    width: 640,
    height: 360
});
document.body.insertBefore(app.view, document.body.firstChild?.nextSibling as ChildNode | null);
let scene = new Scene(app);
app.stage.addChild(scene.baseObj);

let unit = new Unit();

for (let i=0; i<1; i++) {
    let soldier = new Soldier(
        new PIXI.Graphics()
        .lineStyle(2, 0xFFFFFF)
        .drawRect(0, 0, 20, 20)
        .moveTo(10, 0)
        .lineTo(10, -5)
    ).setPivotMiddle();
    unit.soldiers.push(soldier);
    app.stage.addChild(soldier.obj);
}

let p1: Point | null;
scene.baseObj.on("pointerdown", (e: FederatedPointerEvent) => {
    e.preventDefault();
    if (!(e.button === 2)) return;
    p1 = e.global.clone();
});
scene.baseObj.on("pointerup", (e: FederatedPointerEvent) => {
    e.preventDefault();
    if (p1 === null || !(e.button === 2)) return;
    unit.moveFormation(p1, e.global);
    p1 = null;
});

scene.baseObj.on("pointerdown", (e: FederatedPointerEvent) => {
    e.preventDefault();
    if (!(e.button === 0)) return;
    unit.fire(e.global.clone());
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
    let soldier = new Soldier(
        new PIXI.Graphics()
        .lineStyle(2, 0xFFFFFF)
        .drawRect(0, 0, 20, 20)
        .moveTo(10, 0)
        .lineTo(10, -5)
    ).setPivotMiddle();
    unit.soldiers.push(soldier);
    app.stage.addChild(soldier.obj);
}
function disperse() {
    for (let sol of unit.soldiers) {
        sol.mover.move(new Point(app.view.width*Math.random(), app.view.height*Math.random()));
    }
}
(window as any).removeSol = removeSol;
(window as any).addSol = addSol;
(window as any).disperse = disperse;