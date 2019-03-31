import express = require("express");

export abstract class AbstractHandlerGroup {

    public abstract basePath: string;
    public abstract getRouter(): express.Router;

}
