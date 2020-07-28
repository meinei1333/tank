import View from '../../libraries/puremvc/core/View';
import Global from '../Global';
import { Container, Graphics, Sprite, Point } from 'pixi.js';
import Wall from '../components/Wall';
import Hay from '../components/Hay';
import { MapUnitTyps } from '../enums/MapUnitTyps';
import { Direction } from '../enums/Direction';
import MapModel from '../models/MapModel';
import Model from '../../libraries/puremvc/core/Model';

export default class MapView extends View {
    private upIndex: number = 0;
    private downIndex: number = 0;
    private rightIndex: number = 0;
    private leftIndex: number = 0;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private mapArray: MapArray;

    constructor() {
        super('MapView');
        this.container = new Container();
        Global.PIXI.stage.addChild(this.container);
        this.mapArray = new MapArray();
        this.getUnitByTypeOnScreen = this.getUnitByTypeOnScreen.bind(this);
    }

    init() {
        for (let indexY = 0; indexY < Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT; indexY++) {
            for (let indexX = 0; indexX < Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT; indexX++) {
                let tempUnit = this.getUnit();
                let type = tempUnit[0]
                let unit = tempUnit[1];
                this.mapArray.add(indexX, indexY, type, unit);
                if (type != MapUnitTyps.empty) {
                    unit.x = indexX * Global.BOX_UNIT;
                    unit.y = indexY * Global.BOX_UNIT;
                    this.container.addChild(unit);
                }
            }
        }
    }

    get middlePointX(): number {
        return Math.ceil(Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT / 2) - 1 + this.offsetX;
    }

    get middlePointY(): number {
        return Math.ceil(Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT / 2) - 1 + this.offsetY;
    }

    public reduceHayHP(x: number, y: number, value: number) {
        let unit = this.mapArray.getOneUnit(x + this.offsetX, y + this.offsetY);
        this.setHitEffect(unit.sprite)
        if (unit.type === MapUnitTyps.hay) {
            let hay: Hay = unit.sprite as Hay;
            hay.reduceHp(value);
            if (hay.hp <= 0) {
                console.log('remove')
                this.mapArray.clearOneUnitToEmpty(x + this.offsetX, y + this.offsetY);
                this.container.removeChild(hay);
                let mapModel: MapModel = Model.getInstance(MapModel.id) as MapModel;
                mapModel.hay = this.getUnitByTypeOnScreen(MapUnitTyps.hay);
            }
        }
    }

    public hitWall(x: number, y: number) {
        let unit = this.mapArray.getOneUnit(x + this.offsetX, y + this.offsetY);
        this.setHitEffect(unit.sprite)
    }

    setHitEffect(sprite: Sprite) {
        sprite.tint = 0xcc3333;
        setTimeout(() => {
            sprite.tint = 0xFFFFFF;
        }, 500);
    }

    setMapUnitType(x: number, y: number, type: number) {
        this.mapArray.setType(x, y, type);
    }

    up() {
        console.log(this.mapArray.getType(this.middlePointX, this.middlePointY - 1) != MapUnitTyps.empty);

        if (this.mapArray.getType(this.middlePointX, this.middlePointY - 1) != MapUnitTyps.empty) return;

        this.container.y += Global.BOX_UNIT;
        this.offsetY--;
        if (this.offsetY < 0 && this.upIndex > this.offsetY) {
            this.upIndex--;
            this.add(Direction.up);
        } else {
            this.add(Direction.up, true)
        }
    }

    down() {
        if (this.mapArray.getType(this.middlePointX, this.middlePointY + 1) != MapUnitTyps.empty) return;

        this.container.y -= Global.BOX_UNIT;
        this.offsetY++;
        if (this.offsetY > 0 && this.downIndex < this.offsetY) {
            this.downIndex++;
            this.add(Direction.down);
        } else {
            this.add(Direction.down, true)
        }
    }

    left() {
        if (this.mapArray.getType(this.middlePointX - 1, this.middlePointY) != MapUnitTyps.empty) return;

        this.container.x += Global.BOX_UNIT;
        this.offsetX--;
        if (this.offsetX < 0 && this.leftIndex > this.offsetX) {
            this.leftIndex--;
            this.add(Direction.left);
        } else {
            this.add(Direction.left, true)
        }
    }

    right() {
        if (this.mapArray.getType(this.middlePointX + 1, this.middlePointY) != MapUnitTyps.empty) return;

        this.container.x -= Global.BOX_UNIT;
        this.offsetX++;
        if (this.offsetX > 0 && this.rightIndex < this.offsetX) {
            this.rightIndex++;
            this.add(Direction.right);
        } else {
            this.add(Direction.right, true)
        }
    }

    add(direction, checkIsExit: boolean = false) {
        switch (direction) {
            case Direction.up:
                this.createOneRow(this.offsetY * Global.BOX_UNIT, checkIsExit);
                break;
            case Direction.down:
                this.createOneRow(Global.DEFAULT_GAME_HEIGHT + (this.offsetY - 1) * Global.BOX_UNIT, checkIsExit)
                break;
            case Direction.left:
                this.createOneColumn(this.offsetX * Global.BOX_UNIT, checkIsExit)
                break;
            case Direction.right:
                this.createOneColumn(Global.DEFAULT_GAME_WIDTH + (this.offsetX - 1) * Global.BOX_UNIT, checkIsExit);
                break;
        }
    }

