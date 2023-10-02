import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {


  private remainingSeconds: Record<string, number> = {};
  private timers: Record<string, NodeJS.Timeout | undefined> = {};
  private callbacks: Record<string, TimerEventCallbacks | undefined> = {};
  

  constructor() { }

  getRemainingTime(id: string): number {
    return this.remainingSeconds[id] ?? -1;
  }

  isRunning(id: string) {
    return this.timers[id];
  }

  startFootstepTimer(speed: number, loopCount: number = 1, callbacks?: TimerEventCallbacks) {
    if(this.timers['footsteps'])
      this.stopTimer('footsteps');
    
    if(callbacks)
      this.callbacks['footsteps'] = callbacks;

    const timer = setInterval(() => {
      if (loopCount === 0) {
        this.stopTimer('footsteps');
        if (callbacks?.OnFinish) {
          callbacks?.OnFinish();
        }
      } else {
        // If looping is enabled, decrement loopCount and reset the timer
        loopCount--;
        if (callbacks?.OnLoop) {
          callbacks?.OnLoop();
        }
      }
    }, (1 / speed) * 1000);

    this.timers['footsteps'] = timer;
  }

  startTimer(seconds: number, id: string, interval: number = 100, loopCount: number = 1, callbacks?: TimerEventCallbacks) {
    this.remainingSeconds[id] = seconds;

    const timer = setInterval(() => {
      if (this.remainingSeconds[id] > 0) {
        this.remainingSeconds[id] = this.remainingSeconds[id] - (interval / 1000);
      } else {
        if (loopCount === 0) {
          this.stopTimer(id);
          if (callbacks?.OnFinish) {
            callbacks?.OnFinish();
          }
        } else {
          // If looping is enabled, decrement loopCount and reset the timer
          loopCount--;
          this.remainingSeconds[id] = seconds;
          if (callbacks?.OnLoop) {
            callbacks?.OnLoop();
          }
        }
      }
    }, interval);

    this.timers[id] = timer;
  }
  stopTimer(id: string) {
    clearInterval(this.timers[id]);
    this.timers[id] = undefined;
    const callback = this.callbacks[id]?.OnStopped;
    if (callback)
      callback();
    this.callbacks[id] = undefined;
  }
}

export class TimerEventCallbacks {
  OnLoop?: () => void;
  OnFinish?: () => void;
  OnStopped?: () => void;
}