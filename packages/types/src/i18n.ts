/**
 * Art Work Bilingual i18n Contracts & UI Dictionary (English / Arabic)
 * Shared across @art-work/artwork-app, @art-work/admin, and @art-work/database
 */

export type Locale = "en" | "ar";

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "ar"] as const;
export const LOCALE_COOKIE_NAME = "artwork_locale";

export function isValidLocale(value: unknown): value is Locale {
  return value === "en" || value === "ar";
}

export function normalizeLocale(value?: string | null): Locale {
  if (!value) return DEFAULT_LOCALE;
  const clean = value.trim().toLowerCase();
  if (clean === "ar" || clean.startsWith("ar-") || clean.startsWith("ar_")) {
    return "ar";
  }
  return "en";
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}

export interface ProjectTranslationFields {
  title?: string;
  client?: string;
  description?: string;
  stamp?: string;
  metaBadge?: string;
  stats?: string;
  statsSub?: string;
  specs?: string[];
  tags?: string[];
  altText?: string;
  youtubeTitle?: string | null;
  youtubeDescription?: string | null;
  pdfTitle?: string | null;
}

export interface ProjectTranslationsMap {
  ar?: ProjectTranslationFields;
}

export interface CompanyTranslationFields {
  name?: string;
  highlight?: string;
  description?: string;
}

export interface CompanyTranslationsMap {
  ar?: CompanyTranslationFields;
}

export interface UiDictionary {
  localeCode: Locale;
  languageName: string;
  switchLanguageLabel: string;
  switchLanguageAria: string;
  nav: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
  };
  stages: {
    home: string;
    whyUs: string;
    services: string;
    gallery: string;
    contact: string;
  };
  floatingDock: {
    ariaLabel: string;
    emailTooltip: string;
    whatsappTooltip: string;
  };
  projectCategories: {
    all: string;
    stage: string;
    conferences: string;
    booths: string;
    branding: string;
    tech: string;
    led: string;
  };
  companyCategories: {
    all: string;
    pharma: string;
    entertainment: string;
    festivals: string;
    tech: string;
    real_estate: string;
    corporate: string;
  };
  gallery: {
    featuredBadge: string;
    featuredProjectBadge: string;
    noProjectsFound: string;
    resetFilter: string;
    watchVideo: string;
    viewPhotos: string;
    viewBlueprint: string;
    viewGiveawaysPdf: string;
    openBehance: string;
    openFacebookVideo: string;
    openYouTube: string;
    facebookReelBadge: string;
    facebookVideoBadge: string;
    youtubeShortsBadge: string;
    youtubeVideoBadge: string;
    tabOverview: string;
    tabPhotos: string;
    tabVideo: string;
    tabPdf: string;
    clientLabel: string;
    categoryLabel: string;
    yearLabel: string;
    specsHeading: string;
    tagsHeading: string;
    deliverablesLabel: string;
    downloadPdf: string;
    openInNewTab: string;
    closeModal: string;
    loadingPreview: string;
    previousImage: string;
    nextImage: string;
    reelTag: string;
    videoTag: string;
    closeVideo: string;
    playVideo: string;
  };
  services: {
    deliverablesHeading: string;
    closeDialog: string;
    noDisciplinesMatch: string;
  };
  partners: {
    activePartnerBadge: string;
    visitWebsite: string;
    closePartnerDetails: string;
  };
  contact: {
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    successMessage: string;
    errorFallback: string;
    networkError: string;
    sending: string;
  };
  skeletons: {
    servicesTitle: string;
    galleryTitle: string;
    contactTitle: string;
    loading: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    backHome: string;
    exploreGallery: string;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    whyUsTitle: string;
    whyUsDescription: string;
    galleryTitle: string;
    galleryDescription: string;
  };
}

