import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ColorScaleProps {
    colors: string[];
    labels: string[];
}

const ColorScale: React.FC<ColorScaleProps> = ({ colors, labels }) => {
    return (
        // NB: Percentages below are arbitrarily picked to account for the space taken by the labels below the charts
        <Box my="auto" sx={{ height: "87.5%", width: "15%", display: "flex", flexDirection: "row" }}>
            <Box
                sx={{
                    width: "40%",
                    background: `linear-gradient(to bottom, ${colors.join(", ")})`,
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "darkgrey"
                }}
            />
            <Box
                pl={3}
                my={3}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "10px",
                }}
            >
                {labels.map((label, index) => (
                    <Typography
                        key={index}
                        variant="caption"
                        p={0}
                        mx={-3}
                        sx={{ lineHeight: 1, transform: "rotate(20deg)" }}
                    >
                        {label}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default ColorScale;
