'use client'
import { api } from "../api/api";

/**
 * logoutAndRedirect
 * Inasafisha kila kitu na kumrudisha user login huku ikihifadhi alikotoka.
 */
export const logoutAndRedirect = async () => {
  
  window.dispatchEvent(new CustomEvent("app:logout-trigger"));

  // 1. Pata path ya sasa kwa ajili ya callback
  const currentPath = window.location.pathname + window.location.search;

  // 2. Safisha LocalStorage yote (Sio token tu)
  localStorage.clear();

  // 3. Safisha SessionStorage yote
  sessionStorage.clear();

  //Tunfut cliet cookies kumbuka: HttpOnly cookies hazitafutika hapa (hizo lazima zifutwe na API).
  const purgeClientCookies = () => {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

      // Tunaseti expiry ya zamani na domain/path sahihi ili kuhakikisha inafutika
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // Kama una domain specific cookies, unaweza kuongeza domain pia:
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.eduasas.com;`;
    });
  };

  purgeClientCookies()

  // 5. JARIBU KUFUTA HTTPONLY COOKIES (Via Server)
  try {
    // Unaita endpoint ya logout ili server ifute HttpOnly cookies
    await api.post('/auth/logout');
  } catch (err) {
    console.error("Server logout failed, but moving on...", err);
  }

  // 6. Redirect kwenda Login ikiwa na callback
  window.location.href = `/auth/sign-in?callback=${encodeURIComponent(currentPath)}`;
};