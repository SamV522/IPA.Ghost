import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {


  private remainingSeconds: number[] = [];
  private timers: NodeJS.Timeout[] = [];
  

  constructor() { }

  startTimer(seconds: number, id: number, loopCount: number = 1, interval: number = 100, loopCallback?: () => void) {
    this.remainingSeconds[id] = seconds;

    const timer = setInterval(() => {
      if (this.remainingSeconds[id] > 0) {
        this.remainingSeconds[id]--;
      } else {
        if (loopCount === 1) {
          this.stopTimer(id);
        } else {
          // If looping is enabled, decrement loopCount and reset the timer
          loopCount--;
          this.remainingSeconds[id] = seconds;
          if (loopCallback) {
            loopCallback();
          }
        }
      }
    }, interval);

    this.timers[id] = timer;
  }

  stopTimer(id: number) {
    clearInterval(this.timers[id]);
  }
}
