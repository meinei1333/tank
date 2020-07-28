import CarView from '../views/CarView'
import Mediator from '../../libraries/puremvc/patterns/mediator/Mediator';
import View from '../../libraries/puremvc/core/View';
import CommandEventName from '../enums/CommandEventName';

export default class CarMediator extends Mediator<View> {
    private view: CarView;
    constructor() {
        let v = new CarView();
        super('CarMediator', v);
        this.view = v;
    }

    handleNotification(notificationName: string, args) {
        switch (notificationName) {
            case CommandEventName.carInit:
                this.init();
                break;
            case CommandEventName.changeColor:
                this.view.changeColor(args);
                break;
            case CommandEventName.changeDirection:
                this.view.changeDirection(args)
        }
    }

    init() {
        this.view.init();
    }

    listNotificationInterests(): Array<string> {
        return [
            CommandEventName.carInit,
            CommandEventName.changeColor,
            CommandEventName.changeDirection
        ]
    }
}