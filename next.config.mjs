import createNextIntlPlugin from "next-intl/plugin";
import { validateEnv } from "./src/services/validateEnv.mjs";

const env = validateEnv();

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Makes validated environment variables available globally via process.env
    env: {
        ...env,
        // Automatically expose to client with prefix "next_PUBLIC_"
        NEXT_PUBLIC_DONOR_ID_INPUT_METHOD: env.DONOR_ID_INPUT_METHOD,
        NEXT_PUBLIC_DONOR_SURVEY_ENABLED: env.DONOR_SURVEY_ENABLED,
        NEXT_PUBLIC_DONOR_SURVEY_LINK: env.DONOR_SURVEY_LINK
    }
};

export default withNextIntl(nextConfig);
