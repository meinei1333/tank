import Mediator from '../../libraries/puremvc/patterns/mediator/Mediator';
import CommandEventName from '../enums/CommandEventName';
import View from '../../libraries/puremvc/core/View';
import FireView from '../views/FireView';
import Global from '../Global';

export default class FireMediator extends Mediator<View> {
    private view: FireView;
    constructor() {
        let v = new FireView();
        super('FireMediator', v);
        this.view = v;

        this.view.eventEmitter.on(FireView.HIT_HAY, this.hitHay);
        this.view.eventEmitter.on(FireView.HIT_WAll, this.hitWall);
    }

    hitWall(x, y) {
        console.log('hitWall x,y:', x, y);
        Global.facade.sendNotification(CommandEventName.bulletHitWall, x, y);
    }

    hitHay(x, y) {
        console.log('hitHay x,y:', x, y);
        Global.facade.sendNotification(CommandEventName.bulletHitHay, x, y);
    }

    handleNotification(notificationName: string, ...args) {
        switch (notificationName) {
            case CommandEventName.fire:
                this.view.creatOneBullet(args[0], args[1]);
                break;
        }
    }

    listNotificationInterests(): Array<string> {
        return [
            CommandEventName.fire
        ]
    }
}