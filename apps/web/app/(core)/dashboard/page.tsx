import { Sparkles, Calendar, Users, MessageSquare } from 'lucide-react';
import { GlassCard } from '@repo/ui/glass-card';
import { BRAND } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 dark:bg-white">
              <Sparkles className="w-6 h-6 text-white dark:text-neutral-800" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">
                {BRAND.name}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Welcome to your dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Calendar className="w-6 h-6 text-neutral-800 dark:text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                  Events
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  12 upcoming
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Users className="w-6 h-6 text-neutral-800 dark:text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                  Connections
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  487 students
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <MessageSquare className="w-6 h-6 text-neutral-800 dark:text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                  Messages
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  5 unread
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="mt-8">
          <GlassCard>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-4">
              Welcome to Connectify!
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You have successfully logged in. This is your dashboard where you can manage
              your campus events, connect with other students, and stay updated with
              everything happening at your university.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
