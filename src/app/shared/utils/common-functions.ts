import { FormControl, ControlContainer, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, interval, timer, of, Observable } from 'rxjs';
import { takeWhile, filter, takeUntil, endWith, flatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// const SECRET_KEY: any = environment.CipherKey;
declare var $: any;
export interface LooseObject {
    [key: string]: any
}
/**=============== unCheck All checkbox on current pages ==============*/
var localStorageVar = new BehaviorSubject<Object>(false);
export var isLocalStorageChange = localStorageVar.asObservable();
export var allowDecryption = true;
export function makeUnselectAllRows(array, property) {
    array.forEach(row => {
        row[property] = false;
    });
}

/**========== get id's from array of object ===============*/
export function getIdsFromArray(array, property) {
    let result = array.map(a => a[property]);
    return result;
}

/** =========get Filter Data on the base of selected ======*/
export function getFilterDataFromIds(array, ids, prop) {
    let filtered_selected = array.filter(function (req) {
        return ids.includes(+req[prop]);
    });
    return filtered_selected;
}

/** =========if value then retirn value otherwise empty string  ======*/
export function checkForValue(value) {
    return value ? value : ''
}
export function isEmptyObject(o) {
    if (!o) {
        return true;
    }
    return Object.keys(o).every(function (x) {
        return o[x] === '' || o[x] === null;  // or just "return o[x];" for falsy values
    });
}

export function getExtentionOfFile(fileName) {
    var i = fileName.lastIndexOf('.');
    if (i === -1) return false;
    return fileName.slice(i)
}

/** ===========chackForEmptyObject=============*/
// export function isEmpty(obj) {
//     return Object.keys(obj).length === 0;
// }
/**
 * Checks if value is empty. Deep-checks arrays and objects
 * Note: isEmpty([]) == true, isEmpty({}) == true, isEmpty([{0:false},"",0]) == true, isEmpty({0:1}) == false
 * @param value
 * @returns {boolean}
 */
export function isEmpty(value) {
    let isEmptyObject = function (a) {
        if (typeof a.length === 'undefined') { // it's an Object, not an Array
            let hasNonempty = Object.keys(a).some(function nonEmpty(element) {
                return !isEmpty(a[element]);
            });
            return hasNonempty ? false : isEmptyObject(Object.keys(a));
        }

        return !a.some(function nonEmpty(element) { // check if array is really not empty as JS thinks
            return !isEmpty(element); // at least one element should be non-empty
        });
    };
    return (
        value == false
        || typeof value === 'undefined'
        || value == null
        || (typeof value === 'object' && isEmptyObject(value))
    );
}

/** ============make Single Name from first last middle Name============*/
export function makeSingleNameFormFIrstMiddleAndLastNames(arrayName, key) {
    let arr = arrayName;
    arr = arr.filter(function (e) { return e; }); // The filtering function returns `true` if e is not empty.
    return arr.join(key)
}


/**==================== make Deep Copy Of Array ======== */
export function makeDeepCopyArray(array) {
    return array.map(a => Object.assign({}, a));
}

/**==================== Make Deep Copy Of object ===============*/
export function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        return obj.reduce((arr, item, i) => {
            arr[i] = deepCopy(item);
            return arr;
        }, []);
    }

    if (obj instanceof Object) {
        return Object.keys(obj).reduce((newObj, key) => {
            newObj[key] = deepCopy(obj[key]);
            return newObj;
        }, {})
    }
}

/**=======Find From Array of Objects========= */
export function findFromArrayOFObjects(array, prop, value) {
    if (array) {
        let obj = array.find(x => x[prop] == value);
        return obj;
    }

}

export function findIndexInData(data, property, value) {
    var result = -1;
    data.some(function (item, i) {
        if (item[property] === value) {
            result = i;
            return true;
        }
    });
    return result;
}

/**============ Find From Simple Array link Array of numbers/string======= */
export function FindFromSimpleArray(value, array) {
    return array.indexOf(value) > -1;
}

