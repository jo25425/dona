import {useTranslations} from 'next-intl';
import Image from "next/image";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function LearnMore() {
    const a = useTranslations('actions');
    const t = useTranslations('learn-more');

    return (
        <Container maxWidth="md">
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Box sx={{my: 4}}>
                    <Typography variant="h4">
                        {t('data-used.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t.rich('data-used.body1')}
                    </Typography>
                    <Typography variant="body1">
                        {t.rich('data-used.body2', {
                            link: (txt) => <a target="_blank"
                                              href="https://www.limesurvey.org/de/hilfe/faq/39-datenschutz%20und%20datenschutzpolitik">{txt}</a>
                        })}
                        {/* TODO: Make link dynamic (language-dependant) */}
                    </Typography>
                </Box>
                <Box>
                    <Paper elevation={2} sx={{py: 1, mb: 3}}>
                        <figure>
                            <Image
                                src={t('images.text-messages.image-path')}
                                alt={t('images.text-messages.caption')}
                                width={0}
                                height={0}
                                style={{width: "100%", height: "auto"}}
                                loading="lazy"
                            />
                            <figcaption className="font-weight-bold font-italic figure-caption">
                                <Typography variant="caption">{t('images.text-messages.caption')}</Typography>
                            </figcaption>
                        </figure>
                    </Paper>
                    <Paper elevation={2} sx={{py: 1, mb: 3}}>
                        <figure>
                            <Image
                                src={t('images.voice-messages.image-path')}
                                alt={t('images.voice-messages.caption')}
                                width={0}
                                height={0}
                                style={{width: "100%", height: "auto"}}
                                loading="lazy"
                            />
                            <figcaption className="font-weight-bold font-italic figure-caption">
                                <Typography variant="caption">{t('images.voice-messages.caption')}</Typography>
                            </figcaption>
                        </figure>
                    </Paper>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4">
                        {t('data-handling.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t('data-handling.body1')}
                    </Typography>
                    <Typography variant="body1">
                        {t('data-handling.body2')}
                    </Typography>
                </Box>
                <Box>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" href={"/"}>
                            {a('previous')}
                        </Button>
                        <Button variant="contained">
                            {a('start')}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );

}