import { UAParser } from "ua-parser-js";

export class ClientDevice {
  /**
   * GLOBAL CONFIGURATION
   * Inasoma kutoka kwenye .env au kutumia default values
   */
  public static readonly APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0-stable";
  public static readonly BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "EduAsas";

  private static getParser() {
    if (typeof window === "undefined") return null;
    return new UAParser(window.navigator.userAgent).getResult();
  }

  /**
   * 1. Hardware Fingerprint (Hiki VPN haiwezi kuficha)
   * Inasoma GPU, CPU cores, na RAM.
   */
  private static getHardwareInfo() {
    if (typeof window === "undefined") return "Server";

    const cores = navigator.hardwareConcurrency || "N/A";
    const ram = (navigator as any).deviceMemory || "N/A";

    let gpu = "Unknown";
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;

      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {
      gpu = "Inaccessible";
    }

    return `CPU:${cores}|RAM:${ram}GB|GPU:${gpu}`;
  }

  /**
   * 2. Platform Logic (EduAsas Brand Ecosystem)
   */
  static getPlatform(): string {
    const result = this.getParser();
    // 1. Kama tuko upande wa Server (SSR)
    if (!result) return `${this.BRAND_NAME}-SSR`;

    const isPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    // 2. Pata aina ya kifaa (mobile, tablet, desktop, etc.)
    // Ikiwa ua-parser haijapata aina (undefined), tunaita "PC"
    const type = result.device.type || "PC";

    // 3. Tengeneza Prefix (PWA au Browser)
    const prefix = isPWA ? "PWA" : "Browser";

    // 4. Return muundo ule ule uliotaka: Prefix-Type(Brand)
    // Mfano: PWA-mobile(EduAsas) au Browser-tablet(EduAsas)
    return `${prefix}-${type}(${this.BRAND_NAME})`;
  }

  /**
   * 3. Extraction ya Nchi na Lugha bila kutumia GPS (Privacy-Friendly)
   */
  static getDetailedLocality() {
    if (typeof window === "undefined") return { timezone: "UTC", locale: "en-US", combined: "Unknown" };

    try {
      // Pata Timezone (mfano: Africa/Dar_es_Salaam)
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Pata Lugha na Nchi kutoka kwa Browser (mfano: sw-TZ)
      const locale = navigator.language || "en-US";

      return {
        timezone: tz,
        locale: locale,
        combined: `${tz} (${locale})`
      };
    } catch (e) {
      return { timezone: "UTC", locale: "en-US", combined: "Error-Locality" };
    }
  }

  /**
   * 4. Comprehensive Audit Headers
   * Hizi ndizo zinazotumwa kwenye kila request ya Axios.
   */
  static getAuditHeaders() {
    const result = this.getParser();
    const locality = this.getDetailedLocality();
    const hardware = this.getHardwareInfo();

    return {
      // Brand & Version
      "X-Client-Platform": this.getPlatform(),
      "X-Client-Version": this.APP_VERSION,

      // Device Identity
      "X-Client-Device": result ? `${result.device.vendor || ""} ${result.device.model || ""}`.trim() : "PC",
      "X-Client-OS": result ? `${result.os.name} ${result.os.version}` : "Unknown",
      "X-Client-Browser": result ? `${result.browser.name} ${result.browser.version}` : "Unknown",

      // Hardware Fingerprint (Anti-Spoof/VPN)
      "X-Client-HW": hardware,
      "X-Client-SID": btoa(hardware).substring(0, 16), // Hardware-based Session ID
      "X-Client-Res": typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "0x0",

      // Locality (Anti-VPN Analysis)
      "X-Client-TZ": locality.timezone,
      "X-Client-Loc": locality.locale,
    };
  }
}