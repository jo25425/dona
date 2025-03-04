export const CHART_COLORS = {
    primaryBar: "#1f77b4",  // Blue (word count)
    secondaryBar: "#ff7f0e", // Orange (response times)
    // tertiaryBar: "#2ca02c", // Green (activity)
    background: "#f5f5f5",
};

const MOBILE_HEIGHT = 250;
const DESKTOP_HEIGHT = 400;

export const CHART_LAYOUT = {
    barThickness: 20,
    mobileChartHeight: MOBILE_HEIGHT,
    desktopChartHeight: DESKTOP_HEIGHT,
    responsiveChartHeight: { xs: MOBILE_HEIGHT, sm: DESKTOP_HEIGHT },
    paddingX: { xs: 1, sm: 2 }, // Responsive padding
    paddingY: 2,
    labelFontSize: { xs: "0.8rem", sm: "1rem" },
    mirrorLabelsOnMobile: true, // Moves y-axis labels inside on mobile
};

export const COMMON_CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900 },
    plugins: { legend: { display: false } },
    scales: {
        x: {
            beginAtZero: true,
            ticks: { font: { size: 12 }, padding: 5 },
        },
        y: {
            ticks: { font: { size: 12 }, padding: 0, offset: false },
        },
    },
};

export const H_BARCHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900 },
    plugins: {
        legend: { display: true },
        tooltip: {
            callbacks: { label: (context: any) => `${context.raw?.toFixed(2)}%` },
        },
    },
    scales: {
        x: {
            ticks: {
                font: { size: 12 },
                padding: 5
            },
            grid: { drawOnChartArea: false },
        },
        y: {
            ticks: {
                font: { size: 12 },
                padding: 0,
                offset: false,
                callback: (value: number | string) => `${value}%`
            },
            beginAtZero: true,
            max: 100,
        },
    },
};
