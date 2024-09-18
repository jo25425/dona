import {useTranslations} from 'next-intl';
import Image from "next/image";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
                <Box sx={{my: 4}}>
                    <Typography variant="h4">
                        {t('about.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t.rich('about.body_html')}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h5" sx={{margin: 2}}>
                        {t('buttons-header')}
                    </Typography>
                    <Stack spacing={2} direction="row" sx={{justifyContent: "center"}}>
                        <Button variant="contained" href={"/"}>
                            {a('previous')}
                        </Button>
                        <Button variant="contained">
                            {a('donate')}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );

}