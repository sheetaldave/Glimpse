export const environment = {
  production: true,
  baseUrl: "https://api.deepframe.io",
  socialAuth: {
    google: {
      clientId: "189579502293-o8ataarcar6g92ggemp9o0ct8j2ju5v3.apps.googleusercontent.com"
    }
  },
  messageFetchInterval: 30000,
  oneSignal: {
    enabled: true,
    appId: "66895a6d-8650-439b-afe0-e690dcdec958"
  },
  sentry: {
    enabled: true,
    dsn: "https://79b34c1d2b6c4665a51d40bb033f7b89@sentry.io/239526"
  }
};
