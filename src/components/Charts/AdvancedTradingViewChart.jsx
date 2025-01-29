import React from 'react';
import TradingViewWidget from 'react-tradingview-widget';

const AdvancedTradingViewChart = ({ symbol = "BINANCE:BTCUSDT" }) => {
    return (
        <div className="tradingview-container" style={{ width: '100%', height: '600px' }}>
            <TradingViewWidget
                symbol={symbol} // Set symbol dynamically or default to BTC/USDT
                autosize // Automatically adjust to the container's size
                theme="dark" // Use dark mode for the chart
                locale="en" // Language of the chart
                timezone="Etc/UTC"
                hide_side_toolbar={false} // Display side toolbar
                allow_symbol_change={true} // Allow users to change the asset
                enable_publishing={false} // Disable "publish" button
                container_id="tradingview_chart"
            />
        </div>
    );
};

export default AdvancedTradingViewChart;
