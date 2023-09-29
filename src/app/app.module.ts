import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GhostListComponent } from './components/ghost-list/ghost-list.component';
import { EvidenceListComponent } from './components/evidence-list/evidence-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExpansionPanelComponent } from './components/common/expansion/expansion-panel/expansion-panel.component';
import { ExpansionPanelHeaderComponent } from './components/common/expansion/expansion-panel-header/expansion-panel-header.component';
import { AccordionComponent } from './components/common/expansion/accordion/accordion.component';
import { TooltipComponent } from './components/common/tooltip/tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    GhostListComponent,
    EvidenceListComponent,
    ExpansionPanelComponent,
    ExpansionPanelHeaderComponent,
    AccordionComponent,
    TooltipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
