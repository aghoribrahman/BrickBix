import { useEffect, useState } from "react";
import { Add, Sort } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import { Box, Stack, Typography, CircularProgress, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/common/PropertyCard";
import CustomButton from "../components/common/CustomButton";
import TextField from "@mui/material/TextField";

export const AllProperties = () => {
    const navigate = useNavigate();
    const { tableQueryResult: { data, isLoading, isError }, current, setCurrent, setPageSize, pageCount, sorters, setSorters, filters, setFilters } = useTable();
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const currentPrice = sorters.find((item) => item.field === "price")?.order;

    const toggleSort = (field: string) => {
        const newOrder = currentPrice === "asc" ? "desc" : "asc";
        setSorters([{ field, order: newOrder }]);
        sortProperties(allProperties, field, newOrder);
    };

    const sortProperties = (properties: any[], field: string, order: string) => {
        const sortedProperties = [...properties].sort((a, b) => {
            if (order === "asc") {
                return a[field] - b[field];
            } else {
                return b[field] - a[field];
            }
        });
        setAllProperties(sortedProperties);
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/properties");
                if (!response.ok) {
                    throw new Error("Failed to fetch properties");
                }
                const data = await response.json();
                setAllProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, []);

     const currentFilterValues = {
        title: filters.find(f => f.field === "title")?.value || "",
        propertyType: filters.find(f => f.field === "propertyType")?.value || "",
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box sx={{ marginBottom: "20px" }}>
            <Stack direction='column' width='100%'>
                <Typography fontSize={{ xs: 20, sm: 25 }} fontWeight={700} color="#11142d" mb={{ xs: 2, sm: 0 }}>
                    {!allProperties.length ? 'There are no properties' : 'All Properties'}
                </Typography>
                <Box mb={2} mt={3} display='flex' width='84%' justifyContent='space-between'>
                    <Box display='flex' gap={2} flexWrap='wrap' mb={{ xs: '20px', sm: '0px' }}>
                        <CustomButton
                            title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                            handleClick={() => toggleSort("price")}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                            icon={<Sort />}
                        />
                        <TextField
                            variant="outlined"
                            color="info"
                            placeholder="Search by title"
                            value={currentFilterValues.title}
                            onChange={(e) => {
                                setFilters([
                                    {
                                        field: "title",
                                        operator: "contains",
                                        value: e.currentTarget.value ? e.currentTarget.value : undefined,
                                    },
                                    ...filters.filter(f => f.field !== "title")
                                ]);
                            }}
                        />
                       <Select
                                variant="outlined"
                                color="info"
                                displayEmpty
                                required
                                inputProps={{ "aria-label": "Without label" }}
                                defaultValue=""
                                value={currentFilterValues.propertyType}
                                onChange={(e) => {
                                    setFilters(
                                        [
                                            {
                                                field: "propertyType",
                                                operator: "eq",
                                                value: e.target.value,
                                            },
                                        ],
                                        "replace",
                                    );
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {["Apartment", "Rental", "Farmhouse", "Commercial", "Land", "Duplex", "Plot", "Room"].map((type) => (
                                    <MenuItem
                                        key={type}
                                        value={type.toLowerCase()}
                                    >
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                    </Box>
                </Box>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'column' }} justifyContent="space-between" alignItems="center" spacing={2}>
                <CustomButton
                    title="Add Property"
                    handleClick={() => navigate("/allProperties/properties/create")}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    icon={<Add />}
                />
            </Stack>

            <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
    {allProperties
        .filter(property => property.title.toLowerCase().includes(currentFilterValues.title.toLowerCase()))
        .reverse() // Reverse the filtered array
        .map((property) => (
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

            {allProperties.length > 0 && (
                <Box display="flex" gap={2} mt={3} flexWrap="wrap" >
                    <CustomButton
                        title="Previous"
                        handleClick={() => setCurrent((prev) => prev - 1)}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        disabled={!(current > 1)}
                    />
                    <Box
                        display={{ xs: "hidden", sm: "flex" }}
                        alignItems="center"
                        gap="5px"
                    >
                        Page{" "}
                        <strong>
                            {current} of {pageCount}
                        </strong>
                    </Box>
                    <CustomButton
                        title="Next"
                        handleClick={() => setCurrent((prev) => prev + 1)}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        disabled={current === pageCount}
                    />
                    <Select
                        variant="outlined"
                        color="info"
                        displayEmpty
                        required
                        inputProps={{ "aria-label": "Without label" }}
                        defaultValue={10}
                        onChange={(e) =>
                            setPageSize(e.target.value ? Number(e.target.value) : 10)}
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <MenuItem key={size} value={size}>
                                Show {size}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}
        </Box>
    );
};
