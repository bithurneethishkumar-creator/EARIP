import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  title: string;
  subtitle: string;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  availableCountries: string[];
  onRefresh: () => void;
  isLoading: boolean;
  userProfile?: UserProfile | null;
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  selectedCountry,
  onCountryChange,
  availableCountries,
  onRefresh,
  isLoading,
  userProfile,
  onNavigateToProfile,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = userProfile?.name || 'Neethish Kumar';
  const userRole = userProfile?.role || 'Lead Business Analyst';
  const userEmail = userProfile?.email || 'neethish.kumar@earip.enterprise.ai';
  const userStatus = userProfile?.status || 'Active • Enterprise';

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="glass-header sticky top-0 z-20 px-6 py-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Page Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
          {selectedCountry !== 'All' && (
            <span className="text-[10px] font-mono font-semibold text-brand-300 bg-brand-500/15 px-2 py-0.5 rounded border border-brand-500/25">
              {selectedCountry}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium hidden md:block mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Country Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 rounded-lg px-2.5 py-1.5 shadow-sm">
          <Globe className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="All" className="bg-slate-900 text-white">
              Global (All Countries)
            </option>
            {availableCountries.map((c, i) => (
              <option key={`country-${c}-${i}`} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white hover:border-brand-500/40 transition-colors disabled:opacity-50 shadow-sm"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 pl-1.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-brand-500/40 text-left transition-all group shadow-sm"
            id="user-profile-menu-button"
            title="User Profile & Settings"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-cyan p-0.5 shadow-sm flex-shrink-0">
              <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center text-[11px] text-white font-extrabold tracking-wider">
                {userInitials}
              </div>
            </div>

            {/* Name and Role on larger screens */}
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                <span>{userName}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight">
                {userRole}
              </div>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform mr-1 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 p-3 space-y-3 animate-in fade-in duration-150">
              {/* Header inside menu */}
              <div className="flex items-center gap-3 pb-2.5 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-0.5 shadow-glow-indigo flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-sm text-white font-extrabold">
                    {userInitials}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{userName}</div>
                  <div className="text-[10px] text-brand-300 font-medium truncate">{userRole}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{userEmail}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Account Tier:</span>
                <span className="text-accent-emerald font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> {userStatus}
                </span>
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onNavigateToProfile) onNavigateToProfile();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-brand-500/15 hover:border-brand-500/30 border border-transparent transition-all"
                >
                  <User className="w-4 h-4 text-accent-cyan" />
                  <span>View User Profile &amp; Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-accent-rose hover:bg-accent-rose/15 border border-transparent transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of EARIP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
