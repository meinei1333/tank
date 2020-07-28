import Notifier from '../observer/Notifier';
import * as EventEmitter from 'eventemitter3';

export default abstract class Mediator<T> extends Notifier {
  protected viewComponent: T;
  private mediatorName: string;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(mediatorName: string, viewComponent: T) {
    super();
    this.mediatorName = mediatorName || NAME;
    this.viewComponent = viewComponent;
  }

  public getMediatorName(): string {
    return this.mediatorName;
  }

  public setViewComponent(viewComponent: T): void {
    this.viewComponent = viewComponent;
  }

  public getViewComponent(): T {
    return this.viewComponent;
  }

  public abstract listNotificationInterests(): string[];

  public abstract handleNotification(notificationName: string, ...args): void;

  public onRegister(): void { }

  public onRemove(): void { }

  public on(
    notificationName: string,
    observerMethod: (notificationName: string, ...args: any[]) => void,
    context?: any,
  ): void {
    this.eventEmitter.on(notificationName, observerMethod, context);
  }

  public removeListener(
    notificationName: string,
    observerMethod: (notificationName: string, ...args: any[]) => void,
    context?: any,
  ): void {
    this.eventEmitter.removeListener(notificationName, observerMethod, context);
  }

  public emit(notificationName: string, ...args: any[]): void {
    this.eventEmitter.emit(notificationName, notificationName, ...args);
  }
}

const NAME: string = 'Mediator';
