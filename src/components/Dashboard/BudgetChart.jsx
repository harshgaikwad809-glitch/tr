import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BudgetChart = ({ budget, travelerType, numTravelers }) => {
    const total = parseFloat(budget) || 0;

    // Logic to split budget based on traveler type
    const getSplit = () => {
        if (travelerType === 'solo') {
            return [
                { name: 'Accommodation', value: total * 0.4, color: '#FF9933' },
                { name: 'Food', value: total * 0.2, color: '#008080' },
                { name: 'Transport', value: total * 0.25, color: '#000080' },
                { name: 'Sightseeing', value: total * 0.15, color: '#138808' },
            ];
        } else if (travelerType === 'family') {
            return [
                { name: 'Accommodation', value: total * 0.35, color: '#FF9933' },
                { name: 'Food', value: total * 0.3, color: '#008080' },
                { name: 'Transport', value: total * 0.2, color: '#000080' },
                { name: 'Sightseeing', value: total * 0.15, color: '#138808' },
            ];
        }
        // Default split
        return [
            { name: 'Accommodation', value: total * 0.4, color: '#FF9933' },
            { name: 'Food', value: total * 0.25, color: '#008080' },
            { name: 'Transport', value: total * 0.2, color: '#000080' },
            { name: 'Sightseeing', value: total * 0.15, color: '#138808' },
        ];
    };

    const data = getSplit();

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `₹${value.toLocaleString()}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BudgetChart;
