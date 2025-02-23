// StyledTypography.tsx
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// Unified SectionTitle with responsive margin (lighter, not bold)
export const SectionTitle = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    fontWeight: 500, // Less bold for better contrast
    fontSize: "1.25rem",
    [theme.breakpoints.up("md")]: {
        margin: theme.spacing(3, 0),
        fontSize: "1.5rem",
    },
}));

// MainTitle for key sections (larger and bolder for contrast)
export const MainTitle = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(3, 0),
    fontWeight: 800, // Stands out more
    fontSize: "1.5rem",
    [theme.breakpoints.up("md")]: {
        fontSize: "1.75rem",
    },
}));

// Styled component for contact details block
export const ContactBlock = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(1.5, 0),
    paddingLeft: theme.spacing(3),
    borderLeft: `2px solid ${theme.palette.text.secondary}`,
    fontStyle: "italic",
    [theme.breakpoints.up("md")]: {
        paddingLeft: theme.spacing(4),
    },
}));

// Styled component for body text with consistent spacing
export const BodyText = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

// Styled component for rich text translations (ensures spacing & prevents nesting issues)
export const RichText = styled("div")(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "& p": {
        marginBottom: theme.spacing(1), // Ensures spacing between paragraphs
    },
}));
