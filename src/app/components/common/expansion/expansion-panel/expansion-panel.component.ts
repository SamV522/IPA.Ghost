import { Component } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.css'],
  host: { 'style': 'display: flex; flex-direction: column; width:100%;'}
})
export class ExpansionPanelComponent {
  expanded = false;

  togglePanel() {
    this.expanded = !this.expanded;
  }
}
