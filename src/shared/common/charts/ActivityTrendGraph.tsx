import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActivityTrendData {
    month: string;
    [key: string]: string | number;
}

interface ActivityTrendGraphProps {
    data: ActivityTrendData[];
    type: 'contributor' | 'project'
    title?: string;
}

const ActivityTrendGraph: React.FC<ActivityTrendGraphProps> = ({ data, type, title = "Activity Trend" }) => {
    const bar1Key = type === 'contributor' ? 'assigned' : 'created';
    const bar2Key = 'completed';

    const bar1Label = type === 'contributor' ? 'Assigned' : 'Created';
    const bar2Label = 'Completed';

    const bar1Color = '#0f766e';
    const bar2Color = '#2dd4bf';

    return (
        <div className="bg-white p-6 rounded-lg border border-[#e6f4f2] h-full flex flex-col">
            <h3 className="text-[#0c1d1a] font-semibold mb-6">{title}</h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e6f4f2',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: '#f8fcfb' }}
                        />
                        <Legend
                            align="right"
                            verticalAlign="top"
                            wrapperStyle={{ paddingBottom: '20px' }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey={bar1Key}
                            name={bar1Label}
                            fill={bar1Color}
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey={bar2Key}
                            name={bar2Label}
                            fill={bar2Color}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityTrendGraph;
