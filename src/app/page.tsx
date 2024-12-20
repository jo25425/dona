import {useTranslations} from 'next-intl';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function HomePage() {
    const a = useTranslations('actions');
    const t = useTranslations('landing');
    const t_donation = useTranslations('donation-info');

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
                <Box sx={{my: 4}}>
                    <Typography variant="h4" >
                        {t('what.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t('what.body1')}
                    </Typography>
                    <Typography variant="body1">
                        {t('what.body2')}
                    </Typography>
                </Box>
                <Box sx={{my: 4,
                         display: 'flex',
                         flexDirection: 'column',
                         justifyContent: 'center',
                         alignItems: 'center',
                     }}
                >
                    <Typography variant="h4" textAlign="center">
                        {t('why.title')}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Box>
                            <Image
                                src={t('why.col1.image-path')}
                                alt={t('why.col1.title')}
                                height={170}
                                width={310}
                                loading="lazy"
                                style={{margin: "1rem 0"}}
                            />
                            <Typography variant="h6">{t('why.col1.title')}</Typography>
                            <Typography>{t('why.col1.body')}</Typography>
                        </Box>
                        <Box>
                            <Image
                                src={"/images/stay-anonymous-illustration.jpg"}
                                alt={t('why.col2.title')}
                                height={170}
                                width={310}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                            <Typography variant="h6">{t('why.col2.title')}</Typography>
                            <Typography>
                                {t.rich('why.col2.body', {
                                    link: (txt) => <a href="/learn-more">{txt}</a>
                                })}
                            </Typography>
                        </Box>
                        <Box>
                            <Image
                                src={"/images/support-research-illustration.jpg"}
                                alt={t('why.col3.title')}
                                height={170}
                                width={310}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                            <Typography variant="h6">{t('why.col3.title')}</Typography>
                            <Typography>{t('why.col3.body')}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4" >
                        {t('how-to-participate.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t('how-to-participate.body')}
                    </Typography>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4" >
                        {t('how-to-cancel.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t('how-to-cancel.body')}
                    </Typography>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4" textAlign="center">
                        {t_donation('title')}
                    </Typography>
                    <Grid container spacing={2}
                          sx={{
                              justifyContent: 'center',
                              alignItems: 'center'
                        }}
                    >
                        <Grid size={6} sx={{textAlign: "left"}}>
                            <Image
                                src={t_donation('data-request.image')}
                                alt={t_donation('data-request.title')}
                                height={93}
                                width={300}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={'bold'}>{t_donation('data-request.title')}</Typography>
                            <Typography>{t_donation('data-request.body')}</Typography>
                        </Grid>
                        <Grid size={6} sx={{textAlign: "left"}}>
                            <Image
                                src={t_donation('anonymisation.image')}
                                alt={t_donation('anonymisation.title')}
                                height={70}
                                width={140}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={'bold'}>{t_donation('anonymisation.title')}</Typography>
                            <Typography>{t_donation('anonymisation.body')}</Typography>
                        </Grid>
                        <Grid size={6} sx={{textAlign: "left"}}>
                            <Image
                                src={t_donation('storage.image')}
                                alt={t_donation('storage.title')}
                                height={93}
                                width={300}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0", alignSelf: "left"}}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={'bold'}>{t_donation('storage.title')}</Typography>
                            <Typography>{t_donation('storage.body')}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="body2" sx={{
                        fontStyle: "italic",
                    }}>
                        {t.rich('contact.body')}
                    </Typography>
                </Box>
                <Box>
                    <Button variant="contained" href="/instructions">
                        {a('start')}
                    </Button>
                </Box>
            </Stack>
        </Container>
    );

}