import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { propertyReferralsInfo } from "../../constants/index";

interface ProgressBarProps {
  title: string;
  percentage: number;
  color: string;
}

const ProgressBar = ({ title, percentage, color }: ProgressBarProps) => (
  <Box width="100%">
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography fontSize={14} fontWeight={500} color="#11142d"> {/* Decrease font size */}
        {title}
      </Typography>
      <Typography fontSize={14} fontWeight={500} color="#11142d"> {/* Decrease font size */}
        {percentage}%
      </Typography>
    </Stack>
    <Box
      mt={1} // Decrease margin top
      position="relative"
      width="100%"
      height="6px" // Decrease height
      borderRadius={1}
      bgcolor="#e4e8ef"
    >
      <Box
        width={`${percentage}%`}
        bgcolor={color}
        position="absolute"
        height="100%"
        borderRadius={1}
      />
    </Box>
  </Box>
);

const PropertyReferrals = () => {
  return (
    <Box
      p={2} // Decrease padding
      bgcolor="#fcfcfc"
      id="chart"
      minWidth={320} // Adjust minimum width for better responsiveness
      display="flex"
      flexDirection="column"
      borderRadius="15px"
    >
      <Typography fontSize={16} fontWeight={600} color="#11142d"> {/* Increase font size */}
        Property Referrals
      </Typography>

      <Stack my="16px" direction="column" gap={2}> {/* Decrease margin and gap */}
        {propertyReferralsInfo.map((bar) => (
          <ProgressBar key={bar.title} {...bar} />
        ))}
      </Stack>
    </Box>
  );
};

export default PropertyReferrals;
