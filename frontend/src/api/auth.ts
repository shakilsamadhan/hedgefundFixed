// api/auth.ts
const GOOGLE_BACKEND_REDIRECT = "http://localhost:8000/auth/google/callback";

export const handleGoogleLogin = () => {
  const GOOGLE_CLIENT_ID =
    "170452749354-2hgbu9oaltpev3thtokhvgfss3vrgbn5.apps.googleusercontent.com";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    GOOGLE_BACKEND_REDIRECT
  )}&scope=email%20profile&access_type=offline&prompt=consent`;

  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    googleAuthUrl,
    "GoogleLogin",
    `width=${width},height=${height},top=${top},left=${left}`
  );
};
