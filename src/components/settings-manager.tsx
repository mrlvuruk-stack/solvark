'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Loader2, CheckCircle, Save } from 'lucide-react';

interface WebsiteSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  social_links: any; // Record<string, string>
}

interface SettingsManagerProps {
  settings: WebsiteSettings;
}

export default function SettingsManager({ settings }: SettingsManagerProps) {
  const [siteName, setSiteName] = useState(settings.site_name);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');
  const [faviconUrl, setFaviconUrl] = useState(settings.favicon_url || '');
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [contactPhone, setContactPhone] = useState(settings.contact_phone || '');
  const [address, setAddress] = useState(settings.address || '');

  // Social links
  const socialLinksObj = settings.social_links || {};
  const [twitter, setTwitter] = useState(socialLinksObj.twitter || '');
  const [linkedin, setLinkedin] = useState(socialLinksObj.linkedin || '');
  const [github, setGithub] = useState(socialLinksObj.github || '');
  const [instagram, setInstagram] = useState(socialLinksObj.instagram || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: settings.id,
          site_name: siteName,
          logo_url: logoUrl || undefined,
          favicon_url: faviconUrl || undefined,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          address: address || undefined,
          social_links: {
            twitter,
            linkedin,
            github,
            instagram,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to update global settings.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-card p-6 md:p-8 border-white/5 bg-[#0a0a0a]/50">
      <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-brand-accent" />
        Configure Global Variables
      </h2>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Settings successfully synchronized and cached in the DB!
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Core settings */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono text-brand-gray-500">GENERAL PARAMETERS</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Site Name *</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Contact Email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Favicon URL</label>
              <input
                type="text"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social connections */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
          <span className="text-[10px] font-mono text-brand-gray-500">SOCIAL PROFILES CONNECTORS</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/solvark"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/solvark"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">GitHub URL</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/solvark"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/solvark"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-premium-primary text-xs w-full py-3 gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing Web Settings...
            </>
          ) : (
            <>
              Sync Global Variables
              <Save className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
