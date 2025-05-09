import {GetAvailableCredits} from "@/actions/billing/getAvailableCredits";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import {CoinsIcon} from "lucide-react";
import CreditsPurchase from "@/app/(dashboard)/billing/_components/CreditsPurchase";

// ----------------------------------------------------------------------

export default function BillingPage() {
    return (
        <div className="mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Billing</h1>
            <Suspense fallback={<Skeleton className="h-[166px] w-full"/>}>
                <BalanceCard/>
            </Suspense>
            <CreditsPurchase />
        </div>
    );
}

// ----------------------------------------------------------------------

async function BalanceCard() {
    const userBalance = await GetAvailableCredits();

    return (
        <Card
            className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
            <CardContent className="p-6 relative items-center">
                <div className="flex items-center justify-between">
                    <div className="">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            Available Credits
                        </h3>
                        <p className="text-4xl font-bold text-primary">
                            <ReactCountUpWrapper value={userBalance}/>
                        </p>
                    </div>
                    <CoinsIcon size={140} className="text-primary opacity-20 absolute button-0 right-0"/>
                </div>
            </CardContent>
            <CardFooter className="textmuted-foreground text-sm">
                When your credits balance reaches 0, your workflows will stop working.
            </CardFooter>
        </Card>
    );
}