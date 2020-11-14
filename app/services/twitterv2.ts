// import { Twitt, TwittObject } from "../models";
// import { env } from "process";
// import * as Twit from "twit";
// import { ArService } from "./ar.service";
// import { TwittModelService } from "./TwittModel.service";
// const Twitter = require("twitter-v2");
// // import * as ar from "./ar');

// export class TwitterV2Service {
//     public API_URL = "https://api.twitter.com";
//     public SYNDICATION_URL = "https://syndication.twitter.com";
//     public tweetsArray: any[] = [];
//     private twitter: any ;
//     private stream: Twit.Stream;
//     private twittModelService: TwittModelService;

//     constructor(private arService: ArService) {
//         // const t1= new Twitter({
//         //     access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//         //     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//         //     consumer_key: process.env.TWITTER_CONSUMER_KEY,
//         //     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//         // });
//         this.twitter = new Twitter({
//             access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
//             access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//             consumer_key: process.env.TWITTER_CONSUMER_KEY,
//             consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//         });

//         this.twittModelService = new TwittModelService();
//     }

//     public startListen(): any {
//         console.log("Twitter is listening");
//         this.stream = this.twitter.stream("statuses/filter", { track: ["@permabot"] } );
//         // this.stream = this.twitter.stream("statuses/filter", { track: ["@permabot"] } );

//         this.stream.on("tweet", async (tweet) => {
//             const tweetText = tweet.text;
//             const name = tweet.user.screen_name; // Sent by
//             const tweetId  = tweet.id_str;

//             const t1: Twitt = {
//                 id: tweetId,
//                 publisher: name,
//                 isPublished: false,
//                 amountDonated: 0,
//                 tweetText,
//                 tweetTimeStamp: tweet.timestamp_ms,
//             } as Twitt;

//             const result = await this.twittModelService.save(t1);

//             await this.getThread(tweet);
            
//             const reply = `@${name}, Your thread is in the process of being added to the permaweb, visit here to add a few ArCoin to publish it.`;
//             const params = {
//                 status: reply,
//                 // tslint:disable-next-line:object-literal-sort-keys
//                 in_reply_to_status_id: tweetId,
//             };
//             this.twitter.post("statuses/update", params, (err: any, data: any, response: any) => {
//                 if (err !== undefined) {
//                     console.log(err);
//                 } else {
//                     console.log("Tweeted: " + params.status);
//                 }
//             });

//             // this.arService.sendData(tweet.text, tweet.user.screen_name, "keyword");
//             // console.log("– Just archived a tweet from @" + tweet.user.screen_name + " on Arweave's Blockchain.");
//         });

//         // // or
//         // let twitterHandleStream = this.twitter.stream("user");
//         // twitterHandleStream.on("tweet", this.handleMentions);
//         // twitterHandleStream.on("follow", this.handleFollows);

//     }

//     public handleMentions(tweetEvent: any) {}

//     public handleFollows(tweetEvent: any) {}


//     // extractTextFromTweet(tweet: Object) => <String>
//     public extractTextFromTweet(tweet: any): string {
//         return tweet.text;
//     }

//     // extractTweetFromId(id: String) => <Promise>
//     public extractTweetFromId(id: string) {
//         return this.twitter.get("statuses/show/:id", { id });
//     }

//     public async test(){
//         // Tweet Lookup API Reference: https://bit.ly/2QF58Kw
//         const { data: tweet } = await this.twitter.get("tweets", {
//             ids: "1326215768170696704",
//             tweet: {
//                 fields: ['created_at', 'entities', 'public_metrics', 'author_id', "conversation_id", "in_reply_to_user_id"],
//             },
//         });

//         console.log("V2 Tweet: ", tweet);
//     }


//      // getThread(tweet: Object, cb: Function) => void
//     // This function gets the parent's tweet from the 
//     // TWEET variable, & calls a callback <cb> function
//     // when it's done.
//     // public async getThread(tweet: any, cb?: Function) {
        
//     //     this.tweetsArray.push(tweet);
//     //     if (tweet.in_reply_to_status_id_str !== null) {
//     //         const e = await this.extractTweetFromId(tweet.in_reply_to_status_id_str)
//     //             .catch(er => console.error(er));
//     //         if(e) {
//     //             await this.getThread(e.data);
//     //         }
//     //     } else {
//     //         // this.sendDM(
//     //         //     this.tweetsArray.reverse().map(this.extractTextFromTweet).join('\n\n---\n\n'),
//     //         //     this.userid
//     //         // )
//     //         // .then(e => console.log(`DM to user ${this.userid} has been sent!`))
//     //         // .catch(e => console.error(e))
//     //         // .finally(e => this.tweetsArray = []);
//     //     }
//     // }
//     public async getThread(tweet: any) {
//         const tweetObject = new TwittObject();
//         await tweetObject.getThread(tweet, (thread: any[]) => {
//             console.log("Thread --", thread);
//             thread.forEach((element: any) => {
//                 console.log("Tweet ELement --:" + element);
//             });
//         });
        
//         // this.tweetsArray.push(tweet);
//         // if (tweet.in_reply_to_status_id_str !== null) {
//         //     const e = await this.extractTweetFromId(tweet.in_reply_to_status_id_str)
//         //         .catch(er => console.error(er));
//         //     if(e) {
//         //         await this.getThread(e.data);
//         //     }
//         // } else {
//         //     // this.sendDM(
//         //     //     this.tweetsArray.reverse().map(this.extractTextFromTweet).join('\n\n---\n\n'),
//         //     //     this.userid
//         //     // )
//         //     // .then(e => console.log(`DM to user ${this.userid} has been sent!`))
//         //     // .catch(e => console.error(e))
//         //     // .finally(e => this.tweetsArray = []);
//         // }
//     }



    
    
// }

