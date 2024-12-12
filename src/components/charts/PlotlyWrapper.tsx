/**
 * PlotlyWrapper Component
 *
 * This component acts as a centralized wrapper for rendering Plotly charts in a Next.js environment.
 * It dynamically imports `react-plotly.js` to avoid server-side rendering (SSR) issues, ensuring
 * Plotly is only loaded in the browser.
 *
 * Key Features:
 * - Prevents SSR errors caused by browser-specific dependencies (e.g., `window`, `self`).
 * - Supports advanced Plotly features such as animations (`frames`) and custom styles.
 * - Provides a consistent way to handle loading states for charts with a placeholder message.
 *
 * Usage:
 * Import and use `PlotlyWrapper` to render any Plotly chart by passing `data`, `layout`,
 * and optional `config` or `frames`.
 *
 * Example:
 * <PlotlyWrapper
 *     data={data}
 *     layout={layout}
 *     config={config}
 * />
 *
 * Note:
 * Use this wrapper with dynamic imports for any chart-related dependencies
 * (e.g., modeBar buttons) to ensure they load only on the client side.
 */
import dynamic from "next/dynamic";
import React from "react";
import { Layout, Config, Data } from "plotly.js";
import {useTranslations} from "next-intl";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyWrapperProps {
    data: Data[];
    layout: Partial<Layout>;
    config?: Partial<Config>;
    frames?: any[];
    style?: React.CSSProperties;
}


const PlotlyWrapper: React.FC<PlotlyWrapperProps> = ({
                                                         data,
                                                         layout,
                                                         config,
                                                         frames,
                                                         style,
                                                     }) => {
    const t = useTranslations();

    if (typeof window === "undefined") return null; // Avoid rendering on the server

    if (!layout) return (
        <div style={{ textAlign: "center", padding: "1em" }}>
            {t("feedback.loading")}
        </div>
    );

    return (
        <Plot
            data={data}
            layout={layout}
            config={config}
            frames={frames}
            style={style}
        />
    );
};

export default PlotlyWrapper;
