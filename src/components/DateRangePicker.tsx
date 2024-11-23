import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {useTranslations} from "next-intl";
import Typography from "@mui/material/Typography";

interface DateRangePickerProps {
    calculatedRange: [Date | null, Date | null];
    setSelectedRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({calculatedRange, setSelectedRange}) => {
    const t = useTranslations('donation.select-date');
    const [startDate, setStartDate] = useState<Dayjs | null>(calculatedRange[0] ? dayjs(calculatedRange[0]) : null);
    const [endDate, setEndDate] = useState<Dayjs | null>(calculatedRange[1] ? dayjs(calculatedRange[1]) : null);

    const handleStartDateChange = (date: Dayjs | null) => {
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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                {t('choose-period')}
            </Typography>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <DatePicker
                    label={t("start")}
                    value={startDate}
                    onChange={handleStartDateChange}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                    label={t("end")}
                    value={endDate}
                    onChange={handleEndDateChange}
                    format="DD/MM/YYYY"
                    minDate={startDate || undefined}
                    slotProps={{ textField: { size: 'small' } }}
                />
            </div>
        </LocalizationProvider>
    );
};

export default DateRangePicker;
