export const getUniqueStrings = (strings) => {
    return Array.from(new Set(strings));
};

export const wrapError = (message, err) => {
    const wrapped = new Error(`${message} ${err.message}`);
    wrapped.stack = err.stack;
    return wrapped;
};

const round = (value, digits = 2) => {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
};

export const calculatePriceAnalytics = (currentPrice, previousPrice, prices) => {
    const ma5 = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    const maDeviation = currentPrice - ma5;
    const maDeviationPercent = (maDeviation / ma5) * 100;

    const direction = currentPrice > previousPrice ? 'UP' : 'DOWN';
    const pricePosition = currentPrice > ma5 ? 'ABOVE' : currentPrice < ma5 ? 'BELOW' : 'EQUAL';

    let trend = 'NEUTRAL';
    if (pricePosition === 'ABOVE' && direction === 'UP') {
        trend = 'BULLISH';
    } else if (pricePosition === 'BELOW' && direction === 'DOWN') {
        trend = 'BEARISH';
    }

    return {
        current_price: currentPrice,
        previous_price: previousPrice,
        change: round(change),
        change_percent: round(changePercent),
        ma5: round(ma5),
        ma_deviation: round(maDeviation),
        ma_deviation_percent: round(maDeviationPercent),
        direction,
        price_position: pricePosition,
        trend,
    };
};

export const formatGoldAlertMessage = ({
    current_price,
    previous_price,
    change,
    change_percent,
    ma5,
    ma_deviation,
    ma_deviation_percent,
    direction,
    trend,
}) => `🟢 GOLD PRICE ALERT

Price: ${current_price}
Previous: ${previous_price}
Change: ${change} (${change_percent}%)

5-Event Average: ${ma5}
Price vs Average: ${ma_deviation} (${ma_deviation_percent}%)

Direction: ${direction}
Trend: ${trend}`;
