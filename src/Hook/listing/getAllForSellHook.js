import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllListingsByCategory } from '../../redux/Actions/ListingActions';
import { CATEGORY_SELL_ID } from '../../redux/Type';

const getAllForSellHook = () => {     
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listings, setListings] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [filters, setFilters] = useState({
        city: '',
        'property type': '',
        regulationStatus: '',
        floor: '',
        'number of rooms': '',
        'number of bathrooms': '',
        area: '',
        price: '',
        currency: '',
        'payment method': '',
        'delivery conditions': '',
        'property condition': '',
        'building age': '',
        furnishing: false,
        negotiable: false,
        publishedVia: ''
    });

    const dispatch = useDispatch();

    // Get listings data from Redux store
    const response = useSelector((state) => state.listing.allListings);
    const isLoading = useSelector((state) => state.listing.isLoading);
    const errorMessage = useSelector((state) => state.listing.error);

    useEffect(() => {
        const getListings = async () => {
            setLoading(true);
            try {
                // Add filters to the API call
                const queryParams = {
                    page,
                    limit,
                    post:true,
                    ...Object.fromEntries(
                        Object.entries(filters).filter(([_, value]) => 
                            value !== '' && 
                            value !== false && 
                            !(Array.isArray(value) && value.length === 0)
                        )
                    )
                };
                
                await dispatch(getAllListingsByCategory(CATEGORY_SELL_ID, queryParams));   
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
            setTotalPages(response.totalPages || 0);
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

    // Handle filter change
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            city: '',
            'property type': '',
            regulationStatus: '',
            floor: '',
            'number of rooms': '',
            'number of bathrooms': '',
            area: '',
            price: '',
            currency: '',
            'payment method': '',
            'delivery conditions': '',
            'property condition': '',
            'building age': '',
            furnishing: false,
            negotiable: false,
            publishedVia: ''
        });
        setPage(1);
    };

    return {
        loading,
        error,
        listings,
        page,
        limit,
        totalPages,
        filters,
        handlePageChange,
        handleLimitChange,
        handleFilterChange,
        resetFilters
    };
}

export default getAllForSellHook; 



























