"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartColumnStackedIcon} from "lucide-react";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import {GetCreditsUsageInPeriod} from "@/actions/analytics/getCreditsUsageInPeriod";

// ----------------------------------------------------------------------

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>;

const chartConfig = {
    success: {
        label: "Successful Phases Credits",
        color: "hsl(var(--chart-2))",
    },
    failed: {
        label: "Failed Phases Credits",
        color: "hsl(var(--chart-1))",
    },
}

// ----------------------------------------------------------------------

const CreditsUsageChart = (
    {
        data,
        title,
        description,
    }
    :
    {
        data: ChartData,
        title: string,
        description: string,
    }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <ChartColumnStackedIcon className="w-6 h-6 text-primary"/>
                    {title}
                </CardTitle>

                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    className="max-h-[200px] w-full"
                    config={chartConfig}
                >
                    <BarChart
                        data={data}
                        height={250}
                        accessibilityLayer
                        margin={{top: 20}}
                    >
                        <CartesianGrid
                            vertical={false}
                        />

                        <XAxis
                            dataKey={"date"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />

                        <ChartLegend
                            content={<ChartLegendContent/>}
                        />

                        <ChartTooltip
                            content={<ChartTooltipContent className="w-[250px]"/>}
                        />

                        <Bar
                            radius={[0, 0, 4, 4]}
                            fill="var(--color-success)"
                            fillOpacity={0.8}
                            stroke="var(--color-success)"
                            dataKey={"success"}
                            stackId="a"
                        />

                        <Bar
                            radius={[4, 4, 0, 0]}
                            fill="var(--color-failed)"
                            fillOpacity={0.8}
                            stroke="var(--color-failed)"
                            dataKey={"failed"}
                            stackId="a"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CreditsUsageChart;
