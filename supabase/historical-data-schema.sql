-- Historical Stock Data Schema for Nur Finance
-- Run this in Supabase SQL Editor

-- Exchanges table: all supported exchanges
CREATE TABLE IF NOT EXISTS exchanges (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  currency TEXT NOT NULL,
  region TEXT NOT NULL,
  stock_count INTEGER DEFAULT 0,
  last_synced TIMESTAMPTZ
);

-- Stocks/symbols table: all tradeable instruments
CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  exchange TEXT NOT NULL REFERENCES exchanges(code),
  type TEXT DEFAULT 'Common Stock',
  country TEXT NOT NULL,
  currency TEXT,
  isin TEXT,
  full_symbol TEXT GENERATED ALWAYS AS (code || '.' || exchange) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code, exchange)
);

-- Daily OHLCV data: the main historical data table
CREATE TABLE IF NOT EXISTS daily_prices (
  id BIGSERIAL PRIMARY KEY,
  stock_id INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  open DOUBLE PRECISION,
  high DOUBLE PRECISION,
  low DOUBLE PRECISION,
  close DOUBLE PRECISION NOT NULL,
  adjusted_close DOUBLE PRECISION,
  volume BIGINT,
  UNIQUE(stock_id, date)
);

-- Ingest jobs: track data download progress
CREATE TABLE IF NOT EXISTS ingest_jobs (
  id SERIAL PRIMARY KEY,
  exchange TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  total_stocks INTEGER DEFAULT 0,
  processed_stocks INTEGER DEFAULT 0,
  failed_stocks INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_stocks_exchange ON stocks(exchange);
CREATE INDEX IF NOT EXISTS idx_stocks_country ON stocks(country);
CREATE INDEX IF NOT EXISTS idx_stocks_full_symbol ON stocks(full_symbol);
CREATE INDEX IF NOT EXISTS idx_daily_prices_stock_date ON daily_prices(stock_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_prices_date ON daily_prices(date);
CREATE INDEX IF NOT EXISTS idx_ingest_jobs_status ON ingest_jobs(status);

-- Partitioning hint: for very large datasets, consider partitioning daily_prices by date range
-- CREATE TABLE daily_prices_1990s PARTITION OF daily_prices FOR VALUES FROM ('1990-01-01') TO ('2000-01-01');
-- etc.

-- View: latest price for each stock
CREATE OR REPLACE VIEW latest_prices AS
SELECT DISTINCT ON (dp.stock_id)
  dp.stock_id,
  s.code,
  s.name,
  s.exchange,
  s.country,
  s.full_symbol,
  dp.date,
  dp.open,
  dp.high,
  dp.low,
  dp.close,
  dp.adjusted_close,
  dp.volume
FROM daily_prices dp
JOIN stocks s ON s.id = dp.stock_id
ORDER BY dp.stock_id, dp.date DESC;

-- View: stock data coverage summary
CREATE OR REPLACE VIEW data_coverage AS
SELECT
  s.exchange,
  s.country,
  COUNT(DISTINCT s.id) AS stock_count,
  MIN(dp.date) AS earliest_date,
  MAX(dp.date) AS latest_date,
  COUNT(dp.id) AS total_records
FROM stocks s
LEFT JOIN daily_prices dp ON dp.stock_id = s.id
GROUP BY s.exchange, s.country;

-- Function: upsert daily prices in bulk
CREATE OR REPLACE FUNCTION upsert_daily_prices(
  p_stock_id INTEGER,
  p_data JSONB
) RETURNS INTEGER AS $$
DECLARE
  inserted_count INTEGER := 0;
  row_data JSONB;
BEGIN
  FOR row_data IN SELECT * FROM jsonb_array_elements(p_data)
  LOOP
    INSERT INTO daily_prices (stock_id, date, open, high, low, close, adjusted_close, volume)
    VALUES (
      p_stock_id,
      (row_data->>'date')::DATE,
      (row_data->>'open')::DOUBLE PRECISION,
      (row_data->>'high')::DOUBLE PRECISION,
      (row_data->>'low')::DOUBLE PRECISION,
      (row_data->>'close')::DOUBLE PRECISION,
      (row_data->>'adjusted_close')::DOUBLE PRECISION,
      (row_data->>'volume')::BIGINT
    )
    ON CONFLICT (stock_id, date) DO UPDATE SET
      open = EXCLUDED.open,
      high = EXCLUDED.high,
      low = EXCLUDED.low,
      close = EXCLUDED.close,
      adjusted_close = EXCLUDED.adjusted_close,
      volume = EXCLUDED.volume;
    inserted_count := inserted_count + 1;
  END LOOP;
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;
