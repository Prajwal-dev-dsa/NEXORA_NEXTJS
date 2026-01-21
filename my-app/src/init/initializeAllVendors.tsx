"use client"

import useGetAllVendors from "@/hooks/UseGetAllVendors";

function InitializeAllVendors() {
    useGetAllVendors();
    return null;
}

export default InitializeAllVendors