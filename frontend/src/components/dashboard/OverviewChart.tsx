import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 9800, profit: 2000 },
  { name: 'Apr', revenue: 3908, profit: 2780 },
  { name: 'May', revenue: 4800, profit: 1890 },
  { name: 'Jun', revenue: 3800, profit: 2390 },
  { name: 'Jul', revenue: 4300, profit: 3490 },
  { name: 'Aug', revenue: 7800, profit: 4200 },
  { name: 'Sep', revenue: 5300, profit: 3800 },
  { name: 'Oct', revenue: 6200, profit: 4300 },
  { name: 'Nov', revenue: 7100, profit: 5100 },
  { name: 'Dec', revenue: 8900, profit: 6100 },
];

export const OverviewChart = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          contentStyle={{ 
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Bar 
          dataKey="revenue" 
          fill="#4f46e5" 
          radius={[4, 4, 0, 0]} 
          name="Revenue"
        />
        <Bar 
          dataKey="profit" 
          fill="#22c55e" 
          radius={[4, 4, 0, 0]} 
          name="Profit"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};