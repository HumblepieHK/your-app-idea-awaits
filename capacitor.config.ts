import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor config for wrapping the Totonou web app as a native Android app.
 *
 * IMPORTANT: `webDir` must point to the static client-side build output.
 * TanStack Start outputs the client bundle to `.output/public` after `bun run build`.
 * If you switch to a pure-SPA build, update `webDir` accordingly.
 */
const config: CapacitorConfig = {
  appId: "com.transentinel.totonou",
  appName: "Totonou",
  webDir: ".output/public",
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
