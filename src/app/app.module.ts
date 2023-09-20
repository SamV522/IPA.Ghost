import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GhostListComponent } from './components/ghost-list/ghost-list.component';
import { SecondaryEvidenceListComponent } from './components/evidence-list/secondary-evidence-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GhostListComponent,
    SecondaryEvidenceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
