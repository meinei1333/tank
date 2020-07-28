import Model from '../../libraries/puremvc/core/Model';
import { Point } from 'pixi.js';

export default class MapModel extends Model {
    static id = 'MapModel';
    public wall: Array<Point>;
    public hay: Array<Point>;
    constructor() {
        super('MapModel');
    }
}