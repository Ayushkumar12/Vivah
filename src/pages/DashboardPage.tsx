import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
    Heart, Eye, Settings,
    ChevronRight, Star, Bell, Edit2
} from 'lucide-react';
import { ProfileCard } from '../components/ProfileCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/api';

export const DashboardPage = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = React.useState<'recommended' | 'shortlisted'>('recommended');

    const { data: recommendations, isLoading: loadingRecs } = useQuery({
        queryKey: ['recommendations'],
        queryFn: () => profileService.getProfiles({ gender: user?.gender === 'Male' ? 'Female' : 'Male' }),
        enabled: !!user,
    });

    const { data: shortlisted, isLoading: loadingShortlisted } = useQuery({
        queryKey: ['shortlisted'],
        queryFn: () => profileService.getShortlisted(),
        enabled: !!user,
    });

    const { data: visitors, isLoading: loadingVisitors } = useQuery({
        queryKey: ['visitors'],
        queryFn: profileService.getVisitors,
        enabled: !!user,
    });

    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: profileService.getNotifications,
        enabled: !!user,
        refetchInterval: 30000,
    });

    const shortlistedCount = shortlisted?.length || 0;
    const unreadNotificationsCount = notifications?.filter((n: any) => !n.read).length || 0;

    const stats = [
        { label: 'Shortlisted', count: shortlistedCount, icon: <Heart className="text-pink-500" />, bg: 'bg-pink-50', link: '/search' },
        { label: 'Interests Received', count: 0, icon: <Star className="text-brand-500" />, bg: 'bg-brand-50', link: '/dashboard' },
        { label: 'Profile Views', count: visitors?.length || '0', icon: <Eye className="text-blue-500" />, bg: 'bg-blue-50', link: '/dashboard' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center space-x-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                                <img src={user?.photos?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                            </div>
                            <Link to="/profile/edit" className="absolute -bottom-2 -right-2 p-2 bg-brand-600 text-white rounded-xl shadow-lg hover:bg-brand-700 transition-all opacity-0 group-hover:opacity-100">
                                <Edit2 className="w-4 h-4" />
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold font-display text-gray-900">Welcome, {user?.fullName.split(' ')[0]}!</h1>
                            <p className="text-gray-500 font-medium">Your profile is {user?.bio && user?.photos?.length > 0 ? '95' : '85'}% complete. {(!user?.bio || user?.photos?.length === 0) && 'Complete your profile to find better matches.'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-600 shadow-sm transition-all relative">
                                <Bell className="w-6 h-6" />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                                )}
                            </button>
                        </div>
                        <Link to="/profile/edit" className="flex items-center space-x-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-gray-700 font-bold shadow-sm hover:shadow-md transition-all">
                            <Settings className="w-5 h-5" />
                            <span>Account Settings</span>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((s, i) => (
                        <Link
                            key={i}
                            to={s.link}
                            className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-all cursor-pointer"
                        >
                            <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
                                {React.cloneElement(s.icon as React.ReactElement<{ className?: string }>, { className: 'w-7 h-7' })}
                            </div>
                            <p className="text-3xl font-extrabold text-gray-900 mb-1">{s.count}</p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{s.label}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Activity Area */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="flex bg-gray-100 p-1 rounded-2xl">
                                    <button
                                        onClick={() => setActiveTab('recommended')}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'recommended' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Recommendations
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shortlisted')}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'shortlisted' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Shortlisted
                                    </button>
                                </div>
                                <Link to="/search" className="text-brand-600 font-bold text-sm hover:underline flex items-center">
                                    View All <ChevronRight className="ml-1 w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {activeTab === 'recommended' ? (
                                    loadingRecs ? (
                                        <div className="col-span-full py-10 text-center">
                                            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-gray-500 font-bold">Finding matches...</p>
                                        </div>
                                    ) : recommendations?.length === 0 ? (
                                        <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-gray-100 border-dashed text-center">
                                            <p className="text-gray-400 font-medium">No recommendations yet.</p>
                                        </div>
                                    ) : (
                                        recommendations?.slice(0, 4).map((profile: any) => (
                                            <ProfileCard key={profile.id} profile={profile} />
                                        ))
                                    )
                                ) : (
                                    loadingShortlisted ? (
                                        <div className="col-span-full py-10 text-center">
                                            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-gray-500 font-bold">Fetching your favorites...</p>
                                        </div>
                                    ) : shortlisted?.length === 0 ? (
                                        <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-gray-100 border-dashed text-center">
                                            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-400 font-medium">Your shortlist is empty.</p>
                                            <Link to="/search" className="text-brand-600 font-bold mt-2 inline-block">Start exploring</Link>
                                        </div>
                                    ) : (
                                        shortlisted?.map((profile: any) => (
                                            <ProfileCard key={profile.id} profile={profile} />
                                        ))
                                    )
                                )}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-extrabold font-display">Latest Visitors</h2>
                                <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">Updated Live</span>
                            </div>
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                {loadingVisitors ? (
                                    <div className="p-10 text-center">
                                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
                                    </div>
                                ) : visitors?.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400 font-medium">
                                        No visitors yet.
                                    </div>
                                ) : (
                                    visitors?.map((visitor: any) => (
                                        <Link 
                                            to={`/profile/${visitor.user._id}`}
                                            key={visitor._id} 
                                            className="flex items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer group last:border-0"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img src={visitor.user.photos?.[0] || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg group-hover:text-brand-600 transition-colors">{visitor.user.fullName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {visitor.user.age} yrs, {visitor.user.location?.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(visitor.visitedAt).toLocaleDateString()}</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold font-display mb-6">Profile Completeness</h3>
                            <div className="space-y-6">
                                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="absolute inset-y-0 left-0 bg-brand-500"
                                    />
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        { text: 'Basic Details', done: true },
                                        { text: 'Professional Bio', done: true },
                                        { text: 'Partner Preferences', done: true },
                                        { text: 'Horoscope/Astronomy', done: false },
                                        { text: 'Family Information', done: true },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center justify-between text-sm">
                                            <span className={item.done ? 'text-gray-900 font-medium' : 'text-gray-400'}>{item.text}</span>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>
                                                <ChevronRight className="w-3 h-3" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
