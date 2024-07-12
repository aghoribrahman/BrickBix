import { useEffect, useState, useMemo } from "react";
import { Add, Sort } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import { Box, Stack, Typography, CircularProgress, MenuItem, Select, Slider, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/common/PropertyCard";
import CustomButton from "../components/common/CustomButton";

export const AllProperties = () => {
    const navigate = useNavigate();
    const {
        tableQueryResult: { data, isLoading, isError },
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        setSorters,
        filters,
        setFilters,
    } = useTable({
        resource: "properties",
    });

    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]); // Default price range

    const currentPrice = sorters.find((item) => item.field === "price")?.order;
    const toggleSort = (field: string) => {
        const newOrder = currentPrice === "asc" ? "desc" : "asc";
        setSorters([{ field, order: newOrder }]);
        sortProperties(allProperties, field, newOrder);
    };

    const propertyValues = data?.data ?? [];

    const checkURLValue = (url: string): string => {
        const urlSegments = url.split("/");
        const lastSegment = urlSegments[urlSegments.length - 1];
        if (lastSegment === "requirememnt") {
            return "properties-requirement";
        } else {
            return "properties";
        }
    };

    const fullUrl = window.location.href;
    const fullUrlValue = checkURLValue(fullUrl);

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
                const response = await fetch("https://refine-dashboard-3gx3.onrender.com/api/v1/properties");
                if (!response.ok) {
                    throw new Error("Failed to fetch properties");
                }
                const data = await response.json();
                setAllProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        if (allProperties.length === 0) {
            fetchProperties();
        }
    }, [allProperties]);

    const currentFilterValues = {
        propertyType: filters.find((f) => //@ts-ignore
             f.field === "propertyType")?.value || "",
        title: filters.find((f) => //@ts-ignore
         f.field === "title")?.value || "",
    };

    const filteredProperties = useMemo(() => {
        return allProperties
            .filter((property) => {
                const titleFilter = property.title.toLowerCase().includes(currentFilterValues.title.toLowerCase());
                const locationFilter = property.location.toLowerCase().includes(currentFilterValues.title.toLowerCase());
                const propertyTypeFilter = currentFilterValues.propertyType === "" ||
                    property.propertyType.toLowerCase() === currentFilterValues.propertyType.toLowerCase();
                
                const priceFilter = property.price >= priceRange[0] && property.price <= priceRange[1];

                return (titleFilter || locationFilter) && propertyTypeFilter && priceFilter;
            })
            .reverse();
    }, [allProperties, currentFilterValues, priceRange]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography><CircularProgress /></Typography>
            </div>
        );
    }

    if (isError) return <Typography>Error...</Typography>;

    const propertiesPerPage = 50;
    const startIndex = (current - 1) * propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, startIndex + propertiesPerPage);

    return (
        <Box sx={{ marginBottom: "20px" }}>
            <Stack direction="column" width="100%">
                <Typography fontSize={{ xs: 20, sm: 25 }} fontWeight={700} color="#11142d" mb={{ xs: 2, sm: 0 }}>
                    {!allProperties.length ? "There are no properties" : "All Properties"}
                </Typography>
                <Box mb={2} mt={3} width="100%" justifyContent="space-between">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomButton
                                title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                                handleClick={() => toggleSort("price")}
                                backgroundColor="#475be8"
                                color="#fcfcfc"
                                icon={<Sort />}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                variant="outlined"
                                color="info"
                                placeholder="Search by title or location"
                                value={currentFilterValues.title}
                                fullWidth
                                onChange={(e) => {
                                    setFilters([
                                        { field: "title", operator: "contains", value: e.currentTarget.value || undefined },
                                        { field: "location", operator: "contains", value: e.currentTarget.value || undefined },
                                        ...filters.filter((f) => //@ts-ignore
                                         f.field !== "title" && f.field !== "location"),
                                    ]);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Select
                                variant="outlined"
                                color="info"
                                displayEmpty
                                required
                                fullWidth
                                inputProps={{ "aria-label": "Without label" }}
                                defaultValue=""
                                value={currentFilterValues.propertyType}
                                onChange={(e) => {
                                    setFilters(
                                        [{ field: "propertyType", operator: "eq", value: e.target.value }],
                                        "replace"
                                    );
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {["Apartment", "Rental", "Farmhouse", "Commercial", "Land", "Duplex", "Plot", "Room"].map((type) => (
                                    <MenuItem key={type} value={type.toLowerCase()}>{type}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ marginLeft: '10px', marginRight: '10px' }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>Filter by Price Range</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={(event, newValue) => setPriceRange(newValue as number[])}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1000000}
                                    step={10000}
                                    marks={[
                                        { value: 200000, label: '₹2L' },
                                        { value: 10000000, label: '₹1Cr' },
                                    ]}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
                    <CustomButton
                        title="Add Property"
                        handleClick={() => navigate("/allProperties/properties/create")}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        icon={<Add />}
                    />
                </Stack>
                <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                    {propertiesToShow.map((property) => (
                        <PropertyCard
                            key={property._id}
                            id={property._id}
                            title={property.title}
                            location={property.location}
                            dealType={property.dealType}
                            price={property.price}
                            photo={property.photo}
                            phone={property.phone}
                            propertyType={property.propertyType}
                            url={fullUrlValue}
                        />
                    ))}
                </Box>
                {allProperties.length > 0 && (
                    <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                        <CustomButton
                            title="Previous"
                            handleClick={() => setCurrent((prev) => prev - 1)}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                            disabled={!(current > 1)}
                        />
                        <Box display={{ xs: "hidden", sm: "flex" }} alignItems="center" gap="5px">
                            Page <strong>{current} of {pageCount}</strong>
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
                            defaultValue={propertiesPerPage}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            {[50, 100].map((size) => (
                                <MenuItem key={size} value={size}>Show {size}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};
