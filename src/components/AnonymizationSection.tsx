import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Conversation} from "@models/processed";

const AnonymizationSection: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    return (
        <Box>
            <Typography variant="h6">conversation.id</Typography>
            {/*<Typography variant="body2">{data.substring(0,100)}</Typography>*/}
        </Box>
    );
};

export default AnonymizationSection;
