import * as axios from "axios";
import * as path from "path";
import Google from "./index";
import { IGoogleAnalytics, IGoogle } from "../../interfaces/google";

/**
 * @name Analytics
 * @param serviceAccountEmail provided by Google API JSON
 * @param serviceAccountKey provided by Google API JSON
 * @param scopes string[] like ['https://www.googleapis.com/auth/analytics.readonly']
 * @param dimsets {} like `{ auth, ids, start-date, end-date, metrics, dimensions }`
 */
export default class Analytics extends Google
  implements IGoogle<IGoogleAnalytics> {
  public client: any;
  public dimsets: {};
  constructor(
    protected serviceAccountEmail: string,
    protected serviceAccountKey: any,
    public scopes: string[]
  ) {
    super(scopes);
    this.serviceAccountEmail = serviceAccountEmail;
    this.serviceAccountKey = serviceAccountKey;
    this.client;
    this.dimsets = {};
  }

  public auth() {
    this.client = new this.authClient(
      this.serviceAccountEmail,
      this.serviceAccountKey,
      undefined,
      this.scopes
    );

    return this.client;
  }

  /**
   * Request data from Analytics API. Call expects dimensions
   * and metrics to be supplied
   * @param dimsets object
   */
  public async requestData(dimsets: object) {
    await this.client.authorize();
    return this.analytics.data.ga.get(dimsets);
  }
}
