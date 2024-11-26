import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {useTranslations} from "next-intl";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Typography from "@mui/material/Typography";
import {NullableRange} from "@services/rangeFiltering";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface DateRangePickerProps {
    calculatedRange: NullableRange;
    setSelectedRange: (newRange: NullableRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({calculatedRange, setSelectedRange}) => {
    const t = useTranslations('donation.select-date');
    const [startDate, setStartDate] = useState<Dayjs | null>(calculatedRange[0] ? dayjs(calculatedRange[0]) : null);
    const [endDate, setEndDate] = useState<Dayjs | null>(calculatedRange[1] ? dayjs(calculatedRange[1]) : null);

    const handleStartDateChange = (date: Dayjs | null) => {

        console.log("handleStartDateChange");

        setStartDate(date);
        if (date) {
            // Adjust end date if necessary
            if (endDate && date && date.isAfter(endDate)) setEndDate(null);
            // Feedback to parent
            setSelectedRange([date.toDate(), endDate ? endDate.toDate() : null]);
        }
    };

    const handleEndDateChange = (date: Dayjs | null) => {
        setEndDate(date);
        if (date) {
            // Adjust start date if necessary
            if (startDate && date.isBefore(startDate)) setStartDate(date);
            // Feedback to parent
            setSelectedRange([startDate ? startDate.toDate() : null, date.toDate()]);
        }
    };

    const handleReset = () => {
        setStartDate(calculatedRange[0] ? dayjs(calculatedRange[0]) : null);
        setEndDate(calculatedRange[1] ? dayjs(calculatedRange[1]) : null);
        setSelectedRange(calculatedRange);
    };

    return (
        <Box>
            <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                {t('choose-period')}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t("start")}
                            value={startDate}
                            onChange={handleStartDateChange}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t("end")}
                            value={endDate}
                            onChange={handleEndDateChange}
                            format="DD/MM/YYYY"
                            minDate={startDate || undefined}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid>
                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        sx={{ height: "100%" }}
                    >
                        {t("reset")}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DateRangePicker;
