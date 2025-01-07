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
};

export default function Instructions() {
    const a = useTranslations('actions');
    const consent = useTranslations('consent');
    const storage = useTranslations('data-storage');
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
                    <Box sx={{display: 'flex'}}>
                        <Typography variant="h4"  sx={{my: 4, flexGrow: 1}} id="modal-modal-title">
                            {consent('title')}
                        </Typography>
                        <Box sx={{alignSelf: "center"}}>
                            <Button variant="contained" target="_blank" href={consent("pdf.file")} size={"small"}>
                                {consent('pdf.button')}
                            </Button>
                        </Box>
                    </Box>
                    <Box>

                        <Typography variant="h5" sx={{my: 2}}>
                            {consent('about.title')}
                        </Typography>
                        <Typography variant="body1">
                            {consent('about.body1')}
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            {consent('about.body2')}
                        </Typography>

                        <Typography variant="h5" sx={{my: 2}}>
                            {consent('benefit.title')}
                        </Typography>
                        <Typography variant="body1">
                            {consent.rich('benefit.body', {
                                link: (txt) => <a target="_blank" href={consent("benefit.link-url")}>{txt}</a>
                            })
                            }
                        </Typography>

                        <Typography variant="h5" sx={{my: 2}}>{storage('title')}</Typography>
                        <Typography variant="body1"  sx={{my: 2}}>
                            {storage.rich('body1', {
                                em: (content) => <em>{content}</em>
                            })}
                        </Typography>
                        <Typography variant="body1" sx={{my: 2}}>
                            {storage.rich('body2', {
                                em: (content) => <em>{content}</em>,
                                link: (txt) => <a target="_blank" href={storage('url-limesurvey')}>{txt}</a>
                            })}
                        </Typography>

                        <Typography variant="h5" sx={{my: 2}}>
                            {consent('voluntary.title')}
                        </Typography>
                        <Typography variant="body1">
                            {consent('voluntary.body')}
                        </Typography>

                        <Typography variant="h5" sx={{my: 2}}>
                            {consent('data-protection.title')}
                        </Typography>
                        <Typography variant="body1">
                            {consent('data-protection.body')}
                        </Typography>
                        <Typography variant="body1" sx={{my: 1.5, mx: 3}}>
                            {consent.rich('data-protection.contact', {
                                br: (_) => <br/>,
                                email: (address) => <a href={"mailto:" + address}>{address}</a>
                            })}
                        </Typography>

                        <Typography variant="h5" sx={{my: 2}}>
                            {consent('data-purpose.title')}
                        </Typography>
                        <Typography variant="body1">
                            {consent('data-purpose.body')}
                        </Typography>
                    </Box>
                    <Box sx={{mt: 4, textAlign: 'center'}}>
                        <Typography variant="body1" sx={{my: 2, fontWeight: 'bold'}}>
                            {consent('confirmation')}
                        </Typography>
                        <Stack spacing={2} direction="row" sx={{justifyContent: 'center'}}>
                            <Button variant="contained" onClick={handleClose}>
                                {a('close')}
                            </Button>
                            <Button variant="contained" href="/data-donation">
                                {a('agree')}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}