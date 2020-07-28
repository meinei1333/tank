import { Container, Sprite, Texture } from 'pixi.js';
import { MapUnitTyps } from '../enums/MapUnitTyps';

export default class Wall extends Sprite {
    constructor() {
        super(PIXI.Texture.from('wall.jpg'));
    }
    get type(): number {
        return MapUnitTyps.wall;
    }
}