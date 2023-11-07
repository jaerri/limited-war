import { Container, Point } from "pixi.js";
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

        console.log(num_of_columns);
        let i = 0;
        let row = 0;
        for (let man of this.soldiers) {      
            let local_vec = frontrow_vec.clone();
            local_vec.normalize().multiply(x_spacing*i);
            if (row >= 0) {
                // "normal vector" is not a "normalized" vector, it's just perpendicular 
                let normal_vec = new Vector(-frontrow_vec.y, frontrow_vec.x);
                normal_vec.normalize().multiply(y_spacing*row);
                local_vec.add(normal_vec);
            }
            man.mover.move(p1.x + local_vec.x, p1.y + local_vec.y);
            i++;
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
    } = { move: null, rotate: null};
    move_speed = 2;
    rotate_speed = 2;

    constructor(_obj: Container) {
        this.obj = _obj;
    }

    move(x: number, y: number): MovementComponent {
        if (this.currentTweens.move) this.currentTweens.move.stop();
        
        let dist = Math.sqrt(
            (this.obj.position.x - x)**2 +
            (this.obj.position.y - y)**2
        );
        this.currentTweens.move = new TWEEN.Tween(this.obj.position)
            .to({ x: x, y: y }, dist/this.move_speed)
            .start();
        return this;
    }
    rotate(r: number): MovementComponent {
        if (this.currentTweens.rotate) this.currentTweens.rotate.stop();

        this.currentTweens.rotate = new TWEEN.Tween(this.obj.rotation)
            .to(r, this.rotate_speed)
            .start();
        return this;
    }
}

export class Vector extends Point {
    #length: number;
    #dir: number;

    get length(): number {
        return Math.sqrt(
            this.x**2 +
            this.y**2
        )
    }
    set length(n: number) {
        this.y = Math.sin(this.dir)*n;
        this.x = Math.cos(this.dir)*n;
    }
    get dir(): number {
        return Math.atan2(this.y, this.x);
    }
    dot(vec: Vector): number {
        return this.x*vec.x + this.y*vec.y;
    }
    normalize(): Vector {
        let l = (this.length===0)?1:this.length; // prevents divide by 0
        this.x /= l;
        this.y /= l;
        return this
    }

    add(vec: Vector): Vector {
        this.x += vec.x;
        this.y += vec.y;
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