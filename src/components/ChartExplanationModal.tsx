import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface ChartExplanationModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    contentHtml: string;
    imageSrc?: string;
}

const ChartExplanationModal = ({ open, onClose, title, contentHtml, imageSrc }: ChartExplanationModalProps) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    maxWidth: 400,
                    width: "80%",
                }}
            >
                <Typography variant="h6" mb={2}>
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
                {imageSrc && (
                    <Box
                        component="img"
                        src={imageSrc}
                        alt="Chart explanation"
                        sx={{ maxWidth: "100%", mb: 2 }}
                    />
                )}
                <Button onClick={onClose} variant="contained" fullWidth>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ChartExplanationModal;
