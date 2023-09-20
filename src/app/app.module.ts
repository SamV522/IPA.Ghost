import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GhostListComponent } from './components/ghost-list/ghost-list.component';
import { SecondaryEvidenceListComponent } from './components/secondary-evidence-list/secondary-evidence-list.component';
import { PrimaryEvidenceListComponent } from './components/primary-evidence-list/primary-evidence-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    GhostListComponent,
    SecondaryEvidenceListComponent,
    PrimaryEvidenceListComponent
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
