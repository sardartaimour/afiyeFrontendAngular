
import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from "@angular/core";
@Pipe({
    name: 'utcTime',
    pure: false
})
export class UTCTimePipe implements PipeTransform, OnDestroy {
    private timer: number;
    constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) { }
    transform(value: string) {
        if (!value) {
            return value;
        }
        // Split timestamp into [ Y, M, D, h, m, s ]
        let t = value.split(/[- :]/);
        // Apply each element to the Date function
        let d = new Date(Date.UTC(+t[0], +t[1] - 1, +t[2], +t[3], +t[4], +t[5]));

        return d;
    }
    ngOnDestroy(): void {
    }
}