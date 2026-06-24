import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TileRenderer } from '../../game/TileRenderer';
import SEOHead from '../components/SEOHead';

const AVATAR_OPTIONS = [
  'dragons:red', 'dragons:green', 'dragons:white',
  'winds:east', 'winds:south', 'winds:west', 'winds:north',
  'bamboo:1', 'bamboo:8',
  'circles:1', 'circles:8',
  'characters:1', 'characters:9'
];

export default function ProfilePage() {
  const { user, guestSession, isGuest, updateAvatar, displayName, avatarTile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  const handleSelectAvatar = (tile: string) => {
    updateAvatar(tile);
    setSuccessMsg('Avatar updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getAvatarURI = (key: string) => {
    try {
      const [suit, rank] = key.split(':');
      return TileRenderer.generateTileURI(suit as any, rank);
    } catch {
      return '';
    }
  };

  if (!user && !guestSession) {
    return (
      <div className="container-wide py-32 text-center">
        <h1 className="text-3xl text-ivory mb-4">You are not logged in</h1>
        <p className="text-ivory-light">Please login or play as a guest to view this page.</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Your Profile | Nine Gates Mahjong" description="Manage your profile and avatar." />
      
      <div className="container-narrow py-32">
        <div className="glass-card p-8 md:p-12 mb-8 border border-gold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lacquer-dark/30 to-ink-950/80 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Current Avatar Display */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gold shadow-2xl bg-ink-950 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,163,90,0.2)_0%,transparent_100%)]" />
                {avatarTile && (
                  <img src={getAvatarURI(avatarTile)} alt="Avatar" className="w-[140%] h-[140%] object-cover object-center transform scale-110" />
                )}
              </div>
              <div className="text-center">
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-2 ${isGuest ? 'bg-ink-800 text-ivory-dark' : 'bg-vermilion/20 text-vermilion-light border border-vermilion/30'}`}>
                  {isGuest ? 'Guest Player' : 'Registered Member'}
                </span>
                <h1 className="font-display text-3xl text-ivory">{displayName}</h1>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="flex-1 w-full bg-ink-950/50 rounded-xl p-6 border border-ivory/5">
              <h3 className="text-gold font-semibold mb-4 text-lg">Player Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-ink-900 border border-ivory/5">
                  <div className="text-ivory-dark text-sm mb-1">Level</div>
                  <div className="text-2xl text-ivory font-display">{user?.level || 1}</div>
                </div>
                <div className="p-4 rounded-lg bg-ink-900 border border-ivory/5">
                  <div className="text-ivory-dark text-sm mb-1">Coins</div>
                  <div className="text-2xl text-gold font-display">{user?.coins || 0}</div>
                </div>
                <div className="p-4 rounded-lg bg-ink-900 border border-ivory/5">
                  <div className="text-ivory-dark text-sm mb-1">Games Played</div>
                  <div className="text-2xl text-ivory font-display">0</div>
                </div>
                <div className="p-4 rounded-lg bg-ink-900 border border-ivory/5">
                  <div className="text-ivory-dark text-sm mb-1">Win Rate</div>
                  <div className="text-2xl text-ivory font-display">0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Customization */}
        <div className="glass-card p-8 md:p-12 border border-gold/20 relative">
          <h2 className="font-display text-2xl text-gold mb-2">Customize Avatar</h2>
          <p className="text-ivory-light mb-8">Select your personal Mahjong tile avatar to display on the leaderboards and tables.</p>

          {isGuest ? (
            <div className="p-6 bg-lacquer-dark/30 border border-vermilion/30 rounded-xl text-center">
              <p className="text-ivory mb-4">Guest players receive a random avatar. To choose your own, create a free account.</p>
              <button className="btn-primary text-sm">Register Now</button>
            </div>
          ) : (
            <>
              {successMsg && (
                <div className="mb-6 p-4 bg-jade-900/40 border border-jade-500/30 text-jade-100 rounded-lg text-center animate-fade-in">
                  {successMsg}
                </div>
              )}
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {AVATAR_OPTIONS.map(tile => (
                  <button
                    key={tile}
                    onClick={() => handleSelectAvatar(tile)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      avatarTile === tile 
                        ? 'border-gold shadow-[0_0_15px_rgba(196,163,90,0.5)] scale-105 z-10' 
                        : 'border-transparent hover:border-gold/50 hover:scale-105 bg-ink-900'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-ink-950">
                      <img src={getAvatarURI(tile)} alt={tile} className="w-[120%] h-[120%] object-cover object-center transform scale-110" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
