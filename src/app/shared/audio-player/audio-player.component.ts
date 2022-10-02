import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements AfterViewInit {

  @ViewChild('audio') audio: any;
  @ViewChild('slider') slider: any;

  @Input() src: string = '/assets/voice_placeholder.mp3';

  timer: string = '?:?? / ?:??';

  elapseInterval: number;

  constructor(
  ) { }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if(this.src != null) {
        this.audio.src = this.src;
        const durationInterval = setInterval(() => {
          if(this.audio.nativeElement.duration > 0) {
            this.getTime();
            clearInterval(durationInterval)
          }
        })
        clearInterval(interval)
      }
    })
  }

  play() {
    this.audio.nativeElement.play();
    this.elapseInterval = setInterval(() => {
      
      this.getTime();
      
      if(this.audio.nativeElement.ended) {
        clearInterval(this.elapseInterval);
      }
    })
  }

  pause() {
    clearInterval(this.elapseInterval);
    this.audio.nativeElement.pause();
  }

  getTime() {
    const minutes = '0:';

    let duration = this.getSecondsFormat(this.audio.nativeElement.duration);
    let elapsed = this.getSecondsFormat(this.audio.nativeElement.currentTime);

    this.timer = minutes + elapsed + ' / ' + minutes + duration;
  }

  getSecondsFormat(number: number) {
    if(number < 10) {
      return '0' + Math.floor(number);
    } else {
      return Math.floor(number).toString();
    }
  }

}
