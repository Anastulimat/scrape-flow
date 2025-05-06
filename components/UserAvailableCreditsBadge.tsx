"use client";

import {useQuery} from "@tanstack/react-query";
import {GetAvailableCredits} from "@/actions/billing/getAvailableCredits";
import Link from "next/link";
import {CoinsIcon, Loader2Icon} from "lucide-react";
import {cn} from "@/lib/utils";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import {buttonVariants} from "@/components/ui/button";

// ----------------------------------------------------------------------


function UserAvailableCreditsBadge() {
    const query = useQuery({
        queryKey: ["user-available-credits"],
        queryFn: () => GetAvailableCredits(),
        refetchInterval: 30 * 1000, // 30 seconds
    });

    return (
        <Link href={"/billing"} className={cn(
            "w-full space-x-2 items-center",
            buttonVariants({variant: "outline"})
        )}>
            <CoinsIcon size={20} className="text-primary"/>
            <span className="font-semibold capitalize">
                {query.isLoading && <Loader2Icon className="animate-spin h-4 w-4"/>}
                {!query.isLoading && query.data && <ReactCountUpWrapper value={query.data}/>}
                {!query.isLoading && query.data === undefined && "-"}
            </span>
        </Link>
    );
}

export default UserAvailableCreditsBadge;