import React from 'react';
import type { UserProfile } from '../types';
import { MapPin, Briefcase, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
    profile: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="card-premium group relative bg-white"
        >
            <div className="aspect-[3/4] overflow-hidden relative">
                <img
                    src={profile.photos[0]}
                    alt={profile.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {profile.isVerified && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-1.5 border border-white/30">
                        <CheckCircle2 className="w-5 h-5 text-white fill-brand-600" />
                    </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-display">{profile.fullName}, {profile.age}</h3>
                    <div className="flex items-center space-x-2 text-sm opacity-90">
                        <span>{profile.height}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-brand-500" />
                    {profile.location.city}, {profile.location.state}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <Briefcase className="w-4 h-4 mr-2 text-brand-500" />
                    {profile.profession}
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <Link
                        to={`/profile/${profile.id}`}
                        className="text-brand-600 font-semibold text-sm hover:underline"
                    >
                        View Full Profile
                    </Link>
                    <button className="p-2 rounded-full hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
