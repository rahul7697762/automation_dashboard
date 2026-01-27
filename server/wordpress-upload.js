
// WordPress Upload Endpoint
app.post('/api/upload-to-wordpress', async (req, res) => {
    try {
        const { wpUrl, wpUser, wpPassword, title, content, imageUrl } = req.body;

        if (!wpUrl || !wpUser || !wpPassword || !title || !content) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        console.log('Uploading to WordPress:', wpUrl);

        // 1. Upload image to WordPress media library if provided
        let featuredMediaId = null;
        if (imageUrl) {
            try {
                console.log('Downloading image from:', imageUrl);
                const imageResponse = await fetch(imageUrl);
                const imageBuffer = await imageResponse.arrayBuffer();

                const wpMediaUrl = `${wpUrl.replace(/\/+$/, '')}/wp-json/wp/v2/media`;
                const filename = `blog-image-${Date.now()}.png`;

                const formData = new FormData();
                formData.append('file', new Blob([imageBuffer]), filename);

                const mediaResponse = await fetch(wpMediaUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')
                    },
                    body: formData
                });

                if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    featuredMediaId = mediaData.id;
                    console.log('Image uploaded to WordPress, Media ID:', featuredMediaId);
                } else {
                    console.error('Failed to upload image to WordPress:', await mediaResponse.text());
                }
            } catch (imageError) {
                console.error('Error uploading image:', imageError);
                // Continue without featured image
            }
        }

        // 2. Create WordPress post
        const wpApiUrl = `${wpUrl.replace(/\/+$/, '')}/wp-json/wp/v2/posts`;

        const postData = {
            title: title,
            content: content,
            status: 'draft', // Create as draft for review
            excerpt: content.substring(0, 200).replace(/<[^>]*>/g, ''), // Extract plain text for excerpt
        };

        if (featuredMediaId) {
            postData.featured_media = featuredMediaId;
        }

        const response = await fetch(wpApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${wpUser}:${wpPassword}`).toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
        }

        const postResult = await response.json();
        console.log('Post created on WordPress:', postResult.link);

        res.json({
            success: true,
            link: postResult.link,
            postId: postResult.id
        });

    } catch (error) {
        console.error('Error uploading to WordPress:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
