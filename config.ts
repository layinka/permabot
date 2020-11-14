import { env } from "process";

const LOCAL_CONFIGURATION = {
    DB: process.env.DB || "./data/permabot.sq3",
    DIALECT: process.env.DIALECT || "sqlite",
    PASSWORD: process.env.PASSWORD || "",
    PORT_DB: 3306,
    SERVER: "",
    USER_DB: "",
};

const PRODUCTION_CONFIGURATION = {
    DB: process.env.DB || "./data/permabot.sq3",
    DIALECT: process.env.DIALECT || "sqlite",
    PASSWORD: process.env.PASSWORD || "",
    PORT_DB: Number(process.env.PORT_DB) || 3306,
    SERVER: process.env.SERVER || "",
    USER_DB: process.env.USER_DB || "",
};

export function isProduction(): boolean {
    return env.NODE_ENV === "PRODUCTION";
}

export const config = {
    DATABASE: isProduction() ? PRODUCTION_CONFIGURATION : LOCAL_CONFIGURATION,
    PORT_APP: 3050,
    SECRET: env.SECRET,
};
