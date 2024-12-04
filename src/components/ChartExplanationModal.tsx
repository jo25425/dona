import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from '@mui/material/Typography';

export default function ChartExplanationModal({
                                                  open,
                                                  onClose,
                                                  explanation,
                                              }: {
    open: boolean;
    onClose: () => void;
    explanation: string;
}) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    p: 3,
                    boxShadow: 24,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Chart Explanation
                </Typography>
                <Typography variant="body2">{explanation}</Typography>
                <Button onClick={onClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}
