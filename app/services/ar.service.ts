import Arweave = require('arweave/node');
import * as fs from "fs";
let sizeof = require('object-sizeof');

export class ArService {

    public jwk: any;
    public arweave: any;

    constructor() {
        try {
            this.jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));
        } catch (err){

        }

        this.arweave = Arweave.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
            timeout: 20000,
            logging: false
          });
    }

    public getAddress(): Promise<any> {
        return this.arweave.wallets.jwkToAddress(this.jwk);
        // return arweave.wallets.jwkToAddress(jwk).then((address) => {
        //     return address;
        // });
    }

    public async  sendData(tweet: any, username: any, keyword: string) {
        let transaction = await this.arweave.createTransaction({
          data: tweet,
        }, this.jwk);
        // tags
        transaction.addTag("username", username);
        transaction.addTag("keyword", keyword);
        transaction.addTag("App-Name", "permabot");
        // sign
        await this.arweave.transactions.sign(transaction, this.jwk);

        await this.arweave.transactions.post(transaction);
    }

    // public async getTxFee(data: string, toAddress?: string) {
    //     const txnSizeInBytes = this.byteSize(data);
    //     return this.arweave.ar.winstonToAr( this.arweave.api.get(`price/${txnSizeInBytes}/${toAddress}`) );
    // }

    public async getTxFee(txnDataOrSizeInBytes: string|number, toAddress?: string): Promise<number> {
        let txnSizeInBytes = 0;
        if (typeof txnDataOrSizeInBytes === "string") {
            txnSizeInBytes = this.byteSize(txnDataOrSizeInBytes);
        } else {
            txnSizeInBytes = txnDataOrSizeInBytes;
        }
        let fee = 0;
        try{
            const result = await this.arweave.api
                .get(`price/${txnSizeInBytes}${toAddress===null ? "" : "/" }${toAddress || ""}`);
            fee = result.data;
        } catch (err) {
            console.error(err);
        }
        return this.arweave.ar.winstonToAr( fee );
    }

    public byteSize(str: string) {
        return sizeof(str);
    }
    

}
