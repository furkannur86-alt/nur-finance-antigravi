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
