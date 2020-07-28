import Mediator from '../../libraries/puremvc/patterns/mediator/Mediator';
import View from '../../libraries/puremvc/core/View';
import MapView from '../views/MapView';
import CommandEventName from '../enums/CommandEventName';
import { Direction } from '../enums/Direction';
import { MapUnitTyps } from '../enums/MapUnitTyps';
import MapModel from '../models/MapModel';
import Model from '../../libraries/puremvc/core/Model';
import ColorType from '../enums/ColorType';
import BulletDamage from './BulletDamage';

export default class MapMediator extends Mediator<View> {
    private view: MapView;
    private currentColor: number;
    constructor() {
        let v = new MapView();
        super('MapMediator', v);
        this.view = v;
    }

    handleNotification(notificationName: string, ...arg) {
        switch (notificationName) {
            case CommandEventName.mapInit:
                this.view.init();
                break;
            case CommandEventName.changeDirection:
                switch (arg[0]) {
                    case Direction.up:
                        this.view.up();
                        break;
                    case Direction.down:
                        this.view.down();
                        break;
                    case Direction.right:
                        this.view.right();
                        break;
                    case Direction.left:
                        this.view.left();
                        break;
                }
                let mapModel: MapModel = Model.getInstance(MapModel.id) as MapModel;
                mapModel.wall = this.view.getUnitByTypeOnScreen(MapUnitTyps.wall);
                mapModel.hay = this.view.getUnitByTypeOnScreen(MapUnitTyps.hay);
                break;
            case CommandEventName.bulletHitHay:
                let x = arg[0];
                let y = arg[1];
                switch (this.currentColor) {
                    case ColorType.RED:
                        this.view.reduceHayHP(x, y, BulletDamage.RED);
                        break;
                    case ColorType.BLUE:
                        this.view.reduceHayHP(x, y, BulletDamage.BLUE);
                        break;
                    case ColorType.GREEN:
                        this.view.reduceHayHP(x, y, BulletDamage.GREEN);
                        break;
                }
                break;
            case CommandEventName.bulletHitWall:
                this.view.hitWall(arg[0], arg[1]);
                break;
            case CommandEventName.changeColor:
                this.currentColor = arg[0];
                break;
        }
    }

    listNotificationInterests(): Array<string> {
        return [
            CommandEventName.mapInit,
            CommandEventName.changeDirection,
            CommandEventName.bulletHitHay,
            CommandEventName.bulletHitWall,
            CommandEventName.changeColor
        ]
    }
}