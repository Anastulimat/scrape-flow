"use client";

import {GetWorkflowExecutionsStats} from "@/actions/analytics/getWorlflowExecutionsStats";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Layers2Icon} from "lucide-react";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import {CartesianGrid, Line, LineChart, XAxis} from "recharts";

// ----------------------------------------------------------------------

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionsStats>>;

const chartConfig = {
    success: {
        label: "Successful",
        color: "hsl(var(--chart-2))",
    },
    failed: {
        label: "Failed",
        color: "hsl(var(--chart-1))",
    },
}

// ----------------------------------------------------------------------

const ExecutionStatusChart = ({data}: { data: ChartData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Layers2Icon className="w-6 h-6 text-primary"/>
                    Workflow executions status
                </CardTitle>

                <CardDescription>
                    Daily number of successful and failed workflow executions
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    className="max-h-[200px] w-full"
                    config={chartConfig}
                >
                    <LineChart
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

                        <Line
                            min={0}
                            type={"bump"}
                            fill="var(--color-success)"
                            fillOpacity={0.6}
                            stroke="var(--color-success)"
                            dataKey={"success"}
                        />

                        <Line
                            min={0}
                            type={"bump"}
                            fill="var(--color-failed)"
                            fillOpacity={0.6}
                            stroke="var(--color-failed)"
                            dataKey={"failed"}

                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ExecutionStatusChart;