export const UI_DICTIONARY: Record<Locale, UiDictionary> = {
  en: {
    localeCode: "en",
    languageName: "English",
    switchLanguageLabel: "AR",
    switchLanguageAria: "Switch language to Arabic",
    nav: {
      skipToContent: "Skip to content",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
    },
    stages: {
      home: "Home",
      whyUs: "Why Us",
      services: "Services",
      gallery: "★ Gallery",
      contact: "Contact",
    },
    floatingDock: {
      ariaLabel: "Floating Action Dock",
      emailTooltip: "Send Project Brief / Email Inquiry",
      whatsappTooltip: "Direct WhatsApp Chat",
    },
    projectCategories: {
      all: "All Projects",
      stage: "Stage & Events",
      conferences: "Events & Conferences",
      booths: "Booths & Pavilions",
      branding: "Branding & Giveaways",
      tech: "Interactive Tech",
      led: "LED & Scenography",
    },
    companyCategories: {
      all: "All Sectors",
      pharma: "Pharma & Healthcare",
      entertainment: "Entertainment",
      festivals: "Festivals",
      tech: "Tech & Telecom",
      real_estate: "Real Estate",
      corporate: "Corporate",
    },
    gallery: {
      featuredBadge: "★ FEATURED",
      featuredProjectBadge: "★ FEATURED EVENT",
      noProjectsFound: "No projects matched this category yet.",
      resetFilter: "View All Projects",
      watchVideo: "Watch Video",
      viewPhotos: "View Photos",
      viewBlueprint: "Architectural PDF",
      viewGiveawaysPdf: "Giveaways Catalog PDF",
      openBehance: "View on Behance",
      openFacebookVideo: "Watch on Facebook",
      openYouTube: "Watch on YouTube",
      facebookReelBadge: "Facebook Reel",
      facebookVideoBadge: "Facebook Video",
      youtubeShortsBadge: "YouTube Short",
      youtubeVideoBadge: "YouTube Video",
      tabOverview: "Overview",
      tabPhotos: "Gallery Photos",
      tabVideo: "Video Showcase",
      tabPdf: "Specification PDF",
      clientLabel: "Client",
      categoryLabel: "Category",
      yearLabel: "Year",
      specsHeading: "Production Highlights & Specs",
      tagsHeading: "Scope Tags",
      deliverablesLabel: "Deliverables",
      downloadPdf: "Download PDF",
      openInNewTab: "Open in New Tab",
      closeModal: "Close Preview",
      loadingPreview: "Loading preview...",
      previousImage: "Previous image",
      nextImage: "Next image",
      reelTag: "REEL / SHORT",
      videoTag: "VIDEO",
      closeVideo: "Close",
      playVideo: "Play Video",
    },
    services: {
      deliverablesHeading: "Key Deliverables & Scope",
      closeDialog: "Close",
      noDisciplinesMatch: "No services matched the selected filter.",
    },
    partners: {
      activePartnerBadge: "TRUSTED PARTNER",
      visitWebsite: "Visit Website",
      closePartnerDetails: "Close details",
    },
    contact: {
      emailLabel: "Direct Email",
      phoneLabel: "Direct Phone / WhatsApp",
      locationLabel: "Studio Location",
      successMessage:
        "⚡ Brief dispatched! Our stage director has received your specifications and will respond within 24 hours.",
      errorFallback:
        "Failed to submit project brief. Please check your information.",
      networkError:
        "Network error occurred while sending your brief. Please verify your connection.",
      sending: "Dispatching Brief...",
    },
    skeletons: {
      servicesTitle: "SERVICES & CAPABILITIES MATRIX",
      galleryTitle: "SELECTED PROJECTS ARCHIVE",
      contactTitle: "PROJECT BRIEF & INTAKE",
      loading: "Loading stage...",
    },
    notFound: {
      code: "404",
      title: "Stage Not Found",
      description:
        "The scene or blueprint you requested is outside our active production stage.",
      backHome: "Back to Home",
      exploreGallery: "Explore Project Gallery",
    },
    seo: {
      homeTitle: "ART WORK — Creative Marketing Solutions | Event & Exhibition Production",
      homeDescription:
        "From initial concept to final execution, Art Work plans, designs, and delivers unforgettable corporate events, exhibition booths, and brand experiences.",
      whyUsTitle: "Why Art Work — One Team From First Idea to Event Day",
      whyUsDescription:
        "Discover how our creative, planning, and production team turns brand concepts into seamless live events and exhibition spaces.",
      galleryTitle: "Project Gallery — ART WORK Showcase",
      galleryDescription:
        "Explore delivered conferences, exhibition booths, corporate gatherings, and promotional giveaway catalogs by Art Work.",
    },
  },
  ar: {
    localeCode: "ar",
    languageName: "العربية",
    switchLanguageLabel: "EN",
    switchLanguageAria: "التبديل إلى اللغة الإنجليزية",
    nav: {
      skipToContent: "تخطي إلى المحتوى",
      openMenu: "فتح قائمة التنقل",
      closeMenu: "إغلاق قائمة التنقل",
    },
    stages: {
      home: "الرئيسية",
      whyUs: "لماذا نحن",
      services: "خدماتنا",
      gallery: "★ المعرض",
      contact: "تواصل معنا",
    },
    floatingDock: {
      ariaLabel: "شريط التواصل السريع",
      emailTooltip: "أرسل تفاصيل مشروعك / استفسار عبر البريد",
      whatsappTooltip: "تواصل فوري عبر واتساب",
    },
    projectCategories: {
      all: "جميع المشاريع",
      stage: "المسارح والفعاليات",
      conferences: "الفعاليات والمؤتمرات",
      booths: "الأجنحة والمعارض",
      branding: "الهوية والهدايا الترويجية",
      tech: "التقنيات التفاعلية",
      led: "الشاشات والسينوغرافيا",
    },
    companyCategories: {
      all: "جميع القطاعات",
      pharma: "الأدوية والرعاية الصحية",
      entertainment: "الترفيه",
      festivals: "المهرجانات",
      tech: "التقنية والاتصالات",
      real_estate: "التطوير العقاري",
      corporate: "الشركات والمؤسسات",
    },
    gallery: {
      featuredBadge: "★ مشروع مميز",
      featuredProjectBadge: "★ فعالية مميزة",
      noProjectsFound: "لا توجد مشاريع في هذا التصنيف حالياً.",
      resetFilter: "عرض جميع المشاريع",
      watchVideo: "شاهد الفيديو",
      viewPhotos: "معرض الصور",
      viewBlueprint: "ملف المواصفات والمخطط PDF",
      viewGiveawaysPdf: "كتالوج الهدايا الترويجية PDF",
      openBehance: "عرض على Behance",
      openFacebookVideo: "مشاهدة على فيسبوك",
      openYouTube: "مشاهدة على يوتيوب",
      facebookReelBadge: "ريل فيسبوك",
      facebookVideoBadge: "فيديو فيسبوك",
      youtubeShortsBadge: "يوتيوب شورتس",
      youtubeVideoBadge: "فيديو يوتيوب",
      tabOverview: "نظرة عامة",
      tabPhotos: "صور المشروع",
      tabVideo: "عرض الفيديو",
      tabPdf: "ملف PDF",
      clientLabel: "العميل",
      categoryLabel: "التصنيف",
      yearLabel: "السنة",
      specsHeading: "مواصفات وتفاصيل التنفيذ",
      tagsHeading: "نطاق العمل",
      deliverablesLabel: "المخرجات",
      downloadPdf: "تحميل ملف PDF",
      openInNewTab: "فتح في نافذة جديدة",
      closeModal: "إغلاق المعاينة",
      loadingPreview: "جاري تحميل المعاينة...",
      previousImage: "الصورة السابقة",
      nextImage: "الصورة التالية",
      reelTag: "فيديو قصير / ريل",
      videoTag: "فيديو",
      closeVideo: "إغلاق",
      playVideo: "تشغيل الفيديو",
    },
    services: {
      deliverablesHeading: "المخرجات ونطاق التنفيذ",
      closeDialog: "إغلاق",
      noDisciplinesMatch: "لا توجد خدمات مطابقة للتصنيف المحدد.",
    },
    partners: {
      activePartnerBadge: "شريك نجاح",
      visitWebsite: "زيارة الموقع الإلكتروني",
      closePartnerDetails: "إغلاق التفاصيل",
    },
    contact: {
      emailLabel: "البريد الإلكتروني المباشر",
      phoneLabel: "الهاتف المباشر / واتساب",
      locationLabel: "مقر الاستوديو",
      successMessage:
        "⚡ تم استلام تفاصيل مشروعك بنجاح! سيتواصل معك فريق الإنتاج والإدارة الإبداعية خلال 24 ساعة.",
      errorFallback:
        "تعذر إرسال تفاصيل المشروع. يرجى مراجعة البيانات المدخلة.",
      networkError:
        "حدث خطأ في الاتصال أثناء الإرسال. يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً.",
      sending: "جاري إرسال الطلب...",
    },
    skeletons: {
      servicesTitle: "مصفوفة الخدمات والقدرات الإبداعية",
      galleryTitle: "أرشيف المشاريع المختارة",
      contactTitle: "طلب تنفيذ مشروع جديد",
      loading: "جاري تحميل القسم...",
    },
    notFound: {
      code: "404",
      title: "الصفحة غير موجودة",
      description:
        "الصفحة أو المشروع الذي تبحث عنه غير متاح حالياً ضمن جدول الإنتاج النشط.",
      backHome: "العودة للرئيسية",
      exploreGallery: "استكشاف معرض المشاريع",
    },
    seo: {
      homeTitle: "آرت وورك (ART WORK) — حلول التسويق الإبداعي وتنظيم الفعاليات والمعارض",
      homeDescription:
        "من الفكرة الأولى حتى لحظة التنفيذ في الموقع، نخطط ونصمم وننفذ الفعاليات والمؤتمرات وأجنحة المعارض وتجارب العلامات التجارية بأعلى دقة واحترافية.",
      whyUsTitle: "لماذا آرت وورك — فريق واحد من الفكرة الأولى حتى يوم الحدث",
      whyUsDescription:
        "تعرّف على منهجية فريقنا المتكاملة في التصميم الإبداعي والتخطيط والإنتاج الميداني للفعاليات والمعارض.",
      galleryTitle: "معرض المشاريع — آرت وورك (ART WORK)",
      galleryDescription:
        "استعرض أبرز المؤتمرات والفعاليات وأجنحة المعارض وكتالوجات الهدايا الترويجية التي نفذها فريق آرت وورك.",
    },
  },
};

export function getUiDictionary(locale: Locale): UiDictionary {
  return UI_DICTIONARY[locale] || UI_DICTIONARY.en;
}
