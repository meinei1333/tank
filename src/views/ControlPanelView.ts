import View from '../../libraries/puremvc/core/View';
import { Container, Graphics, Text } from 'pixi.js';
import Global from '../Global';
import { Direction } from '../enums/Direction';
import EmitEvent from '../enums/EmitEvent';
import ColorType from '../enums/ColorType';

export default class ControlPanelView extends View {
    static COLOR: string = "COLOR";
    static DIRECTION: string = "DIRECTION";
    static FIRE: string = "FIRE";
    constructor() {
        super('ControlPanelView');
        this.container = new Container();
        Global.PIXI.stage.addChild(this.container);
        this.container.x = Global.DEFAULT_GAME_WIDTH - 300;
        this.container.y = Global.DEFAULT_GAME_HEIGHT - 150;
    }

    init() {
        this.getDirectionRect(80, 0, '↑', Direction.up);
        this.getDirectionRect(80, 80, '↓', Direction.down);
        this.getDirectionRect(0, 80, '←', Direction.left);
        this.getDirectionRect(160, 80, '→', Direction.right);

        this.getColorRect(240, 0, ColorType.RED);
        this.getColorRect(240, 50, ColorType.GREEN);
        this.getColorRect(240, 100, ColorType.BLUE);

        let fire = PIXI.Sprite.from('fire.png');
        fire.x = -90;
        fire.y = 60;
        fire.interactive = true;
        fire.buttonMode = true;
        this.container.addChild(fire);
        fire.name = ControlPanelView.FIRE;
        fire.on('pointertap', this.click.bind(this))
    }

    private getColorRect(x: number, y: number, color: number) {
        let colorRect = new Graphics();
        colorRect.beginFill(color);
        colorRect.drawRect(x, y, 50, 50);
        colorRect.endFill();
        this.container.addChild(colorRect);
        colorRect.interactive = true;
        colorRect.buttonMode = true;
        colorRect.name = `${ControlPanelView.COLOR},${color.toString()}`;
        colorRect.on('pointertap', this.click.bind(this));
    }

    private getDirectionRect(x: number, y: number, symbol: string, direction: number) {
        let rect = new Graphics();
        rect.beginFill(0xd5dce6);
        rect.drawRect(0, 0, 70, 70);
        rect.endFill();
        let text = new Text(symbol, {
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#FF0000']
        });
        rect.x = x;
        rect.y = y;
        this.container.addChild(rect);
        rect.addChild(text);
        text.x = (rect.width - text.width) / 2;
        text.y = (rect.height - text.height) / 2;
        rect.interactive = true;
        rect.buttonMode = true;
        rect.name = `${ControlPanelView.DIRECTION},${direction.toString()}`;
        rect.on('pointertap', this.click.bind(this));
    }

    click(event) {
        let ar = event.target.name.split(',')
        this.eventEmitter.emit(EmitEvent.CLICK, ar[0], parseInt(ar[1]));
    }
}