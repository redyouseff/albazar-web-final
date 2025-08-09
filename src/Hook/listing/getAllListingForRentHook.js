import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListingsByCategory } from "../../redux/Actions/ListingActions";
import { CATEGORY_RENT_ID } from "../../redux/Type";

const getAllListingForRentHook = (filters = {}) => {
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
            category: CATEGORY_RENT_ID,
            sort: '-createdAt',
            post:true
        };

        // Process each filter
        Object.entries(filters).forEach(([key, value]) => {
            // Handle range filters (price, area, rooms, bathrooms)
            if (value && typeof value === 'object' && ('gte' in value || 'lte' in value)) {
                if (value.gte) queryParams[`${key}[gte]`] = value.gte;
                if (value.lte) queryParams[`${key}[lte]`] = value.lte;
            }
            // Handle regular filters
            else if (value && value !== '') {
                queryParams[key] = value;
            }
        });

        return queryParams;
    };

    useEffect(() => {
        const getListings = async () => {
            setLoading(true);
            try {
                const queryParams = processFilters();
                await dispatch(getAllListingsByCategory(CATEGORY_RENT_ID, queryParams));   
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
};

export default getAllListingForRentHook;