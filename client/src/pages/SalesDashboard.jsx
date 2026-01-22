import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
    Phone,
    Clock,
    Users,
    CheckCircle,
    Mic,
    Settings,
    LayoutDashboard,
    BarChart,
    Calendar,
    Bell,
    Search,
    MoreVertical,
    Play,
    Volume2,
    AlertTriangle
} from 'lucide-react';

import VoiceAgentInterface from '../components/VoiceAgentInterface';

const SalesDashboard = () => {
    const [currentView, setCurrentView] = useState('overview'); // overview, voice_demo
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCalls: 0,
        avgDuration: '0m 0s',
        activeConversations: 0,
        successRate: '0%'
    });

    useEffect(() => {
        fetchData();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('public:sales_calls')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_calls' }, (payload) => {
                console.log('Realtime change received!', payload);
                fetchData(); // Refresh data on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        try {
            const { data: callsData, error } = await supabase
                .from('sales_calls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCalls(callsData);
            calculateStats(callsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const active = data.filter(c => c.status === 'Active').length;
        const completed = data.filter(c => c.status === 'Completed');
        const success = completed.length; // Simplified for now

        // Avg Duration
        const totalDuration = completed.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
        const avgSeconds = completed.length ? Math.floor(totalDuration / completed.length) : 0;
        const avgMin = Math.floor(avgSeconds / 60);
        const avgSec = avgSeconds % 60;

        setStats({
            totalCalls: total,
            avgDuration: `${avgMin}m ${avgSec}s`,
            activeConversations: active,
            successRate: total ? `${((success / total) * 100).toFixed(1)}%` : '0%'
        });
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hours ago`;
    };

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                        <Mic className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">VoiceAgent</h1>
                        <p className="text-xs text-slate-500">AI Dashboard</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6">
                    <div className="text-xs font-semibold text-slate-500 mb-4 px-4">DASHBOARD</div>
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="Overview"
                        active={currentView === 'overview'}
                        onClick={() => setCurrentView('overview')}
                    />
                    <NavItem icon={<Users size={20} />} label="Conversations" />
                    <NavItem icon={<Calendar size={20} />} label="Meetings" />
                    <NavItem icon={<Bell size={20} />} label="Reminders" />
                    <NavItem icon={<BarChart size={20} />} label="Analytics" />

                    <div className="text-xs font-semibold text-slate-500 mt-8 mb-4 px-4">SETTINGS</div>
                    <NavItem icon={<Mic size={20} />} label="Voice Settings" />
                    <NavItem icon={<Phone size={20} />} label="Call Settings" />
                    <NavItem icon={<Settings size={20} />} label="System Settings" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900">
                    <div>
                        <h2 className="text-xl font-bold">AI Voice Agent Dashboard</h2>
                        <p className="text-sm text-slate-500">
                            {currentView === 'overview' ? 'Manage your calls and conversations' : 'Live Voice Agent Demo'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            System Online
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative">
                    {currentView === 'voice_demo' ? (
                        <div className="h-full w-full rounded-2xl overflow-hidden border border-slate-800">
                            <VoiceAgentInterface />
                        </div>
                    ) : (
                        <>
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <MetricCard
                                    title="Total Calls Today"
                                    value={stats.totalCalls}
                                    trend="+12%"
                                    icon={<Phone className="text-green-500" />}
                                    trendUp
                                />
                                <MetricCard
                                    title="Average Call Duration"
                                    value={stats.avgDuration}
                                    trend="+5%"
                                    icon={<Clock className="text-blue-500" />}
                                    trendUp
                                />
                                <MetricCard
                                    title="Active Conversations"
                                    value={stats.activeConversations}
                                    trend="+8%"
                                    icon={<Users className="text-purple-500" />}
                                    trendUp
                                />
                                <MetricCard
                                    title="Success Rate"
                                    value={stats.successRate}
                                    trend="+2.1%"
                                    icon={<CheckCircle className="text-emerald-500" />}
                                    trendUp
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Recent Calls List */}
                                <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold">Recent Calls</h3>
                                            <p className="text-sm text-slate-500">Latest voice agent interactions</p>
                                        </div>
                                        <button className="text-slate-400 hover:text-white">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {loading ? (
                                            <div className="text-center py-10 text-slate-500">Loading calls...</div>
                                        ) : calls.length === 0 ? (
                                            <div className="text-center py-10 text-slate-500">No calls recorded yet.</div>
                                        ) : (
                                            calls.map((call) => (
                                                <CallItem
                                                    key={call.id}
                                                    name={call.contact_name}
                                                    duration={formatDuration(call.duration_seconds)}
                                                    status={call.status}
                                                    timeAgo={formatTimeAgo(call.created_at)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Voice Agent Status Panel */}
                                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-800 h-fit">
                                    <h3 className="text-lg font-bold mb-1">Voice Agent Status</h3>
                                    <p className="text-sm text-slate-500 mb-6">Current system status and controls</p>

                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold text-green-500">System Status</div>
                                            <div className="text-xs text-green-400/80">All systems operational</div>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Voice Quality</span>
                                            <span className="font-medium">High</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Response Time</span>
                                            <span className="font-medium">&lt; 200ms</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Active Channels</span>
                                            <span className="font-medium">5/10</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setCurrentView('voice_demo')}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Play size={18} fill="currentColor" /> Start Voice Agent
                                    </button>

                                    <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="text-yellow-500 w-5 h-5 shrink-0" />
                                            <div>
                                                <div className="text-sm font-semibold text-yellow-500 mb-1">Reminder</div>
                                                <div className="text-xs text-yellow-500/80">3 pending acknowledgments require review</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-green-500/10 text-green-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </div>
);

const MetricCard = ({ title, value, trend, icon, trendUp }) => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">{value}</h3>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
        <div className={`text-xs font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
            {trendUp ? '↗' : '↘'} {trend}
        </div>
    </div>
);

const CallItem = ({ name, duration, status, timeAgo }) => {
    const getStatusColor = (s) => {
        switch (s.toLowerCase()) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'active': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'missed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    return (
        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <div className="font-semibold text-slate-200">{name}</div>
                    <div className="text-xs text-slate-500">Duration: {duration}</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status}
                </div>
                <div className="text-xs text-slate-500 w-24 text-right">
                    {timeAgo}
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;
