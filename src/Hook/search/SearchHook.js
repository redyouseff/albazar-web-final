


import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllListings } from '../../redux/Actions/ListingActions';


const SearchHook = (keyword) => {
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

  

    useEffect(() => {
        const getListings = async () => {
            setLoading(true);
            try {
                // If keyword is empty or undefined, pass empty string to get all listings
                const searchKeyword = keyword || '';
                await dispatch(getAllListings(limit, searchKeyword, page));   
            } catch (err) {
                setError(err.message || 'حدث خطأ أثناء تحميل السيارات');
            }
            setLoading(false);
        };

        getListings();
    }, [dispatch, page, limit, keyword]);

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

export default SearchHook; 