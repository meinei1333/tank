import { Sprite } from 'pixi.js';
import { MapUnitTyps } from '../enums/MapUnitTyps';

export default class Hay extends Sprite {
    private _hp: number = 100;
    constructor() {
        super(PIXI.Texture.from('hay.jpg'));
    }
    get type(): number {
        return MapUnitTyps.hay;
    }
    get hp(): number {
        return this._hp;
    }
    reduceHp(value: number) {
        this._hp -= value;
    }
}