import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Briefcase, GraduationCap, Ruler, Calendar, Heart,
    Phone, Share2, ShieldCheck, CheckCircle2,
    ChevronLeft, ChevronRight, Info, Users, Wallet, Star
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile } from '../types';
import { useAuthStore } from '../store/useAuthStore';

export const ProfileDetailPage = () => {
    const { id } = useParams();
    const [activePhoto, setActivePhoto] = useState(0);
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuthStore();

    const { data: profile, isLoading, error } = useQuery<UserProfile>({
        queryKey: ['profile', id],
        queryFn: () => profileService.getProfileById(id!),
        enabled: !!id,
    });

    const shortlistMutation = useMutation({
        mutationFn: () => profileService.toggleShortlist(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', id] });
            queryClient.invalidateQueries({ queryKey: ['shortlisted'] });
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <p className="text-xl font-bold text-gray-800">Profile not found</p>
                <Link to="/search" className="text-brand-600 font-bold hover:underline">Back to Search</Link>
            </div>
        );
    }

    const nextPhoto = () => setActivePhoto((prev) => (prev + 1) % (profile.photos?.length || 1));
    const prevPhoto = () => setActivePhoto((prev) => (prev - 1 + (profile.photos?.length || 1)) % (profile.photos?.length || 1));

    const isShortlisted = currentUser?.shortlisted?.includes(profile.id || '');

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/search" className="inline-flex items-center text-gray-500 hover:text-brand-600 mb-8 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Results
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Photos & Quick Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activePhoto}
                                    src={profile.photos[activePhoto]}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover"
                                    alt={profile.fullName}
                                />
                            </AnimatePresence>

                            {profile.photos.length > 1 && (
                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                    <button onClick={prevPhoto} className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all pointer-events-auto">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={nextPhoto} className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all pointer-events-auto">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}

                            <div className="absolute bottom-6 inset-x-0 flex justify-center space-x-2">
                                {profile.photos.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActivePhoto(i)}
                                        className={`h-1.5 rounded-full transition-all ${i === activePhoto ? 'w-8 bg-brand-500' : 'w-2 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold font-display">{profile.fullName}</h2>
                                {profile.isVerified && <CheckCircle2 className="w-6 h-6 text-brand-600" />}
                            </div>
                            <p className="text-gray-500 text-sm">Profile ID: VIV-{profile.id?.substring(0, 6)}</p>

                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={() => shortlistMutation.mutate()}
                                    disabled={shortlistMutation.isPending}
                                    className={`w-full py-4 rounded-2xl flex items-center justify-center shadow-xl transition-all ${isShortlisted ? 'bg-white border-2 border-brand-600 text-brand-600 shadow-brand-100' : 'btn-primary shadow-brand-200'}`}
                                >
                                    <Heart className={`w-5 h-5 mr-2 ${isShortlisted ? 'fill-current' : ''}`} />
                                    {isShortlisted ? 'Shortlisted' : 'Shortlist Profile'}
                                </button>
                                <button className="w-full flex items-center justify-center p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700">
                                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                                    Call Member
                                </button>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-around">
                                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-brand-600">
                                    <Share2 className="w-5 h-5" />
                                    <span className="text-xs">Share</span>
                                </button>
                                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-brand-600">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-xs">Report</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-2xl font-bold font-display mb-6 flex items-center">
                                <Info className="w-6 h-6 mr-3 text-brand-600" />
                                About Me
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg italic">
                                "{profile.bio}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Age / DOB</p>
                                            <p className="font-bold text-gray-900">{profile.age} Years, Nov 1997</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                                            <Ruler className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Height</p>
                                            <p className="font-bold text-gray-900">{profile.height}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                            <p className="font-bold text-gray-900">{profile.location.city}, {profile.location.state}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                                            <Briefcase className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profession</p>
                                            <p className="font-bold text-gray-900">{profile.profession}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Education</p>
                                            <p className="font-bold text-gray-900">{profile.education}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                                            <Wallet className="w-5 h-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Annual Income</p>
                                            <p className="font-bold text-gray-900">{profile.income}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-2xl font-bold font-display mb-6 flex items-center">
                                    <Users className="w-6 h-6 mr-3 text-brand-600" />
                                    Family Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Father's Status</span>
                                        <span className="font-bold">{profile.familyDetails.fatherStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Mother's Status</span>
                                        <span className="font-bold">{profile.familyDetails.motherStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Siblings</span>
                                        <span className="font-bold">{profile.familyDetails.siblings}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Family Values</span>
                                        <span className="font-bold">{profile.familyDetails.familyValues}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-2xl font-bold font-display mb-6 flex items-center">
                                    <Star className="w-6 h-6 mr-3 text-brand-600" />
                                    Interests & Hobbies
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {profile.interests.map(interest => (
                                        <span key={interest} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-2xl font-medium border border-gray-100">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};
