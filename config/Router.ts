import * as express from "express";
import * as jwt from "express-jwt";
import { HomeRouter, JwtRouter, SampleRouter } from "../app/routes";
import { config } from "../config";

interface IROUTER {
    path: string;
    middleware: any[];
    handler: express.Router;
}

const Sample = new SampleRouter();
const JWT = new JwtRouter();
const Home = new HomeRouter();

export const ROUTER: IROUTER[] = [{
    handler: JWT.router,
    middleware: [],
    path: "/JWT",
}, {
    handler: Sample.router,
    middleware: [
        jwt({ secret: config.SECRET }),
    ],
    path: "/sample",
}, {
    handler: Home.router,
    middleware: [],
    path: "/",
}];
