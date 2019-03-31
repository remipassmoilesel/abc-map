import express = require("express");
import {Route} from "../../../../shared/dist/src/routes/Route";

export abstract class AbstractRouter {

    public abstract route: Route;

    public abstract getRouter(): express.Router;

}
