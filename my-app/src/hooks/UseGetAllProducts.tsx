"use client"

import { setAllProductsData } from "@/redux/slices/vendorSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux"


function useGetAllProducts() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const res = await axios.get(`/api/vendor/get-all-products`)
                console.log(res.data)
                dispatch(setAllProductsData(res.data))
            } catch (error) {
                console.log(`Error in useGetAllProducts: ${error}`);
            }
        }
        getAllProducts()
    }, [])
}

export default useGetAllProducts