"use client"

import useGetAllProducts from "@/hooks/UseGetAllProducts";

function InitializeAllProducts() {
    useGetAllProducts();
    return null;
}

export default InitializeAllProducts