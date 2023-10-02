import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {


  private remainingSeconds: Record<string, number> = {};
  private timers: Record<string, NodeJS.Timeout> = {};
  

  constructor() { }

  startTimer(speed: number, id: string, loopCount: number = 1, loopCallback?: () => void, finishCallback?: () => void) {
    if(this.timers[id])
      this.stopTimer(id);

    const timer = setInterval(() => {
      if (loopCount === 0) {
        this.stopTimer(id);
        if (finishCallback) {
          finishCallback();
        }
      } else {
        // If looping is enabled, decrement loopCount and reset the timer
        loopCount--;
        if (loopCallback) {
          loopCallback();
        }
      }
    }, (1 / speed) * 1000);

    this.timers[id] = timer;
  }

  stopTimer(id: string) {
    clearInterval(this.timers[id]);
  }
}
