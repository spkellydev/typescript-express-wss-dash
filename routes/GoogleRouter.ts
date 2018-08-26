import { Router, Request, Response, NextFunction } from "express";
import * as path from "path";
import User from "../models/UserModel";
import Analytics from "../services/google/analytics";

class GoogleRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public GetData(req: Request, res: Response, next: NextFunction): void {
    const SERVICE_ACCOUNT_EMAIL =
      "reactanalytics@celtic-current-212815.iam.gserviceaccount.com";
    const SERVICE_ACCOUNT_KEY = path.resolve(
      __dirname,
      "../services/key_cert.pem"
    );
    const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];
    const analytics = new Analytics(
      SERVICE_ACCOUNT_EMAIL,
      SERVICE_ACCOUNT_KEY,
      SCOPES
    );
    let authClient = analytics.auth();
    analytics
      .requestData({
        auth: authClient,
        ids: "ga:178297180",
        "start-date": "30daysAgo",
        "end-date": "today",
        metrics: "ga:hits",
        dimensions: "ga:date"
      })
      .then(ga => {
        res.json(ga.data);
      });
  }

  routes() {
    this.router.get("/analytics", this.GetData);
  }
}

const googleRoutes = new GoogleRouter();
googleRoutes.routes();
export default googleRoutes.router;
