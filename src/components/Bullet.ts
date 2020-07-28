import { Sprite } from 'pixi.js';

export default class Bullet extends Sprite {
    private _id: number;
    private _color: number;
    private _direction;
    constructor(color: number, direction) {
        super(PIXI.Texture.from('bullet.png'));
        this.tint = color;
        this._color = color;
        this._direction = direction;
        this._id = Math.random();
    }
    get direction() {
        return this._direction;
    }
    get id(){
        return this._id;
    }
}