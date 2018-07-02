import { Injectable } from '@angular/core';

@Injectable()
export class DateTimeService {
    public static readonly DEFAULT_VALUE = '';

    public static readonly DATE_DIVIDER = '/';
    public static readonly TIME_DIVIDER = ':';

    public static readonly DATE_FORMAT = `MM${DateTimeService.DATE_DIVIDER}dd`;
    public static readonly DATE_FORMAT_FULL = `MM${DateTimeService.DATE_DIVIDER}dd${DateTimeService.DATE_DIVIDER}yyyy`;
    public static readonly TIME_FORMAT = `HH${DateTimeService.TIME_DIVIDER}mm`;
    public static readonly TIME_FORMAT_FULL = `HH${DateTimeService.TIME_DIVIDER}mm${DateTimeService.TIME_DIVIDER}ss`;
    public static readonly DATE_TIME_FORMAT = `${DateTimeService.DATE_FORMAT} ${DateTimeService.TIME_FORMAT}`;
    public static readonly DATE_TIME_FORMAT_FULL = `${DateTimeService.DATE_FORMAT_FULL} ${DateTimeService.TIME_FORMAT_FULL}`;
    public static readonly DATE_TIME_FORMAT_FULL_MS = `${DateTimeService.DATE_FORMAT_FULL} ${DateTimeService.TIME_FORMAT_FULL}.fff`;
    public static readonly DATE_TIME_FORMAT_FULL_DATE = `${DateTimeService.DATE_FORMAT_FULL} ${DateTimeService.TIME_FORMAT}`;
    public static readonly DATE_TIME_FORMAT_FULL_TIME = `${DateTimeService.DATE_FORMAT} ${DateTimeService.TIME_FORMAT_FULL}`;

    public static readonly DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    public static readonly MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    private static readonly ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

    public static formatFullDateFromString(date: string, showYears: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return DateTimeService.formatFullDateFromDate(dt, showYears, defaultIfNull);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatDateFromString(date: string, showYears: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return DateTimeService.formatDateFromDate(dt, showYears, defaultIfNull);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatDateFromNumber(date: number, showYears: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return DateTimeService.formatDateFromDate(dt, showYears, defaultIfNull);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatDateFromDate(date: Date, showYears: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            let month: any = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }

            let day: any = date.getDate();
            if (day < 10) {
                day = '0' + day;
            }

            if (showYears) {
                return `${month}${DateTimeService.DATE_DIVIDER}${day}${DateTimeService.DATE_DIVIDER}${date.getFullYear().toString()}`;
            }

            return `${month}${DateTimeService.DATE_DIVIDER}${day}${DateTimeService.DATE_DIVIDER}`;
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatFullDateFromDate(date: Date, showYears: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            const month: any = date.getMonth();
            const day: any = date.getDate();
            const weekDay: any = date.getDay();

            if (showYears) {
                return `${DateTimeService.DAYS_OF_WEEK[weekDay]}, ${DateTimeService.MONTHS[month]} ${day}, ${date.getFullYear().toString()}`;
            }

            return `${DateTimeService.DAYS_OF_WEEK[weekDay]}, ${DateTimeService.MONTHS[month]} ${day}`;
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatTimeFromString(date: string, showSeconds: boolean = true, defaultIfNull: boolean = true, midnightSystem: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return DateTimeService.formatTimeFromDate(dt, showSeconds, defaultIfNull, midnightSystem);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatTimeFromNumber(date: number, showSeconds: boolean = true, defaultIfNull: boolean = true, midnightSystem: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return DateTimeService.formatTimeFromDate(dt, showSeconds, defaultIfNull, midnightSystem);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatTimeFromDate(date: Date, showSeconds: boolean = true, defaultIfNull: boolean = true, midnightSystem: boolean = false) {
        if (date) {
            let hours: any = date.getHours();

            let minutes: any = date.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            let timeString: string = `${hours}${DateTimeService.TIME_DIVIDER}${minutes}`;

            if (showSeconds) {
                let seconds: any = date.getSeconds();
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }

                timeString = timeString + `${DateTimeService.TIME_DIVIDER}${seconds}`;
            }

            if (midnightSystem) {
                let mid = 'AM';
                if (!hours) {
                    hours = 12;
                }
                else if (hours > 12) {
                    mid = 'PM';
                    hours -= 12;
                }

                timeString = timeString + ` ${mid}`;
            }

            return timeString;
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatDateTimeFromString(date: string, showYears: boolean = true, showSeconds: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return DateTimeService.formatDateTimeFromDate(dt, showYears, showSeconds, defaultIfNull);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatDateTimeFromNumber(date: number, showYears: boolean = true, showSeconds: boolean = true, defaultIfNull: boolean = true) {
        if (date) {
            const dt = new Date(date);
            return this.formatDateTimeFromDate(dt, showYears, showSeconds, defaultIfNull);
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static formatDateTimeFromDate(date: Date, showYears: boolean = true, showSeconds: boolean = true, defaultIfNull: boolean = true, midnightSystem: boolean = true) {
        if (date) {
            return `${DateTimeService.formatDateFromDate(date, showYears, defaultIfNull)} ${DateTimeService.formatTimeFromDate(date, showSeconds, defaultIfNull, midnightSystem)}`;
        } else if (defaultIfNull) {
            return DateTimeService.DEFAULT_VALUE;
        }
    }

    public static createDateFromString(date: string): Date {
        return new Date(date);
    }

    public static getMonthFromNumber(month: number) {
        return DateTimeService.getMonthFromDate(new Date(2017, month));
    }

    public static getMonthFromDate(date: Date) {
        return date.toLocaleString('un-us', { month: 'long' });
    }

    public static convertToLocalDate(utcDate: Date): Date {
        if (!utcDate) {
            return;
        }

        const localDate = new Date(utcDate);
        localDate.setMinutes(utcDate.getMinutes() - localDate.getTimezoneOffset());

        return localDate;
    }

    public static convertToUtcDate(date: Date, includeTime: boolean = true): Date {
        if (!date) {
            return;
        }

        if (includeTime) {
            return new Date(Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes() + date.getTimezoneOffset(),
                date.getUTCSeconds(),
                date.getUTCMilliseconds()));
        }

        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }

    public static formatServerDateTime(date: Date, includeTime: boolean = false) {
        if (!date) {
            return DateTimeService.DEFAULT_VALUE;
        }

        let result = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        if (includeTime) {
            let hours: number = date.getHours();
            let mid = 'AM';
            if (!hours) {
                hours = 12;
            } else if (hours > 12) {
                mid = 'PM';
                hours -= 12;
            }

            result += ` ${hours}:${date.getMinutes()}:${date.getSeconds()} ${mid}`;
        }

        return result;
    }

    public static getUtcTodayDate() {
        const now = new Date();
        const todayUTCDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        return todayUTCDate;
    }

    public static jsonDateParser(key: string, value: any) {
        if (typeof value === 'string') {
            if (DateTimeService.ISO_DATE_REGEX.exec(value)) {
                return new Date(value);
            }
        }

        return value;
    }

    public static formatDiffToElapsed(diff: any): string {
        const hours = Math.floor(diff.asHours());

        let minutes = Math.floor(diff.asMinutes());
        minutes -= hours * 60;

        let seconds = Math.floor(diff.asSeconds());
        seconds -= (hours * 60 * 60) + (minutes * 60);

        return `${hours !== 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}
