import { Request, Response } from "express";
import { Sample } from "../models";
import { SampleService, TwittModelService } from "../services";
import { Controller } from "./Controller";

export class HomeController extends Controller {

    private sampleService: SampleService;
    private sample: Sample;
    private twittModelService: TwittModelService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.sample = new Sample();
        this.sampleService = new SampleService();
        this.twittModelService = new TwittModelService();
    }

    public async index() {
        
        // const sampleList = await this.sampleService.find();
        
        // return this.res.status(200).send({ text: "Home found" });
        return this.res.render("index", {
            layout: "_layout.hbs",
            // companyInfo: this.config.get('app').companyInfo,
            // host: req.headers.host,
            message: "Hello world - Front!"
        });
    }

    public async pendingTwits() {

        const pending = await this.twittModelService.getPendingTweets();

        return this.res.status(200)
        .send({
            pending,
        });

    }

    public async publish() {
        const { id, wallet } = this.req.body as { id: number, wallet: string };
        const tweet = await this.twittModelService.getPendingTweet(id);
        if (tweet) {
            // tweet.isPublished = true;
            // tweet.arweaveWalletAddress = wallet;
            this.twittModelService.markTweetAsPublished(tweet, wallet);
            return this.res.status(200).send({tweet});
        } else {
            return this.res.status(404).send({ text: "not found" });
        }


    }

    

}
