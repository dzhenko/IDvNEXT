import { Injectable } from '@angular/core';

@Injectable()
export class GridService {
    public static sort(arr: any[], currentSort: string, sortBy: string, allowedVals: any): string {
        if (!allowedVals[sortBy]) {
            return null;
        }

        let compare = (a, b) => a - b;
        if (typeof (allowedVals[sortBy](arr[0])) === typeof ('string')) {
            compare = (a, b) => a.localeCompare(b);
        }

        if (currentSort === sortBy + '-a') {
            arr.sort((a, b) => compare(allowedVals[sortBy](b), allowedVals[sortBy](a)));
            return sortBy + '-d';
        }
        else {
            arr.sort((a, b) => compare(allowedVals[sortBy](a), allowedVals[sortBy](b)));
            return sortBy + '-a';
        }
    }
}
