import React, { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Dark Theme Configuration
Highcharts.setOptions({
    chart: {
        backgroundColor: '#231930', // Dark background
        style: { color: '#ffffff' } // Text color
    },
    title: { style: { color: '#ffffff' } },
    xAxis: {
        labels: { style: { color: '#ffffff' } }
    },
    yAxis: {
        labels: { style: { color: '#ffffff' } },
        gridLineColor: '#333333'
    },
    navigator: {
        outlineColor: '#ffffff',
        maskFill: 'rgba(255,255,255,0.2)'
    },
    rangeSelector: {
        buttonTheme: {
            fill: '#333333',
            style: { color: '#ffffff' },
            states: { hover: { fill: '#555555', style: { color: '#ffffff' } } }
        },
        labelStyle: { color: '#ffffff' }
    },
    tooltip: {
        backgroundColor: '#333333',
        style: { color: '#ffffff' }
    }
});

const HighchartsReactNew = () => {
    const { id } = useParams();
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get(`${apiUrl}trade/graph-data?token_id=${id}`);
                console.log("chartData response:", response);

                const formattedData = response.data?.data?.map(item => [
                    new Date(item.time).getTime(), // x-axis time
                    item.open, // Open price
                    item.high, // High price
                    item.low,  // Low price
                    item.close // Close price
                ]);

                setChartData(formattedData || []);
                setError(null);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError("No trades found for the specified token.");
                } else {
                    setError("Error fetching chart data.");
                }
                console.error("Error fetching chart data:", error);
            }
        };

        fetchChartData();
    }, [id]);
    console.log("chartData:", chartData);

    const options = {
        rangeSelector: {
            selected: 1,
            buttons: [
                { type: 'minute', count: 1, text: '1m' },
                { type: 'hour', count: 1, text: '1h' },
                { type: 'day', count: 1, text: '1D' },
                { type: 'week', count: 1, text: '1W' },
                { type: 'month', count: 1, text: '1M' },
                { type: 'all', text: 'All' }
            ]
        },
        title: { text: 'Candlestick Chart' },
        series: [{
            type: 'candlestick',
            name: 'Price Data',
            data: chartData,
            color: 'red',    // Bearish candle
            upColor: 'green' // Bullish candle
        }],
        xAxis: { type: 'datetime' },
        yAxis: {
            labels: {
                format: '{value}',
                style: { color: '#ffffff' }
            }
        }
    };

    return (
        <div className="chart-container" style={{ backgroundColor: '#231930', padding: '10px' }}>
            {/* {error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : ( */}
            <HighchartsReact
                highcharts={Highcharts}
                constructorType="stockChart"
                options={options}
            />
            {/* )} */}
        </div>
    );
};

export default HighchartsReactNew;


// import React from 'react';
// import HighchartsReact from 'highcharts-react-official';
// import Highcharts from 'highcharts/highstock';

// // Dark Theme Configuration
// Highcharts.setOptions({
//     chart: {
//         backgroundColor: '#231930', // Dark background
//         style: {
//             color: '#ffffff' // Text color
//         }
//     },
//     title: {
//         style: {
//             color: '#ffffff'
//         }
//     },
//     xAxis: {
//         labels: {
//             style: { color: '#ffffff' } // X-axis text
//         }
//     },
//     yAxis: {
//         labels: {
//             style: { color: '#ffffff' } // Y-axis text
//         },
//         gridLineColor: '#333333' // Grid color
//     },
//     navigator: {
//         outlineColor: '#ffffff', // Navigator outline
//         maskFill: 'rgba(255,255,255,0.2)' // Navigator mask
//     },
//     rangeSelector: {
//         buttonTheme: { // Time button style
//             fill: '#333333',
//             style: {
//                 color: '#ffffff'
//             },
//             states: {
//                 hover: {
//                     fill: '#555555',
//                     style: { color: '#ffffff' }
//                 }
//             }
//         },
//         labelStyle: { color: '#ffffff' } // Range selector text
//     },
//     tooltip: {
//         backgroundColor: '#333333',
//         style: { color: '#ffffff' }
//     }
// });

// const options = {
//     rangeSelector: {
//         selected: 1,
//         buttons: [
//             { type: 'minute', count: 1, text: '1m' },
//             { type: 'hour', count: 1, text: '1h' },
//             { type: 'day', count: 1, text: '1D' },
//             { type: 'week', count: 1, text: '1W' },
//             { type: 'month', count: 1, text: '1M' },
//             { type: 'all', text: 'All' }
//         ]
//     },
//     title: {
//         text: 'Candlestick Chart'
//     },
//     series: [{
//         type: 'candlestick',
//         name: 'Stock Data',
//         data: [
//             [1625097600000, 100, 110, 90, 105],
//             [1625184000000, 105, 115, 95, 108],
//             [1625270400000, 108, 120, 102, 118],
//             [1625356800000, 118, 130, 112, 125],
//             [1625443200000, 125, 135, 120, 130]
//         ],
//         color: 'red', // Bearish candle color
//         upColor: 'green' // Bullish candle color
//     }]
// };

// const HighchartsReactNew = () => {
//     return (
//         <div className="chart-container" style={{ backgroundColor: '#231930', padding: '10px' }}>
//             <HighchartsReact
//                 highcharts={Highcharts}
//                 constructorType="stockChart"
//                 options={options}
//             />
//         </div>
//     );
// };

// export default HighchartsReactNew;
