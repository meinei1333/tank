import Global from './Global';
import Facade from '../libraries/puremvc/patterns/facade/Facade';
import { Application, Loader } from 'pixi.js';
import CommandEventName from './enums/CommandEventName';
import MapMediator from './mediators/MapMediator';
import ControlPanelMediator from './mediators/ControlPanelMediator';
import CarMediator from './mediators/CarMediator';
import FireMediator from './mediators/FireMediator';
import ColorType from './enums/ColorType';
import { Direction } from './enums/Direction';
import MapModel from './models/MapModel';
import Model from '../libraries/puremvc/core/Model';

export default class App {
    private defaultColor = ColorType.RED;
    private defaultDirection = Direction.up;

    constructor() {
        this.loadAssets();
        this.initMVC();
        this.initPIXI();
        this.registerMediator();
    }

    registerMediator() {
        Global.facade.registerMediator(new MapMediator());
        Global.facade.registerMediator(new ControlPanelMediator());
        Global.facade.registerMediator(new CarMediator());
        Global.facade.registerMediator(new FireMediator());
    }

    loadAssets() {
        let source = ['bullet.png', 'car.png', 'hay.jpg', 'wall.jpg', 'fire.png'];
        let loader = new Loader('assets/');
        source.forEach(element => {
            loader.add(element);
        })
        loader.load(this.loadCompelted.bind(this));
    }

    loadCompelted() {
        Global.facade.sendNotification(CommandEventName.mapInit);
        Global.facade.sendNotification(CommandEventName.controlPanceInit);
        Global.facade.sendNotification(CommandEventName.carInit);

        Global.facade.sendNotification(CommandEventName.changeColor, this.defaultColor);
        Global.facade.sendNotification(CommandEventName.changeDirection, this.defaultDirection);
    }

    initMVC() {
        Global.facade = Facade.getInstance('unique');
    }
    initPIXI() {
        Global.PIXI = new Application({
            width: Global.DEFAULT_GAME_WIDTH,
            height: Global.DEFAULT_GAME_HEIGHT,
            backgroundColor: 0x000000,
        });
        document.body.appendChild(Global.PIXI.view);
    }
}