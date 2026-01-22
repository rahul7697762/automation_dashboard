-- Migration to update sales_calls table for Retell AI integration
-- Run this SQL in your Supabase SQL Editor

-- Add new columns if they don't exist
ALTER TABLE sales_calls
ADD COLUMN IF NOT EXISTS call_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS agent_id TEXT,
ADD COLUMN IF NOT EXISTS disconnection_reason TEXT,
ADD COLUMN IF NOT EXISTS call_summary TEXT,
ADD COLUMN IF NOT EXISTS user_sentiment TEXT,
ADD COLUMN IF NOT EXISTS call_successful BOOLEAN DEFAULT false;

-- Create an index on call_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_sales_calls_call_id ON sales_calls(call_id);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_sales_calls_created_at ON sales_calls(created_at DESC);

-- Add a comment to the table
COMMENT ON TABLE sales_calls IS 'Stores call records from Retell AI voice agent';
