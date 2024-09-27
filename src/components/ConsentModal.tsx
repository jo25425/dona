"use client";

import React from "react";
import {useTranslations} from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";


const modal_style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflow:'scroll',
    height:'96%',
    display:'block',
    bgcolor: 'background.paper',
    border: '1px solid dimgrey',
    borderRadius: 2,
    boxShadow: 30,
    p: 4
};

export default function Instructions() {
    const a = useTranslations('actions');
    const t = useTranslations('consent');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                {a('donate')}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                <Box sx={modal_style}>
                    <Box>
                        <Typography variant="h4"  sx={{my: 4}} id="modal-modal-title">
                            {t('title')}
                        </Typography>
                        {/* TODO: Add button to download PDF */}
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{my: 2}}>
                            {t('about.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('about.body1')}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {t('about.body2')}
                        </Typography>
                        <Typography variant="h5" sx={{my: 2}}>
                            {t('benefit.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t.rich('benefit.body', {
                                link: (txt) => <a target="_blank" href={t("benefit.link-url")}>{txt}</a>})
                            }
                        </Typography>
                        {/* TODO: Add "Collected data" section? */}
                        <Typography variant="h5" sx={{my: 2}}>
                            {t('voluntary.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('voluntary.body')}
                        </Typography>
                        <Typography variant="h5" sx={{my: 2}}>
                            {t('data-protection.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('data-protection.body')}
                        </Typography>
                        <Typography variant="body1" sx={{my: 1.5, mx: 3}}>
                            {t.rich('data-protection.contact', {
                                br: (_) => <br/>,
                                email: (address) => <a href={"mailto:" + address}>{address}</a>
                            })}
                        </Typography>
                        <Typography variant="h5" sx={{my: 2}}>
                            {t('data-purpose.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('data-purpose.body')}
                        </Typography>
                    </Box>
                    <Box sx={{mt: 4, textAlign: 'center'}}>
                        <Typography variant="body1" sx={{my:2, fontWeight: 'bold'}}>
                            {t('confirmation')}
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{justifyContent: 'center'}}>
                            <Button variant="contained" onClick={handleClose}>
                                {a('close')}
                            </Button>
                            <Button variant="contained">
                                {a('agree')}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}