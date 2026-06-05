import { db } from '@/lib/db';
import SettingsManager from '@/components/settings-manager';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await db.websiteSettings.findFirst();

  if (!settings) {
    return (
      <div className="text-center py-10 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl">
        No configuration settings found in the database. Please seed the database first.
      </div>
    );
  }

  // Cast settings data to appropriate type
  const formattedSettings = {
    id: settings.id,
    site_name: settings.site_name,
    logo_url: settings.logo_url,
    favicon_url: settings.favicon_url,
    contact_email: settings.contact_email,
    contact_phone: settings.contact_phone,
    address: settings.address,
    social_links: settings.social_links as any,
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Global Configurations</h1>
        <p className="text-xs text-brand-gray-400">
          Manage system variables, agency email, office locations, and social media connectors.
        </p>
      </div>

      <SettingsManager settings={formattedSettings} />
    </div>
  );
}
