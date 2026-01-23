import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                        New Generation of Automation
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white leading-tight">
                        Automate Your Workflow <br className="hidden md:block" />
                        <span className="text-blue-600 dark:text-blue-400">With Intelligent Agents</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Deploy autonomous agents to handle social media, data processing, and complex workflows. bitlance.ai brings the power of AGI to your fingertips.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/agents">
                            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1">
                                Get Started Now
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-gray-800 border-2 border-gray-100 font-bold text-lg hover:border-gray-200 hover:bg-gray-50 transition-all">
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Bitlance?</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our platform offers robust tools designed to scale with your business needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">Lightning Fast</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Experience zero latency with our edge-optimized agent architecture.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">Fully Customizable</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Tailor every aspect of your agents to fit your specific workflow requirements.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">Enterprise Security</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Bank-grade encryption and security protocols to keep your data safe.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
