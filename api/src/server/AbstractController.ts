import express = require("express");

export abstract class AbstractController {

    public abstract getRouter(): express.Router;

}
