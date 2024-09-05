import {useTranslations} from 'next-intl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Button} from "@mui/material";

export default function HomePage() {
    const t = useTranslations('landing');
    const t2 = useTranslations('learn-more');
    const t_donation = useTranslations('donation-info');

    return (
        <Container maxWidth="lg">
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >

                <Box my={4}>
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
                <Box my={4}
                     sx={{
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
                            <img
                                src={t('feedback_image')}
                                alt={t('why.col1.title')}
                                height={'170px'}
                                width={'310px'}
                                margin-bottom={'1rem'}
                                loading="lazy"
                            />
                            <Typography variant="h6">{t('why.col1.title')}</Typography>
                            <Typography>{t('why.col1.body')}</Typography>
                        </Box>
                        <Box>
                            <img
                                src='images/stay-anonymous-illustration.jpg'
                                alt={t('why.col2.title')}
                                height={'170px'}
                                margin-bottom={'1rem'}
                                loading="lazy"
                            />
                            <Typography variant="h6">{t('why.col2.title')}</Typography>
                            <Typography>
                                {t.rich('why.col2.body', {
                                    link: (txt) => <a href="/learn-more">{txt}</a>
                                })}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='images/support-research-illustration.jpg'
                                alt={t('why.col3.title')}
                                height={'170px'}
                                margin-bottom={'1rem'}
                                loading="lazy"
                            />
                            <Typography variant="h6">{t('why.col3.title')}</Typography>
                            <Typography>{t('why.col3.body')}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box my={4}>
                    <Typography variant="h4" >
                        {t2('how-to-participate.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t2('how-to-participate.body')}
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h4" >
                        {t2('how-to-cancel.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t2('how-to-cancel.body')}
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h4" textAlign="center">
                        {t_donation('title')}
                    </Typography>
                    <Grid container spacing={2}
                          sx={{
                              justifyContent: 'center',
                              alignItems: 'center'
                        }}
                    >
                        <Grid item xs={6}>
                            <img
                                src={t_donation('data-request.image')}
                                alt={t_donation('data-request.title')}
                                height={'120px'}
                                margin-bottom={'1rem'}
                                loading="lazy"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={'bold'}>{t_donation('data-request.title')}</Typography>
                            <Typography>{t_donation('data-request.body')}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <img
                                src={t_donation('anonymisation.image')}
                                alt={t_donation('anonymisation.title')}
                                height={'80px'}
                                margin-bottom={'1rem'}
                                loading="lazy"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={'bold'}>{t_donation('anonymisation.title')}</Typography>
                            <Typography>{t_donation('anonymisation.body')}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <img
                                src={t_donation('storage.image')}
                                alt={t_donation('storage.title')}
                                height={'120px'}
                                margin-bottom={'1rem'}
                                loading="lazy"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={'bold'}>{t_donation('storage.title')}</Typography>
                            <Typography>{t_donation('storage.body')}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box my={4}>
                    <Typography variant="body2" sx={{
                        fontStyle: "italic",
                    }}>
                        {t.rich('contact.body')}
                    </Typography>
                </Box>
                <Box my={4}>
                    <Button variant="contained">
                        {t('start')}
                    </Button>
                </Box>

            </Stack>
        </Container>
    );

}