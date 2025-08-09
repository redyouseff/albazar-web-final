import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import { useParams } from 'react-router-dom'
import { getListingById } from '../../redux/Actions/ListingActions'

const ListingByIdHook = (id) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [listing, setListing] = useState(null)

    const dispatch = useDispatch()
    
    const response = useSelector((state) => state.listing.listingById)

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true)
            setError(null)
            try {
                await dispatch(getListingById(id))
            } catch (err) {
                setError(err.message || 'حدث خطأ أثناء تحميل البيانات')
            }
            setLoading(false)
        }

        if (id) {
            fetchListing()
        }
    }, [dispatch, id])

    useEffect(() => {
        if (response?.data) {
            setListing(response.data)
            setError(null)
        } else if (response?.error) {
            setError(response.error)
            setListing(null)
        }
    }, [response])

    return {
        loading,
        error,
        listing,
        isSuccess: !!listing && !error && !loading
    }
}

export default ListingByIdHook;                                                                                                