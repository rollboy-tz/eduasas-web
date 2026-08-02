"use client"

import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function ApiTestPage() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['schools'],
        queryFn: () => apiFetch<any>("/my/profile")
    });

    if (isLoading) {
        return (
            <div className="flex items-center ustify-center">
                <h3>Loading...</h3>
            </div>
        )


    }

    if (error) {
        console.error(error)
        return (
            <div className="flex items-center ustify-center">
                <h3>Error check log</h3>
            </div>
        )
    }

    console.log(data)
    return (

        <div>
            <h3>Data fethed</h3>
        </div>
    )
}