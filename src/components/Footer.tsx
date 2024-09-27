import {useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Footer() {
    const l = useTranslations("links")
    const project_number = useTranslations("footer")("project-number")

    return (
        <Box sx={{flexShrink: 1, mt: 10}}>
            <Toolbar>
                <Stack spacing={2} direction="row" sx={{flexGrow: 1}}>
                    <Button variant="contained" href={l("report-problem-url")}>
                        {l("report-problem")}
                    </Button>
                    <Button href="/data-protection">
                        {l("data-protection")}
                    </Button>
                    <Button href="/imprint">
                        {l("imprint")}
                    </Button>
                </Stack>
                <Stack spacing={2} direction="row">
                    <Typography
                        variant="caption"
                        sx={{alignSelf: "center", pr: 2}}
                    >
                        {project_number}
                    </Typography>
                    <Link href="https://www.bmbf.de/" target="_blank">
                        <Image
                            src="images/BMBF_logo.svg"
                            alt="Bundesministerium für Bildung und Forschung (BMBF) logo"
                            width={0}
                            height={60}
                            style={{width: "auto"}}
                        />
                    </Link>
                    <Link href="https://www.hpi.de" target="_blank">
                        <Image
                            src="images/HPI_logo.svg"
                            alt="Hasso Plattner Institut (HPI) logo"
                            width={0}
                            height={60}
                            style={{width: "auto"}}
                        />
                    </Link>
                    <Link href="https://www.data4life.care/" target="_blank">
                        <Image
                            src="images/data4life-blueLogo.svg"
                            alt="Data 4 Life logo"
                            width={0}
                            height={60}
                            style={{width: "auto"}}
                        />
                    </Link>
                </Stack>
            </Toolbar>
        </Box>
    );
}