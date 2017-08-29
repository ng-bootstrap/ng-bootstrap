import {Subject} from 'rxjs/Subject';
import {AnimationEvent} from '@angular/animations';
import {filter} from 'rxjs/operator/filter';
import {take} from 'rxjs/operator/take';

const ENTER_STATE = 'enter';
const EXIT_STATE = 'exit';

export class AnimationsHelper {
  state = ENTER_STATE;

  stateChanges = new Subject<AnimationEvent>();

  triggerExitAnimation(): Promise<any> {
    const exitAnimationCompleted = new Promise((resolve, reject) => {
      take.call(filter.call(this.stateChanges, event => event.toState === EXIT_STATE), 1).subscribe(resolve, reject);
    });
    this.state = EXIT_STATE;
    return exitAnimationCompleted;
  }
}
