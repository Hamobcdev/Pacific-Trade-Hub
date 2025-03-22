import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import { alchemy, arbitrumSepolia } from "@account-kit/infra";

export const config = createConfig(
  {
    transport: alchemy({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
    }),
    chain: arbitrumSepolia, // Chain specified here only
    ssr: false,
    storage: cookieStorage,
    enablePopupOauth: true,
    sessionConfig: { expirationTimeMs: 1000 * 60 * 60 },
    policyId: import.meta.env.VITE_GAS_POLICY_ID as string | undefined,
  },
  {
    auth: {
      sections: [
        [{ type: "email" }],
        [
          { type: "social", authProviderId: "google", mode: "popup" },
          { type: "external_wallets" },
        ],
      ],
      addPasskeyOnSignup: true,
    },
  }
);

export const queryClient = new QueryClient();