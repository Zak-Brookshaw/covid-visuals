import React from 'react';
import Plot from 'react-plotly.js';
// import { DataType } from './Types'

type LineChartProps = {
    data: any[],
    layout: any
}
export const LineChart: React.FC<LineChartProps> = ({data, layout}) => { 
    return(
        <Plot
            data={data}
            layout={layout}
        />
    )
}