import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as Transaction from 'ethereumjs-tx';

import { DEFAULT_NODE_URL } from '../../app.constants';
import { UtilsService } from '../core/utils.service';

@Injectable()
export class Web3Service {
    @Output() update = new EventEmitter();

    private nodeIP: string; // Current nodeIP
    private nodeConnected: boolean = true;  // If we've established a connection yet
    private web3Instance: any;  // Current instance of web3
    private unlockedAccount: string;    // Current unlocked account

    protected initImpl() {
        this.intializeWeb3();
        return UtilsService.observableFromEmpty();
    }

    protected stopImpl() {
        return UtilsService.observableFromEmpty();
    }

    intializeWeb3(): void {
        this.nodeIP = DEFAULT_NODE_URL;
        this.connectToNode(); // Connect to whatever's available
    }

    signTransaction(transaction, privateKey) {
        const tx = new Transaction(transaction);
        tx.sign(privateKey);
        return tx.serialize();
    }

    signMessage(message, privateKey) {
        return this.web3.eth.accounts.sign(message, privateKey);
    }

    getNonce(address): Observable<any> {
        return Observable.fromPromise(this.web3.eth.getTransactionCount(address));
    }

    sendSignedTransaction(transaction): Observable<any> {
        return Observable.fromPromise(
            this.web3.eth.sendSignedTransaction('0x' + transaction.toString('hex'))
                .on('transactionHash', hash => console.log(hash))
                .on('error', console.error));
    }

    getBalance(address: string): Observable<string> {
        return Observable.fromPromise(this.web3.eth.getBalance(address)).map(value => this.web3.utils.hexToNumberString(value));
    }

    // TODO Change with upper function when bug in web3 is resolved
    getTokenBalance(token: string, address: string): Observable<any> {
        const balanceFunctionAbi = [{ "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }];
        const contract = new this.web3.eth.Contract(balanceFunctionAbi, token);
        return Observable.fromPromise(this.web3.eth.call({
            to: token,
            data: contract.methods.balanceOf(address).encodeABI()
        })).map(value => this.web3.utils.hexToNumberString(value));
    }

    getBlockNumber(): Observable<any> {
        return Observable.fromPromise(this.web3.eth.getBlockNumber());
    }

    createAccount(): any {
        return this.web3.eth.accounts.create();
    }

    privateKeyToAccount(privateKey: string): any {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    weiToEth(wei: number): number {
        return parseFloat(this.web3.fromWei(wei, 'ether'));
    }

    connected(): Promise<any> {
        let p = new Promise<any>((resolve, reject) => {
            if (this.nodeIP !== 'MetaMask') {
                this.web3.eth.sendTransaction({ from: this.web3.eth.accounts[0], to: this.web3.eth.accounts[0], value: 0, gas: 0, gasPrice: 0 },
                    (err, res) => {
                        if (err.toString() !== 'Error: account is locked') {
                            this.unlockedAccount = this.web3.eth.accounts[0];
                            this.update.emit(null);
                            console.log('Connected to account: ' + this.unlockedAccount);
                            resolve(true);
                        } else {
                            console.log('Error: Could not find an unlocked account');
                            resolve(false);
                        }
                    }
                );
            } else {
                this.unlockedAccount = this.web3.eth.accounts[0];
                console.log('Connected to account: ' + this.unlockedAccount);
                resolve(false);
            }
        });
        return p;
    }

    handleConnection(connect: boolean): void {
        if (connect) {
            this.connected();
        } else {
            this.nodeIP = DEFAULT_NODE_URL;
            this.connectToNode();
        }
        this.nodeConnected = connect;
    }

    connectToNode(): void { // Don't unlock until you send a transaction
        if (typeof window['web3'] !== 'undefined' && (!localStorage['nodeIP'] || this.nodeIP === 'MetaMask')) {
            localStorage['nodeIP'] = this.nodeIP;
            console.log('Using injected web3');
            this.web3 = new this.Web3(window['web3'].currentProvider);
            this.nodeIP = 'MetaMask';
            this.nodeConnected = true;
            this.unlockedAccount = 'MetaMask';
            this.update.emit(null);
        } else {
            localStorage['nodeIP'] = this.nodeIP;
            console.log('Using HTTP node');
            this.unlockedAccount = undefined;
            this.web3 = new this.Web3();
            this.web3.setProvider(new this.web3.providers.HttpProvider(this.nodeIP));
        }
    }

    unlockAccount(pk: string) {
        this.web3.eth.accounts.wallet.add(pk);
    }

    getContract(abi: any[], address: string): any {
        return new this.web3.eth.Contract(abi, address);
    }

    deployContract(abi: any[], data: string, from: string, ctorParams: any[] = null, gasPrice: string = '100000', gas: number = 1000000): Observable<string> {
        const contract = new this.web3.eth.Contract(abi);
        return UtilsService.observableFromCb(done => contract
            .deploy({
                data: data,
                arguments: ctorParams
            }).send({
                from: from,
                gas: gas,
                gasPrice: gasPrice
            }, function (err, txHash) {
                if (err) {
                    done(false, err);
                }
            }).then(newContractInstance => done(true, newContractInstance.options.address)));
    }

    readContractMethod(method: any, from: string = null): Observable<any> {
        return UtilsService.observableFromCb(done => method.call({
            from: from
        }).then(res => done(true, res)).catch(err => done(false, err)));
    }

    writeContractMethod(method: any, from: string, gasPrice: string = '100000', gas: number = 1000000) {
        return UtilsService.observableFromCb(done => method.send({
            from: from,
            gas: gas,
            gasPrice: gasPrice
        }).then(res => done(true, res)).catch(err => done(false, err)));
    }

    // Properties
    get isConnected(): boolean {
        return this.nodeConnected;
    }

    get web3(): any {
        if (!this.web3Instance) {
            this.intializeWeb3();
        }
        return this.web3Instance;
    }
    set web3(web3: any) {
        this.web3Instance = web3;
    }

    get currentAcc(): string {
        return this.unlockedAccount;
    }

    get currentNode(): string {
        return this.nodeIP;
    }
    set currentNode(nodeIP: string) {
        this.nodeIP = nodeIP;
    }

    get Web3(): any {
        return window['Web3'];
    }
}
