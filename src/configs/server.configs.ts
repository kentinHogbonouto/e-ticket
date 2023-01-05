import EnvironmentConfigs from "./environments";

export default class ServerConfigs {
  static onListening(): void {
    console.log(EnvironmentConfigs.serverStartedMessage());
  }

  static gracefulStopServer(): void {
    setTimeout(() => {
      console.info("Shutting down server");
      process.exit(0);
    }, 10000);
  }

  static onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") throw error;

    let bind =
      typeof EnvironmentConfigs.getServerPort() === "string"
        ? `Pipe ${EnvironmentConfigs.getServerPort()}`
        : `Port ${EnvironmentConfigs.getServerPort()}`;

    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);

      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);

      default:
        throw error;
    }
  }

  static unhandledRejection(reason: any, promise: any): void {
    console.error(
      {
        promise,
        reason,
      },
      "unhandledRejection"
    );
    process.exit(1);
  }

  static uncaughtException(err: NodeJS.UncaughtExceptionListener): void {
    console.error(err, "Uncaught exception");
    process.exit(1);
  }
}
