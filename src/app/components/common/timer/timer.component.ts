import { Component, HostListener, Input } from '@angular/core';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  @Input() Time!: number;
  @Input() Name!: string;
  @Input() restartKey!: string;

  constructor(public timerService: TimerService)
  {

  }

  @HostListener('document:keydown', ['$event'])
  handleSKeyPressed(event: KeyboardEvent)
  {
    if (event.key == this.restartKey)
    {
      this.timerService.stopTimer(this.Name)
      this.timerService.startTimer(this.Time, this.Name, 0);
    }
  }

  restartTimer() {
    if (this.timerService.isRunning(this.Name))
      this.timerService.stopTimer(this.Name)
    else
      this.timerService.startTimer(this.Time, this.Name, 0);
  }

  getConicGradientBackground(): string {
    const remaining = this.timerService.getRemainingTime(this.Name);
    const percentage = ((this.Time - remaining) / this.Time) * 100

    return `conic-gradient(
      from 0deg,
      rgba(255, 0, 0, 0.3) 0%,
      rgba(255, 0, 0, 0.3) ${percentage}%,
      rgba(0, 0, 0, 0) ${percentage}%,
      rgba(0, 0, 0, 0) 100%
    )`;
  }
}
