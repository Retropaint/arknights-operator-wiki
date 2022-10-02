import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormatter'
})
export class NumberFormatterPipe implements PipeTransform {

  units = [
    {
      minimum: 1000,
      name: 'k'
    },
    {
      minimum: 1000000000,
      name: 'm'
    }
  ]

  transform(value: number): string {
    for(let unit of this.units.reverse()) {
      if(value > unit.minimum) {
        return value/unit.minimum + unit.name;
      }
    }

    return value.toString();
  }

}
