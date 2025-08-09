import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { getAllListingsByCategory } from '../../redux/Actions/ListingActions';
import { CATEGORY_LAND_ID } from '../../redux/Type';
import { z } from 'zod';


const getAllLandingHook = (filters = {}) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listings, setListings] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const dispatch = useDispatch();

    // Get listings data from Redux store
    const response = useSelector((state) => state.listing.allListings);
    const isLoading = useSelector((state) => state.listing.isLoading);
    const errorMessage = useSelector((state) => state.listing.error);

    // Process filters for API
    const processFilters = () => {
        const queryParams = {
            page,
            limit,
           
            ...filters
        };

        // Remove empty values
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
                delete queryParams[key];
            }
        });

        return queryParams;
    };

    useEffect(() => {
        const getListings = async () => {
            setLoading(true);
            try {
                const queryParams = processFilters();
                await dispatch(getAllListingsByCategory(CATEGORY_LAND_ID, queryParams));   
            } catch (err) {
                setError(err.message || 'حدث خطأ أثناء تحميل العقارات');
            }
            setLoading(false);
        };

        getListings();
    }, [dispatch, page, limit, filters]);

    useEffect(() => {
        if (response) {
            setListings(response.data || []);
            setTotalPages(response.paginate?.numbeOfPage || 0);
        }
    }, [response]);

    useEffect(() => {
        if (errorMessage) {
            setError(errorMessage);
        }
    }, [errorMessage]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle limit change
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    };

    return {
        loading,
        error,
        listings,
        page,
        limit,
        totalPages,
        handlePageChange,
        handleLimitChange
    };



}


export default getAllLandingHook;
