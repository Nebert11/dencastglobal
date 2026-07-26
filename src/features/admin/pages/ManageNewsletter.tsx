import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, Download, UserX, UserCheck, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { NewsletterSubscriber } from '@/types';
import { format } from 'date-fns';

// ─── Export to CSV ────────────────────────────────────────────────────────────

function exportCSV(subscribers: NewsletterSubscriber[]) {
  const headers = ['Email', 'Name', 'Subscribed', 'Status'];
  const rows = subscribers.map((s) => [
    s.email,
    s.name ?? '',
    format(new Date(s.subscribed_at), 'yyyy-MM-dd'),
    s.is_active ? 'Active' : 'Unsubscribed',
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV exported!');
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatsCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageNewsletter() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['adminNewsletter', statusFilter],
    queryFn: async () => {
      let q = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (statusFilter === 'active') q = q.eq('is_active', true);
      else if (statusFilter === 'inactive') q = q.eq('is_active', false);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as NewsletterSubscriber[];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['newsletterStats'],
    queryFn: async () => {
      const { count: total } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
      const { count: active } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: thisMonth } = await supabase.from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('subscribed_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      return { total: total ?? 0, active: active ?? 0, inactive: (total ?? 0) - (active ?? 0), thisMonth: thisMonth ?? 0 };
    },
  });

  const handleToggle = async (sub: NewsletterSubscriber) => {
    const { error } = await db
      .from('newsletter_subscribers')
      .update({
        is_active: !sub.is_active,
        unsubscribed_at: sub.is_active ? new Date().toISOString() : null,
      })
      .eq('id', sub.id);

    if (error) { toast.error(error.message); return; }
    toast.success(sub.is_active ? 'Unsubscribed' : 'Reactivated');
    qc.invalidateQueries({ queryKey: ['adminNewsletter'] });
    qc.invalidateQueries({ queryKey: ['newsletterStats'] });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage email subscribers</p>
        </div>
        <button
          onClick={() => subscribers && exportCSV(subscribers)}
          disabled={!subscribers?.length}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Total Subscribers" value={stats?.total ?? 0} icon={<Users size={20} className="text-[#25408F]" />} color="bg-blue-50" />
        <StatsCard label="Active Subscribers" value={stats?.active ?? 0} icon={<UserCheck size={20} className="text-green-600" />} color="bg-green-50" />
        <StatsCard label="Unsubscribed" value={stats?.inactive ?? 0} icon={<UserX size={20} className="text-gray-500" />} color="bg-gray-100" />
        <StatsCard label="New This Month" value={stats?.thisMonth ?? 0} icon={<TrendingUp size={20} className="text-purple-600" />} color="bg-purple-50" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Unsubscribed', value: 'inactive' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value as 'all' | 'active' | 'inactive')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-colors',
              statusFilter === tab.value ? 'bg-[#25408F] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Subscribed</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : (subscribers ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Mail size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No subscribers found</p>
                  </td>
                </tr>
              ) : (
                (subscribers ?? []).map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#25408F]/10 flex items-center justify-center text-[#25408F] font-bold text-xs flex-shrink-0">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 truncate">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{sub.name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                      {format(new Date(sub.subscribed_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold',
                        sub.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        {sub.is_active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggle(sub)}
                        className={cn(
                          'text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
                          sub.is_active
                            ? 'text-[#D3232E] hover:bg-red-50'
                            : 'text-green-700 hover:bg-green-50'
                        )}
                      >
                        {sub.is_active ? (
                          <span className="flex items-center gap-1"><UserX size={13} /> Unsubscribe</span>
                        ) : (
                          <span className="flex items-center gap-1"><UserCheck size={13} /> Reactivate</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {subscribers && subscribers.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
            {statusFilter === 'all' && stats && (
              <span className="ml-1">
                · {stats.active} active, {stats.inactive} unsubscribed
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