    createOneRow(yy, checkIsExit: boolean = false) {
        if (checkIsExit) {
            for (let indexX = 0; indexX < Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT; indexX++) {
                let tempUnit = this.getUnit();
                let type = tempUnit[0]
                let unit = tempUnit[1];
                if (!this.mapArray.isExit(indexX + this.offsetX, this.offsetY)) {
                    this.mapArray.add(indexX + this.offsetX, this.offsetY, type, unit);
                    if (type != MapUnitTyps.empty) {
                        unit.x = indexX * Global.BOX_UNIT + this.offsetX * Global.BOX_UNIT;
                        unit.y = yy;
                        this.container.addChild(unit);
                    }
                }
            }
        } else {
            for (let indexX = 0; indexX < Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT; indexX++) {
                let tempUnit = this.getUnit();
                let type = tempUnit[0]
                let unit = tempUnit[1];
                this.mapArray.add(indexX + this.offsetX, this.offsetY, type, unit);

                if (type != MapUnitTyps.empty) {
                    unit.x = indexX * Global.BOX_UNIT + this.offsetX * Global.BOX_UNIT;
                    unit.y = yy;
                    this.container.addChild(unit);
                }
            }
        }
    }

    createOneColumn(xx, checkIsExit: boolean = false) {
        if (checkIsExit) {
            for (let indexY = 0; indexY < Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT; indexY++) {
                let tempUnit = this.getUnit();
                let type = tempUnit[0]
                let unit = tempUnit[1];
                if (!this.mapArray.isExit(this.offsetX, indexY + this.offsetY)) {
                    this.mapArray.add(this.offsetX, indexY + this.offsetY, type, unit);
                    if (type != MapUnitTyps.empty) {
                        unit.x = xx;
                        unit.y = indexY * Global.BOX_UNIT + this.offsetY * Global.BOX_UNIT;
                        this.container.addChild(unit);
                    }
                }
            }
        } else {
            for (let indexY = 0; indexY < Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT; indexY++) {
                let tempUnit = this.getUnit();
                let type = tempUnit[0]
                let unit = tempUnit[1];
                this.mapArray.add(this.offsetX, indexY + this.offsetY, type, unit);

                if (type != MapUnitTyps.empty) {
                    unit.x = xx;
                    unit.y = indexY * Global.BOX_UNIT + this.offsetY * Global.BOX_UNIT;
                    this.container.addChild(unit);
                }
            }
        }
    }

    getUnit(): Array<any> {
        let result = [];
        let unitType = this.getUnitType();
        switch (unitType) {
            case MapUnitTyps.wall:
                result.push(MapUnitTyps.wall, new Wall());
            case MapUnitTyps.hay:
                result.push(MapUnitTyps.hay, new Hay());
            default:
                result.push(MapUnitTyps.empty);
        }
        return result;
    }

    getUnitType(): number {
        let random = Math.random();
        if (random < 0.02) {
            return MapUnitTyps.wall;
        } else if (random < 0.04) {
            return MapUnitTyps.hay;
        } else {
            return MapUnitTyps.empty;
        }
    }

    getUnitByTypeOnScreen(type): Array<Point> {
        let result = [];
        for (let index = 0; index < this.mapArray.all.length; index++) {
            const oneUnit = this.mapArray.all[index];
            if (oneUnit.point.x >= this.offsetX && oneUnit.point.x < this.offsetX + Global.WIDTH_COUNT) {
                if (oneUnit.point.y >= this.offsetY && oneUnit.point.y < this.offsetY + Global.HEIGHT_COUNT) {
                    if (type === oneUnit.type) {
                        let point = new Point(oneUnit.point.x - this.offsetX, oneUnit.point.y - this.offsetY)
                        result.push(point);
                    }
                }
            }
        }
        return result;
    }
}

class MapArray {
    public all: Array<OneUnit> = [];
    add(x: number, y: number, type, sprite = null) {
        this.all.push(new OneUnit(new Point(x, y), type, sprite));
    }
    isExit(x, y): boolean {
        for (let index = 0; index < this.all.length; index++) {
            const point = this.all[index].point;
            if (point.x === x && point.y === y) {
                return true;
            }
        }
        return false;
    }
    getOneUnit(x, y): OneUnit {
        for (let index = 0; index < this.all.length; index++) {
            const oneUnit = this.all[index];
            if (oneUnit.point.x === x && oneUnit.point.y === y) {
                return oneUnit;
            }
        }
    }
    clearOneUnitToEmpty(x, y) {
        for (let index = 0; index < this.all.length; index++) {
            const oneUnit = this.all[index];
            if (oneUnit.point.x === x && oneUnit.point.y === y) {
                this.all[index].type = MapUnitTyps.empty;
                this.all[index].sprite = null;
            }
        }
    }
    getType(x, y): number {
        for (let index = 0; index < this.all.length; index++) {
            const point = this.all[index].point;
            const oneUnit = this.all[index];
            if (oneUnit.point.x === x && oneUnit.point.y === y) {
                return oneUnit.type;
            }
        }
    }
    setType(x, y, type) {
        for (let index = 0; index < this.all.length; index++) {
            const oneUnit = this.all[index];
            if (oneUnit.point.x === x && oneUnit.point.y === y) {
                oneUnit.type = type;
            }
        }
    }
}

class OneUnit {
    public point: Point;
    public type: number;
    public sprite: any;
    constructor(point, type, sprite) {
        this.point = point;
        this.type = type;
        this.sprite = sprite;
    }
}