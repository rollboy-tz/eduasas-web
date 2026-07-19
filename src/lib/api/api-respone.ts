export type ResponseAction =
  | "NONE"
  | "RE_AUTHENTICATE"
  | "SYNC_CONTEXT"
  | "KILL_CONTEXT"
  | "REDIRECT"
  | "NOTIFY_ONLY"
  | "RELOAD_DATA"
  | "LOGOUT";

export interface ApiResponse<T = any> {
  success: any;
  status: "success" | "error" | "warning";
  message: string;
  action:  ResponseAction;
  data:    T;
  metadata?:  any;
  errorCode?: string;
  errors?:    any;
  timestamp:  string;
}