/**============ Find From Simple Array link Array of numbers/string======= */
export function FindIndexFromSimpleArray(array, value) {
    return array.indexOf(value);
}

/**check For Null or Empty or undefined String */
export function checkNUllEmptyUndefinedANdNullString(value) {
    return (value == null || value == 'null' || value == undefined || value == '') ? '' : value
}

/**=========== get keys value from inner array========== */
export function getInnerArrayKeyValue(array, keyValue) {
    const ids = [];
    JSON.stringify(array, (key, value) => {
        if (key === keyValue) ids.push(value);
        return value;
    });
    return ids;
}


/**============ Generate random Color======= */
export function get_rand_color() {
    let color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);
    while (color.length < 6) {
        color = '0' + color;
    }
    return '#' + color;
}


/**=========== All value in array are same ====== */
export function allTheSame(array) {
    var first = array[0];
    return array.every(function (element) {
        return element === first;
    });
}

export function max(maxValue): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value) {
            // console.log('control.value', control.value);
            return control.value && parseFloat(moneyMasking(control.value)) <= maxValue ? null : {
                max: true
            }
        } else {
            return null;
        }
    };
}

/**================= maximum value for control ===========  */

export function minValidation(minValue): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value || control.value == 0) {
            console.log('control.value', control.value && (parseFloat(moneyMasking(control.value)).toFixed(2) == parseFloat(minValue).toFixed(2)) ? { min: true } : null);
            return (parseFloat(moneyMasking(control.value)).toFixed(2) == parseFloat(minValue).toFixed(2) || parseFloat(moneyMasking(control.value)).toFixed(2) < parseFloat(minValue).toFixed(2)) ? {
                min: true
            } : null;
        } else {
            return null;
        }
    };
}
/**================= manimum value for control ===========  */
export function min(control: FormControl) {
    return parseFloat(control.value) > 0 && parseFloat(control.value) <= 999999.99 ? null : {
        min: true
    }
}

/** ============== check in enum value ========== */
export function existValueInEnum(type: any, value: any): boolean {
    return Object.keys(type).filter(k => isNaN(Number(k))).filter(k => type[k] === value).length > 0;
}

// export function changeDateFormat(date: Date){

//     this.day =  date.getDate();
//    console.log("change date format: " ,this.day);
//    return this.day =  date.getDate();
// }

export function changeDateFormat(date) {
    if (date) {

        let mom = <any>moment(date);
        var d = mom._d,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        // console.log('[year, month, day]', d, [year, month, day]);
        return [year, month, day].join('-');
    }
    return '';
}

