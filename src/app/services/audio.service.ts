import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio = new Audio();
  constructor() { }

  playSound(sound: string) {
    this.audio.src = sound;
    this.audio.load();
    this.audio.play();
  }
}
