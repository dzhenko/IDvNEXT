import { Injectable } from '@angular/core';

import { Web3Service } from '../eth/web3.service';

declare var QRCode: any;
declare var blockies: any;

@Injectable()
export class EthService {
    constructor(private web3Service: Web3Service) { }

    public static isEmptyAddress(addr: string): boolean {
        return addr && addr.toLowerCase() !== '0x0000000000000000000000000000000000000000';
    }

    public static isValidPk(pk: string): boolean {
        return pk && /^[0-9a-f]{64}$/i.test(pk.toLowerCase());
    }

    public static isValidAddress(addr: string): boolean {
        return addr && /^0x[0-9a-f]{40}$/i.test(addr.toLowerCase());
    }

    public static generateQRCode(text: string, elId: string, size: number = 128, colorDark: string = '#000', colorLight: string = '#fff') {
        new QRCode(elId, {
            text: text,
            width: size,
            height: size,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    public static generateAddressImage(addr: string): HTMLCanvasElement {
        if (EthService.isValidAddress(addr)) {
            return blockies.create({ seed: addr.toLowerCase() });
        }
    }

    public static generateAddressImageUrl(addr: string): string {
        const img = EthService.generateAddressImage(addr);
        if (img) {
            return img.toDataURL('image/png');
        }
    }

    public addressFromPk(pk: string): string {
        const account = this.web3Service.privateKeyToAccount(pk);
        return account.address;
    }

    public generatePk(): string {
        const account = this.web3Service.createAccount();
        let pk = account.privateKey;
        if (pk.startsWith('0x')) {
            pk = pk.substring(2);
        }

        return pk;
    }
}
