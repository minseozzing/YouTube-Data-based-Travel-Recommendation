import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const DUMMY_CHART_DATA = [
  { month: '2024-07', index: 88 },
  { month: '2024-08', index: 91 },
  { month: '2024-09', index: 87 },
  { month: '2024-10', index: 93 },
  { month: '2024-11', index: 90 },
  { month: '2024-12', index: 95 },
];

export function PriceIndexLineChart() {
  return (
    <div>
      <h3 className="font-semibold text-foreground mb-4">물가 지수 추이</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={DUMMY_CHART_DATA}
          margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
            }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="index"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#2563eb' }}
            name="물가 지수"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
