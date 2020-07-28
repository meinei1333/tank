import View from '../../libraries/puremvc/core/View';
import { Container, Sprite } from 'pixi.js';
import Global from '../Global';
import ColorType from '../enums/ColorType';
import { Direction } from '../enums/Direction';

export default class CarView extends View {
    private car: Sprite;
    constructor() {
        super('CarView');
        this.container = new Container();
        Global.PIXI.stage.addChild(this.container);
    }

    init() {
        this.car = new Sprite(PIXI.Texture.from('car.png'));
        this.container.addChild(this.car);
        this.car.anchor.set(0.5);

        this.car.x = Math.ceil(Global.DEFAULT_GAME_WIDTH / Global.BOX_UNIT / 2) * Global.BOX_UNIT - Global.BOX_UNIT / 2;
        this.car.y = Math.ceil(Global.DEFAULT_GAME_HEIGHT / Global.BOX_UNIT / 2) * Global.BOX_UNIT - Global.BOX_UNIT / 2;
    }

    changeColor(color) {
        this.car.tint = color;
    }

    changeDirection(direction) {
        switch (direction) {
            case Direction.up:
                this.car.rotation = Math.PI * 0;
                this.car.scale.y = 1;
                break;
            case Direction.right:
                this.car.rotation = Math.PI * 0.5;
                this.car.scale.y = 1;
                break;
            case Direction.down:
                this.car.rotation = Math.PI * 1;
                this.car.scale.y = 1;
                break;
            case Direction.left:
                this.car.rotation = Math.PI * 0.5;
                this.car.scale.y *= -1;
                break;
        }
    }
}