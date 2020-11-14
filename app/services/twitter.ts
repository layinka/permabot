import { Twitt, TwittObject } from "../models";
import { env } from "process";
import * as Twit from "twit";
import { ArService } from "./ar.service";
import { TwittModelService } from "./TwittModel.service";
// import * as ar from "./ar');
let sizeof = require('object-sizeof');

export class TwitterService {
    public API_URL = "https://api.twitter.com";
    public SYNDICATION_URL = "https://syndication.twitter.com";
    public tweetsArray: any[] = [];
    private twitter: Twit;
    private stream: Twit.Stream;
    private twittModelService: TwittModelService;

    constructor(private arService: ArService) {
        this.twitter = new Twit({
            access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            timeout_ms: 60 * 1000,
            strictSSL: true,
        });

        this.twittModelService = new TwittModelService();
    }

    public startListen(): any {
        console.log("Twitter is listening");
        this.stream = this.twitter.stream("statuses/filter", { track: ["@permabot"] } );
        // this.stream = this.twitter.stream("statuses/filter", { track: ["@permabot"] } );

        this.stream.on("tweet", async (tweet) => {
            const tweetText = tweet.text;
            const name = tweet.user.screen_name; // Sent by
            const tweetId  = tweet.id_str;

            console.log("Tweet is seen");

            const t1: Twitt = {
                id: tweetId,
                threadSubmittedBy: name,
                isPublished: false,
                amountDonated: 0,
                tweetText,
                tweetTimeStamp: tweet.timestamp_ms,
            } as Twitt;

            const tweetsInThread = await this.getThread(tweet);

            t1.noOfTweetsInThread = tweetsInThread.length;
            t1.tweetOwner = tweetsInThread[0].user.screen_name;
            const savedThreadTweets = JSON.stringify( tweetsInThread.map((v) => {
                return {
                    text: v.text,
                    name: v.user.screen_name,
                    id: v.id_str,
                };

            }) );
            t1.savedThread = savedThreadTweets;

            const txFee = await this.arService.getTxFee(savedThreadTweets);
            const percentCharge = 0.01;
            const txCharge = Math.max( 0.05, percentCharge * txFee) ; // Maximum of 0.05ar or 1% )
            t1.estimatedPublishingCost = txFee;
            const totalfee = txFee + txCharge;
            t1.estimatedFee = txCharge;

            const result = await this.twittModelService.save(t1);


            const reply = `@${name}, Your thread is in the process of being added to the permaweb, visit here to add a few ArCoin to publish it.`;
            const params = {
                status: reply,
                // tslint:disable-next-line:object-literal-sort-keys
                in_reply_to_status_id: tweetId,
            };
            this.twitter.post("statuses/update", params, (err, data, response) => {
                if (err !== undefined) {
                    console.log(err);
                } else {
                    console.log("Tweeted: " + params.status);
                }
            });

            // this.arService.sendData(tweet.text, tweet.user.screen_name, "keyword");
            // console.log("– Just archived a tweet from @" + tweet.user.screen_name + " on Arweave's Blockchain.");
        });

        // // or
        // let twitterHandleStream = this.twitter.stream("user");
        // twitterHandleStream.on("tweet", this.handleMentions);
        // twitterHandleStream.on("follow", this.handleFollows);

    }

    public handleMentions(tweetEvent: any) {}

    public handleFollows(tweetEvent: any) {}


    // extractTextFromTweet(tweet: Object) => <String>
    public extractTextFromTweet(tweet: any): string {
        return tweet.text;
    }

    // extractTweetFromId(id: String) => <Promise>
    public extractTweetFromId(id: string) {
        return this.twitter.get("statuses/show/:id", { id });
    }


     // getThread(tweet: Object, cb: Function) => void
    // This function gets the parent's tweet from the 
    // TWEET variable, & calls a callback <cb> function
    // when it's done.
    // public async getThread(tweet: any, cb?: Function) {
        
    //     this.tweetsArray.push(tweet);
    //     if (tweet.in_reply_to_status_id_str !== null) {
    //         const e = await this.extractTweetFromId(tweet.in_reply_to_status_id_str)
    //             .catch(er => console.error(er));
    //         if(e) {
    //             await this.getThread(e.data);
    //         }
    //     } else {
    //         // this.sendDM(
    //         //     this.tweetsArray.reverse().map(this.extractTextFromTweet).join('\n\n---\n\n'),
    //         //     this.userid
    //         // )
    //         // .then(e => console.log(`DM to user ${this.userid} has been sent!`))
    //         // .catch(e => console.error(e))
    //         // .finally(e => this.tweetsArray = []);
    //     }
    // }
    public async getThread(tweet: any) {

        const tweetObject = new TwittObject();
        return new Promise<any[]>(async (resolve , reject) => {
            await tweetObject.getThread(tweet, (thread: any[]) => {
                console.log("Thread --", thread);
                const parentTweet = {
                    id_str: thread[0].id_str,
                    user_id: thread[0].user.id_str,
                };

                // if (thread.length > 1) {
                //     thread.forEach((element: any) => {
                //         console.log("Tweet ELement --:" + element);
                //     });
                //     thread.filter((ff) => ff.user.id_str === parentTweet.user_id);
                // }

                resolve(thread.filter((ff) => ff.user.id_str === parentTweet.user_id));

            });
        });

    }



    
    
}

