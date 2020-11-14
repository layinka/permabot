import Twit = require("twit");

export class TwittObject {

    public API_URL = "https://api.twitter.com";
    public SYNDICATION_URL = "https://syndication.twitter.com";
    public tweetsArray: any[] = [];
    
    private twitter: Twit;
    

    constructor() {
        this.twitter = new Twit({
            access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            timeout_ms: 60 * 1000,
            strictSSL: true,
        });
    }

    // extractTextFromTweet(tweet: Object) => <String>
    public extractTextFromTweet(tweet: any): string {
        return tweet.text;
    }

    // extractTweetFromId(id: String) => <Promise>
    public extractTweetFromId(id: string): Promise<any> {
        return this.twitter.get("statuses/show/:id", { id });
    }


    //  // getThread(tweet: Object) => void
    public async getThread(tweet: any, callback?: (arr: any[]) => void ) {
        console.log('adding');
        this.tweetsArray.push(tweet);
        if (tweet.in_reply_to_status_id_str !== null) {
            console.log('getting thread child');
            const e = await this.extractTweetFromId(tweet.in_reply_to_status_id_str)
                .catch(er => console.error(er));

                console.log('getting thread child e is not null: ', e != null);
            if (e) {
                console.log('getting thread child e : ', e.data.text);
                await this.getThread(e.data,  callback);
            }
        } else {
            // this.sendDM(
            //     this.tweetsArray.reverse().map(this.extractTextFromTweet).join('\n\n---\n\n'),
            //     this.userid
            // )
            // .then(e => console.log(`DM to user ${this.userid} has been sent!`))
            // .catch(e => console.error(e))
            // .finally(e => this.tweetsArray = []);
            console.log('Calling callback:', callback);
            if (callback) {
                callback( this.tweetsArray.reverse() );
            }
        }
    }

}
