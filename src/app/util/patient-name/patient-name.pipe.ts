import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'patientName'
})
export class PatientNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //TODO: enhance this formatter to return proper formatted name and make it same, not to dump!!!
    var name: string = "";
    if (!value || value.length === 0) {
      return;
    }

    
    if (value[0] != undefined) {
      name = value[0].given[0][0] + ". " + value[0].given[1][0] + ". " + value[0].family;
    }

    return name;
  }

}
