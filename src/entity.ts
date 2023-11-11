import { Application, Container, DisplayObject, Graphics, ICanvas, IPoint, Point, RAD_TO_DEG } from "pixi.js";
import * as TWEEN from "tweedle.js";

export class Entity {
    health: number;
    obj: Container;
    mover: MovementComponent;

    constructor(_obj: Container) {
        this.obj = _obj;
        this.mover = new MovementComponent(this.obj);
    }
    setPivotMiddle() {
        this.obj.pivot = new Point(
            this.obj.width/2,
            this.obj.height/2
        );
        return this;
    }
}

export class Soldier extends Entity {
    
}

export class Unit extends Container {
    soldiers: Soldier[];
    spacing: number = 2;
    min_columns: number = 3;
    #last_y: number = 0;

    constructor() {
        super();
        this.soldiers = [];
    }
    moveFormation(p1: Point, p2: Point) {
        let x_spacing = this.soldiers[0].obj.width + this.spacing;
        let y_spacing = this.soldiers[0].obj.height + this.spacing; 

        let frontrow_vec = new Vector(x_spacing*this.min_columns, this.#last_y);
        if (!p1.equals(p2)) {
            frontrow_vec = new Vector(p2.x - p1.x, p2.y - p1.y);
        }     
        let num_of_columns = Math.max(this.min_columns, Math.floor(frontrow_vec.length/x_spacing));

        let i = 0;
        let row = 0;
        for (let man of this.soldiers) {      
            i++;
            let local_vec = frontrow_vec.clone();
            local_vec.normalize().multiply(x_spacing*i);
            if (row >= 0) {
                // @jaerri "normal_vec" is not "normalized" vector
                let normal_vec = new Vector(-frontrow_vec.y, frontrow_vec.x);
                normal_vec.normalize().multiply(y_spacing*row);
                local_vec.add(normal_vec);
            }
            let r = new Vector(-frontrow_vec.y, frontrow_vec.x).dir - Math.PI/2;
            let tween = man.mover.move(new Vector(p1.x + local_vec.x, p1.y + local_vec.y));
            tween.onComplete(() => man.mover.rotate(r));
 
            if (i >= num_of_columns) {
                i = 0;
                row++;
            }     
        } 
        this.#last_y = frontrow_vec.y;
    }
}

export class MovementComponent {
    private obj: Container;
    private currentTweens: { 
        move: TWEEN.Tween<Point> | null, 
        rotate: TWEEN.Tween<number> | null 
    } = { move: null, rotate: null };
    move_speed = 1;
    rotate_speed = 1;

    constructor(_obj: Container) {
        this.obj = _obj;
    }

    move(pos: Point): TWEEN.Tween<Point> {
        let vec = new Vector(pos.x, pos.y).subtract(this.obj.position);
        this.obj.rotation = vec.dir + Math.PI/2;
        
        return this.movePos(pos);
    }
    movePos(pos: Point): TWEEN.Tween<Point> {
        if (this.currentTweens.move) this.currentTweens.move.stop();
        
        let dist = Math.sqrt(
            (this.obj.position.x - pos.x)**2 +
            (this.obj.position.y - pos.y)**2
        );
        this.currentTweens.move = new TWEEN.Tween(this.obj.position)
            .to({ x: pos.x, y: pos.y }, dist / this.move_speed)
            .start();
        return this.currentTweens.move;
    }
    rotate(r: number): MovementComponent {
        if (this.currentTweens.rotate) this.currentTweens.rotate.stop();
        
        // this.currentTweens.rotate = new TWEEN.Tween(this.obj.rotation)
        //     .to(r, r / this.rotate_speed)
        //     .start();
        // console.log(this.currentTweens.rotate)
        // console.log(this.currentTweens.move);
        this.obj.rotation = r;
        return this;
    }
}

export class Vector extends Point {
    #length: number;
    #dir: number;
    #vecarr: Graphics[] = [];

    get length(): number {
        return Math.sqrt(
            this.x ** 2
            + this.y ** 2
        )
    }
    set length(n: number) {
        this.y = Math.sin(this.dir) * n;
        this.x = Math.cos(this.dir) * n;
    }
    get dir(): number {
        return Math.atan2(this.y, this.x);
    }
    dot(vec: Vector): number {
        return this.x * vec.x + this.y * vec.y;
    }
    normalize(): Vector {
        let l = (this.length===0)?1:this.length; // prevents divide by 0
        this.x /= l;
        this.y /= l;
        return this
    }

    add(vec: Vector | Point): Vector {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    subtract(vec: Vector | Point): Vector {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    multiply(n: number): Vector {
        this.x *= n;
        this.y *= n;
        return this;
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }

}