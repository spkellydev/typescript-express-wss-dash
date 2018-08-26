import { JWT } from "google-auth-library";

export type GoogleJWT = typeof JWT;

export interface IGoogle<T> {
  scopes: string[];
  requestData: (dimsets: object) => any;
}

export interface IGoogleAnalytics {
  serviceAccountEmail: string;
  serviceAccountKey: string;
}

// export type IGoogleAnalyticsDimSets = {
//   auth: GoogleJWT;
//   ids: string;
//   "start-date": string;
//   "end-date": string;
//   metrics: string;
//   dimensions: string;
// };
