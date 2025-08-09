import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllListings, getAllListingsByCategory } from '../../redux/Actions/ListingActions';

const ShowListingForAdminHook = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const { allListings, loading: reduxLoading } = useSelector(state => state.listing);

    // Fetch all listings on component mount
    useEffect(() => {
        fetchAllListings();
    }, []);

    // Update listings when redux state changes
    useEffect(() => {
        if (allListings?.data) {
            setListings(allListings.data);
            setLoading(false);
        }
        if (reduxLoading !== undefined) {
            setLoading(reduxLoading);
        }
    }, [allListings, reduxLoading]);

    const fetchAllListings = async () => {
        setLoading(true);
        try {
            await dispatch(getAllListings(50, searchQuery, 1, true)); // Add pending: true
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCategoryClick = async (categoryId) => {
        setActiveCategory(categoryId);
        setLoading(true);
        
        try {
            if (categoryId) {
                // Fetch listings by specific category
                await dispatch(getAllListingsByCategory(categoryId, {
                    limit: 50,
                    keyword: searchQuery,
                    page: 1
                }, true)); // Add pending: true
            } else {
                // Fetch all listings
                await dispatch(getAllListings(50, searchQuery, 1, true)); // Add pending: true
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setLoading(true);
        
        try {
            if (activeCategory) {
                // Search within specific category
                await dispatch(getAllListingsByCategory(activeCategory, {
                    limit: 50,
                    keyword: query,
                    page: 1
                }, true)); // Add pending: true
            } else {
                // Search in all listings
                await dispatch(getAllListings(50, query, 1, true)); // Add pending: true
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return {
        listings,
        loading,
        error,
        activeCategory,
        searchQuery,
        handleCategoryClick,
        handleSearch,
        fetchAllListings
    };
};

export default ShowListingForAdminHook;