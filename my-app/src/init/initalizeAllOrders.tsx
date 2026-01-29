"use client"

import useGetAllOrders from "@/hooks/UseGetAllOrders";

function InitializeAllOrders() {
    useGetAllOrders();
    return null;
}

export default InitializeAllOrders