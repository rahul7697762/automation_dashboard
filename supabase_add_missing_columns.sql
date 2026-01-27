-- Migration: Add missing columns to articles table
-- Run this in your Supabase SQL Editor

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS word_count INTEGER,
ADD COLUMN IF NOT EXISTS plagiarism_check TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles'
ORDER BY ordinal_position;
