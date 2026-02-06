import { useLocale } from '../useLocale';

function Login() {
  const { t } = useLocale();
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:5002/api';
  const authBase = apiBase.replace(/\/api\/?$/, '');

  const startSocialLogin = () => {
    window.location.href = `${authBase}/auth/login`;
  };

  return (
    <main style={{ padding: 24 }}>
      <h2>{t('login')}</h2>
      {error && (
        <div role="alert" style={{ color: 'red', marginBottom: 12 }}>
          {t('couldNotLoad')} {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={startSocialLogin} aria-label={`${t('loginWith')} Google`}>
          {t('loginWith')} Google
        </button>
        <button onClick={startSocialLogin} aria-label={`${t('loginWith')} GitHub`}>
          {t('loginWith')} GitHub
        </button>
      </div>
    </main>
  );
}

export default Login;
