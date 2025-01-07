import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useTranslations} from "next-intl";

interface ChartExplanationModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    contentHtml: string;
    imageSrc?: string;
}

const ChartExplanationModal = ({ open, onClose, title, contentHtml, imageSrc }: ChartExplanationModalProps) => {
    const actions = useTranslations("actions");
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                className={"dona-modal"}
                sx={{
                    position: "absolute",
                    top: '2%',
                    bottom: '2%',
                    left: '50%',
                    width: '90%',
                    maxWidth: '900px',
                    transform: 'translate(-50%, 0%)',
                    overflow:'scroll',
                    display:'block',
                    bgcolor: 'background.paper',
                    border: '1px solid dimgrey',
                    borderRadius: 2,
                    boxShadow: 30,
                    p: 4
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
                <Box display="flex" justifyContent="right">
                    <Button onClick={onClose} variant="contained">
                        {actions("close")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ChartExplanationModal;
