import { Component } from '@angular/core';
import { EvidenceService } from './services/evidence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ipaGhost';

  constructor(public evidenceService: EvidenceService) {}
}
