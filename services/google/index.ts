import { google, analytics_v3 } from "googleapis";
import { IGoogle, GoogleJWT } from "../../interfaces/google";

/**
 * `abstract` Google |
 * `implements` IGoogle<T> |
 *  provides structure for GoogleAPIs
 */
export default abstract class Google implements IGoogle<any> {
  protected authClient: GoogleJWT;
  public analytics: analytics_v3.Analytics;

  constructor(public scopes: string[]) {
    this.scopes = scopes;
    this.authClient = google.auth.JWT;
    this.analytics = google.analytics("v3");
  }

  /**
   * `abstract` auth  |
   * grants auth access |
   * Any service implementing the Google abstract base class should have an auth method to provide access to API on client's behalf
   */
  protected abstract auth(): any;

  /**
   * `abstract` requestData |
   * retrieves data |
   * Any service implementing the Google abstract base class should have a requestData method to require data once auth access is granted
   */
  public abstract requestData(dimsets: object): any;
}
