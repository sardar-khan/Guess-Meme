import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CandlestickComboChart = () => {

    const { id } = useParams();
    const [coinData, setCoinData] = useState(null);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                const response = await axios.get(`${apiUrl}trade/graph-data?token_id=${id}`);
                setCoinData(response.data);
                setError(null);  // Clear any previous errors
                console.log("Coin Data:", response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError("No trades found for the specified token.");
                } else {
                    setError("Error fetching coin data.");
                }
                console.error("Error fetching coin data:", error);
            }
        };

        fetchCoinData();
    }, [id]);

    // Transform the graphdata into the series format for the candlestick chart
    const series = [{
        name: 'Candlestick Data',
        data: coinData?.data.map(item => ({
            x: new Date(item.time).getTime(),
            y: [item.open, item.high, item.low, item.close] // Candlestick format
        }))
    }];

    const options = {
        series: series,
        chart: {
            height: 350,
            type: 'candlestick', // Change type to candlestick
            background: '#231930', // Set background color here
        },
        title: {
            text: 'Candlestick Chart',
            style: {
                color: '#fff' // Optional: set title color to contrast with background
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#fff' // Optional: set x-axis label color
                }
            }
        },
        yaxis: {
            tooltip: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(2);
                }
            },
            labels: {
                style: {
                    colors: '#fff' // Optional: set y-axis label color
                }
            }
        }
    };

    return (
        <div className="app w-full">
            <div className="mixed-chart">
                <Chart
                    options={options}
                    series={series}
                    type="candlestick" // Change type to candlestick
                    height={450}
                    width="100%"
                />
            </div>
        </div>
    );
};

export default CandlestickComboChart;
