import React, {useRef} from "react";
import {Box, Slider, useMediaQuery, useTheme} from "@mui/material";
import {useTranslations} from "next-intl";
import {ChartControlButton} from "@/styles/StyledButtons";
import { styled } from '@mui/material/styles';

const RotatedLabelsSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-markLabel': {
        transform: 'translateX(-60%) rotate(-30deg)',
        transformOrigin: 'center center',
        marginTop: '1px',
        marginBottom: '100px',
        whiteSpace: 'nowrap',
        fontSize: '0.75rem',
    },
}));

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const maxTicks = isMobile ? 6 : 10; // Example values for max ticks

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
        <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            mx="auto"
            width="95%"
            gap={{ xs: 0, sm: 3 }}
            mt={-2}
            mb={{ xs: 2, sm: 0 }}
        >
            {/* Slider up to 60% width */}
            <Box flexGrow={1} width={{ xs: "100%", sm: "60%" }} minWidth="150px" px={2} mb={1}>
                <RotatedLabelsSlider
                    value={value}
                    onChange={(_, newValue) => setCurrentFrame(newValue as number)}
                    min={0}
                    max={Math.min(marks.length - 1, maxTicks - 1)}
                    step={1}
                    marks={marks.slice(0, maxTicks)}
                    valueLabelDisplay="auto"
                />
            </Box>

            {/* Buttons, side by side */}
            <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                <ChartControlButton variant="outlined" onClick={handleStartAnimation}>
                    {labels("start")}
                </ChartControlButton>
                <ChartControlButton variant="outlined" onClick={handleReset}>
                    {labels("resetView")}
                </ChartControlButton>
            </Box>
        </Box>
    );
};

export default SliderWithButtons;