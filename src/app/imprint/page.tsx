import {useTranslations} from 'next-intl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


export default function LearnMore() {
    const imprint = useTranslations('imprint');

    return (
        <Container maxWidth="md">
            <Box>
                <Typography variant="h4">
                    {imprint('title')}
                </Typography>

                <Typography component="div" sx={{my: 1.5}}>
                    {imprint.rich('imprint', {
                        link: (txt) => <a target="_blank" href="https://www.uni-bielefeld.de">{txt}</a>
                    })}
                </Typography>

                <Typography variant="h5" sx={{my: 2}}>{imprint('rsa.title')}</Typography>
                <Typography component="div">{imprint.rich('rsa.body')}</Typography>

                <Typography variant="h5" sx={{my: 2}}>{imprint('responsible-dona.title')}</Typography>
                <Typography component="div">
                    {imprint.rich('responsible-dona.body', {
                        link: (txt) => <a target="_blank" href="https://www.uni-bielefeld.de/fakultaeten/technische-fakultaet/arbeitsgruppen/multimodal-behavior-processing/">{txt}</a>
                    })}
                </Typography>

                <Typography variant="h5" sx={{my: 2}}>{imprint('responsible-central-website.title')}</Typography>
                <Typography component="div">{imprint.rich('responsible-central-website.body')}</Typography>

                <Typography variant="h5" sx={{my: 2}}>{imprint('liability-disclaimer.title')}</Typography>
                <Typography component="div">{imprint.rich('liability-disclaimer.body')}</Typography>

                <Typography variant="h5" sx={{my: 2}}>{imprint('copyright.title')}</Typography>
                <Typography component="div">{imprint.rich('copyright.body')}</Typography>

                <Typography variant="h5" sx={{my: 2}}>{imprint('photo-credits.title')}</Typography>
                <Typography component="div">{imprint.rich('photo-credits.body')}</Typography>
            </Box>
        </Container>
    );

}