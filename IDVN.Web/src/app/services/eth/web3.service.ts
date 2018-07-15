import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as Transaction from 'ethereumjs-tx';

import { environment } from '../../../environments/environment';
import { UtilsService } from '../core/utils.service';
import { NotificationsService } from '../core/notifications.service';
import { StorageService } from '../core/storage.service';

declare var ethereumjs: any;

@Injectable()
export class Web3Service {
    public static USING_HTTP_NODE: boolean = false;

    private static PK: string = '';
    private static ADDRESS: string = '';

    public static ISLOGGEDIN: boolean = false;

    constructor(private storageService: StorageService) {

    }

    private web3Instance: any;
    
    public signTransaction(transaction, privateKey) {
        const tx = new Transaction(transaction);
        tx.sign(privateKey);
        return tx.serialize();
    }

    public signMessage(message, privateKey) {
        return this.web3.eth.accounts.sign(message, privateKey);
    }

    public getNonce(address): Observable<any> {
        return Observable.fromPromise(this.web3.eth.getTransactionCount(address));
    }

    public sendSignedTransaction(transaction): Observable<any> {
        return Observable.fromPromise(
            this.web3.eth.sendSignedTransaction('0x' + transaction.toString('hex'))
                .on('transactionHash', hash => console.log(hash))
                .on('error', console.error));
    }

    public getBalance(address: string): Observable<string> {
        return Observable.fromPromise(this.web3.eth.getBalance(address)).map(value => this.web3.utils.hexToNumberString(value));
    }

