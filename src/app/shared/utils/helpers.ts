import { HttpParams } from '@angular/common/http';
export function makeParamsFromFormData(formData: Object) {
  let params = new HttpParams();
  if (Object.keys(formData).length) {
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(k => {
          // params = params.append(key + '[]', isString(k) ? encodeURIComponent(k) : k);
          params = params.append(key + '[]', k);
        });
      } else {
        params = params.append(key, formData[key]);
        // params = params.append(key, isString(formData[key]) ? encodeURIComponent(formData[key]) : formData[key]);
      }
    });
  }
  return params;
}

export function changeBooleanToNumber(bool) {
  return bool ? 1 : 0;
}

export function getLengthOfAnObject(object) {
  return Object.keys(object).length;
}


export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}
