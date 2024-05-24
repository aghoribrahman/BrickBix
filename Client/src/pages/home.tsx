import { useList } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import {
  useGetIdentity,
  useActiveAuthProvider,
} from "@refinedev/core";
import BrickBixImage from '../assets/brick bix image.jpg';
import  PieChart  from '../components/charts/PieChart';
import  PropertyReferrals  from '../components/charts/PropertyReferrals';
import  TotalRevenue  from '../components/charts/TotalRevenue';
import PropertyCard from "../components/common/PropertyCard";



const Home = () => {
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
        try {
            const response = await fetch("https://refine-dashboard-3gx3.onrender.com/api/v1/properties");
            const responseRequirement = await fetch("https://refine-dashboard-3gx3.onrender.com/api/v1/requirement/five");
            if (!response.ok || !responseRequirement.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data = await response.json();
            const dataRequirement = await responseRequirement.json()
            setMyProperties(data);
            setRequirements(dataRequirement.requirements)
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    fetchProperties();
}, []);
    
const commercialProperties = myProperties.filter(property => property.propertyType === 'Commercial');

const apartmentProperties = myProperties.filter(property => property.propertyType === 'apartment');


const apartmentPropertiesCount = apartmentProperties.length;

const commercialPropertiesCount = commercialProperties.length;



  return (
    <Box>
      <Typography sx={{margin:'10px'}} fontSize={15} fontWeight={700} color="#11142D">
        {user?.name && (
          <Typography style={{ fontWeight: "bold", fontSize: '15px' }} color="textPrimary" variant="subtitle2" data-testid="header-user-name">
            {user?.name} 
          </Typography>
        )}
        
      </Typography>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#F6F5F2"
        display="flex"
        justifyContent="center" 
        alignItems="center"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Properties 
        </Typography>
        <Box
            mt={2.5}
            sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4 }} 
        >
            {myProperties.slice().reverse().slice(0, 5).map((property) => (
                <PropertyCard
                    key={property._id}
                    id={property._id}
                    title={property.title}
                    location={property.location}
                    dealType={property.dealType}
                    price={property.price}
                    phone={property.phone}
                    photo={property.photo}
                    propertyType={property.propertyType}
                    url={"properties"}
                />
            ))}
        </Box>

      </Box>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#F6F5F2"
        display="flex"
        justifyContent="center" 
        alignItems="center"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Requirement
        </Typography>
        <Box
            mt={2.5}
            sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4 }} 
        >
            {requirements.slice().reverse().slice(0, 5).map((property) => (
                <PropertyCard
                    key={property._id}
                    id={property._id}
                    title={property.title}
                    location={property.location}
                    dealType={property.dealType}
                    price={property.askedPrice}
                    phone={property.phone}
                    photo={BrickBixImage}
                    propertyType={property.propertyType}
                    url={"properties-requirement"}
                />
            ))}
        </Box>

      </Box>
       

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties Listed"
          value={myProperties.length}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Requirements Listed"
          value={requirements.length}
          series={[60, 40]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Commercial Properties for Sell"
          value={commercialPropertiesCount}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Apartment For Sell"
          value={apartmentPropertiesCount}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>
    </Box>
  );
};

export default Home;
