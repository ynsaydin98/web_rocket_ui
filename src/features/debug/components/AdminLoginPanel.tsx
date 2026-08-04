import { useState, type FormEvent } from "react";
import { Panel } from "../../../shared/components/Panel";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useAdminSessionStore } from "../store/adminSessionStore";

export function AdminLoginPanel() {
  const isAdmin = useAdminSessionStore((state) => state.isAdmin);
  const loginError = useAdminSessionStore((state) => state.loginError);
  const login = useAdminSessionStore((state) => state.login);
  const logout = useAdminSessionStore((state) => state.logout);
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = login(password);
    if (success) {
      setPassword("");
    }
  };

  return (
    <Panel
      title="Admin Girişi"
      eyebrow="Komut Yetkisi"
      action={
        <StatusBadge tone={isAdmin ? "success" : "warning"}>
          {isAdmin ? "YETKİLİ" : "KİLİTLİ"}
        </StatusBadge>
      }
    >
      {isAdmin ? (
        <div className="admin-session-panel">
          <p className="muted-copy">
            Bu tarayıcı oturumunda komut gönderme yetkisi açık.
          </p>
          <button type="button" className="button button--quiet" onClick={logout}>
            Yetkiyi Kapat
          </button>
        </div>
      ) : (
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Admin Şifresi</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="button">
            Giriş
          </button>
          {loginError && <p className="error-copy">{loginError}</p>}
        </form>
      )}
    </Panel>
  );
}
