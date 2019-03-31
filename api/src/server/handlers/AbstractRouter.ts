import express = require("express");

export abstract class AbstractRouter {

    public abstract basePath: string;
    public abstract getRouter(): express.Router;

}
