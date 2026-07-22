import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  Clock,
  Eye,
  CheckCircle,
  Archive,
  MailOpen,
  Reply,
  ChevronRight,
  Search,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';
import db from '@/lib/db';
import { cn } from '@/utils/cn';
import type { ContactMessage, MessageStatus } from '@/types';
import { format } from 'date-fns';

async function toUserFriendlyError(err: unknown): Promise<string> {
  if (err && typeof err === 'object') {
    const maybe = err as {
      message?: string;
      context?: { json?: () => Promise<{ error?: string; message?: string }> };
    };

    if (typeof maybe.context?.json === 'function') {
      try {
        const payload = await maybe.context.json();
        return payload?.error || payload?.message || maybe.message || 'Failed to send reply';
      } catch {
        return maybe.message || 'Failed to send reply';
      }
    }

    if (typeof maybe.message === 'string' && maybe.message.trim()) {
      return maybe.message;
    }
  }

  return 'Failed to send reply';
}

// ─── Status config ────────────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG: Record<MessageStatus, StatusConfig> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: <Clock size={11} /> },
  read: { label: 'Read', color: 'bg-gray-100 text-gray-600', icon: <Eye size={11} /> },
  replied: { label: 'Replied', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={11} /> },
  archived: { label: 'Archived', color: 'bg-yellow-100 text-yellow-700', icon: <Archive size={11} /> },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ManageContactMessages() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus | ''>('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['adminMessages', search, statusFilter],
    queryFn: async () => {
      let q = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
      }
      if (statusFilter) q = q.eq('status', statusFilter);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ContactMessage[];
    },
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: async () => {
      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      return count ?? 0;
    },
  });

  const updateStatus = async (id: string, status: MessageStatus) => {
    const { error } = await db
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked as ${status}`);
    qc.invalidateQueries({ queryKey: ['adminMessages'] });
    qc.invalidateQueries({ queryKey: ['unreadMessages'] });
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleSelect = async (msg: ContactMessage) => {
    setSelected(msg);
    setReplyText('');
    if (msg.status === 'new') {
      await updateStatus(msg.id, 'read');
    }
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    try {
      const subject = selected.subject?.trim()
        ? `Re: ${selected.subject}`
        : 'Re: Your message to Dencast Global';

      const { data, error } = await supabase.functions.invoke('send-contact-reply', {
        body: {
          messageId: selected.id,
          toEmail: selected.email,
          toName: selected.name,
          subject,
          replyMessage: replyText.trim(),
          originalMessage: selected.message,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to send email reply');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Reply could not be delivered');
      }

      await qc.invalidateQueries({ queryKey: ['adminMessages'] });
      await qc.invalidateQueries({ queryKey: ['unreadMessages'] });

      setSelected((prev) => (prev
        ? {
            ...prev,
            status: 'replied',
            reply_message: replyText.trim(),
            replied_at: new Date().toISOString(),
          }
        : null));

      toast.success('Reply email sent successfully!');
      setReplyText('');
    } catch (err: unknown) {
      const errMsg = await toUserFriendlyError(err);
      toast.error(errMsg);
    } finally {
      setReplying(false);
    }
  };

  const FILTER_TABS: { label: string; value: MessageStatus | '' }[] = [
    { label: `All${messages ? ` (${messages.length})` : ''}`, value: '' },
    { label: `Unread${unreadCount ? ` (${unreadCount})` : ''}`, value: 'new' },
    { label: 'Read', value: 'read' },
    { label: 'Replied', value: 'replied' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
        {unreadCount !== undefined && unreadCount > 0 && (
          <p className="text-sm text-[#D72638] mt-0.5 font-medium">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-220px)]">
        {/* ── Left panel: message list ── */}
        <div className="lg:w-[380px] flex-shrink-0 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Search + filter */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages…"
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0056A6]/30 bg-gray-50"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    'flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                    statusFilter === tab.value
                      ? 'bg-[#0056A6] text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border-b border-gray-50 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (messages ?? []).length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2 text-gray-400">
                <Mail size={32} className="text-gray-200" />
                <p className="text-sm">No messages</p>
              </div>
            ) : (
              (messages ?? []).map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={cn(
                    'w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors',
                    selected?.id === msg.id && 'bg-blue-50 border-l-2 border-l-[#0056A6]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                      msg.status === 'new' ? 'bg-[#0056A6] text-white' : 'bg-gray-100 text-gray-500'
                    )}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn('text-sm truncate', msg.status === 'new' ? 'font-bold text-gray-900' : 'font-medium text-gray-700')}>
                          {msg.name}
                        </p>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {format(new Date(msg.created_at), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.subject ?? 'No subject'}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message.slice(0, 60)}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full', STATUS_CONFIG[msg.status].color)}>
                          {STATUS_CONFIG[msg.status].icon}
                          {STATUS_CONFIG[msg.status].label}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: detail ── */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {selected ? (
            <>
              {/* Message header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{selected.subject ?? 'No Subject'}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">{selected.name}</span>
                      <span className="text-gray-300">·</span>
                      <a href={`mailto:${selected.email}`} className="text-sm text-[#0056A6] hover:underline">{selected.email}</a>
                      {selected.phone && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm text-gray-600">{selected.phone}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(selected.created_at), 'MMMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <span className={cn('flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_CONFIG[selected.status].color)}>
                    {STATUS_CONFIG[selected.status].icon}
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 overflow-y-auto p-5">
                {selected.service_interest && (
                  <div className="mb-4 bg-blue-50 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-[#0056A6] mb-0.5">Service Interest</p>
                    <p className="text-sm text-gray-700">{selected.service_interest}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(selected.id, 'read')}
                    disabled={selected.status === 'read'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                  >
                    <MailOpen size={13} /> Mark as Read
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, 'replied')}
                    disabled={selected.status === 'replied'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-40 transition-colors"
                  >
                    <CheckCircle size={13} /> Mark as Replied
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, 'archived')}
                    disabled={selected.status === 'archived'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-40 transition-colors"
                  >
                    <Archive size={13} /> Archive
                  </button>
                  {selected.status === 'archived' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'read')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      <RefreshCw size={13} /> Restore
                    </button>
                  )}
                </div>

                {/* Reply form */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Reply size={16} className="text-[#0056A6]" /> Reply Email
                  </p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Write the email reply that will be sent to this user..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6] bg-gray-50 resize-vertical"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">This sends an actual email reply and marks message as replied.</p>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || replying}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] disabled:opacity-50 transition-colors"
                    >
                      <Reply size={14} />
                      {replying ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Mail size={48} className="text-gray-200" />
              <p className="text-sm">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
