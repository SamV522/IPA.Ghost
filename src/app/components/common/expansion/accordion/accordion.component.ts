import { AfterViewInit, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';

@Component({
  selector: 'app-accordion',
  template: '<ng-content></ng-content>',
  styleUrls: ['./accordion.component.css'],
  host: { 'style': 'display: flex; flex-direction: column;'}
})
export class AccordionComponent implements AfterViewInit {
  @ViewChildren(ExpansionPanelComponent) panels!: QueryList<ExpansionPanelComponent>;
  @Input() active!: string;

  ngAfterViewInit(): void {
    if (this.active && this.panels) {
      // this works, this.panels is defined

      const activePanel = this.panels.find(panel => panel.panelName == this.active);
      // this is undefined
      
      if (activePanel) {
        // this does not, activePanel is undefined?
        activePanel.expanded = true;
      }
    }
  }
}
