import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.css'],
  host: { 'style': 'display: flex; flex-direction: column; width:100%;'}
})
export class ExpansionPanelComponent {
  @Input() public panelName: string = 'none';
  @Input() public expanded: boolean = false;

  togglePanel() {
    this.expanded = !this.expanded;
  }
}
