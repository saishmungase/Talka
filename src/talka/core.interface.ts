
export class Provider {

  config : any

  constructor(config : any) {
    this.config = config;
  }

  async send(message : string) {
    throw new Error("Provider.send must be implemented");
  }

  supports(field : any) { return false; }
}
