import dotenv from "dotenv";
import { Server, createServer } from "http";
import express, { Application } from "express";

import ApplicationConfigs from "./configs/app.configs";

dotenv.config();

const app: Application = express();

/**
 * @description Create application server
 * @param app
 */
const server: Server = createServer(app);

/**
 * @description Configure Application
 */
ApplicationConfigs.init(app);

/**
 * @description Configure Routes
 */
ApplicationConfigs.initRoutes(app);

/**
 * @description Initialize upload directory
 */
ApplicationConfigs.fileDirectoryInitializer();

/**
 * @description Handles errors
 */
ApplicationConfigs.handleErrors(app);

export default server;
