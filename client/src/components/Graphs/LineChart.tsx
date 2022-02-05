import React from 'react';
import Plot from 'react-plotly.js';
import { DataType } from './Types'

type LineChartProps = {
    data: DataType[],
    layout: any
}
const LineChart: React.FC<LineChartProps> = ({data, layout}) => {

    
    return(
        <Plot
            data={data}
            layout={layout}
        />
    )
}