import {Injectable, Renderer2, RendererFactory2, OnDestroy} from '@angular/core';

/**
 * Global Service to notify the click and Escape key events to perform auto close.
 */
@Injectable()
export class AutoCloseNotifyService {
  /**
   * Type of mouse event which is to be listened on document
   */
  public readonly mouseEvent: string = 'mousedown';

  /**
   * Type of keyboard event which is to be listened on document
   */
  public readonly keyboardEvent: string = 'keyup';

  /**
   * list of subscribers registered with this service
   */
  private subscribers = [];

  private _renderer: Renderer2;

  private _clickListener: Function;
  private _keyupListener: Function;


  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);

    this._clickListener = this._renderer.listen('document', this.mouseEvent, this.broadcast.bind(this));
    this._keyupListener = this._renderer.listen('document', this.keyboardEvent, this.broadcast.bind(this));
  }

  OnDestroy() {
    this._clickListener();
    this._keyupListener();
  }

  /**
   * register for events to be notified when they are fired.
   * @param callback : callback function to receive notifications
   */
  register(callback: any) {
    const myHandler = (...args) => { callback(...args); };
    this.subscribers.push(myHandler);
    return () => {
      const index = this.subscribers.indexOf(myHandler);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * boradcaster for the registered events to the subscribers
   */
  private broadcast(event: Event) {
    if (event.defaultPrevented) {
      return;  // Do nothing if the event was already processed
    }

    if (event.type === this.keyboardEvent) {
      // check for escape key
      if ((<KeyboardEvent>event).key !== 'Escape') {
        return;
      }
    } else if (event.type === this.mouseEvent && (<MouseEvent>event).button === 2) {
      return;
    }

    this.subscribers.forEach((callback: (ev: Event) => any, key) => {
      // call the subscribed function
      callback(event);
    });
  }
}
