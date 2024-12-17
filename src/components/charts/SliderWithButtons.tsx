import React, { useRef } from "react";
import { Box, Button, Slider } from "@mui/material";
import { useTranslations } from "next-intl";

interface SliderWithButtonsProps {
    value: number;
    marks: { value: number; label: string }[];
    setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
}

const SliderWithButtons: React.FC<SliderWithButtonsProps> = ({
                                                                 value,
                                                                 marks,
                                                                 setCurrentFrame
                                                             }) => {
    const labels = useTranslations("feedback.chartLabels");
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    const handleStartAnimation = () => {
        if (animationRef.current) clearInterval(animationRef.current);
        setCurrentFrame(0);
        animationRef.current = setInterval(() => {
            setCurrentFrame((prevFrame) => {
                if (prevFrame < marks.length - 1) {
                    return prevFrame + 1;
                } else {
                    if (animationRef.current) clearInterval(animationRef.current);
                    return prevFrame;
                }
            });
        }, 500);
    };

    const handleReset = () => {
        if (animationRef.current) clearInterval(animationRef.current);
        setCurrentFrame(0);
    };

    return (
        <Box display="flex" alignItems="center" px={4} mb={3}>
            <Box display="flex" gap={2} mr={5}>
                <Button variant="contained" color="primary" onClick={handleStartAnimation}>
                    {labels("start")}
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                    {labels("resetView")}
                </Button>
            </Box>
            <Box flexGrow={1}>
                <Slider
                    value={value}
                    onChange={(_, newValue) => setCurrentFrame(newValue as number)}
                    min={0}
                    max={marks.length - 1}
                    step={1}
                    marks={marks}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => marks[value]?.label}
                />
            </Box>
        </Box>
    );
};

export default SliderWithButtons;
