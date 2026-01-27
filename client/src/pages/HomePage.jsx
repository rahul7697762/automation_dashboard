import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MessageSquare,
    Phone,
    Search,
    ArrowRight,
    Activity,
    Zap,
    LayoutDashboard
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const HomePage = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    const agents = [
        {
            title: 'Social Media Automation',
            description: 'Automate your social presence with AI-generated content and scheduling.',
            icon: MessageSquare,
            path: '/broadcast',
            color: 'from-blue-500 to-cyan-500',
            stats: 'Active Campaigns'
        },
        {
            title: 'AI Voice Agent',
            description: 'Intelligent voice assistants for sales, support, and customer engagement.',
            icon: Phone,
            path: '/dashboard',
            color: 'from-purple-500 to-pink-500',
            stats: 'Call Analytics'
        },
        {
            title: 'SEO AI Agent',
            description: 'Dominate search rankings with automated content and SEO optimization.',
            icon: Search,
            path: '/seo-agent',
            color: 'from-amber-500 to-orange-500',
            stats: 'Keyword Rankings'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            B
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">Bitlance AI</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{user?.email?.split('@')[0]}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Pro Plan</div>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Here's what's happening with your AI agents today.
                    </p>
                </header>

                {/* Quick Stats Row (Mock Data) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">System Status</div>
                                <div className="font-semibold text-gray-900 dark:text-white">All Systems Operational</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agents Grid */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <LayoutDashboard size={24} className="text-indigo-600" />
                            Your Agents
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {agents.map((agent, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(agent.path)}
                                className="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                {/* Gradient Hover Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <agent.icon size={28} />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {agent.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed h-12">
                                        {agent.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            {agent.stats}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
