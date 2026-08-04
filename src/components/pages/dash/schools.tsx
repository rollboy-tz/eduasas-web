"use client"

import { SchoolCard } from "@/components/cards/dash";
import { EduMainLoader } from "@/components/elements";
import { EmptyState } from "@/components/ui";
import { useUser } from "@/hooks/dash"
import { University } from "lucide-react";
export const SchoolsPageContents = () => {
    const { schools, isLoading, refresh } = useUser();

    return (
        <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8">
            {/* Welcome Header */}
            <div className="
                    relative overflow-hidden
                    rounded-xl sm:rounded-2xl
                    bg-gradient-to-r from-green-600 to-indigo-600
                    p-5 sm:p-6 lg:p-8
                    text-white shadow-md
                ">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-sm text-blue-100">
                    </p>

                    <h1 className=" mt-1 text-xl sm:text-1xl lg:text-2xl font-bold tracking-tight ">
                        Connected Schools
                    </h1>

                    <p className="
                            mt-2
                            text-sm sm:text-base
                            text-blue-100
                        ">
                        Easly find & manage your all associated schools in one place.
                    </p>
                </div>

                {/* Background decoration */}
                <div className="
                        absolute -right-16 -top-16
                        h-40 w-40
                        rounded-full
                        bg-white/10
                    " />

                <div className="
                        absolute -bottom-20 right-10
                        h-48 w-48
                        rounded-full
                        bg-white/5
                    " />
            </div>
            {(isLoading || schools?.length === 0) &&
                <div className="w-full flex items-center justify-center border border-gray-300 rounded-xl sm:rounded-2xl">
                    {isLoading && (
                        <div className="flex items-center ustify-center min-h-75">
                            <EduMainLoader loadingText="Looking for your schools" />
                        </div>
                    )}

                    {(!isLoading && !schools || !isLoading && schools?.length === 0) && (
                        <EmptyState
                            title="You haven't any connected school yet"
                            description="This is either your associated school not roaed yet  or no associated one found. Try reloading or add one."
                            icon={University}
                            iconClassName="text-white"
                            iconContainerClassName="bg-blue-500"
                            hasSlash={true}
                            slashColor="white"
                            slashHeightPercentage={101}
                            action={
                                <div className="flex items-center justify-center">
                                    <button 
                                        className="bg-blue-600 text-white font-medium px-3.5 py-1 rounded-sm text-sm cursor-pointer hover:bg-blue-600/70 transission-all duration-300"
                                        onClick={refresh}
                                    >
                                        Reload
                                    </button>
                                </div>
                            }
                        />
                    )}
                </div>
            }

            <div className="flex flex-col">
                {schools?.map((school, key) => ( <SchoolCard school={school} key={key}/> ))}
            </div>
        </div>
    )
}