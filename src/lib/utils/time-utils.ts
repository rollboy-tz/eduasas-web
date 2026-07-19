/**
 * DATE MANAGER - EDUASAS SYSTEM (v3.5)
 * Class hii inasimamia muda, tarehe, na dynamic formatting.
 * Inatumia Intl.DateTimeFormat kwa usahihi wa maeneo (Localization & Timezone).
 */

// Uhakiki wa mazingira (Client vs Server)
const USER_TIMEZONE = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Africa/Dar_es_Salaam";
const USER_LOCALE = typeof window !== "undefined" ? navigator.language : "en-GB";

export interface DateConfig {
  format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  showTime?: boolean;
  hour12?: boolean;
  withDay?: boolean;
  monthType?: 'short' | 'long' | '2-digit';
}

export class DateUtils {
  
  /**
   * 1. FORMAT RELATIVE TIME
   * Inabadilisha timestamp kuwa maelezo ya kirafiki (mfano: "5m ago").
   * @param {string | number | Date} date - Timestamp ya awali
   * @returns {string} String ya muda iliyochakatwa (e.g., "2m ago")
   */
  static formatRelative(date: string | number | Date): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Unknown time";

    const diff = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return new Intl.DateTimeFormat(USER_LOCALE, { day: "2-digit", month: "short" }).format(dateObj);
  }

  /**
   * 2. FORMAT DATE PEKEE
   * @param {string | number | Date} date - Timestamp ya database
   * @param {'text' | 'numeric'} style - 'text' (09 Mar 2026) au 'numeric' (09/03/2026)
   * @returns {string} Tarehe iliyopangiliwa (e.g., "09 Mar 2026")
   */
  static formatDate(date: string | number | Date, style: 'text' | 'numeric' = 'text'): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "N/A";

    return new Intl.DateTimeFormat(USER_LOCALE, {
      timeZone: USER_TIMEZONE,
      day: '2-digit',
      month: style === 'text' ? 'short' : '2-digit',
      year: 'numeric',
    }).format(dateObj);
  }

  /**
   * 3. FORMAT TIME PEKEE
   * @param {string | number | Date} date - Timestamp ya database
   * @param {boolean} showSeconds - Ionyeshe sekunde (Default: false)
   * @param {boolean} is12Hour - 12-hour (AM/PM) vs 24-hour (Default: false/24hr)
   * @returns {string} Muda pekee (e.g., "14:30")
   */
  static formatTime(date: string | number | Date, showSeconds = false, is12Hour = false): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "N/A";

    return new Intl.DateTimeFormat(USER_LOCALE, {
      timeZone: USER_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: is12Hour,
    }).format(dateObj);
  }

  /**
   * 4. FORMAT DATE NA TIME KWA PAMOJA
   * @param {string | number | Date} date - Timestamp ya database
   * @returns {string} Mchanganyiko (e.g., "09 Mar 2026, 14:30")
   */
  static formatDateTime(date: string | number | Date): string {
    return `${this.formatDate(date, 'text')}, ${this.formatTime(date)}`;
  }

  /**
   * 5. CUSTOM DATE FORMATTER
   * @param {string | number | Date} date - Tarehe inayochakatwa
   * @param {DateConfig} config - Mipangilio ya muonekano
   * @returns {string} Custom formatted date
   */
  static formatCustom(date: string | number | Date, config: DateConfig = {}): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid date";

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: config.monthType || 'short',
      year: 'numeric',
      weekday: config.withDay ? 'short' : undefined,
      timeZone: USER_TIMEZONE,
    };

    if (config.showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = config.hour12 || false;
    }

    const localeMap = { 'DD/MM/YYYY': 'en-GB', 'MM/DD/YYYY': 'en-US', 'YYYY-MM-DD': 'en-CA' };
    return new Intl.DateTimeFormat(localeMap[config.format || 'DD/MM/YYYY'], options).format(dateObj);
  }

  /**
   * 6. GET TIME GREETING
   * @returns {string} Salamu ("Good morning", "Good afternoon", "Good evening")
   */
  static getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  /**
   * 7. IS DATE EXPIRED
   * @param {string | number | Date} date - Tarehe ya uhakiki
   * @returns {boolean} true kama muda umepita
   */
  static isExpired(date: string | number | Date): boolean {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  }
}