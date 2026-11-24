"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2,
  ExternalLink,
  Check,
  X,
  Loader2,
  Save,
  Sparkles,
  UploadCloud,
  Link2,
  RefreshCw,
  Languages,
} from "lucide-react";
import {
  type CompanyRecord,
  type CompanyCategorySlug,
  type Locale,
  DEFAULT_COMPANIES,
} from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { uploadFileDirect } from "@/lib/directUpload";

const CATEGORIES: { slug: CompanyCategorySlug; label: string }[] = [
  { slug: "all", label: "All Sectors" },
  { slug: "pharma", label: "Pharma & Health" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "festivals", label: "Festivals" },
  { slug: "tech", label: "Tech & Telecom" },
  { slug: "real_estate", label: "Real Estate" },
  { slug: "corporate", label: "Corporate" },
];

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>(DEFAULT_COMPANIES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategorySlug>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalLocale, setModalLocale] = useState<Locale>("en");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo_url: "",
    website_url: "",
    category: "corporate" as CompanyCategorySlug,
    highlight: "",
    description: "",
    order_index: 0,
    featured: false,
    is_active: true,
    translations: {
      ar: {
        name: "",
        highlight: "",
        description: "",
      },
    },
  });

  // Logo Upload & Drag-and-Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!validMimes.includes(file.type)) {
      showNotification("error", "Unsupported file format. Please use PNG, WebP, or JPG.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showNotification("error", "File size exceeds 50MB limit.");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const uploadRes = await uploadFileDirect(file, "logos");

      if (uploadRes.ok && uploadRes.url) {
        setFormData((prev) => ({ ...prev, logo_url: uploadRes.url! }));
        showNotification("success", "Logo uploaded to CDN successfully!");
      } else {
        showNotification("error", uploadRes.error || "Failed to upload logo");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      showNotification("error", msg);
    } finally {
      setIsUploadingLogo(false);
      setIsDragging(false);
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        setCompanies(json.data);
      }
    } catch {
      // Keep existing
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch("/api/companies");
        const json = await res.json();
        if (!ignore && json.ok && Array.isArray(json.data)) {
          setCompanies(json.data);
        }
      } catch {
        // Keep existing
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setModalLocale("en");
    setShowManualUrl(false);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      name: "",
      slug: "",
      logo_url: "",
      website_url: "",
      category: "corporate",
      highlight: "",
      description: "",
      order_index: companies.length + 1,
      featured: false,
      is_active: true,
      translations: {
        ar: {
          name: "",
          highlight: "",
          description: "",
        },
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: CompanyRecord) => {
    setEditingCompany(comp);
    setModalLocale("en");
    setShowManualUrl(false);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      name: comp.name,
      slug: comp.slug,
      logo_url: comp.logo,
      website_url: comp.websiteUrl || "",
      category: comp.category,
      highlight: comp.highlight,
      description: comp.description,
      order_index: comp.order,
      featured: Boolean(comp.featured),
      is_active: comp.isActive,
      translations: {
        ar: {
          name: comp.translations?.ar?.name || "",
          highlight: comp.translations?.ar?.highlight || "",
          description: comp.translations?.ar?.description || "",
        },
      },
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo_url) {
      showNotification("error", "Please upload or provide a company logo.");
      return;
    }

    const generatedSlug =
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || `partner-${Date.now()}`;

    const payload = {
      ...formData,
      slug: editingCompany ? formData.slug || generatedSlug : generatedSlug,
    };

    setIsSaving(true);
    try {
      const url = editingCompany
        ? `/api/companies/${editingCompany.id}`
        : "/api/companies";
      const method = editingCompany ? "PUT" : "POST";

      const res = await apiFetchWithCsrf(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification("success", editingCompany ? "Company updated!" : "Company created!");
        setIsModalOpen(false);
        fetchCompanies();
      } else {
        const err = await res.json();
        showNotification("error", err.error || "Failed to save company");
      }
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (comp: CompanyRecord) => {
    if (!confirm(`Are you sure you want to remove "${comp.name}"?`)) return;

    try {
      const res = await apiFetchWithCsrf(`/api/companies/${comp.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotification("success", "Company removed!");
        setCompanies((prev) => prev.filter((c) => c.id !== comp.id));
      } else {
        const err = await res.json();
        showNotification("error", err.error || "Failed to delete");
      }
    } catch {
      showNotification("error", "Error communicating with server");
    }
  };

  const handleToggleActive = async (comp: CompanyRecord) => {
    try {
      const updatedStatus = !comp.isActive;
      const res = await apiFetchWithCsrf(`/api/companies/${comp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: updatedStatus }),
      });
      if (res.ok) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === comp.id ? { ...c, isActive: updatedStatus } : c))
        );
      }
    } catch {
      showNotification("error", "Could not toggle status");
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredCompanies.length) return;

    const itemA = filteredCompanies[index];
    const itemB = filteredCompanies[targetIndex];

    const newOrderA = itemB.order;
    const newOrderB = itemA.order;

    try {
      await Promise.all([
        apiFetchWithCsrf(`/api/companies/${itemA.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: newOrderA }),
        }),
        apiFetchWithCsrf(`/api/companies/${itemB.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: newOrderB }),
        }),
      ]);
      fetchCompanies();
    } catch {
      showNotification("error", "Failed to update order");
    }
  };

  const filteredCompanies = companies.filter((comp) => {
    const matchCategory = selectedCategory === "all" || comp.category === selectedCategory;
    const matchSearch =
      !search ||
      comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.description.toLowerCase().includes(search.toLowerCase()) ||
      comp.highlight.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0e0e14] text-white">
      <AdminHeader title="Company & Partner Showcase" />

      <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner Alert Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              notification.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                : "bg-rose-950/60 border-rose-500/50 text-rose-300"
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#161622] border border-[#2a2a3c] rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono uppercase">Total Companies</div>
              <div className="text-2xl font-black">{companies.length}</div>
            </div>
          </div>

          <div className="p-4 bg-[#161622] border border-[#2a2a3c] rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-400 text-black flex items-center justify-center font-black">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono uppercase">Active on Website</div>
              <div className="text-2xl font-black">
                {companies.filter((c) => c.isActive).length}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#161622] border border-[#2a2a3c] rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-300 text-black flex items-center justify-center font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono uppercase">Featured Badges</div>
              <div className="text-2xl font-black">
                {companies.filter((c) => c.featured).length}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#161622] p-4 rounded-xl border border-[#2a2a3c]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search companies by name or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0e0e14] border border-[#2a2a3c] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-body"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs uppercase px-4 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#ffffff] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        {/* Sector Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat.slug
                  ? "bg-yellow-400 text-black border-black font-black"
                  : "bg-[#161622] text-zinc-400 border-[#2a2a3c] hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Table of Companies */}
        <div className="bg-[#161622] rounded-xl border border-[#2a2a3c] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2a2a3c] text-[11px] font-mono uppercase text-zinc-400 bg-[#12121a]">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Partnership Highlight</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3c] text-xs font-body">
                {filteredCompanies.map((comp, idx) => (
                  <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Order Controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-zinc-400">
                        <span>#{comp.order}</span>
                        <div className="flex flex-col ml-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleReorder(idx, "up")}
                            className="hover:text-yellow-400 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === filteredCompanies.length - 1}
                            onClick={() => handleReorder(idx, "down")}
                            className="hover:text-yellow-400 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Logo & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center p-1 shrink-0">
                          {comp.logo ? (
                            <Image
                              src={comp.logo}
                              alt={comp.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover rounded"
                              unoptimized
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-headline font-bold text-sm text-white flex items-center gap-2">
                            {comp.name}
                            {comp.featured && (
                              <span className="text-[9px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/40 uppercase font-mono">
                                ★ Featured
                              </span>
                            )}
                          </div>
                          {comp.websiteUrl && (
                            <a
                              href={comp.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-zinc-400 hover:text-yellow-400 flex items-center gap-1 font-mono mt-0.5"
                            >
                              <span>{comp.websiteUrl.replace(/^https?:\/\//, "")}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-headline font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1e1e2d] border border-[#32324a] text-zinc-300">
                        {comp.category}
                      </span>
                    </td>

                    {/* Highlight */}
                    <td className="py-3 px-4 text-zinc-300 max-w-xs truncate">
                      <div className="font-semibold text-white">{comp.highlight || "—"}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{comp.description}</div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(comp)}
                        className={`text-[10px] font-headline font-bold uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          comp.isActive
                            ? "bg-emerald-950/60 border-emerald-500 text-emerald-400 hover:bg-emerald-900/60"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                        }`}
                      >
                        {comp.isActive ? "● Live / Active" : "○ Hidden"}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(comp)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-300 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(comp)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-600 hover:text-white text-zinc-300 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          onClick={() => setIsModalOpen(false)}
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121318] border border-white/10 rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.75)]"
          >
            {/* Sticky Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#16171e] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white tracking-tight">
                    {editingCompany ? "Edit Partner Company" : "Add Partner Company"}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Displayed in the home partners marquee
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bilingual Language Switcher Bar */}
            <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#13141b] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>{modalLocale === "ar" ? "Arabic Translation (RTL)" : "English & Shared Logo"}</span>
              </div>
              <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-[#0b0c10] border border-white/10">
                <button
                  type="button"
                  onClick={() => setModalLocale("en")}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    modalLocale === "en"
                      ? "bg-amber-400 text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setModalLocale("ar")}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    modalLocale === "ar"
                      ? "bg-amber-400 text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  العربية (AR)
                </button>
              </div>
            </div>

            {/* Dedicated Scrollable Y Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5 text-sm">
              {modalLocale === "ar" ? (
                <div dir="rtl" className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">
                      اسم الشركة بالعربي
                    </label>
                    <input
                      type="text"
                      value={formData.translations.ar.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            ar: {
                              ...formData.translations.ar,
                              name: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={formData.name || "مثال: ريد بُل"}
                      className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">
                      وصف التعاون بالعربي (يظهر عند تمرير الماوس على الشعار)
                    </label>
                    <input
                      type="text"
                      value={formData.translations.ar.highlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            ar: {
                              ...formData.translations.ar,
                              highlight: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={formData.highlight || "مثال: الملتقى السنوي وتجهيز المسرح"}
                      className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <>
              <div>
                <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">
                  Company Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug =
                      name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "") || formData.slug;
                    setFormData({
                      ...formData,
                      name,
                      slug: editingCompany ? formData.slug : slug,
                    });
                  }}
                  placeholder="e.g. Red Bull"
                  className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">
                    Sector <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as CompanyCategorySlug })
                    }
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all"
                  >
                    <option value="corporate">Corporate</option>
                    <option value="pharma">Pharma &amp; Health</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="festivals">Festivals</option>
                    <option value="tech">Tech &amp; Telecom</option>
                    <option value="real_estate">Real Estate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all"
                  />
                </div>
              </div>

              {/* Company Logo Uploader */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[13px] font-medium text-zinc-300">
                    Company Logo <span className="text-amber-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-xs text-zinc-400 hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{showManualUrl ? "Hide image URL" : "Paste image URL"}</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                {formData.logo_url ? (
                  <div className="relative bg-[#0b0c10] border border-white/10 rounded-xl p-3.5 flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-lg bg-[#16171e] border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.logo_url}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/100x100/1e1e2d/ffd700?text=Logo";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Logo attached</span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate" title={formData.logo_url}>
                        {formData.logo_url}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="px-2.5 py-1 text-xs bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 rounded-lg border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3 h-3 ${isUploadingLogo ? "animate-spin" : ""}`} />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, logo_url: "" }))}
                          className="px-2.5 py-1 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDropFile}
                    onClick={() => !isUploadingLogo && fileInputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                      isDragging
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/15 bg-[#0b0c10] hover:border-amber-400/60 hover:bg-[#14151c]"
                    }`}
                  >
                    {isUploadingLogo ? (
                      <div className="py-2 flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                        <span className="text-zinc-400 text-xs">
                          Uploading logo to storage...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-zinc-200 text-xs font-medium">
                            Drag &amp; drop logo here, or{" "}
                            <span className="text-amber-400 underline underline-offset-2">browse</span>
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-1">
                            PNG (transparent), WebP, JPG up to 50MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {showManualUrl && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://... or /assets/images/..."
                      className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400/80"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">
                  Collaboration Highlight
                </label>
                <input
                  type="text"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  placeholder="e.g. Annual Gathering & Stage Rig"
                  className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15 transition-all"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Shown next to the sector tag when hovering a partner card
                </p>
              </div>
                </>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="px-6 py-4 border-t border-white/[0.08] bg-[#16171e] flex items-center justify-between gap-3 shrink-0">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 rounded border-white/20 cursor-pointer"
                />
                <span>Live on Website</span>
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingCompany ? "Save Changes" : "Create Company"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
