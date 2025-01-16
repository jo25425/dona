import createNextIntlPlugin from "next-intl/plugin";
import { validateEnv } from "./src/services/validateEnv.mjs";

const env = validateEnv();

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Makes validated environment variables available globally
    env: {
        ...env,
        NEXT_PUBLIC_DONOR_ID_INPUT_METHOD: env.DONOR_ID_INPUT_METHOD, // Automatically expose to client
    }
};

export default withNextIntl(nextConfig);
