import {AbstractHandlerGroup} from "./AbstractHandlerGroup";
import express = require("express");

export class HelloWorldRouter extends AbstractHandlerGroup {

    public basePath = "/hello";

    getRouter(): express.Router {
        const router = express.Router();
        router.get("/world", (req, res) => {
            res.json({hello: 'world'});
        });

        return router;
    }

}
