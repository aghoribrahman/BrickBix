import Place from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import { PropertyCardProps } from "../../interfaces/property";

const PropertyCard = ({
  id,
  title,
  location,
  price,
  photo,
  propertyType,
}: PropertyCardProps) => {
  return (
    
    <Card
      component={Link}
      to={`/properties/show/${id}`}
      sx={{
        maxWidth: "330px",
        cursor: "pointer",
       textDecoration: 'none',
       backgroundColor: '#f2f2f2',
       borderRadius:'10px'
    }}
      elevation={0}
    >
      <CardMedia
        sx={{borderRadius:'10px'}}
        component="img"
        width="100%"
        height={210}
        image={photo}
        alt="card image"
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "10px",
          paddingX: "5px",
          
        }}
      >
        <Stack direction="column" gap={1}>
          <Typography sx={{ textDecoration: 'none' }} fontSize={16} marginLeft={"5px"} fontWeight={500} color="#11142d">
            {title}
          </Typography>
          <Stack direction="row" gap={0.5} alignItems="flex-start">
            <Place
              sx={{
                fontSize: 18,
                color: "#11142d",
                marginTop: 0.5,
                textDecoration: 'none'
              }}
            />
            <Typography sx={{ textDecoration: 'none' }} fontSize={14} color="#808191">
             Loacation: {location}
            </Typography>
          </Stack>
        </Stack>
        
        <Box
          px={1.5}
          py={0.5}
          borderRadius={1}
          bgcolor="#dadefa"
          height="fit-content"
        >
          
          <Typography fontSize={14} fontWeight={600} color="#475be8">
             ₹ {price}/-
          </Typography>
          <Typography fontSize={14} fontWeight={600}>
             {propertyType}
          </Typography>
        </Box>
      </CardContent>
    </Card>
   
  );
};

export default PropertyCard;
