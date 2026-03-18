export const COLS = 60;                // visible candles
export const SPACING = 22;
export const WIDTH = 1200;
export const HEIGHT = 1400;

export const PAD_TOP = 120;
export const PAD_BOTTOM = 320;

// “1m-ish” feel
export const TICK_RATE = 20;           // ticks/sec
export const CANDLE_SECONDS = 2.2;     // seconds per candle

// GBM params (stylized)
export const MU = 0.10;
export const SIGMA = 1.45;
export const SECONDS_PER_TRADING_YEAR = 252 * 6.5 * 3600;

// Orders
export const ORDER_SPAWN_PER_SEC = 2.5;
export const ORDER_PRICE_DIST = 0.35;
export const MAX_RESTING_ORDERS = 48;
export const MAX_RECENT_FILLS = 6;

// Indicators
export const SHOW_BB = true;
export const BB_LEN = 20;
export const BB_STD = 2;
