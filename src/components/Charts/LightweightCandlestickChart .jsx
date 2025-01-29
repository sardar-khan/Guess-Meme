import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LightweightCandlestickChart = () => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const { id } = useParams();
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                const response = await axios.get(`${apiUrl}trade/graph-data?token_id=${id}`);
                if (response.data && response.data.data) {
                    const formattedData = response.data.data.map((item) => ({
                        time: Math.floor(new Date(item.time).getTime() / 1000), // Convert to seconds
                        open: item.open,
                        high: item.high,
                        low: item.low,
                        close: item.close,
                    }));

                    initializeChart(formattedData);
                } else {
                    setError('No trades found for the specified token.');
                }
            } catch (err) {
                console.error('Error fetching coin data:', err);
                setError('Error fetching coin data.');
            }
        };

        fetchCoinData();
    }, [id]);

    const initializeChart = (data) => {
        // If chart already exists, clear it
        if (chartRef.current) {
            chartRef.current.remove();
        }

        // Create the chart
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 450,
            layout: {
                backgroundColor: '#231930',
                textColor: '#ffffff',
            },
            grid: {
                vertLines: { color: '#444' },
                horzLines: { color: '#444' },
            },
            priceScale: {
                borderColor: '#555',
            },
            timeScale: {
                borderColor: '#555',
                timeVisible: true,
                secondsVisible: true,
            },
        });

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00C853',
            downColor: '#D50000',
            borderUpColor: '#00C853',
            borderDownColor: '#D50000',
            wickUpColor: '#00C853',
            wickDownColor: '#D50000',
        });

        candlestickSeries.setData(data);

        // Save references for cleanup
        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;

        // Resize chart dynamically
        const resizeObserver = new ResizeObserver(() => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        });
        resizeObserver.observe(chartContainerRef.current);

        return () => resizeObserver.disconnect();
    };

    return (
        <div className="w-full">
            {error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div ref={chartContainerRef} style={{ width: '100%', height: '450px' }} />
            )}
        </div>
    );
};

export default LightweightCandlestickChart;
