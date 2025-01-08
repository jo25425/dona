import createNextIntlPlugin from "next-intl/plugin";
import { validateEnv } from "./src/services/validateEnv.mjs";

const env = validateEnv();

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: env, // Makes validated environment variables available globally
};

export default withNextIntl(nextConfig);