export function createDateAsUTC(date) {
    if (isValidDate(date)) {
        return date.toISOString();
    }
    return date;
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

export function isValidDate(dateObject) {
    console.log('isValidDate', dateObject)
    return new Date(dateObject).toString() !== 'Invalid Date';
}

export function moneyMasking(element) {
    let data = element;
    if (element !== undefined && element !== NaN && element !== null && element !== '' && element !== -1) {
        if (isString(element)) {
            data = (element.replace(/,/g, ''));
        }
    }
    return data;
}

export function isString(val) {
    return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
}

export function DaysBetween(Start, endDate) {
    var a = moment(Start);
    var b = moment(endDate);
    return a.diff(b, 'days') // 1
    let StartDate = new Date(Start);
    let EndDate = new Date(endDate);
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
}

export function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

export function getLink(link) {
    if (!_.isArray(link)) {
        link = [link]
    }

    return link
}

export function dateObjectPicker(value) {
    // let mom = <any>moment(value, "DD-MM-YYYY");
    let mom = <any>moment(value);
    let date = mom._d;
    console.log('dateObjectPicker', date);
    return date;
}

//========================================================================================
/*                                                                                      *
 *        remove Empty Keys Like null value, Invalid dateObjectPicker, undefined        *
 *                                                                                      */
//========================================================================================

export function removeEmptyKeysFromObject(obj) {
    Object.keys(obj).forEach(key => {
        if (Object.prototype.toString.call(obj[key]) === '[object Date]' && (obj[key].toString().length === 0 || obj[key].toString() === 'Invalid Date')) {
            delete obj[key];
        } else if (obj[key] && typeof obj[key] === 'object') {
            removeEmptyKeysFromObject(obj[key]);
        } else if (obj[key] == null || obj[key] === '' || obj[key] === undefined) {
            delete obj[key];
        }

        if (obj[key]
            && typeof obj[key] === 'object'
            && Object.keys(obj[key]).length === 0
            && Object.prototype.toString.call(obj[key]) !== '[object Date]') {
            delete obj[key];
        }
    });
    return obj;
}

//========================================================================================
/*                                                                                      *
 *                          remove properties From Given Object                         *
 *                                                                                      */
//========================================================================================

export function removeObjectProperties(obj, props) {
    for (var i = 0; i < props.length; i++) {
        if (obj.hasOwnProperty(props[i])) {
            delete obj[props[i]];
        }
    }
    return obj;
};


//========================================================================================
/*                                                                                      *
 *                                     To parse Json                                    *
 *                                                                                      */
//========================================================================================

export function parseJson(input) {
    try {
        let obj = JSON.parse(input);
        return obj;
        console.error(obj)
    } catch (e) {
        return input;
        // conversion fails
        console.error(e)
    }
};
//========================================================================================
/*                                                                                      *
 *                                to stringify an Object                                *
 *                                                                                      */
//========================================================================================

export function JsonStringify(data) {
    return JSON.stringify(data)
};


export function replaceKeySandValues(object, type = 'encryption') {
    // var obj: LooseObject = {};
    // obj = deepCopy(object);
    // Object.keys(obj).forEach(function (key) {
    //     if (type == 'encryption') {
    //         var newKey = enc(key);
    //         obj[newKey] = enc(obj[key])
    //         delete obj[key];
    //     }
    //     if (type == 'decryption') {
    //         // var newKeyDec = dec(key).replace(/\"/g, "");
    //         var newKeyDec = dec(key);
    //         obj[newKeyDec] = dec(obj[key])
    //         delete obj[key];
    //     }
    //     console.log(key, obj[key]);
    // });
    // return obj;
    // console.log('obj', obj);
}

export function isObject(val) {
    if (val === null) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
}

export function formatBytes(bytes) {
    var kb = 1024;
    var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
    var fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

    return {
        size: +(bytes / kb / kb).toFixed(2),
        type: fileSizeTypes[ndx]
    };
}

export function getGenderList() {
    let genderList = [{
        '1': 'Male',
        '2': 'Female',
        '3': 'Transgender'
    }];
    return genderList;
}


export function getAttorneyTypes() {
    let types = [
        { id: 1, name: "user" },
        { id: 2, name: "patient" },
        { id: 3, name: "referrer" }
    ];
    return types;
}
export function getAttorneyType(id) {
    let type = getAttorneyTypes();
    return type[id - 1];
}


export function getInventoryItemFeeType(id: number): any {
    let feeType = [{
        id: 0,
        name: 'Rental'
    }, {
        id: 1,
        name: 'One Time'
    }];
    // if(id==)

    if (id != null) {
        return feeType[id];
    } else {
        return feeType;
    }

}

export function getInventoryItemFeeUnit(id: any) {
    let feeUnit = [{
        value: 'per hour',
        name: 'Per Hour'
    }, {
        value: 'per day',
        name: 'Per Day'
    }, {
        value: 'per week',
        name: 'Per Week'
    }];
    if (typeof id == "number") {
        return feeUnit[id];
    } else {
        return feeUnit;
    }

}

export let fee_types = [
    {
        'value': '0',
        'name': 'Rental',
    }, {
        'value': '1',
        'name': 'One Time',
    }
];

export function getFeeType(id) {
    if (id != null) {
        return fee_types[id].name;
    }
    return "";
}
export function getFeeTypes() {
    return fee_types;
}

export function arrayObjectIndexOf(myArray, property, searchTerm) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

export function getExtension(fileName) {
    var i = fileName.lastIndexOf('.');
    if (i === -1) return false;
    return fileName.slice(i)
}

export function mergeRecursive(obj1, obj2) {
    if (Array.isArray(obj2)) { return obj1.concat(obj2); }
    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor == Object) {
                obj1[p] = mergeRecursive(obj1[p], obj2[p]);
            } else if (Array.isArray(obj2[p])) {
                obj1[p] = obj1[p].concat(obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}

export function parseBool(value) {
    if (typeof value === "boolean") {
        return value === true ? 1 : 0;
    }
    return value;
}

export function parseIntToBool(value) {
    if (typeof value === "number") {
        return value === 1 ? true : false;
    }
    return value;
}

export function dataURLtoFile(dataUrl, filename) {

    var arr = dataUrl.split(',');
    // console.log('arr', arr);


    var arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


/**if already not checked then checked and push in selected array */
export function ifNotCheckedAlreadyAndSelect(currentRow, currentPageItems, SelectedItemsArray, matchProp) {
    let index = currentPageItems.findIndex(x => x[matchProp] == currentRow[matchProp]);
    let indexInSelected = SelectedItemsArray.findIndex(x => x[matchProp] == currentRow[matchProp]);
    if (indexInSelected == -1) {
        SelectedItemsArray.push(currentRow);
        currentPageItems[index]['checkBoxChecked'] = true;
    }
}
/**=================Check First array contain all elements of second================= */
export function containAll(a, b) {
    return b.every(function (e) {
        return e === this.splice(this.indexOf(e), 1)[0];
    }, a.slice()); // a.slice() is the "this" in the every method
}

/**=================UnCheck All Checkbox and remove from Selected Array================= */

export function UnCheckAllCheckBoxAndRemoveCurrentUnselect(currentRow, selectedArray, matchProp, self, checkBoxCheckedField) {
    currentRow.checkBoxChecked = false;
    self[checkBoxCheckedField] = false;
    let index = selectedArray.findIndex(x => x[matchProp] == currentRow[matchProp]);
    if (index > -1) {
        selectedArray.splice(index, 1);
    }
}

/**=================On Select All checkOnly those items who are unChecked================== */
export function SelectUnCheckItemsOnly(currentPageItems, SelectedItemsArray, matchProp) {
    let s = this;
    let tempArray = [];
    currentPageItems.forEach(element => {
        let indexInSelected = SelectedItemsArray.findIndex(x => x[matchProp] == element[matchProp]);
        if (indexInSelected == -1) {
            element.checkBoxChecked = true;
            tempArray.push(element);
        }
    });
    SelectedItemsArray = SelectedItemsArray.concat(tempArray);
    return SelectedItemsArray;
}

/**=========UnCheck All on unselect All From Action Column on Current page============= */
export function unCheckCurrentPageItems(array) {
    array.forEach(current => {
        current.checkBoxChecked = false;
    });
}

/**============================ on unCheck All Remove from Selected Arrays ====================== */
export function removeCurrentPageSelectionFromSelected(currentPageItems, selectedArray, matchProp) {
    let result = currentPageItems.map(a => a[matchProp]);
    let tempArray = [...selectedArray]
    for (var i = tempArray.length - 1; i >= 0; i--) {
        for (var j = 0; j < result.length; j++) {
            if (tempArray[i][matchProp] === result[j]) {
                selectedArray.splice(i, 1);
            }
        }
    }
}
export function arrayContainsArray(superset, subset) {
    return _.isEqual(_.intersection(superset.sort(), subset.sort()), subset.sort());
}

export function lTrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, '');
}

export function removeSpecialCharacters(fileName = '') {
    return fileName = fileName.replace(/[&\/\\#,+@()$~%'":*!^=?<>{}]/g, '');
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function cleanArray(arr) {
    return arr.filter(i => i);
}
export function haspProperty(objArr, string) {
    return objArr.findIndex(
        // Is the string contained in the object keys?
        obj => Object.keys(obj).includes(string)
    ) !== -1
}

export function isEmptyObjectKeys(o) {
    if (!o) {
        return true;
    }
    return Object.keys(o).every(function (x) {
        return o[x] === '' || o[x] === null;  // or just "return o[x];" for falsy values
    });
}

export function waitWhileViewChildIsReady(parent: any, viewChildName: string, refreshRateSec: number = 50, maxWaitTime: number = 3000): Observable<any> {
    return interval(refreshRateSec)
        .pipe(
            takeWhile(() => !isDefined(parent[viewChildName])),
            filter(x => x === undefined),
            takeUntil(timer(maxWaitTime)),
            endWith(parent[viewChildName]),
            flatMap(v => {
                if (!parent[viewChildName]) throw new Error(`ViewChild "${viewChildName}" is never ready`);
                return of(!parent[viewChildName]);
            })
        );

    // Now you can do it in any place of your code
    waitWhileViewChildIsReady(this, 'yourViewChildName').subscribe(() => {
        // your logic here
    })
}


function isDefined<T>(value: T | undefined | null): value is T {
    return <T>value !== undefined && <T>value !== null;
}

export function isAllWhitespace(valueToCheck) {
    if (valueToCheck.match(/^ *$/) !== null) {
        // Is all whitespace!
        return true;
    } else {
        // Is not all whitespace!
        return false;
    }
}

export function isEmptyArray(valueToCheck) {
    if (Array.isArray(valueToCheck) && !valueToCheck.length) {
        // Array is empty!
        return true;
    } else {
        // Array is not empty!
        return false;
    }
}

export function parseFloatC(input, fixed) {
    try {
        let val = input ? parseFloat(input).toFixed(fixed) : 0;
        return val;
        console.error(val)
    } catch (e) {
        return input;
        // conversion fails
        console.error(e)
    }
};

export let availabilities = [{ id: 1, name: 'Daily' }, { id: 2, name: 'Morning' }, { id: 3, name: 'Evening' }, { id: 4, name: 'Night' },]

/**
  * Marks all controls in a form group as touched
  * @param formGroup - The form group to touch
  */
export function markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();

        if (control.controls) {
            markFormGroupTouched(control);
        }
    });
}

export function oneGridOwlCarousel() {
    /*  One-Grid-Owl-carousel  */
    if ($('.fp_single_item_slider').length) {
        $('.fp_single_item_slider').owlCarousel({
            loop: false,
            margin: 15,
            dots: false,
            nav: true,
            rtl: false,
            autoplayHoverPause: false,
            autoplay: false,
            smartSpeed: 2000,
            singleItem: true,
            navText: [
                '<i class="flaticon-left-arrow-1"></i>',
                '<i class="flaticon-right-arrow"></i>'
            ],
            responsive: {
                320: {
                    items: 1,
                    center: false
                },
                480: {
                    items: 1,
                    center: false
                },
                600: {
                    items: 1,
                    center: false
                },
                768: {
                    items: 1
                },
                992: {
                    items: 1
                },
                1200: {
                    items: 1
                }
            }
        })
    }

}

/* ----- Preloader ----- */
export function preloaderLoad() {
    if ($('.preloader').length) {
        $('.preloader').delay(200).fadeOut(300);
        $("#preloader").hide();
    }
    $(".preloader_disabler").on('click', function () {
        $("#preloader").hide();
    });
}

export function sliderProperty(className) {
    if ($('.' + className).length) {
        $('.' + className).owlCarousel({
            loop: true,
            margin: 30,
            dots: true,
            nav: true,
            rtl: false,
            autoplayHoverPause: false,
            autoplay: false,
            singleItem: true,
            smartSpeed: 1200,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            responsive: {
                0: {
                    items: 1,
                    center: false
                },
                480: {
                    items: 1,
                    center: false
                },
                600: {
                    items: 1,
                    center: false
                },
                768: {
                    items: 2
                },
                992: {
                    items: 2
                },
                1200: {
                    items: 2
                },
                1280: {
                    items: 3
                }
            }
        })
    }

}