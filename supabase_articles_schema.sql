-- Create articles table for blog posts
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    seo_title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    keywords TEXT,
    language TEXT DEFAULT 'English',
    style TEXT DEFAULT 'Professional',
    length TEXT DEFAULT 'Medium (500-1000 words)',
    audience TEXT DEFAULT 'General Public',
    word_count INTEGER,
    plagiarism_check TEXT,
    user_id TEXT DEFAULT 'anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations on articles" ON articles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comment
COMMENT ON TABLE articles IS 'Stores SEO-generated blog articles';
