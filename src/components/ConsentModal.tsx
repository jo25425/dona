"use client";

import React, {useEffect, useState} from "react";
import {useLocale} from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {generateExternalDonorId, useDonation} from "@/context/DonationContext";
import {IdInputMethod} from "@models/settings";
import {useRichTranslations} from "@/hooks/useRichTranslations";
import {BlockTitle, ContactBlock} from "@/styles/StyledTypography";
import FullSizeModal from "@components/FullSizeModal";

const idInputMethod = process.env.NEXT_PUBLIC_DONOR_ID_INPUT_METHOD as IdInputMethod;
const isDonorSurveyEnabled = process.env.NEXT_PUBLIC_DONOR_SURVEY_ENABLED === "true";
const donorSurveyLink = process.env.NEXT_PUBLIC_DONOR_SURVEY_LINK;

export default function ConsentModal() {
    const actions = useRichTranslations("actions");
    const consent = useRichTranslations("consent");
    const storage = useRichTranslations("data-storage");
    const donor = useRichTranslations("donor-id");
    const { externalDonorId, setExternalDonorId } = useDonation();
    const locale = useLocale();

    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [manualId, setManualId] = useState("");
    const [generatedId, setGeneratedId] = useState("");

    useEffect(() => {
        if (idInputMethod === IdInputMethod.AUTOMATED || idInputMethod === IdInputMethod.SHOW_ID) {
            const newId = generateExternalDonorId();
            setGeneratedId(newId);
            setExternalDonorId(newId);
        }
    }, []);

    const handleAgree = () => {
        if (idInputMethod === IdInputMethod.MANUALLY && manualId.trim()) {
            setExternalDonorId(manualId);
        }

        window.location.href =
            isDonorSurveyEnabled && donorSurveyLink
                ? `${donorSurveyLink}?UID=${externalDonorId}&lang=${locale}`
                : "/data-donation";
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDialogClose = () => setDialogOpen(false);

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                {actions.t("donate")}
            </Button>
            <FullSizeModal
                open={open}
                onClose={handleClose}
                onAgree={idInputMethod === IdInputMethod.AUTOMATED ? handleAgree : () => setDialogOpen(true)}
                ariaLabel="Consent Modal"
            >
                <Box sx={{ display: "flex" }}>
                    <Typography variant="h4" sx={{ my: 4, flexGrow: 1 }} id="modal-modal-title">
                        {consent.t("title")}
                    </Typography>
                    <Box sx={{ alignSelf: "center" }}>
                        <Button variant="contained" target="_blank" href={consent.t("pdf.file")} size="small">
                            {consent.t("pdf.button")}
                        </Button>
                    </Box>
                </Box>

                <BlockTitle>{consent.t("about.title")}</BlockTitle>
                <Typography>{consent.t("about.body1")}</Typography>
                <Typography sx={{ mt: 1 }}>{consent.t("about.body2")}</Typography>

                <BlockTitle>{consent.t("benefit.title")}</BlockTitle>
                <Typography>{consent.rich("benefit.body", { link: "cadooz-benefit" })}</Typography>

                <BlockTitle>{storage.t("title")}</BlockTitle>
                <Typography>{storage.rich("body1")}</Typography>
                <Typography sx={{ mt: 1 }}>{storage.rich("body2", { link: "limesurvey" })}</Typography>

                <BlockTitle>{consent.t("voluntary.title")}</BlockTitle>
                <Typography>{consent.t("voluntary.body")}</Typography>

                <BlockTitle>{consent.t("data-protection.title")}</BlockTitle>
                <Typography>{consent.t("data-protection.body")}</Typography>

                <ContactBlock>{consent.rich("data-protection.contact")}</ContactBlock>

                <BlockTitle>{consent.t("data-purpose.title")}</BlockTitle>
                <Typography>{consent.t("data-purpose.body")}</Typography>

                <Typography variant="body1" sx={{ mt: 4, mb: 2, fontWeight: "bold", textAlign: "center" }}>
                    {consent.t("confirmation")}
                </Typography>
            </FullSizeModal>

            {idInputMethod !== IdInputMethod.AUTOMATED && (
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>{idInputMethod === IdInputMethod.SHOW_ID ? donor.t("remember") : donor.t("enter")}</DialogTitle>
                    <DialogContent>
                        {idInputMethod === IdInputMethod.SHOW_ID && (
                            <Typography variant="body1" sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}>
                                {generatedId}
                            </Typography>
                        )}
                        {idInputMethod === IdInputMethod.MANUALLY && (
                            <TextField
                                label={donor.t("your-id")}
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                fullWidth
                                sx={{ my: 1 }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ mr: 2, mb: 2 }}>
                        <Stack spacing={2} direction="row" sx={{ justifyContent: "center" }}>
                            <Box>
                                <Button onClick={handleDialogClose}>{actions.t("close")}</Button>
                            </Box>
                            <Box>
                                <Button onClick={handleAgree} variant="contained">
                                    {actions.t("next")}
                                </Button>
                            </Box>
                        </Stack>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}
