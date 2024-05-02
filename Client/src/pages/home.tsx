import { useList } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import {
  useGetIdentity,
  useActiveAuthProvider,
} from "@refinedev/core";

import  PieChart  from '../components/charts/PieChart';
import  PropertyReferrals  from '../components/charts/PropertyReferrals';
import  TotalRevenue  from '../components/charts/TotalRevenue';
import PropertyCard from "../components/common/PropertyCard";
import { AllProperties } from "./all-properties";


const Home = () => {
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const userId = user?.id;
  const [myProperties, setMyProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/properties");
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data = await response.json();
            setMyProperties(data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    fetchProperties();
}, []);

  console.log(myProperties);

  
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
        bgcolor="#fcfcfc"
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
            price={property.price}
            photo={property.photo}
            propertyType={property.propertyType}
        />
    ))}
</Box>

      </Box>
       

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties for Listed"
          value={myProperties.length}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Properties for Rent"
          value={550}
          series={[60, 40]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Total customers"
          value={5684}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Properties for Cities"
          value={555}
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