    public getTokenBalance(token: string, address: string): Observable<any> {
        const balanceFunctionAbi = [{ "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }];
        const contract = new this.web3.eth.Contract(balanceFunctionAbi, token);
        return Observable.fromPromise(this.web3.eth.call({
            to: token,
            data: contract.methods.balanceOf(address).encodeABI()
        })).map(value => this.web3.utils.hexToNumberString(value));
    }

    public getContract(abi: any[], address: string): any {
        return new this.web3.eth.Contract(abi, address);
    }

    public deployContract(abi: any[], data: string, from: string, ctorParams: any[] = null, gasPrice: string = '1', gasLimit: number = 4665264): Observable<string> {
        const contract = new this.web3.eth.Contract(abi);
        if (Web3Service.USING_HTTP_NODE) {
            return UtilsService.observableFromCb(done => {
                this.getNonce(Web3Service.ADDRESS).subscribe(nonce => {
                    const txData = contract.deploy({
                        data: data,
                        arguments: ctorParams
                    });

                    var tx = new ethereumjs.Tx({
                        nonce: nonce,
                        gasPrice: this.web3.utils.toHex(gasPrice),
                        gasLimit: gasLimit,
                        value: 0,
                        data: txData,
                    });

                    tx.sign(ethereumjs.Buffer.Buffer.from(Web3Service.PK, 'hex'));

                    var raw = '0x' + tx.serialize().toString('hex');
                    this.web3.eth.sendRawTransaction(raw, function (err, transactionHash) {
                        debugger;
                        done(true, transactionHash);
                    });
                });
            });
        }
        else {
            return UtilsService.observableFromCb(done => contract
                .deploy({
                    data: data,
                    arguments: ctorParams
                }).send({
                    from: from,
                    gas: gasLimit,
                    gasPrice: gasPrice
                }, function (err, txHash) {
                    if (err) {
                        done(false, err);
                    }
                }).then(newContractInstance => done(true, newContractInstance.options.address)));
        }
    }

    public readContractMethod(method: any): Observable<any> {
        return UtilsService.observableFromCb(done =>
            this.walletAccount().subscribe(address =>
                method.call({ from: address })
                .then(res => done(true, res))
                .catch(err => done(false, err))));
    }

    public readContractMethods(methods: any[]): Observable<any[]> {
        return UtilsService.observableFromCb(done => {
            this.walletAccount().subscribe(address => {
                var results = [];
                var batch = new this.web3.BatchRequest();

                methods.forEach((m, i) => {
                    results[i] = { isDone: false };
                    var cb = (err, res) => {
                        results[i] = { err: err, res: res, isDone: true };
                        if (!UtilsService.arrayAny(results, r => !r.isDone)) {
                            done(true, results.map(r => { return { err: r.err, res: r.res } }));
                        }
                    };

                    batch.add(m.call.request({ from: address }, cb));
                });

                batch.execute();
            });
        });
    }

    public writeContractMethod(method: any, gasPrice: string = '100000', gas: number = 1000000) {
        return UtilsService.observableFromCb(done =>
            this.walletAccount().subscribe(address =>
                method
                    .send({
                        from: address,
                        gas: gas,
                        gasPrice: gasPrice
                    })
                    .then(res => done(true, res))
                    .catch(err => done(false, err))));
    }

    public walletAccount(): Observable<string> {
        if (Web3Service.USING_HTTP_NODE) {
            console.log('Wallet account: ' + Web3Service.ADDRESS);
            return Observable.of(Web3Service.ADDRESS);
        }
        else {
            return Observable.fromPromise(this.web3.eth.getAccounts()).map(accounts => {
                console.log('Wallet account: ' + accounts[0]);
                return accounts[0];
            });
        }
    }

    // Utils
    public weiToEth(wei: number): number {
        return parseFloat(this.web3.fromWei(wei, 'ether'));
    }

    public unlockAccount(pk: string) {
        this.web3.eth.accounts.wallet.add(pk);
    }

    public createAccount(): any {
        return this.web3.eth.accounts.create();
    }

    public privateKeyToAccount(privateKey: string): any {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    public addressFromPk(pk: string): string {
        const account = this.privateKeyToAccount(pk);
        return account.address;
    }
    
    public isValidAddress(addr: string): boolean {
        return this.web3.utils.isAddress(addr);
    }

    public generatePk(): string {
        const account = this.createAccount();
        let pk = account.privateKey;
        if (pk.startsWith("0x")) {
            pk = pk.substring(2);
        }

        return pk;
    }

    private intializeWeb3() {
        Web3Service.USING_HTTP_NODE = false;
        if (typeof window['web3'] !== 'undefined') {
            console.log('Using injected web3');
            this.web3 = new this.Web3(window['web3'].currentProvider);

            this.walletAccount().subscribe(address => {
                if (!address) {
                    NotificationsService.warning('Please unlock your metamask account and refresh the page.', null, 'WARNING', 0);
                }
            });
        } else {
            Web3Service.USING_HTTP_NODE = true;
            console.log('Using HTTP node');
            this.web3 = new this.Web3();
            this.web3.setProvider(new this.web3.providers.HttpProvider(environment.nodeUrl));

            if (!Web3Service.ADDRESS) {
                const persistedPk = this.storageService.getItem('pk');
                const persistedAddr = this.storageService.getItem('addr');
                if (persistedPk && persistedAddr) {
                    Web3Service.PK = persistedPk;
                    Web3Service.ADDRESS = persistedAddr;
                    this.unlockAccount(persistedPk);
                }
                else {
                    NotificationsService.confirm(
                        'You have no account yet. Do you want to import account or create one?',
                        () => {
                            var pk = this.generatePk();
                            Web3Service.PK = pk;
                            Web3Service.ADDRESS = this.privateKeyToAccount(pk).address;
                            this.unlockAccount(pk);
                            this.storageService.setItem('pk', pk);
                            this.storageService.setItem('addr', Web3Service.ADDRESS);
                            NotificationsService.success('Account created!');
                        },
                        () => {
                            NotificationsService.prompt('Enter PK', 'Import account', pk => {
                                NotificationsService.prompt('Enter Address', 'Import account', address => {
                                    Web3Service.PK = pk;
                                    Web3Service.ADDRESS = address;
                                    this.unlockAccount(pk);
                                    this.storageService.setItem('pk', pk);
                                    this.storageService.setItem('addr', address);
                                    NotificationsService.success('Account imported!');
                                }, null, null);
                            }, null, null);
                        },
                        'Welcome',
                        'Create',
                        'Import');
                }
            }            
        }
    }

    // Props
    get web3(): any {
        if (!this.web3Instance) {
            this.intializeWeb3();
        }

        return this.web3Instance;
    }

    set web3(web3: any) {
        this.web3Instance = web3;
    }

    get Web3(): any {
        return window['Web3'];
    }
}
