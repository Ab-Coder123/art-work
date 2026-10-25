"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Mail,
  Search,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  Send,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { InquiryRecord, InquiryStatus } from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";

const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: "Pending Review",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    border: "border-yellow-400/30",
  },
  reviewed: {
    label: "Under Review",
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    border: "border-blue-400/30",
  },
  contacted: {
    label: "Contacted",
    bg: "bg-emerald-400/10",
    text: "text-emerald-400",
    border: "border-emerald-400/30",
  },
  archived: {
    label: "Archived",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
  },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "all") {
        params.append("status", selectedStatus);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          setInquiries(json.data.items || []);
        }
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const params = new URLSearchParams();
        if (selectedStatus !== "all") {
          params.append("status", selectedStatus);
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        const res = await fetch(`/api/inquiries?${params.toString()}`);
        if (res.ok && isMounted) {
          const json = await res.json();
          if (json.ok && json.data) {
            setInquiries(json.data.items || []);
          }
        }
      } catch {
        // Silently caught
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedStatus, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    setIsUpdating(true);
    try {
      const res = await apiFetchWithCsrf(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
        setActionFeedback(`Updated status to ${STATUS_CONFIG[newStatus].label}`);
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch {
      setActionFeedback("Failed to update status");
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await apiFetchWithCsrf(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        setActionFeedback("Inquiry deleted successfully");
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch {
      setActionFeedback("Failed to delete inquiry");
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;

  return (
    <div className="flex-1 flex flex-col bg-[#0d0d12] text-[#f3f3f6] min-h-screen">
      <AdminHeader
        title="Client Leads & Project Briefs"
        subtitle={`Manage incoming client intake submissions, dispatch direct correspondence, and track conversion status (${pendingCount} pending).`}
        action={
          <button
            onClick={() => loadInquiries()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262638] bg-[#1a1a24] text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#222230] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Status Toast Feedback */}
        {actionFeedback && (
          <div className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-yellow-400 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionFeedback}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-[#12121a] p-4 rounded-2xl border border-[#262638]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedStatus === "all"
                  ? "bg-yellow-400 text-black font-bold shadow-[2px_2px_0px_#ffffff]"
                  : "text-zinc-400 hover:text-white hover:bg-[#1a1a26]"
              }`}
            >
              All Leads ({inquiries.length})
            </button>
            {(["pending", "reviewed", "contacted", "archived"] as InquiryStatus[]).map(
              (st) => {
                const count = inquiries.filter((i) => i.status === st).length;
                return (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedStatus === st
                        ? "bg-yellow-400 text-black font-bold shadow-[2px_2px_0px_#ffffff]"
                        : "text-zinc-400 hover:text-white hover:bg-[#1a1a26]"
                    }`}
                  >
                    <span>{STATUS_CONFIG[st].label}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedStatus === st
                            ? "bg-black/20 text-black"
                            : "bg-[#262638] text-zinc-300"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, email, brief..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181824] border border-[#262638] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>

        {/* Leads Table / List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
            <p className="text-xs font-mono">Loading client leads pipeline...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-[#12121a] border border-[#262638] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mx-auto border border-yellow-400/20">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Inquiries Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== "all"
                ? "No client submissions match your current filter criteria."
                : "The intake pipeline is clear. New submissions from the public website will appear here in real-time."}
            </p>
          </div>
        ) : (
          <div className="bg-[#12121a] border border-[#262638] rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-[#262638]">
              {inquiries.map((inq) => {
                const cfg = STATUS_CONFIG[inq.status] || STATUS_CONFIG.pending;
                const formattedDate = new Date(inq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={inq.id}
                    className="p-5 hover:bg-[#181824] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div
                      className="space-y-1.5 flex-1 cursor-pointer"
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-sm text-white hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                          {inq.fullName}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-xs text-yellow-400 font-mono bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          {inq.serviceType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span className="text-zinc-300">{inq.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {formattedDate}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 max-w-3xl font-body">
                        {inq.brief}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <a
                        href={`mailto:${inq.email}?subject=Re:%20Art%20Work%20//%20Project%20Brief%20(${encodeURIComponent(
                          inq.serviceType
                        )})`}
                        className="px-3 py-1.5 rounded-lg border border-[#262638] bg-[#1a1a24] text-xs font-medium text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Direct reply email"
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply</span>
                      </a>

                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="px-3 py-1.5 rounded-lg border border-[#262638] bg-[#1a1a24] text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#222230] transition-colors cursor-pointer"
                      >
                        View Full Brief
                      </button>

                      <button
                        onClick={() => handleDelete(inq.id)}
                        disabled={isUpdating}
                        className="p-2 rounded-lg border border-[#262638] bg-[#1a1a24] text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121a] border-2 border-[#262638] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#262638] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                    LEAD DETAILS // STAGE 05
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                      STATUS_CONFIG[selectedInquiry.status].bg
                    } ${STATUS_CONFIG[selectedInquiry.status].text} ${
                      STATUS_CONFIG[selectedInquiry.status].border
                    }`}
                  >
                    {STATUS_CONFIG[selectedInquiry.status].label}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedInquiry.fullName}</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  ID: {selectedInquiry.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1a26]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#181824] p-4 rounded-xl border border-[#262638]">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Client Email
                </span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-xs font-semibold text-yellow-400 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedInquiry.email}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Target Service
                </span>
                <span className="text-xs font-semibold text-white block mt-0.5">
                  {selectedInquiry.serviceType}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Submitted At
                </span>
                <span className="text-xs text-zinc-300 font-mono block mt-0.5">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Security Hash (IP)
                </span>
                <span className="text-[11px] text-zinc-400 font-mono block mt-0.5 truncate">
                  {selectedInquiry.ipHash || "N/A"}
                </span>
              </div>
            </div>

            {/* Full Brief Narrative */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold block">
                The Core Brief / Vision Constraints
              </label>
              <div className="bg-[#181824] border border-[#262638] rounded-xl p-4 text-xs text-zinc-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-body">
                {selectedInquiry.brief}
              </div>
            </div>

            {/* Lifecycle Status Switcher */}
            <div className="space-y-2 border-t border-[#262638] pt-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Update Pipeline Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {(["pending", "reviewed", "contacted", "archived"] as InquiryStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdating || selectedInquiry.status === st}
                      onClick={() => handleStatusChange(selectedInquiry.id, st)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                        selectedInquiry.status === st
                          ? "bg-yellow-400 text-black border-black font-bold shadow-[2px_2px_0px_#ffffff]"
                          : "bg-[#1a1a24] text-zinc-300 border-[#262638] hover:border-yellow-400/50 hover:text-white"
                      }`}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between border-t border-[#262638] pt-4">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                disabled={isUpdating}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#1a1a26] transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re:%20Art%20Work%20//%20Project%20Brief%20(${encodeURIComponent(
                    selectedInquiry.serviceType
                  )})`}
                  className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold text-xs hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-[2px_2px_0px_#ffffff] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
