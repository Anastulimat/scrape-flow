"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon} from "lucide-react";
import {useRouter} from "next/navigation";

// ----------------------------------------------------------------------

const Topbar = () => {
    const router = useRouter();

    return (
        <header
            className="flex px-2 border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10"
        >
            <div className="flex gap-1 flex-1">
                <TooltipWrapper content="Back">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <ChevronLeftIcon size={20}/>
                    </Button>
                </TooltipWrapper>
            </div>
        </header>
    );
};

export default Topbar;
