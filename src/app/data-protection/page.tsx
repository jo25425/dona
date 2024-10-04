import {useTranslations} from 'next-intl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


export default function LearnMore() {
    const protection = useTranslations('data-protection');
    const storage = useTranslations('data-storage');
    const consent = useTranslations('consent');

    return (
        <Container maxWidth="md">
            <Box>
                <Typography variant="h4">
                    {protection('title')}
                </Typography>

                <Typography variant="h5" sx={{my: 2, fontWeight: 800}}>{protection('technical-details.title')}</Typography>

                <Typography variant="body1"  sx={{my: 2}}>{protection('technical-details.body1')}</Typography>
                <Typography variant="body1" sx={{my: 2}}>{protection('technical-details.body2')}</Typography>
                <Typography variant="body1" sx={{my: 2}}>{protection('technical-details.body3')}</Typography>
                <Typography variant="body1" sx={{my: 2}}>{protection('technical-details.body4')}</Typography>

                <Typography variant="h5" sx={{my: 2, fontWeight: 800}}>{protection('participation.title')}</Typography>

                <Typography variant="h5" sx={{my: 2}}>{storage('title')}</Typography>
                <Typography variant="body1"  sx={{my: 2}}>{storage.rich('body1')}</Typography>
                <Typography variant="body1" sx={{my: 2}}>
                    {storage.rich('body2', {
                        link: (txt) => <a target="_blank" href={storage('url-limesurvey')}>{txt}</a>
                    })}
                </Typography>

                <Typography variant="h5" sx={{my: 2}}>{consent('voluntary.title')}</Typography>
                <Typography variant="body1">{consent('voluntary.body')}</Typography>

                <Typography variant="h5" sx={{my: 2}}> {consent('data-protection.title')} </Typography>
                <Typography variant="body1">{consent('data-protection.body')}</Typography>
                <Typography variant="body1" sx={{my: 1.5, mx: 3}}>
                    {consent.rich('data-protection.contact')}
                </Typography>

                <Typography variant="h5" sx={{my: 2}}>
                    {protection('participation.usage.title')}
                </Typography>
                <Typography variant="body1">
                    {protection('participation.usage.body')}
                </Typography>
            </Box>
        </Container>
    );

}