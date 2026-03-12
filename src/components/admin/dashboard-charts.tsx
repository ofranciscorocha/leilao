'use client'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

interface ChartDataPoint {
    name: string
    value: number
}

export function DashboardCharts({ data }: { data: ChartDataPoint[] }) {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid vertical={false} stroke="#ecf0f5" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#777' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#777' }}
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            fontSize: '12px',
                            borderRadius: '2px'
                        }}
                        formatter={(value: number) => [value, 'Lances']}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        name="Lances"
                        stroke="#3c8dbc"
                        strokeWidth={2}
                        fill="#b9cde5"
                        fillOpacity={0.7}
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
