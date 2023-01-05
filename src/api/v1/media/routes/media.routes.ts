import { Response, Request, NextFunction, Router } from "express";

import MediaController from "../controllers/media.controller";

export default function MediasRoutes(mediaController: MediaController) {
  const router = Router();

  return router;
}
