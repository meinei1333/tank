import { Application } from 'pixi.js';
import Facade from '../libraries/puremvc/patterns/facade/Facade';

export default class Global {
    public static facade: Facade;
    public static PIXI: Application;
    public static DEFAULT_GAME_WIDTH: number = 1900;
    public static DEFAULT_GAME_HEIGHT: number = 1050;
    public static BOX_UNIT: number = 50;
    public static WIDTH_COUNT = Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT;
    public static HEIGHT_COUNT = Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT;
}