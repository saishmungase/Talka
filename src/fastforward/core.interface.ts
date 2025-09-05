
export class Provider {

  config : any

  constructor(config : any) {
    this.config = config;
  }

  async send(message : any) {
    throw new Error("Provider.send must be implemented");
  }

  supports(field : string) { return false; }
}
