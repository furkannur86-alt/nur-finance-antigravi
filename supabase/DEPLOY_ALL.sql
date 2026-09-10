-- ================================================================
-- NUR Finance AntiGravi — Supabase Schema (tumu tek seferde calistir)
-- Dashboard: https://supabase.com/dashboard/project/ifrgvswdqxjieqyejznh/sql/new
-- ================================================================

-- Real customer account profiles, linked 1:1 to Supabase Auth's built-in auth.users table.
-- Run this in the Supabase SQL editor once a project is provisioned.

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  tier TEXT NOT NULL DEFAULT 'NONE' CHECK (tier IN ('NONE', 'NUR_FINANCE_R', 'NUR_FINANCE_B')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- A user can only read/update their own profile row.
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create a profile row whenever a new auth.users row is created.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ================================================================

-- NUR Finance Broadcast Network Schema
-- Run this in Supabase SQL Editor after historical-data-schema.sql

-- Channels: all broadcast channels
CREATE TABLE IF NOT EXISTS broadcast_channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_local TEXT NOT NULL,
  language TEXT NOT NULL,
  secondary_languages TEXT[] DEFAULT '{}',
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  timezone TEXT NOT NULL,
  studio_name TEXT,
  flag TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('live', 'upcoming', 'pre-launch')),
  launch_date DATE,
  description TEXT,
  description_local TEXT,
  youtube_handle TEXT,
  topics TEXT[] DEFAULT '{}',
  brand_color TEXT,
  accent_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hosts: on-air anchors
CREATE TABLE IF NOT EXISTS broadcast_hosts (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL REFERENCES broadcast_channels(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  gender TEXT DEFAULT 'female',
  height_cm INTEGER DEFAULT 185,
  eye_color TEXT DEFAULT 'green',
  hair_color TEXT,
  hair_style TEXT,
  skin_tone TEXT,
  age_range TEXT,
  nationality TEXT,
  languages TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  certifications TEXT[] DEFAULT '{}',
  previous_employers TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  bio TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on-leave', 'training')),
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guests: recurring expert guests (professors, doctors)
CREATE TABLE IF NOT EXISTS broadcast_guests (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  title TEXT,
  gender TEXT,
  age_range TEXT,
  nationality TEXT,
  languages TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  current_position TEXT,
  institution TEXT,
  specializations TEXT[] DEFAULT '{}',
  publications INTEGER DEFAULT 0,
  typical_segment_minutes INTEGER DEFAULT 20,
  bio TEXT,
  image_url TEXT,
  image_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest-Channel mapping (many-to-many)
CREATE TABLE IF NOT EXISTS broadcast_guest_channels (
  guest_id TEXT NOT NULL REFERENCES broadcast_guests(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL REFERENCES broadcast_channels(id) ON DELETE CASCADE,
  PRIMARY KEY (guest_id, channel_id)
);

-- Shows: scheduled broadcast programs
CREATE TABLE IF NOT EXISTS broadcast_shows (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL REFERENCES broadcast_channels(id),
  name TEXT NOT NULL,
  name_local TEXT,
  format TEXT CHECK (format IN ('live-desk', 'panel-discussion', 'market-open', 'market-close', 'breaking-news', 'interview', 'deep-dive', 'weekend-review')),
  duration_minutes INTEGER DEFAULT 60,
  schedule JSONB DEFAULT '{}',
  description TEXT,
  segments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Show-Host mapping
CREATE TABLE IF NOT EXISTS broadcast_show_hosts (
  show_id TEXT NOT NULL REFERENCES broadcast_shows(id) ON DELETE CASCADE,
  host_id TEXT NOT NULL REFERENCES broadcast_hosts(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'anchor',
  PRIMARY KEY (show_id, host_id)
);

-- Show-Guest mapping (recurring guests per show)
CREATE TABLE IF NOT EXISTS broadcast_show_guests (
  show_id TEXT NOT NULL REFERENCES broadcast_shows(id) ON DELETE CASCADE,
  guest_id TEXT NOT NULL REFERENCES broadcast_guests(id) ON DELETE CASCADE,
  frequency TEXT DEFAULT 'weekly',
  PRIMARY KEY (show_id, guest_id)
);

-- Audio packages
CREATE TABLE IF NOT EXISTS broadcast_audio (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('intro', 'outro', 'breaking', 'transition', 'ambient', 'bumper')),
  duration_seconds INTEGER,
  mood TEXT,
  bpm INTEGER,
  description TEXT,
  production_note TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visual production tasks
CREATE TABLE IF NOT EXISTS broadcast_visual_tasks (
  id TEXT PRIMARY KEY,
  category TEXT CHECK (category IN ('host-portrait', 'guest-portrait', 'studio-render', 'logo-animation', 'lower-third', 'channel-bumper', 'social-template')),
  target_id TEXT NOT NULL,
  tool TEXT,
  prompt TEXT,
  width INTEGER,
  height INTEGER,
  result_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studio graphics configuration
CREATE TABLE IF NOT EXISTS broadcast_studio_graphics (
  channel_id TEXT PRIMARY KEY REFERENCES broadcast_channels(id),
  lower_third_style TEXT DEFAULT 'glass',
  ticker_position TEXT DEFAULT 'bottom',
  ticker_speed REAL DEFAULT 1.0,
  brand_watermark_position TEXT DEFAULT 'top-left',
  live_badge_color TEXT DEFAULT '#ef4444',
  breaking_banner_color TEXT DEFAULT '#dc2626',
  data_overlay_theme TEXT DEFAULT 'dark',
  chart_color_scheme TEXT[] DEFAULT '{}'
);

-- Breaking news templates
CREATE TABLE IF NOT EXISTS broadcast_breaking_templates (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title_template TEXT NOT NULL,
  urgency_level TEXT CHECK (urgency_level IN ('flash', 'urgent', 'developing')),
  auto_interrupt BOOLEAN DEFAULT false,
  graphics_package TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hosts_channel ON broadcast_hosts(channel_id);
CREATE INDEX IF NOT EXISTS idx_shows_channel ON broadcast_shows(channel_id);
CREATE INDEX IF NOT EXISTS idx_visual_tasks_status ON broadcast_visual_tasks(status);
CREATE INDEX IF NOT EXISTS idx_hosts_status ON broadcast_hosts(status);


-- ================================================================

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

