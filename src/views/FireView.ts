import View from '../../libraries/puremvc/core/View';
import { Container, Point } from 'pixi.js';
import Global from '../Global';
import Bullet from '../components/Bullet';
import { Direction } from '../enums/Direction';
import MapModel from '../models/MapModel';
import Model from '../../libraries/puremvc/core/Model';

export default class FireView extends View {
    static HIT_HAY: string = 'HIT_HAY';
    static HIT_WAll: string = 'HIT_WAll';
    private bulletPool: BulletPool;
    constructor() {
        super('FireView');
        this.container = new Container();
        Global.PIXI.stage.addChild(this.container);
        this.bulletPool = new BulletPool();

        Global.PIXI.ticker.add(this.move.bind(this));
    }
    creatOneBullet(color: number, direction) {
        let bullet = new Bullet(color, direction);
        this.bulletPool.addOneBullet(bullet);
        this.container.addChild(bullet);

        this.setDirection(bullet, direction);
    }
    setDirection(bullet: Bullet, direction) {
        switch (direction) {
            case Direction.up:
                bullet.x = Math.ceil(Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT / 2) * Global.BOX_UNIT - Global.BOX_UNIT;
                bullet.y = Math.ceil(Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT / 2) * Global.BOX_UNIT - Global.BOX_UNIT;
                bullet.rotation = Math.PI * 1.5;
                break;
            case Direction.down:
                bullet.x = Math.ceil(Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT / 2) * Global.BOX_UNIT;
                bullet.y = Math.ceil(Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT / 2) * Global.BOX_UNIT;
                bullet.rotation = Math.PI * 0.5;
                break;
            case Direction.right:
                bullet.x = Math.ceil(Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT / 2) * Global.BOX_UNIT;
                bullet.y = Math.ceil(Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT / 2) * Global.BOX_UNIT - Global.BOX_UNIT;
                break;
            case Direction.left:
                bullet.x = Math.ceil(Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT / 2) * Global.BOX_UNIT - Global.BOX_UNIT;
                bullet.y = Math.ceil(Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT / 2) * Global.BOX_UNIT;
                bullet.rotation = Math.PI * 1;
                break;
        }
    }
    move() {
        if (!this.bulletPool.all || this.bulletPool.all.length === 0) return;
        let mapModel: MapModel = Model.getInstance(MapModel.id) as MapModel;

        this.bulletPool.all.forEach(bullet => {
            switch (bullet.direction) {
                case Direction.up:
                    bullet.y -= 1;
                    break;
                case Direction.down:
                    bullet.y += 1;
                    break;
                case Direction.right:
                    bullet.x += 1;
                    break;
                case Direction.left:
                    bullet.x -= 1;
                    break;
            }
            for (let index = 0; index < mapModel.wall.length; index++) {
                const wall = mapModel.wall[index];
                let bulletBox: Box = new Box(bullet.x, bullet.y, 50, 50);
                let wallBox: Box = new Box(wall.x * Global.BOX_UNIT, wall.y * Global.BOX_UNIT, Global.BOX_UNIT, Global.BOX_UNIT);
                if (this.isCollision(bulletBox, wallBox)) {
                    console.log('destroy by wall');
                    this.destroyBullet(bullet);
                    this.eventEmitter.emit(FireView.HIT_WAll, wall.x, wall.y);
                }
            }
            for (let index = 0; index < mapModel.hay.length; index++) {
                const hay = mapModel.hay[index];
                let bulletBox: Box = new Box(bullet.x, bullet.y, 50, 50);
                let hayBox: Box = new Box(hay.x * Global.BOX_UNIT, hay.y * Global.BOX_UNIT, Global.BOX_UNIT, Global.BOX_UNIT);
                if (this.isCollision(bulletBox, hayBox)) {
                    console.log('destroy by hay');
                    this.destroyBullet(bullet);
                    this.eventEmitter.emit(FireView.HIT_HAY, hay.x, hay.y);
                }
            }
        });
    }
    destroyBullet(bullet: Bullet) {
        this.container.removeChild(bullet);
        this.bulletPool.removeOneBullet(bullet);
    }
    isCollision(bullet: Box, box: Box) {
        if (this.isBetween(bullet.x, box.x, box.x + box.w) ||
            this.isBetween(bullet.x + bullet.w, box.x, box.x + box.w)) {
            if (this.isBetween(bullet.y, box.y, box.y + box.h) ||
                this.isBetween(bullet.y + bullet.h, box.y, box.y + box.h)) {
                return true;
            }
        }
        return false;
    }
    isBetween(a: number, b1: number, b2: number): boolean {
        if (a >= b1 && a <= b2) {
            return true;
        } else if (a <= b1 && a >= b2) {
            return true;
        } else {
            return false;
        }
    }
}

class BulletPool {
    public all: Array<Bullet>;
    constructor() {
        this.all = [];
    }
    addOneBullet(bullet: Bullet) {
        this.all.push(bullet);
    }
    removeOneBullet(deleteBullet: Bullet) {
        for (let index = 0; index < this.all.length; index++) {
            const bullet = this.all[index];
            if (bullet.id === deleteBullet.id) {
                this.all.splice(index, 1);
            }
        }
    }
}

class Box {
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    constructor(ox, oy, ow, oh) {
        this.x = ox;
        this.y = oy;
        this.w = ow;
        this.h = oh;
    }
}