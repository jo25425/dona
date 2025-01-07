import React from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {toPng, toSvg} from "html-to-image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

interface DownloadButtonsProps {
    chartId: string;
    fileNamePrefix: string;
    currentLabel?: string;
    labelToShowId?: string;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({
    chartId,
    fileNamePrefix,
    currentLabel
}) => {
    const exportOptions = {
        backgroundColor: "#ffffff",
        padding: 20,
        // Exclude elements with the "download-buttons" class from the chart
        filter: (element: HTMLElement) => !element.classList?.contains("download-buttons")
    };

    const handleDownload = async (format: "png" | "svg") => {
        const chartElement = document.getElementById(chartId);
        if (!chartElement) return;

        try {
            const dataUrl =
                format === "png"
                    ? await toPng(chartElement, exportOptions)
                    : await toSvg(chartElement, exportOptions);
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = currentLabel
                ? `${fileNamePrefix}-${currentLabel}.${format}`
                : `${fileNamePrefix}.${format}`;
            link.click();
        } catch (error) {
            console.error("Error exporting chart:", error);
        }
    };

    return (
        <Box gap={1}
            sx={{ opacity: 0.25, transition: "opacity 0.3s", "&:hover": { opacity: 1 } }}
        >
            <div className="download-buttons">
                <IconButton
                    onClick={() => handleDownload("png")}
                    size="small"
                    sx={{ position: "relative", "&:hover::after": { content: '"PNG"', position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "gray" } }}
                >
                    <PhotoCameraIcon fontSize="small" />
                </IconButton>
                <IconButton
                    onClick={() => handleDownload("svg")}
                    size="small"
                    sx={{ position: "relative", "&:hover::after": { content: '"SVG"', position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "gray" } }}
                >
                    <PhotoCameraIcon fontSize="small" />
                </IconButton>
            </div>
        </Box>
    );
};

export default DownloadButtons;
