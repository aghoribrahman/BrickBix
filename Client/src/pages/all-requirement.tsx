import React, { useEffect, useState, useMemo } from 'react';
import Typography from "@mui/material/Typography";
import { Box, CircularProgress, Stack } from "@mui/material";
import CustomButton from '../components/common/CustomButton';
import { TextField, Select, MenuItem } from '@mui/material';
import { Sort, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTable } from '@refinedev/core';
import PropertyCard from '../components/common/PropertyCard';
import BrickBixImage from '../assets/brick bix image.jpg';

const Requirement = () => {
    const navigate = useNavigate();
    const { tableQueryResult: { data, isLoading, isError }, 
    current, 
    setCurrent, 
    setPageSize, 
    sorters, 
    setSorters, 
    filters, 
    setFilters } = useTable({   
            resource: "requirement",});
    
    const [allRequirement, setAllRequirement] = useState<any[]>([]);
    const currentPrice = sorters.find((item) => item.field === "askedPrice")?.order;

    const toggleSort = (field: string) => {
        const newOrder = currentPrice === "asc" ? "desc" : "asc";
        setSorters([{ field, order: newOrder }]);
        sortProperties(allRequirement, field, newOrder);
    };

    const sortProperties = (properties: any[], field: string, order: string) => {
        const sortedProperties = [...properties].sort((a, b) => {
            if (order === "asc") {
                return a[field] - b[field];
            } else {
                return b[field] - a[field];
            }
        });
        setAllRequirement(sortedProperties);
    };

    function checkURLValue(url: string): string {
        const urlSegments = url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];
        
        if (lastSegment.includes('requirement')) {
            return 'properties-requirement';
        } else {
            return 'properties';
        }
    }
    
    const fullUrl = window.location.href;
    const fullUrlValue = checkURLValue(fullUrl);

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const response = await fetch('https://refine-dashboard-3gx3.onrender.com/api/v1/requirement');
                if (!response.ok) {
                    throw new Error('Failed to fetch requirements');
                }
                const data = await response.json();
                setAllRequirement(data.requirements);
            } catch (error) {
                console.error('Error fetching requirements:', error);
            }
        };
    
        if (allRequirement.length === 0) {
            fetchRequirements();
        }
    }, [allRequirement]);

    const currentFilterValues = {
        propertyType: filters.find(f => // @ts-ignore
            f.field === "propertyType")?.value || "",
        title: filters.find(f => // @ts-ignore
             f.field === "title")?.value || "",
    };

    // Apply filtering logic to all properties, not just the ones on the current page
    const filteredProperties = useMemo(() => {
        return allRequirement
            .filter(property => {
                const titleFilter = property.title.toLowerCase().includes(currentFilterValues.title.toLowerCase());
                const locationFilter = property.location.toLowerCase().includes(currentFilterValues.title.toLowerCase());
                const propertyTypeFilter = currentFilterValues.propertyType === "" || property.propertyType.toLowerCase() === currentFilterValues.propertyType.toLowerCase();
                return (titleFilter || locationFilter) && propertyTypeFilter;
            })
            .reverse();
    }, [allRequirement, currentFilterValues]);

    if (isLoading) 
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
        </div>;

    if (isError) return <Typography>Error...</Typography>;

    const propertiesPerPage = 50; // Number of properties to display per page
    const totalProperties = filteredProperties.length;
    const calculatedPageCount = Math.ceil(totalProperties / propertiesPerPage);

    const startIndex = (current - 1) * propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, startIndex + propertiesPerPage);

    return (
        <Box sx={{ marginBottom: "20px" }}>
            <Stack direction='column' width='100%'>
                <Typography fontSize={{ xs: 20, sm: 25 }} fontWeight={700} color="#11142d" mb={{ xs: 2, sm: 0 }}>
                    {!allRequirement.length ? 'There are no requirements' : 'All Requirements'}
                </Typography>
                <Box mb={2} mt={3} display='flex' width='84%' justifyContent='space-between'>
                    <Box display='flex' gap={2} flexWrap='wrap' mb={{ xs: '20px', sm: '0px' }}>
                        <CustomButton
                            title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
                            handleClick={() => toggleSort("askedPrice")}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                            icon={<Sort />}
                        />
                        <TextField
                            variant="outlined"
                            color="info"
                            placeholder="Search by title or location"
                            value={currentFilterValues.title}
                            onChange={(e) => {
                                setFilters([
                                    {
                                        field: "title",
                                        operator: "contains",
                                        value: e.currentTarget.value ? e.currentTarget.value : undefined,
                                    },
                                    {
                                        field: "location",
                                        operator: "contains",
                                        value: e.currentTarget.value ? e.currentTarget.value : undefined,
                                    },
                                    ...filters.filter(f =>// @ts-ignore
                                    f.field !== "title" && f.field !== "location")
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
                                setFilters([
                                    {
                                        field: "propertyType",
                                        operator: "eq",
                                        value: e.target.value,
                                    },
                                ], "replace");
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {["Apartment", "Rental", "Farmhouse", "Commercial", "Land", "Duplex", "Plot", "Room"].map((type) => (
                                <MenuItem key={type} value={type.toLowerCase()}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'column' }} justifyContent="space-between" alignItems="center" spacing={2}>
                <CustomButton
                    title="Add Requirement"
                    handleClick={() => navigate("properties-requirement/create")}
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
                        price={property.askedPrice}
                        photo={BrickBixImage}
                        phone={property.phone}
                        dealType={property.dealType}
                        propertyType={property.propertyType}
                        url={fullUrlValue}
                    />
                ))}
            </Box>

            {allRequirement.length > 0 && (
                <Box display="flex" gap={2} mt={3} flexWrap="wrap" justifyContent="center" alignItems="center">
                    <CustomButton
                        title="Previous"
                        handleClick={() => setCurrent((prev) => prev - 1)}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        disabled={!(current > 1)}
                    />
                    <Box display="flex" alignItems="center" gap="5px">
                        Page <strong>{current} of {calculatedPageCount}</strong>
                    </Box>

                    <CustomButton
                        title="Next"
                        handleClick={() => setCurrent((prev) => prev + 1)}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        disabled={current === calculatedPageCount}
                    />
                    <Select
                        variant="outlined"
                        color="info"
                        displayEmpty
                        required
                        inputProps={{ "aria-label": "Without label" }}
                        defaultValue={10}
                        onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}
                    >
                        {[50, 100].map((size) => (
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

export default Requirement;

