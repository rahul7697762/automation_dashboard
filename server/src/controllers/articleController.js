import PerplexityService from '../services/perplexityService.js';
import OpenAIService from '../services/openAIService.js';
import { supabase } from '../config/supabaseClient.js';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export const generateArticle = async (req, res) => {
    try {
        const {
            topic,
            keywords = "",
            language = "English",
            style = "conversational",
            length = "Medium (500-1000 words)",
            audience = "general public",
            variants = 1,
        } = req.body;

        const userId = req.user.id; // From Auth Middleware
        const token = req.token;

        // Create scoped Supabase client for RLS
        const scopedSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });

        if (!topic) {
            return res.status(400).json({ success: false, error: 'Topic is required' });
        }

        // 1. Check Credits
        const CREDIT_COST = 5;
        const { data: creditData, error: creditError } = await scopedSupabase
            .from('user_credits')
            .select('balance')
            .eq('user_id', userId)
            .single();

        if (creditError && creditError.code !== 'PGRST116') { // Ignore row missing if handled elsewhere, but rigorous check is better
            console.error('Credit check error:', creditError);
            return res.status(500).json({ success: false, error: 'Failed to check credits' });
        }

        const currentBalance = creditData?.balance || 0;
        if (currentBalance < CREDIT_COST) {
            return res.status(402).json({ success: false, error: 'Insufficient credits', required: CREDIT_COST, balance: currentBalance });
        }

        console.log('Credits check passed. Balance:', currentBalance);

        // 2. Keyword Research
        console.log('Starting keyword research...');
        let generatedKeywords = keywords;
        if (!keywords || keywords.trim() === '') {
            generatedKeywords = await PerplexityService.generateKeywords(topic);
        }
        console.log('Keywords:', generatedKeywords);

        // 3. Generate Blog Content
        console.log('Generating blog content...');
        const lengthMapping = {
            "Short (300-500 words)": 300,
            "Medium (500-1000 words)": 500,
            "Long (1000-2000 words)": 1000,
        };
        const lengthNum = lengthMapping[length] || 500;

        const { blogText, wordCount } = await PerplexityService.generateBlogContent(
            topic,
            generatedKeywords,
            language,
            audience,
            style,
            lengthNum,
            0,
            3,
            variants
        );
        console.log('Blog content generated. Words:', wordCount);

        // 4. Generate SEO Title
        console.log('Generating SEO Title...');
        const seoTitle = await PerplexityService.generateSeoTitle(blogText, topic);

        // 5. Plagiarism Check
        console.log('Checking plagiarism...');
        const plagiarismCheck = await PerplexityService.checkPlagiarism(blogText);

        // 6. Generate Image
        console.log('Generating Image...');
        const imageText = await PerplexityService.generateImageText(blogText, topic);
        let imageUrl = await OpenAIService.generateImage(topic, imageText);
        console.log('Image generated:', imageUrl);

        // 6.1 Persist Image to Supabase Storage
        if (imageUrl && !imageUrl.startsWith('http')) {
            // Handle potential placeholder or error case from OpenAIService if it didn't return a proper URL
        } else if (imageUrl) {
            try {
                // Download image
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');

                const fileName = `blog-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;

                // Upload to Supabase
                const { data: uploadData, error: uploadError } = await scopedSupabase
                    .storage
                    .from('blog-images')
                    .upload(fileName, buffer, {
                        contentType: 'image/png',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Supabase Storage Upload Error:', uploadError);
                    // Fallback to OpenAI URL (temporary) if upload fails
                } else {
                    console.log('Image uploaded successfully:', uploadData);
                    // Get Public URL
                    const { data: publicUrlData } = scopedSupabase
                        .storage
                        .from('blog-images')
                        .getPublicUrl(fileName);

                    if (publicUrlData && publicUrlData.publicUrl) {
                        imageUrl = publicUrlData.publicUrl;
                    }
                }
            } catch (storageError) {
                console.error('Image persistence failed:', storageError);
                // Fallback to OpenAI URL
            }
        }


        // 7. Format Content (Simple HTML wrapping for now, client can handle markdown too or we format here)
        // User requested formatting function:
        const formatBlogToHTML = (text) => {
            return text
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/\n{2,}/g, '</p><p>')
                .replace(/^/, '<p>')
                .concat('</p>');
        };
        const blogHTML = formatBlogToHTML(blogText);

        // 8. Deduct Credits
        const { error: deductError } = await scopedSupabase
            .from('user_credits')
            .update({
                balance: currentBalance - CREDIT_COST,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (deductError) {
            console.error('Failed to deduct credits after generation:', deductError);
            // We don't fail the request, but log critical error
        } else {
            console.log('Credits deducted.');
        }

        // 9. Save Article
        console.log('Saving article...');
        const { data: savedArticle, error: saveError } = await scopedSupabase
            .from('articles') // Ensure this table exists in Supabase
            .insert({
                user_id: userId,
                topic,
                keywords: generatedKeywords,
                content: blogHTML, // or blogText if we want raw markdown
                seo_title: seoTitle,
                image_url: imageUrl,
                word_count: wordCount,
                plagiarism_check: plagiarismCheck,
                language,
                audience,
                style
            })
            .select()
            .single();

        if (saveError) {
            console.error('Save article error:', saveError);
            // Return success with data but warn about save? Or just return success.
            // We can return the generated data even if save fails.
        }

        res.json({
            success: true,
            article: blogHTML, // Frontend expects 'article' key for content? check frontend.
            seoTitle,
            imageUrl,
            wordCount,
            plagiarismCheck,
            id: savedArticle?.id
        });

    } catch (error) {
        console.error('Article Generation Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
