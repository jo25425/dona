import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



interface ChartContainerProps {
    type: string;
    data: any;
}

export default function ChartContainer({ type, data}: ChartContainerProps) {
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
            <Typography variant="body2">Placeholder for {type} chart</Typography>
        </Box>
    );
}
