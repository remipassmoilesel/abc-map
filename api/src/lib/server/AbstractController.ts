import express = require("express");
import {Route} from "../../../../shared/dist";

export abstract class AbstractController {

    public abstract route: Route;

    public abstract getRouter(): express.Router;

}
