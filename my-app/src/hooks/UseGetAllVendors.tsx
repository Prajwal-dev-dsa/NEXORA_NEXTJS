"use client"

import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/slices/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux"


function useGetAllVendors() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const getAllVendors = async () => {
            try {
                const res = await axios.get(`/api/vendor/get-all-vendors`)
                dispatch(setUserData(res.data))
            } catch (error) {
                console.log(`Error in useGetAllVendors: ${error}`);
            }
        }
        getAllVendors()
    }, [])
}

export default useGetAllVendors
