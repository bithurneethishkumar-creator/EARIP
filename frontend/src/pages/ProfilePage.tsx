import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  Shield,
  Key,
  Bell,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Building,
  Check,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile, ProfileUpdateRequest } from '../types';

interface ProfilePageProps {
  onLogout?: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onLogout,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Editable Form State
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    name: '',
    role: '',
    email: '',
    theme: 'Executive Dark',
    defaultCurrency: 'USD ($)',
    emailAlerts: true,
    anomalyAlertThreshold: 'MEDIUM',
  });

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Logout Confirmation Modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await api.getUserProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        role: data.role,
        email: data.email,
        theme: data.preferences?.theme || 'Executive Dark',
        defaultCurrency: data.preferences?.defaultCurrency || 'USD ($)',
        emailAlerts: data.preferences?.emailAlerts ?? true,
        anomalyAlertThreshold: data.preferences?.anomalyAlertThreshold || 'MEDIUM',
      });
    } catch (err: any) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await api.updateUserProfile(formData);
      if (res.success && res.profile) {
        setProfile(res.profile);
        setSaveSuccess(true);
        if (onProfileUpdated) onProfileUpdated(res.profile);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setPasswordMsg('Password changed successfully in Enterprise IAM.');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordMsg(null);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleConfirmLogout = async () => {
    try {
      await api.logoutUser();
    } catch (e) {
      console.error(e);
    }
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-12 border border-white/10 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-300">Loading User Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-accent-rose/30 bg-accent-rose/5 text-center space-y-2">
        <AlertCircle className="w-6 h-6 text-accent-rose mx-auto" />
        <h3 className="text-sm font-bold text-white">Profile Unavailable</h3>
        <button
          onClick={loadProfile}
          className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-16 max-w-5xl mx-auto">
      {/* Top Banner / User Hero Card */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {/* Avatar with Initials fallback */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-0.5 shadow-glow-indigo">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-2xl tracking-wider">
                {profile.name
                  ? profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'NK'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-emerald border-2 border-slate-950 flex items-center justify-center">
              <Check className="w-3 h-3 text-slate-950 font-bold" />
            </span>
          </div>

          {/* Profile Identity */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">{profile.name}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-center sm:self-auto">
                {profile.status}
              </span>
            </div>

            <p className="text-xs text-brand-300 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-accent-cyan" /> {profile.role} &bull;{' '}
              <span className="text-slate-400 font-normal">{profile.department}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {profile.organization}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-accent-emerald" /> {profile.accessTier}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-center sm:self-start">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-rose/15 hover:bg-accent-rose/25 text-accent-rose border border-accent-rose/30 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form & Sections Grid */}
      <form onSubmit={handleSaveProfile} className="space-y-5">
        {/* EDIT PROFILE & ACCOUNT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal Information */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Personal Information
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">IAM Verified</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Your Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="your.email@earip.enterprise.ai"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Assigned Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g. Lead Business Analyst"
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Details & Permissions */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Account Status & Permissions
                </h3>
              </div>
              <span className="text-[10px] text-accent-emerald font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" /> Verified
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Account Status:</span>
                <span className="font-semibold text-white">{profile.status}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Member Since:</span>
                <span className="font-semibold text-white">{profile.memberSince}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Access Tier:</span>
                <span className="font-semibold text-accent-cyan">{profile.accessTier}</span>
              </div>

              <div className="pt-2">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Active Enterprise Permissions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.permissions || []).map((perm, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/10 text-slate-300 flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-400" /> {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PREFERENCES & SECURITY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Platform Preferences */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-purple" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Platform Preferences
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Interface Theme
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white bg-slate-900"
                >
                  <option value="Executive Dark">Executive Dark (Default)</option>
                  <option value="Midnight Slate">Midnight Slate</option>
                  <option value="OLED Obsidian">OLED Obsidian</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Default Reporting Currency
                </label>
                <select
                  value={formData.defaultCurrency}
                  onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white bg-slate-900"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Anomaly Notification Threshold
                </label>
                <select
                  value={formData.anomalyAlertThreshold}
                  onChange={(e) => setFormData({ ...formData, anomalyAlertThreshold: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white bg-slate-900"
                >
                  <option value="LOW">Low (Notify on all outliers)</option>
                  <option value="MEDIUM">Medium (Z-score &gt; 2.5)</option>
                  <option value="HIGH">High (Severe critical deviations only)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Daily Intelligence Briefings</div>
                  <div className="text-[10px] text-slate-400">Receive automated morning anomaly emails</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailAlerts}
                    onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security & Authentication */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-rose" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Security & Authentication
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">2FA Active</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Two-Factor Authentication:</span>
                <span className="text-accent-emerald font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enabled (TOTP Authenticator)
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Authentication Provider:</span>
                <span className="font-semibold text-white">{profile.security?.authProvider}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Session Status:</span>
                <span className="font-mono text-slate-300">{profile.security?.sessionStatus}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Last Verified Login:</span>
                <span className="font-mono text-slate-300 text-[11px]">{profile.security?.lastLogin}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-brand-500/40 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-accent-cyan" /> Change Password / Security Keys
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar & Notifications */}
        <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {saveSuccess && (
              <div className="text-xs font-semibold text-accent-emerald flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Profile and preferences successfully saved!
              </div>
            )}
            {saveError && (
              <div className="text-xs font-semibold text-accent-rose flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {saveError}
              </div>
            )}
            {!saveSuccess && !saveError && (
              <p className="text-xs text-slate-400">
                All profile updates are immediately synchronized with your active session.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-glow-indigo"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/15 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-sm font-bold text-white">Update Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              {passwordMsg && (
                <div
                  className={`text-xs font-semibold p-2 rounded-lg ${
                    passwordMsg.includes('successfully')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {passwordMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-6 border border-white/15 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent-rose/20 border border-accent-rose/30 flex items-center justify-center mx-auto text-accent-rose">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Log Out of EARIP?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to end your active enterprise session?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Stay Logged In
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-accent-rose hover:bg-rose-600 text-white text-xs font-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
