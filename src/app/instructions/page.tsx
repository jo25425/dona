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
import WhatsappIcon from '@mui/icons-material/WhatsApp';
import WhatsappInstructions from "@/components/WhatsappInstructions";
import FacebookInstructions from "@/components/FacebookInstructions";
import InstagramInstructions from "@/components/InstagramInstructions";
import ConsentModal from "@/components/ConsentModal";


export default function Instructions() {
    const a = useTranslations('actions');
    const t = useTranslations('instructions');

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
                    <Typography variant="h4">
                        {t('about.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t.rich('about.body_html')}
                    </Typography>
                </Box>
                <Box sx={{my: 4}}>
                    {/* WhatsApp */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <WhatsappIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("datasource.title-format", {datasource: "Whatsapp"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <WhatsappInstructions />
                        </AccordionDetails>
                    </Accordion>
                    {/* Facebook */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <FacebookIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("datasource.title-format", {datasource: "Facebook"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FacebookInstructions />
                        </AccordionDetails>
                    </Accordion>
                    {/* Instagram */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <InstagramIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("datasource.title-format", {datasource: "Instagram"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <InstagramInstructions />
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box>
                    <Typography variant="body1">
                        {t('continue.body')}
                    </Typography>
                    <Typography variant="h5" sx={{margin: 3}}>
                        {t('continue.buttons-header')}
                    </Typography>
                    <Stack spacing={2} direction="row" sx={{justifyContent: "center"}}>
                        <Button variant="contained" href="/">
                            {a('previous')}
                        </Button>
                        <ConsentModal />
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}