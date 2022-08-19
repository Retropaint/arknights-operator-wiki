import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerFormat'
})
export class TimerFormatPipe implements PipeTransform {

  transform(value: number): number {
    const hours = Math.floor(value / 3600);
    return hours;
  }

}
