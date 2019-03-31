import express = require("express");
import {AbstractHandlerGroup} from "./AbstractHandlerGroup";

export class HelloWorldRouter extends AbstractHandlerGroup {

    public basePath = "/hello";

    public getRouter(): express.Router {
        const router = express.Router();
        router.get("/world", (req, res) => {
            res.json({hello: "world"});
        });

        return router;
    }

}
