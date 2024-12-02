import { Request, Response, NextFunction } from "express";

declare global {
  type Controller = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void> | void;
}
