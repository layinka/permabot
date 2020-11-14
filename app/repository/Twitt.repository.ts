import { EntityRepository, Repository } from "typeorm";
import { Sample } from "../models";
import { Twitt } from "./../models/twittModel.model";

@EntityRepository(Twitt)
export class TwittRepository extends Repository<Twitt> {

    // public bulkCreate(Samples: Sample[]): Promise<any> {
    //     return this.manager.createQueryBuilder().insert().into(Sample).values(Samples).execute();
    // }

    public async removeById(id: string): Promise<Twitt> {
        const itemToRemove: Twitt = await this.findOne({id});
        return this.manager.remove(itemToRemove);
    }

    public findByText(tweetId: string): Promise<Twitt[]> {
        return this.manager.find(Twitt, {where: {id: tweetId}});
    }

    public findOneById(id: number): Promise<Twitt> {
        return this.manager.findOne(Twitt, {where: {id}});
    }


    public getPendingTweets(): Promise<Twitt[]> {
        return this.manager.find(Twitt, {
            where: {isPublished : false}, 
            order: {
                dateCreated: "DESC",
            },
            skip: 0,
            take: 10
        });
    }

    public markTweetAsPublished(tweet: Twitt, wallet: string) {
        return this.manager.save({
            amountDonated: tweet.estimatedFee + tweet.estimatedPublishingCost,
            arweaveWalletAddress: wallet,
            id: tweet.id,
            isPublished: true,
        });
    }

}
