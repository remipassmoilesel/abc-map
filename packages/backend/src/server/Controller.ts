import { Router } from 'express';

export abstract class Controller {
  public abstract getRoot(): string;
  public abstract getRouter(): Router;
}
