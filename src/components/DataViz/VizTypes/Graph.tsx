import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

export interface DataObj {
  monthly_income: number;
  housing_expenses: number;
  other_expenses: number;
}

interface GraphProps {
  analysisData: DataObj;
}

interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  // This calculates the middle of the donut's "ring"
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#666666"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '16px', fontWeight: 'bold', pointerEvents: 'none' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Graph = ({ analysisData }: GraphProps) => {

  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    console.log('Raw data:', analysisData);  // See what's actually coming in
    console.log('Keys:', Object.keys(analysisData));
    console.log('monthly_income:', analysisData.monthly_income, typeof analysisData.monthly_income);
    console.log('housing_expenses:', analysisData.housing_expenses, typeof analysisData.housing_expenses);
    console.log('other_expenses:', analysisData.other_expenses, typeof analysisData.other_expenses);

    const formatData = () => {
      if (Object.keys(analysisData).length > 1) {
        const housingExp = Number(analysisData.housing_expenses);
        const otherExp = Number(analysisData.other_expenses);
        const leftOver = Number(analysisData.monthly_income) - (housingExp + otherExp);

        const formattedChartData: Array<{ name: string; value: number }> = [
          { name: 'Housing', value: housingExp },
          { name: 'Fixed Costs', value: otherExp },
          { name: 'Left Over', value: Math.max(0, leftOver) },
        ];

        setChartData(formattedChartData);
        setHasData(true);
      } else {
        setHasData(false);
      }
    };


    formatData()
  }, [analysisData]);

  console.log("chartData: ", chartData)
  console.log("hasData: ", hasData)

  const COLORS = ['#00ffbc', '#8ea5ff', '#ffffff', '#00C49F'];


  return (
    <div className='chart-container'>
      {hasData ? (

        
          
          <ResponsiveContainer className="responsive-container-left" width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="64%"
                outerRadius="90%"
                // Corner radius is the rounded edge of each pie slice
                cornerRadius="50%"
                cx="50%"
                cy="47%"
                fill="#8884d8"
                // padding angle is the gap between each pie slice
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={true}
                stroke="none"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
              />
              <RechartsDevtools />
            </PieChart>

          </ResponsiveContainer>
      ) : (
        <div>
        </div>
      )
      }
    </div>
  );
};

export default Graph;