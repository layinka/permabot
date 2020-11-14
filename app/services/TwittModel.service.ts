import { getCustomRepository } from "typeorm";
import { Twitt } from "../models";
import { TwittRepository } from "../repository";

export class TwittModelService {

    public findByText(text: string): Promise<Twitt[]> {
        return getCustomRepository(TwittRepository).findByText(text);
    }

    public getPendingTweets(): Promise<Twitt[]> {
        return getCustomRepository(TwittRepository).getPendingTweets();
    }

    public async getPendingTweet(id: number): Promise<Twitt> {
        const twitt = await this.findOneById(id);
        if (twitt && twitt.isPublished) {
            return twitt;
        }
        return null;
    }
    public findOneById(id: number): Promise<Twitt> {
        return getCustomRepository(TwittRepository).findOneById(id);
    }

    public find(): Promise<Twitt[]> {
        return getCustomRepository(TwittRepository).find();
    }

    public remove(twitt: Twitt): Promise<Twitt> {
        return getCustomRepository(TwittRepository).remove(twitt);
    }

    public removeById(id: string): Promise<Twitt> {
        return getCustomRepository(TwittRepository).removeById(id);
    }

    public save(twitt: Twitt): Promise<Twitt> {
        return getCustomRepository(TwittRepository).save(twitt);
    }

    public async markTweetAsPublished(tweet: any, wallet: string) {
        return getCustomRepository(TwittRepository).markTweetAsPublished(tweet, wallet);
    }

}
