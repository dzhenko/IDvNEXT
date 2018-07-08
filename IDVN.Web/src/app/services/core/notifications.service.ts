import { Injectable } from '@angular/core';

declare var swal: any;
declare var toastr: any;

@Injectable()
export class NotificationsService {
    constructor() { }

    public static success(text: string, cb: any = null, title: string = 'SUCCESS', timeout: number = 4000) {
        NotificationsService.successSwal(text, cb, title);
    }

    public static successTx(text: string, txs: string[], cb: any = null, title: string = 'SUCCESS', timeout: number = 4000) {
        NotificationsService.successSwal(text, cb, title);
    }

    public static error(text: string, cb: any = null, title: string = 'ERROR', timeout: number = 4000) {
        NotificationsService.errorSwal(text, cb, title);
    }

    public static warning(text: string, cb: any = null, title: string = 'WARNING', timeout: number = 4000) {
        NotificationsService.warningSwal(text, cb, title);
    }

    public static confirm(
        html: string,
        successCb: () => void,
        failCb: () => void = null,
        title: string = 'CONFIRMATION',
        confirmButtonText: string = 'YES',
        cancelButtonText: string = 'NO') {

        NotificationsService.confirmSwal(html, successCb, failCb, title, confirmButtonText, cancelButtonText);
    }

    public static prompt(
        html: string,
        title: string,
        confirmCb: (val: string) => void,
        cancelCb: (val: string) => void,
        validateCb: (val: string) => string,
        inputType: string = 'text',
        inputPlaceholder: string = null,
        confirmButtonText: string = 'DONE',
        cancelButtonText: string = 'CANCEL',
        showCancelButton: boolean = true) {

        NotificationsService.promptSwal(
            html,
            title,
            confirmCb,
            cancelCb,
            validateCb,
            inputType,
            inputPlaceholder,
            confirmButtonText,
            cancelButtonText,
            showCancelButton);
    }

    private static buildAlert(type: string, title: string, message: string, txs: string[], timeout: number = 2000) {
        let urlsMarkup = '';
        if (txs && txs.length) {
            txs.forEach(t => urlsMarkup += `<p><a href="https://etherscan/tx/${t}" target="_blank">View transaction</a><p>`);
        }

        $('body').append($(`
<div class="notification alert alert-${type}" style="position:fixed; bottom:0%; width:100%">
    <div class="container">
        <div class="alert-icon">
            <i class="material-icons">${type}_outline</i>
        </div>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true"><i class="material-icons">clear</i></span>
        </button>
        <b>${title}</b> ${message}
        ${urlsMarkup}
    </div>
</div>
`));

        if (timeout) {
            setTimeout(() => $('.notification.alert button.close').click(), timeout);
        }
    }

    // swal
    private static successSwal(text: string, cb: any = null, title: string = 'Success') {
        if (cb) {
            swal({
                title: title,
                text: text,
                type: 'success'
            }).then(cb);
        } else {
            swal(title, text, 'success');
        }
    }

    private static errorSwal(text: string, cb: any = null, title: string = 'Error') {
        if (cb) {
            swal({
                title: title,
                text: text,
                type: 'error'
            }).then(cb);
        } else {
            swal(title, text, 'error');
        }
    }

    private static warningSwal(
        text: string,
        cb: any = null,
        title: string = 'Warning',
        allowEscapeKey: boolean = true,
        allowOutsideClick: boolean = false) {

        if (cb) {
            swal({
                title: title,
                text: text,
                type: 'warning',
                allowEscapeKey: allowEscapeKey,
                allowOutsideClick: allowOutsideClick
            }).then(cb);
        } else {
            swal({
                title: title,
                text: text,
                type: 'warning',
                allowEscapeKey: allowEscapeKey,
                allowOutsideClick: allowOutsideClick
            });
        }
    }

    private static confirmSwal(
        html: string,
        successCb: () => void,
        failCb: () => void = null,
        title: string = 'Confirmation',
        confirmButtonText: string = 'Yes',
        cancelButtonText: string = 'No') {

        swal({
            title: title,
            html: html,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-default',
            buttonsStyling: false
        }).then(
            () => {
                if (successCb) {
                    successCb();
                }
            },
            () => {
                if (failCb) {
                    failCb();
                }
            });
    }

    private static promptSwal(
        html: string,
        title: string,
        confirmCb: (val: string) => void,
        cancelCb: (val: string) => void,
        validateCb: (val: string) => string,
        inputType: string = 'text',
        inputPlaceholder: string = null,
        confirmButtonText: string = 'Done',
        cancelButtonText: string = 'Cancel',
        showCancelButton: boolean = true) {

        const opts: any = {
            html: html,
            title: title,
            input: inputType,
            inputPlaceholder: inputPlaceholder,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            showCancelButton: true,
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-default',
            buttonsStyling: false
        };

        if (validateCb) {
            opts.preConfirm = (val) => {
                return new Promise((resolve, reject) => {
                    const err = validateCb(val);
                    if (err) {
                        swal.showValidationError(err);
                        reject(err);
                    }
                    else {
                        resolve(val);
                    }
                });
            };
        }

        confirmCb = confirmCb || (v => { });
        cancelCb = cancelCb || (v => { });

        swal(opts).then(val => confirmCb(val), dismiss => cancelCb(dismiss));
    }

    private static customBootstrapNotify(title: string, message: string, type: string = 'sucess', url: string = null, icon: string = null) {
        const opts: any = {
            title: title,
            message: message
        };

        if (icon) {
            opts.icon = icon;
        }

        if (url) {
            opts.url = url;
            opts.target = '_blank';
        }

        const settings = {
            element: 'body',
            position: null,
            type: type,
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: 'top',
                align: 'right'
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 1000,
            timer: 1000,
            url_target: '_blank',
            mouse_over: null,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            onShow: null,
            onShown: null,
            onClose: null,
            onClosed: null,
            icon_type: 'class',
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        };

        ($ as any).notify(opts, settings);
    }

    private static getToastrOpts() {
        const opts: any = {
            closeButton: true,
            progressBar: true,
            debug: false,
            positionClass: 'toast-top-right', // 'toast-top-full-width',
            preventDuplicates: true,
            escapeHtml: true,
            showDuration: 333,
            hideDuration: 333,
            timeOut: 2500,
            extendedTimeOut: 5000,
            showEasing: 'swing',
            hideEasing: 'swing',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut',
        };

        return opts;
    }
}
