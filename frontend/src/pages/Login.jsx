import { useLocale } from '../i18n.js';

function Login() {
  const { t } = useLocale();
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  const startSocialLogin = (provider = 'google') => {
    window.location.href = `/auth/${provider}`;
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
        <button onClick={() => startSocialLogin('google')} aria-label={`${t('loginWith')} Google`}>
          {t('loginWith')} Google
        </button>
        <button onClick={() => startSocialLogin('github')} aria-label={`${t('loginWith')} GitHub`}>
          {t('loginWith')} GitHub
        </button>
      </div>
    </main>
  );
}

export default Login;