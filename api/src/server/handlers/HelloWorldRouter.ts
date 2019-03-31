import express = require("express");
import {AbstractRouter} from "./AbstractRouter";

export class HelloWorldRouter extends AbstractRouter {

    public basePath = "/hello";

    public getRouter(): express.Router {
        const router = express.Router();
        router.get("/world", (req, res) => {
            res.json({hello: "world"});
        });

        return router;
    }

}
