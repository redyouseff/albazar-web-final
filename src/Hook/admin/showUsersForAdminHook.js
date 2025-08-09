import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getAllUsersForAdmin } from "../../redux/Actions/UserActions";


const showUsersForAdminHook = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [users, setUsers] = useState([]);
    const [paginate, setPaginate] = useState({});
    const [searchKeyword, setSearchKeyword] = useState('');
    const user = useSelector((state) => state.user.allUsers);

    useEffect(() => {
        setLoading(true);
        const params = { page: currentPage, limit };
        if (searchKeyword.trim()) {
            params.keyword = searchKeyword.trim();
        }
        dispatch(getAllUsersForAdmin(params));
    }, [dispatch, currentPage, limit, searchKeyword]);

    useEffect(() => {
        if (user) {
            setLoading(false);
            if (user?.data) {
                // Handle the API response structure: { paginate: {...}, data: [...] }
                setUsers(user.data.data || []);
                setPaginate(user.data.paginate || {});
            } else {
                setUsers([]);
                setPaginate({});
            }
        }
    }, [user]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1); // Reset to first page when searching
    };

    return {
        loading,
        users,
        currentPage,
        limit,
        paginate,
        handlePageChange,
        handleSearch,
        searchKeyword
    }

}

export default showUsersForAdminHook;
