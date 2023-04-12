//export a logger function that will be used to log messages
export function logger(debug: boolean, level: string, message: string) {
  if (debug) {
    switch (level) {
      case "info":
        console.info(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "error":
        console.error(message);
        break;
      default:
        console.log(message);
        break;
    }
  }
}
