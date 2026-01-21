"use client"

import useGetCurrentUser from "@/hooks/UseGetCurrentUser";

function InitalizeUser() {
    useGetCurrentUser();
    return null;
}

export default InitalizeUser