import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const AnonymizationSection: React.FC<{ data: string }> = ({ data }) => {
    return (
        <Box>
            <Typography variant="h6">Anonymized Data</Typography>
            <Typography variant="body2">{data.substring(0,100)}</Typography>
        </Box>
    );
};

export default AnonymizationSection;
