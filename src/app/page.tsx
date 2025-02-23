import {useTranslations} from 'next-intl';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useRichTranslations} from "@/hooks/useRichTranslations";

export default function HomePage() {
    const a = useTranslations('actions');
    const landing = useRichTranslations('landing');
    const donation = useTranslations('donation-info');

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
                        {landing.t('what.title')}
                    </Typography>
                    <Typography variant="body1">
                        {landing.t('what.body1')}
                    </Typography>
                    <Typography variant="body1">
                        {landing.t('what.body2')}
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
                        {landing.t('why.title')}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Box>
                            <Image
                                src={landing.t('why.col1.image-path')}
                                alt={landing.t('why.col1.title')}
                                height={170}
                                width={310}
                                loading="lazy"
                                style={{margin: "1rem 0"}}
                            />
                            <Typography variant="h6">{landing.t('why.col1.title')}</Typography>
                            <Typography>{landing.t('why.col1.body')}</Typography>
                        </Box>
                        <Box>
                            <Image
                                src={"/images/stay-anonymous-illustration.jpg"}
                                alt={landing.t('why.col2.title')}
                                height={170}
                                width={310}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                            <Typography variant="h6">{landing.t('why.col2.title')}</Typography>
                            <Typography>
                                {landing.rich('why.col2.body', {link: "learn-more"})}
                            </Typography>
                        </Box>
                        <Box>
                            <Image
                                src={"/images/support-research-illustration.jpg"}
                                alt={landing.t('why.col3.title')}
                                height={170}
                                width={310}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                            <Typography variant="h6">{landing.t('why.col3.title')}</Typography>
                            <Typography>{landing.t('why.col3.body')}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4" >
                        {landing.t('how-to-participate.title')}
                    </Typography>
                    <Typography variant="body1">
                        {landing.t('how-to-participate.body')}
                    </Typography>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4" >
                        {landing.t('how-to-cancel.title')}
                    </Typography>
                    <Typography variant="body1">
                        {landing.t('how-to-cancel.body')}
                    </Typography>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="h4" textAlign="center">
                        {donation('title')}
                    </Typography>
                    <Grid container spacing={2}
                          sx={{
                              justifyContent: 'center',
                              alignItems: 'center'
                        }}
                    >
                        <Grid size={6} sx={{textAlign: "left"}}>
                            <Image
                                src={donation('data-request.image')}
                                alt={donation('data-request.title')}
                                height={93}
                                width={300}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={'bold'}>{donation('data-request.title')}</Typography>
                            <Typography>{donation('data-request.body')}</Typography>
                        </Grid>
                        <Grid size={6} sx={{textAlign: "left"}}>
                            <Image
                                src={donation('anonymisation.image')}
                                alt={donation('anonymisation.title')}
                                height={70}
                                width={140}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0"}}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={'bold'}>{donation('anonymisation.title')}</Typography>
                            <Typography>{donation('anonymisation.body')}</Typography>
                        </Grid>
                        <Grid size={6} sx={{textAlign: "left"}}>
                            <Image
                                src={donation('storage.image')}
                                alt={donation('storage.title')}
                                height={93}
                                width={300}
                                loading="lazy"
                                style={{width: "auto", margin: "1rem 0", alignSelf: "left"}}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography fontWeight={'bold'}>{donation('storage.title')}</Typography>
                            <Typography>{donation('storage.body')}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{my: 4}}>
                    <Typography variant="body2" sx={{
                        fontStyle: "italic",
                    }}>
                        {landing.rich('contact.body')}
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