import {useTranslations} from 'next-intl';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsappIcon from '@mui/icons-material/Whatsapp';
import TextField from "@mui/material/TextField";


export default function DataDonation() {
    const a = useTranslations('actions');
    const t = useTranslations('donation');

    const MultiFileSelect = () => (
        <Box>
            <Typography variant="body1" sx={{mb: 1, fontWeight: "bold"}}>
                {t('select-data.select-header')}
            </Typography>
            {/* TODO: Make input labels language-specific */}
            <TextField fullWidth type={"file"} slotProps={{
                input: { inputProps: { accept: ".txt,.zip", multiple: true }}
            }}/>
        </Box>
    );

    return (
        <Container maxWidth="md" sx={{flexGrow: 1}}>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{my: 2}}>
                        {t('select-data.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t('select-data.body1')}
                    </Typography>
                    <br/>
                    <Typography variant="body1">
                        {t.rich('select-data.body2')}
                    </Typography>
                </Box>
                <Box sx={{my: 4, minWidth: "80%", textAlign: 'left'}}>
                    {/* WhatsApp */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <WhatsappIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("select-data.datasource.title-format", {datasource: "Whatsapp"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect />
                        </AccordionDetails>
                    </Accordion>
                    {/* Facebook */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <FacebookIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("select-data.datasource.title-format", {datasource: "Facebook"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect />
                        </AccordionDetails>
                    </Accordion>
                    {/* Instagram */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <InstagramIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("select-data.datasource.title-format", {datasource: "Instagram"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect />
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box>
                    <Stack spacing={2} direction="row" sx={{justifyContent: "center"}}>
                        <Button variant="contained" href="/instructions">
                            {a('previous')}
                        </Button>
                        <Button variant="contained">
                            {a('submit')}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}