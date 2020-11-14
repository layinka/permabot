
import { HomeController, SampleController } from "../controllers";
import { Validator } from "../middlewares";
import { createSample, deleteSample, updateSample } from "../schemas";
import { Router } from "./Router";

export class HomeRouter extends Router {
    constructor() {
        super(HomeController);

        this.router
            .get("/", this.handler(HomeController.prototype.index))
            .get("/pending", this.handler(HomeController.prototype.pendingTwits))
            .post("/publish", this.handler(HomeController.prototype.publish));
            // .get("/:id", this.handler(SampleController.prototype.find))
            // .post("/", [ Validator(createSample) ], this.handler(SampleController.prototype.create))
            // .put("/", [ Validator(updateSample) ],  this.handler(SampleController.prototype.update))
            // .delete("/", [ Validator(deleteSample) ], this.handler(SampleController.prototype.delete));
    }
}
