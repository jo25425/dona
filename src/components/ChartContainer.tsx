import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ChartContainer() {
    return (
        <Box
            sx={{
                border: '1px dashed grey',
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant="body2">Chart Placeholder</Typography>
        </Box>
    );
}
