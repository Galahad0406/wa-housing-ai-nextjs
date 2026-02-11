'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

export default function ResultsDisplay({ data }: any) {

  return (
    <div>
      <h2>ROI: {data.roi.roi}%</h2>

      <LineChart width={600} height={300} data={data.growth}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="projectedValue" />
      </LineChart>
    </div>
  )
}
