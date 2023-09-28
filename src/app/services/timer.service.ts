import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {


  private remainingSeconds: number[] = [];
  private timers: NodeJS.Timeout[] = [];
  

  constructor() { }

  startTimer(seconds: number, id: number, interval: number = 100) {
    this.remainingSeconds[id] = seconds;
    this.timers[id] = setInterval(() => {
      if(this.remainingSeconds[id] > 0)
        this.remainingSeconds[id]--;
      else
        this.stopTimer(id);
    }, interval)
  }

  stopTimer(id: number) {
    clearInterval(this.timers[id]);
  }
}
