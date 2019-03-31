import express = require("express");

export abstract class AbstractHandlerGroup {

    abstract basePath: string;
    abstract getRouter(): express.Router;

}
