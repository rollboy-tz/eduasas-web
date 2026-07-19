// 🟢 lib/errors.ts
import { ApiResponse, ResponseAction } from "./api-respone";

// 2. Class yako sasa inatumia types zilizo hapa hapa ndani, haina import ya sumu!
export class ApiError extends Error {
  public status:      "success" | "error" | "warning";
  public action:      ResponseAction;
  public data:        any;
  public errorCode?:  string;
  public errors?:     any;
  public timestamp:   string;

  constructor(apiResponse: ApiResponse) {
    super(apiResponse.message);
    
    this.name      = "ApiError";
    this.status    = apiResponse.status     ||  "error";
    this.action    = apiResponse.action     ||  "NONE";
    this.data      = apiResponse.data       ||  null;
    this.errorCode = apiResponse.errorCode;
    this.errors    = apiResponse.errors     ||  null;
    this.timestamp = apiResponse.timestamp;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
