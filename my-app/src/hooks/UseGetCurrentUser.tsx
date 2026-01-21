"use client"

import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/slices/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux"


function useGetCurrentUser() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const res = await axios.get(`/api/user/get-current-user`)
                dispatch(setUserData(res.data))
            } catch (error) {
                console.log(`Error in useGetCurrentUser: ${error}`);
            }
        }
        getCurrentUser()
    }, [])
}

export default useGetCurrentUser
