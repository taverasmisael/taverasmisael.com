export class Logger {
  private colors = {
    reset: "\x1B[0m",
    fg: {
      red: "\x1B[31m",
      green: "\x1B[32m",
      yellow: "\x1B[33m",
    },
  };

  constructor(public packageName: string) {}
  public log(msg: string, prefix = "") {
    console.log(
      `%s${this.packageName}:%s ${msg}
`,
      prefix,
      prefix ? this.colors.reset : ""
    );
  }
  info(msg: string) {
    this.log(msg);
  }
  success(msg: string) {
    this.log(msg, this.colors.fg.green);
  }
  warn(msg: string) {
    this.log(
      `Skipped!
${msg}`,
      this.colors.fg.yellow
    );
  }
  error(msg: string) {
    this.log(
      `Failed!
${msg}`,
      this.colors.fg.red
    );
  }
}
