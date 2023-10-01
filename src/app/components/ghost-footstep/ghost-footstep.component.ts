import { Component, Input } from '@angular/core';
import { Ghost } from 'src/app/models/ghost.model';

@Component({
  selector: 'app-ghost-footstep',
  templateUrl: './ghost-footstep.component.html',
  styleUrls: ['./ghost-footstep.component.css'],
  host: { 'style': 'display: flex; width: 50px;'}
})
export class GhostFootstepComponent {
  @Input() ghost!: Ghost
}
