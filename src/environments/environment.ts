// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl: "http://localhost:3000",
  socialAuth: {
    google: {
      clientId: "915559766112-04jn1dk8g47t4at1grrfcqlq4k9d3qk6.apps.googleusercontent.com"
    }
  },
  messageFetchInterval: 30000,
  oneSignal: {
    enabled: false,
    appId: "8d4ff732-d9bc-4fa7-a90a-a3f6bf1f74b2"
  },
  sentry: {
    enabled: false,
    dsn: "https://79b34c1d2b6c4665a51d40bb033f7b89@sentry.io/239526"
  }
};
