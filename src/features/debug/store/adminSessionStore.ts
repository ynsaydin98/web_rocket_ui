import { create } from "zustand";

const ADMIN_SESSION_KEY = "rocket-web-ui-admin-session";
const EMBEDDED_ADMIN_PASSWORD = "admin123";

type AdminSessionStore = {
  isAdmin: boolean;
  loginError?: string;
  login: (password: string) => boolean;
  logout: () => void;
};

function readInitialAdminState() {
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export const useAdminSessionStore = create<AdminSessionStore>((set) => ({
  isAdmin: readInitialAdminState(),

  login: (password) => {
    const isValid = password === EMBEDDED_ADMIN_PASSWORD;

    if (isValid) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      set({ isAdmin: true, loginError: undefined });
      return true;
    }

    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    set({ isAdmin: false, loginError: "Şifre hatalı." });
    return false;
  },

  logout: () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    set({ isAdmin: false, loginError: undefined });
  },
}));
