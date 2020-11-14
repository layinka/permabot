
import { HomeController, SampleController } from "../controllers";
import { Validator } from "../middlewares";
import { createSample, deleteSample, updateSample } from "../schemas";
import { Router } from "./Router";

export class SampleRouter extends Router {
    constructor() {
        super(SampleController);
        this.router
            .get("/sample", this.handler(SampleController.prototype.all))
            .get("/sample/:id", this.handler(SampleController.prototype.find))
            .post("/sample/", [ Validator(createSample) ], this.handler(SampleController.prototype.create))
            .put("/sample/", [ Validator(updateSample) ],  this.handler(SampleController.prototype.update))
            .delete("/sample/", [ Validator(deleteSample) ], this.handler(SampleController.prototype.delete));

    }
}
