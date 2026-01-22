import React, { useState } from 'react';
import { n8nService } from '../services/n8nService';

const BroadcastForm = () => {
    const [formData, setFormData] = useState({
        phone: '',
        message: '',
        mediaUrl: '',
        mediaType: 'image'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    mediaUrl: reader.result // Base64 string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const phoneNumbers = formData.phone.split(',').map(p => p.trim()).filter(Boolean);

        if (phoneNumbers.length === 0) {
            setStatus({ type: 'error', message: 'Please enter at least one phone number.' });
            setLoading(false);
            return;
        }

        let successCount = 0;
        let failCount = 0;

        try {
            // Process sequentially to avoid rate limits or overwhelming the backend
            for (let i = 0; i < phoneNumbers.length; i++) {
                const phone = phoneNumbers[i];
                setStatus({ type: 'info', message: `Sending to ${phone} (${i + 1}/${phoneNumbers.length})...` });

                const payload = {
                    phone: phone,
                    message: formData.message,
                    mediaUrl: formData.mediaUrl || undefined,
                    mediaType: formData.mediaUrl ? formData.mediaType : undefined
                };

                try {
                    await n8nService.sendBroadcast(payload);
                    successCount++;
                } catch (error) {
                    console.error(`Failed to send to ${phone}`, error);
                    failCount++;
                }
            }

            if (failCount === 0) {
                setStatus({ type: 'success', message: `Successfully sent to ${successCount} contact${successCount !== 1 ? 's' : ''}!` });
                setFormData(prev => ({ ...prev, message: '', mediaUrl: '' }));
            } else if (successCount > 0) {
                setStatus({ type: 'warning', message: `Sent to ${successCount} contacts, but failed for ${failCount}.` });
            } else {
                setStatus({ type: 'error', message: 'Failed to send to all contacts.' });
            }

        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto my-12 border border-indigo-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send Broadcast</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Numbers (comma separated)
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., 919876543210, 919876543211"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter multiple numbers separated by commas.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                        placeholder="Type your message here..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Media Attachment
                            </label>
                            <div className="flex gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => { setUploadMode('url'); setFormData(prev => ({ ...prev, mediaUrl: '' })); }}
                                    className={`px-2 py-1 rounded ${uploadMode === 'url' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setUploadMode('file'); setFormData(prev => ({ ...prev, mediaUrl: '' })); }}
                                    className={`px-2 py-1 rounded ${uploadMode === 'file' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        {uploadMode === 'url' ? (
                            <input
                                type="url"
                                name="mediaUrl"
                                value={formData.mediaUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        ) : (
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept={formData.mediaType === 'image' ? 'image/*' : formData.mediaType === 'video' ? 'video/*' : '.pdf,.doc,.docx'}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        )}
                        {uploadMode === 'file' && formData.mediaUrl && (
                            <p className="mt-1 text-xs text-green-600 truncate">File loaded: {formData.mediaUrl.substring(0, 30)}...</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Media Type
                        </label>
                        <select
                            name="mediaType"
                            value={formData.mediaType}
                            onChange={(e) => {
                                handleChange(e);
                                // Clear media if switching types to prevent invalid file persistence
                                setFormData(prev => ({ ...prev, mediaUrl: '' }));
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="document">Document</option>
                        </select>
                    </div>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                            status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                                status.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                    'bg-blue-50 text-blue-700 border border-blue-200' // Info
                        }`}>
                        {status.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </span>
                    ) : 'Ids Send Broadcast'}
                </button>
            </form>
        </div>
    );
};

export default BroadcastForm;
