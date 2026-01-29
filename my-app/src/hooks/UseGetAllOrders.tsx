"use client"

import { setAllOrdersData } from "@/redux/slices/orderSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux"


function useGetAllOrders() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const getAllOrders = async () => {
            try {
                const res = await axios.get(`/api/user/order/get-all-orders`)
                dispatch(setAllOrdersData(res.data))
            } catch (error) {
                console.log(`Error in useGetAllOrders: ${error}`);
            }
        }
        getAllOrders()
    }, [])
}

export default useGetAllOrders