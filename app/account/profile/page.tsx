import { requireAuth } from '@/lib/auth/utils';
import { getUserProfile } from '@/lib/db/profiles';
import { ProfileForm } from '@/components/account/profile-form';
import { AvatarUpload } from '@/components/account/avatar-upload';
import { ChangePasswordForm } from '@/components/account/change-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profile | Logbloga',
  description: 'Manage your profile information',
};

export default async function ProfilePage() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information and settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url || null}
            />
          </div>

          <div className="md:col-span-2">
            <ProfileForm
              initialData={{
                fullName: profile?.full_name || null,
              }}
            />
          </div>

          <div className="md:col-span-2">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}

