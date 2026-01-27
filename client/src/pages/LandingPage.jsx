import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Check, ArrowRight, Zap, Globe, MessageSquare,
    BarChart3, Shield, Users, Mic, PenTool, Share2,
    Play, ChevronDown, ChevronUp, Star
} from 'lucide-react';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const [openFaq, setOpenFaq] = useState(null);

    if (loading) return null;
    if (user) return <Navigate to="/home" replace />;

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 transition-colors duration-300">

            {/* 1. HERO SECTION */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 -z-10" />

                {/* Animated Background Blobs */}
                <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-indigo-400/20 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-400/20 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="flex h-2 w-2 relative mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-bold">
                            v2.0 Now Live: Voice Agents & SEO Blog Generation
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        The Only <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">AI Workforce</span> <br className="hidden md:block" />
                        You'll Ever Need
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Replace manual drudgery with autonomous agents. Deploy intelligent workers for
                        <strong> Sales Calls</strong>, <strong>SEO Content</strong>, and <strong>Social Media</strong> in minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup">
                            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                Start Free Trial <ArrowRight size={20} />
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 font-bold text-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                            <Play size={20} className="text-indigo-600" /> Watch Demo
                        </button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Check size={16} className="text-green-500" /> No credit card required</span>
                        <span className="flex items-center gap-1"><Check size={16} className="text-green-500" /> 14-day free trial</span>
                        <span className="flex items-center gap-1"><Check size={16} className="text-green-500" /> Cancel anytime</span>
                    </div>
                </div>
            </header>

            {/* 2. TRUST / SOCIAL PROOF */}
            <section className="py-10 border-y border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted by forward-thinking teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos */}
                        <div className="font-bold text-xl flex items-center gap-2"><Globe size={24} /> Acme Corp</div>
                        <div className="font-bold text-xl flex items-center gap-2"><Zap size={24} /> BoltShift</div>
                        <div className="font-bold text-xl flex items-center gap-2"><Shield size={24} /> SecureNet</div>
                        <div className="font-bold text-xl flex items-center gap-2"><BarChart3 size={24} /> Growth.io</div>
                        <div className="font-bold text-xl flex items-center gap-2"><Users size={24} /> CommunityPlus</div>
                    </div>
                </div>
            </section>

            {/* 3. CORE FEATURES (DEEP DIVE) */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">One Platform, <span className="text-indigo-600 dark:text-indigo-400">Three Powerhouses</span></h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Stop juggling multiple tools. Bitlance unifies your most critical growth engines into a single, automated dashboard.
                        </p>
                    </div>

                    {/* Feature 1: Voice Agent */}
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="inline-block p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6">
                                <Mic size={32} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">AI Voice Agents</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Deploy human-like voice agents that make outbound sales calls, handle inbound support, and qualify leads 24/7. They never sleep, never get tired, and always stick to the script.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Real-time transcription & sentiment analysis</li>
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Seamless handoff to human agents</li>
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Integrates with your CRM instantly</li>
                            </ul>
                            <Link to="/agents" className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                Meet your Voice Agent <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="flex-1 order-1 md:order-2 bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden h-80 flex items-center justify-center relative">
                                {/* Visual Mockup */}
                                <div className="absolute inset-0 flex items-center justify-center space-x-2">
                                    <div className="w-2 h-12 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-20 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                                    <div className="w-2 h-16 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-24 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                                    <div className="w-2 h-10 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-700/90 backdrop-blur p-4 rounded-lg shadow-lg border border-gray-100 dark:border-slate-600">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">AI</div>
                                        <div>
                                            <p className="text-sm font-bold">Sales Agent - Sarah</p>
                                            <p className="text-xs text-green-600 dark:text-green-400">● Live Call (02:14)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: SEO Blog */}
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
                        <div className="flex-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 bg-yellow-400 text-yellow-900 font-bold text-xs uppercase tracking-wide rounded-bl-xl shadow-sm z-10">SEO Optimized</div>
                                <div className="h-64 bg-gray-100 dark:bg-slate-700 rounded-lg mb-4 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1499750310159-5b5f834ced4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")' }}></div>
                                <h4 className="text-xl font-bold mb-2">10 Ways AI is Revolutionizing Healthcare</h4>
                                <div className="flex gap-2 mb-3">
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Healthcare</span>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Technology</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-3">
                                    Artificial Intelligence is transforming the medical landscape at an unprecedented pace. From diagnostic imaging to personalized medicine...
                                </p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="inline-block p-3 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                                <PenTool size={32} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Autonomous SEO Blogging</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Dominate search rankings without lifting a finger. Our agent researches keywords, writes 2,000+ word articles, generates unique images, and publishes directly to WordPress.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Deep research with Perplexity AI</li>
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Plagiarism-free guarantee</li>
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Auto-generated DALL-E 3 cover images</li>
                            </ul>
                            <Link to="/blog" className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                See generated examples <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Feature 3: Social Media */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="inline-block p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
                                <Share2 size={32} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Viral Social Media Manager</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Keep your audience engaged on Twitter, LinkedIn, and Instagram. Our agent analyzes trends, drafts viral hooks, and schedules posts at peak engagement times.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Multi-platform scheduling</li>
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Trend hijacking & viral hook generation</li>
                                <li className="flex items-center gap-3"><span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={14} /></span> Analytics & growth tracking</li>
                            </ul>
                            <Link to="/broadcast" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                Automate your feed <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="flex-1 order-1 md:order-2">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                                    <div>
                                        <div className="font-bold">Your Brand</div>
                                        <div className="text-xs text-gray-400">@yourbrand • Just now</div>
                                    </div>
                                </div>
                                <p className="text-base mb-4">
                                    Why most businesses fail at AI adoption: they try to automate everything at once. 🤖💥
                                    <br /><br />
                                    Start small. Scale fast. Here is the framework we used to 10x our output... 🧵 👇
                                </p>
                                <div className="flex justify-between text-gray-400 border-t border-gray-100 dark:border-slate-700 pt-3">
                                    <span>💬 24</span>
                                    <span>Cw 12</span>
                                    <span>❤️ 142</span>
                                    <span>📊 4.2k</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PRICING */}
            <section className="py-24 bg-gray-50 dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-gray-600 dark:text-gray-400">Start for free, scale as you grow.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Starter */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                            <h3 className="text-xl font-bold mb-2">Starter</h3>
                            <div className="text-4xl font-bold mb-6">$0 <span className="text-base font-normal text-gray-500">/mo</span></div>
                            <p className="text-gray-500 mb-8 flex-grow">Perfect for individuals just exploring AI agents.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3"><Check size={20} className="text-green-500" /> 5 AI Blog Posts</li>
                                <li className="flex gap-3"><Check size={20} className="text-green-500" /> 1 Voice Agent (Demo)</li>
                                <li className="flex gap-3"><Check size={20} className="text-green-500" /> Basic Analytics</li>
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">Start Free</button>
                        </div>

                        {/* Pro */}
                        <div className="bg-indigo-600 dark:bg-indigo-900 rounded-2xl shadow-xl border-2 border-indigo-500 p-8 flex flex-col transform scale-105 relative">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                            <h3 className="text-xl font-bold mb-2 text-white">Pro Growth</h3>
                            <div className="text-4xl font-bold mb-6 text-white">$49 <span className="text-base font-normal text-indigo-200">/mo</span></div>
                            <p className="text-indigo-100 mb-8 flex-grow">For startups ready to automate serious workflows.</p>
                            <ul className="space-y-4 mb-8 text-white">
                                <li className="flex gap-3"><Check size={20} className="text-indigo-300" /> Unlimited Blog Posts</li>
                                <li className="flex gap-3"><Check size={20} className="text-indigo-300" /> 3 Voice Agents</li>
                                <li className="flex gap-3"><Check size={20} className="text-indigo-300" /> Social Media Scheduler</li>
                                <li className="flex gap-3"><Check size={20} className="text-indigo-300" /> Priority Support</li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-colors shadow-lg">Get Started</button>
                        </div>

                        {/* Enterprise */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold mb-6">Custom</div>
                            <p className="text-gray-500 mb-8 flex-grow">For large teams needing custom integrations.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3"><Check size={20} className="text-green-500" /> Custom Agent Training</li>
                                <li className="flex gap-3"><Check size={20} className="text-green-500" /> SSO & Audit Logs</li>
                                <li className="flex gap-3"><Check size={20} className="text-green-500" /> Dedicated Account Manager</li>
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FAQ */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Do I need technical skills to use Bitlance?", a: "Not at all. Our platform is designed for non-technical users. You can set up your first agent in under 5 minutes." },
                            { q: "Can I connect my own data?", a: "Yes! You can upload knowledge bases (PDFs, Docs) for your agents to train on, ensuring they speak your brand language." },
                            { q: "Is the content really unique?", a: "Absolutely. We use a multi-step verification process with Perplexity AI to ensure all generated blogs are plagiarism-free and fact-checked." },
                            { q: "How does the voice agent handle complex questions?", a: "Our voice agents use advanced LLMs to understand context. If a question is too complex, they can be programmed to gracefully hand off the call to a human." }
                        ].map((item, index) => (
                            <div key={index} className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {item.q}
                                    {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openFaq === index && (
                                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800/50">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FINAL CTA */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-30"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Automate Your Future?</h2>
                    <p className="text-xl text-slate-300 mb-10">Join 10,000+ businesses using Bitlance to scale faster, smarter, and cheaper.</p>
                    <Link to="/signup">
                        <button className="px-10 py-5 rounded-full bg-white text-indigo-900 font-bold text-xl hover:bg-indigo-50 transition-all shadow-2xl transform hover:-translate-y-1">
                            Get Started for Free
                        </button>
                    </Link>
                    <p className="mt-6 text-slate-400 text-sm">No credit card required. Cancel anytime.</p>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
