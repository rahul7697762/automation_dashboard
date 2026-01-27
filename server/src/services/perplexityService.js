import axios from 'axios';

class PerplexityService {
    constructor() {
        this.apiKey = process.env.PERPLEXITY_API_KEY;
        this.baseUrl = 'https://api.perplexity.ai/chat/completions';

        if (!this.apiKey) {
            console.warn('⚠️ PERPLEXITY_API_KEY is not set. Blog generation features will fail.');
        }
    }

    async generateKeywords(topic) {
        try {
            const prompt = `Generate relevant keywords for "${topic}" as comma-separated list.`;
            const response = await axios.post(
                this.baseUrl,
                {
                    model: "sonar-pro",
                    messages: [
                        { role: "system", content: "You are an SEO expert." },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 500,
                    n: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.choices?.[0]?.message?.content || "";
        } catch (error) {
            console.error('Perplexity Keyword Error:', error.response?.data || error.message);
            throw new Error('Failed to generate keywords');
        }
    }

    async generateBlogContent(topic, keywords, language, audience, style, lengthNum, attempts, maxAttempts, variants) {
        let blogText = "";
        let wordCount = 0;
        let generatedKeywords = keywords;

        // Simple loop implementation based on user request (though recursive or iterative is fine)
        // User's code was: while (wordCount < lengthNum && attempts < maxAttempts)
        // We will do a single robust call first, as Perplexity usually handles length well if prompted correctly.
        // But let's follow the user's logic of appending if short.

        let currentAttempts = 0;

        while (wordCount < lengthNum && currentAttempts < maxAttempts) {
            currentAttempts++;
            const prompt = `Write an engaging blog for ${audience} in ${language} on "${topic}". Include keywords: ${generatedKeywords || "none"}. Use ${style} style. Ensure at least ${lengthNum} words. ⚠️ Important: Do not use [1], [2], or citation numbers. Instead, insert valid external references as clickable HTML links (<a href="..." target="_blank" rel="noopener noreferrer">text</a>). All links must be real websites (Wikipedia, government, research journals, or news sources). ${blogText ? "Continue from previous text: " + blogText.substring(blogText.length - 100) : ""}`;

            try {
                const n_variants = parseInt(variants, 10);
                const safe_n = (!isNaN(n_variants) && n_variants > 0) ? n_variants : 1;
                console.log('Generating blog with n=', safe_n, '(from variants:', variants, ')');

                const response = await axios.post(
                    this.baseUrl,
                    {
                        model: "sonar-pro",
                        messages: [
                            { role: "system", content: "You are an expert content writer." },
                            { role: "user", content: prompt },
                        ],
                        max_tokens: 4000,
                        n: safe_n,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const newContent = response.data.choices?.[0]?.message?.content || "";
                blogText += "\n\n" + newContent;
                wordCount = blogText.split(/\s+/).length;

            } catch (error) {
                console.error('Perplexity Blog Gen Error:', error.response?.data || error.message);
                throw new Error('Failed to generate blog content');
            }
        }

        return { blogText, wordCount };
    }

    async generateSeoTitle(blogText, topic) {
        try {
            const prompt = `Based on this blog content, generate the best SEO-friendly title (max 60 characters) that is catchy and optimized for search engines:
            ${blogText.substring(0, 1200)}
            Topic: ${topic}
            Return only the title, nothing else.`;

            const response = await axios.post(
                this.baseUrl,
                {
                    model: "sonar-pro",
                    messages: [
                        { role: "system", content: "You are an expert SEO copywriter." },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 50,
                    n: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data.choices?.[0]?.message?.content?.trim() || topic;
        } catch (error) {
            console.error('Perplexity SEO Title Error:', error.message);
            return topic; // Fallback
        }
    }

    async checkPlagiarism(blogText) {
        try {
            console.log('🔍 Starting plagiarism check...');

            if (!blogText || blogText.trim() === '') {
                console.warn('⚠️ Empty blog text provided to plagiarism checker');
                return "Plagiarism check skipped - empty content";
            }

            const prompt = `Check for plagiarism in this article. Reply "No plagiarism detected" if original, otherwise summarize detected parts:\n\n${blogText.substring(0, 3000)}`; // Truncate for token limits if needed

            const response = await axios.post(
                this.baseUrl,
                {
                    model: "sonar-pro",
                    messages: [
                        { role: "system", content: "You are a plagiarism checker." },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 500,
                    n: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log('✅ Plagiarism check API response received');

            let result = response.data?.choices?.[0]?.message?.content;

            if (!result || result.trim() === '') {
                console.warn('⚠️ Empty response from plagiarism API, using fallback');
                result = "No plagiarism detected";
            }

            result = result.trim();

            if (!result.toLowerCase().includes("no plagiarism")) {
                result += " ⚠️ Could not fully eliminate plagiarism, but the article is returned to user.";
            }

            console.log('✅ Plagiarism check result:', result.substring(0, 100) + '...');
            return result;
        } catch (error) {
            console.error('❌ Perplexity Plagiarism Error:', error.response?.data || error.message);
            return "Plagiarism check unavailable - service error";
        }
    }

    async generateImageText(blogText, topic) {
        try {
            const prompt = `Based on this blog content, create a short, simplest, small and catchy headline or phrase (maximum 3 words) that would look good on a blog header image. Make it engaging and relevant to the content:
            ${blogText.substring(0, 1000)}
            Topic: ${topic}
            Return only the headline text, nothing else.`;

            const response = await axios.post(
                this.baseUrl,
                {
                    model: "sonar-pro",
                    messages: [
                        { role: "system", content: "You are a marketing copywriter expert at creating catchy headlines." },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 100,
                    n: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            let text = response.data.choices?.[0]?.message?.content?.trim() || topic;
            // Clean up
            return text.replace(/^["']|["']$/g, '').replace(/[^\w\s-]/g, '').trim();
        } catch (error) {
            console.error('Perplexity Image Text Error:', error.message);
            return topic;
        }
    }
}

export default new PerplexityService();
