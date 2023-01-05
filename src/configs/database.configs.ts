import mongoose from "mongoose";
import Promise from "bluebird";

import EnvironmentConfigs from "./environments";

mongoose.Promise = Promise;

export default class DatabaseConfigs {
  static init(): void {
    /**
     * @descritpion Initiate the connection to the database
     */
    const db = mongoose.connect(
      EnvironmentConfigs.getDatabaseURL(),
      (error: NativeError | null) => {
        if (error) {
          console.error(`Mongoose default connection error: ${error}`);
        }
      }
    );

    /**
     * @descritpion If the connection is successfully established
     */
    mongoose.connection.on("connected", () => {
      console.info("Successfully connected to MongoDB database");
    });

    /**
     * @descritpion When the connection throws an error
     */
    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose default connection error: ${err}`);
    });

    /**
     * @descritpion When the connection is disconnected
     */
    mongoose.connection.on("disconnected", () => {
      console.error("Mongoose default connection disconnected");
    });

    /**
     * @descritpion When the Node process ends, close the Mongoose connection
     */
    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        console.info(
          "Mongoose default connection disconnected through app termination"
        );
        process.exit(0);
      });
    });
  }
}
