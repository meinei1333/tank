import Mediator from '../../libraries/puremvc/patterns/mediator/Mediator';
import View from '../../libraries/puremvc/core/View';
import ControlPanelView from '../views/ControlPanelView';
import CommandEventName from '../enums/CommandEventName';
import EmitEvent from '../enums/EmitEvent';
import Global from '../Global';

export default class ControlPanelMediator extends Mediator<View> {
    private view: ControlPanelView;
    private currentColor: number;
    private currentDirection;
    constructor() {
        let v = new ControlPanelView();
        super('ControlPanelMediator', v);
        this.view = v;
    }

    handleNotification(notificationName: string, args) {
        switch (notificationName) {
            case CommandEventName.controlPanceInit:
                this.view.init();
                this.view.eventEmitter.on(EmitEvent.CLICK, this.click.bind(this));
                break;
            case CommandEventName.changeColor:
                this.currentColor = args;
                break;
            case CommandEventName.changeDirection:
                this.currentDirection = args;
                break;
        }
    }

    click(type, value) {
        switch (type) {
            case ControlPanelView.DIRECTION:
                Global.facade.sendNotification(CommandEventName.changeDirection, value);
                break;
            case ControlPanelView.COLOR:
                Global.facade.sendNotification(CommandEventName.changeColor, value);
                this.currentColor = value;
                break;
            case ControlPanelView.FIRE:
                Global.facade.sendNotification(CommandEventName.fire, this.currentColor, this.currentDirection);
                break;
        }
    }

    listNotificationInterests(): Array<string> {
        return [
            CommandEventName.controlPanceInit,
            CommandEventName.changeColor,
            CommandEventName.changeDirection
        ];
    }
}