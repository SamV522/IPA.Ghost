import { Component, Input } from '@angular/core';
import { Ghost } from '../../models/ghost.model';
import { AudioService } from '../../services/audio.service';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-ghost-footstep',
  templateUrl: './ghost-footstep.component.html',
  styleUrls: ['./ghost-footstep.component.css'],
  host: { 'style': 'display: flex; width: 50px;'}
})
export class GhostFootstepComponent {
  @Input() ghost!: Ghost

  playing: boolean = false

  constructor(private timerService: TimerService, private audioService: AudioService) {

  }

  startFootsteps(speed: number) {
    if (this.playing) {
      this.timerService.stopTimer('footsteps');
    } else {
      this.playing = true;
      this.playFootstep();
      this.timerService.startTimer(speed, 'footsteps', 9, () => {
        this.playFootstep();
      }, () => {
        this.playing = false;
      } )
    }
  }

  playFootstep(): void {
    this.audioService.playSound('assets/audio/footstep.wav');
  }

}
