/**
 * 1. RAW CONSTANTS (The Truth)
 * Hapa ndio orodha ya makosa yote yanayotoka server.
 */
export const SERVER_ERRORS = {
    // Session/Auth Errors
    SESSION_MALFORMED: "SESSION_MALFORMED",
    SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
    SESSION_EXPIRED: "SESSION_EXPIRED",
    AUTH_REQUIRED: "AUTH_REQUIRED",
    
    // Access Errors
    PERMISSION_DENIED: "PERMISSION_DENIED",
    VIEW_ONLY_MODE: "VIEW_ONLY_MODE",
    ROLE_MISMATCH: "ROLE_MISMATCH",
    
    // Context Errors
    SCHOOL_NOT_FOUND: "SCHOOL_NOT_FOUND",
    CONTEXT_MISMATCH: "CONTEXT_MISMATCH",
    
    // Logic/Data Errors
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  } as const;
  
  /**
   * 2. ACTION GROUPS
   * Tunayaweka kwenye makundi kulingana na "Action" itakayochukuliwa.
   */
  export const ERROR_ACTIONS = {
    // Action: Futa kila kitu na mrudishe Login
    TERMINATE_SESSION: [
      SERVER_ERRORS.SESSION_MALFORMED,
      SERVER_ERRORS.SESSION_NOT_FOUND,
      SERVER_ERRORS.SESSION_EXPIRED,
      SERVER_ERRORS.AUTH_REQUIRED,
    ],
  
    // Action: Zuia kufuta/kuedit (View-only UI)
    RESTRICT_ACCESS: [
      SERVER_ERRORS.PERMISSION_DENIED,
      SERVER_ERRORS.VIEW_ONLY_MODE,
      SERVER_ERRORS.ROLE_MISMATCH,
    ],
  
    // Action: Mrudishe kwenye Portal/Switch School
    REDIRECT_TO_PORTAL: [
      SERVER_ERRORS.SCHOOL_NOT_FOUND,
      SERVER_ERRORS.CONTEXT_MISMATCH,
    ],
  } as const;