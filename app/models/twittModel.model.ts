import { IsEmail } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity("twitt")
export class Twitt extends BaseEntity {

    /// Tweet Id
    // @PrimaryGeneratedColumn()
    @PrimaryColumn()
    public id: string;

    @Column()
    public tweetOwner: string;

    @Column()
    public threadSubmittedBy: string;

    @Column({nullable: true})
    public arweaveWalletAddress: string;

    // @Column()
    // public tweetId: string;

    @Column()
    public tweetText: string;

    @Column({default: false})
    public isPublished: boolean;

    @Column({default: 0})
    public amountDonated: number;


    @CreateDateColumn()
    public dateCreated: Date;

    @Column({nullable: true})
    public tweetTimeStamp: number;

    @Column({default: 1})
    public noOfTweetsInThread: number;

    @Column({default: ""})
    public savedThread: string;

    @Column({default: 0})
    public estimatedPublishingCost: number;

    @Column({default: 0})
    public estimatedFee: number;

}