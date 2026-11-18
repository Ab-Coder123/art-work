import { ProjectRecord } from "@art-work/types";

export interface AdminNotification {
  type: "success" | "error" | "warning";
  title: string;
  detail?: string;
}

export function humanizeAdminError(rawError: string): { title: string; detail: string } {
  const err = (rawError || "").toLowerCase();

  if (err.includes("title must be at least") || err.includes("title is required")) {
    return {
      title: "اسم المشروع غير مكتمل (Title Required)",
      detail: "يرجى كتابة عنوان واضح للمشروع لا يقل عن حرفين ليظهر بشكل صحيح في المعرض.",
    };
  }
  if (err.includes("client") && (err.includes("required") || err.includes("least"))) {
    return {
      title: "اسم العميل مطلوب (Client Required)",
      detail: "يرجى تحديد اسم العميل أو الجهة الراعية للعمل (حرفين على الأقل).",
    };
  }
  if (err.includes("description") && (err.includes("least") || err.includes("characters") || err.includes("10"))) {
    return {
      title: "الوصف غير كافٍ (Description Too Short)",
      detail: "يرجى كتابة نبذة تفصيلية عن المشروع لا تقل عن 10 أحرف لشرح فكرته وتنفيذه.",
    };
  }
  if (err.includes("slug") || err.includes("duplicate key") || err.includes("already exists")) {
    return {
      title: "اسم المشروع مسجل مسبقاً (Duplicate Project)",
      detail: "يوجد مشروع آخر بنفس الاسم أو الرابط التعريفي، يرجى تعديل الاسم قليلاً لتجنب التكرار.",
    };
  }
  if (err.includes("youtube") || err.includes("iframe")) {
    return {
      title: "رابط اليوتيوب غير صالح (Invalid YouTube URL)",
      detail: "يرجى إدخال رابط فيديو صحيح من YouTube مباشرة (تأكد من عدم استخدام كود تضمين iframe).",
    };
  }
  if (err.includes("facebook")) {
    return {
      title: "رابط فيديو فيسبوك غير صالح (Invalid Facebook URL)",
      detail: "يرجى إدخال رابط فيديو صالح من Facebook أو fb.watch مباشرة (تأكد من عدم استخدام كود تضمين iframe).",
    };
  }
  if (err.includes("cover image")) {
    return {
      title: "صورة الغلاف مطلوبة (Cover Image Required)",
      detail: "يرجى رفع صورة الغلاف أو إدخال رابط يوتيوب ليتم سحب صورة الغلاف تلقائياً.",
    };
  }
  if (err.includes("year")) {
    return {
      title: "سنة المشروع غير صالحة (Invalid Year)",
      detail: "يرجى كتابة سنة صالحة بين عامي 2020 و 2035.",
    };
  }
  if (err.includes("network") || err.includes("failed to fetch") || err.includes("500")) {
    return {
      title: "تعذر الاتصال بالسيرفر (Connection Error)",
      detail: "حدثت مشكلة أثناء الاتصال بقاعدة البيانات. تأكد من اتصال الإنترنت ثم حاول مرة أخرى.",
    };
  }

  return {
    title: "تنبيه أثناء حفظ المشروع (Save Notice)",
    detail: rawError || "يرجى مراجعة الحقول المطلوبة والتأكد من صحتها.",
  };
}

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: "rameda-event",
    title: "Rameda Event",
    stamp: "2026",
    metaBadge: "ANNUAL GATHERING",
    cadId: "",
    image: "/assets/images/gallery/rameda_event.jpg",
    altText: "Rameda Annual Company Gathering & Event Production",
    category: "conferences",
    year: 2026,
    tags: [
      "Corporate Gathering",
      "Annual Event",
      "Stage & Production",
      "Event Management",
    ],
    stats: "",
    statsSub: "",
    description:
      "Relive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.",
    client: "Rameda Pharmaceuticals",
    specs: [
      "Custom Branded Stage & Lighting Rig",
      "High-Definition LED Screen Choreography",
      "Multi-Camera Live Broadcast & Showreel",
      "Seamless On-site Event Logistics",
    ],
    status: "published",
    order: 1,
    featured: true,
    youtubeVideoId: "7SkcdZ7CcGI",
    youtubeUrl: "https://www.youtube.com/watch?v=7SkcdZ7CcGI",
    youtubeTitle: "Rameda Event",
    youtubeDescription:
      "A day filled with unforgettable moments, positive energy, and team spirit! 🎉\n\nRelive the highlights of Rameda’s Annual Company Gathering, bringing together our amazing team for a special day of celebration, connection, and shared achievements.\n\nFrom memorable moments to the smiles and energy of our people, this event reflects the strong culture, teamwork, and passion that drive us forward every day.",
    isShort: false,
  },
  {
    id: "nova-medtech-booth",
    title: "Nova MedTech Custom Pavilion",
    stamp: "2025",
    metaBadge: "36M² CUSTOM BUILD",
    cadId: "",
    image: "/assets/images/gallery/project_06_sensory_expo.jpg",
    altText: "Nova MedTech Custom Exhibition Booth & Pavilion Fabrication",
    category: "booths",
    year: 2025,
    tags: [
      "Exhibition Booth",
      "Custom Fabrication",
      "3D Spatial Design",
      "On-Site Build",
    ],
    stats: "",
    statsSub: "",
    description:
      "Turnkey custom exhibition booth featuring architectural archways, integrated interactive touchscreens, and bespoke backlit brand displays for medical expo showcase.",
    client: "Nova MedTech Innovations",
    specs: [
      "Precision CNC Curved Woodwork & Matte Lacquer",
      "Integrated 65-inch Interactive Product Kiosks",
      "Engineered Overhead Hanging Signage & Truss Rigging",
      "Complete 48-Hour On-Site Assembly & Handover",
    ],
    status: "published",
    order: 2,
    featured: true,
    images: [
      "/assets/images/gallery/project_06_sensory_expo.jpg",
      "/assets/images/gallery/spotlight_blueprint_easel.jpg",
    ],
    pdfUrl: "/assets/docs/booth_spec_proposal.pdf",
    pdfTitle: "Nova MedTech 36m² Architectural Blueprint & 3D Spec Sheet (PDF)",
    youtubeVideoId: null,
    youtubeUrl: null,
    youtubeTitle: null,
    youtubeDescription: null,
    isShort: false,
  },
  {
    id: "pharmapack-expo-booth",
    title: "Pharmapack Discovery Stand",
    stamp: "2025",
    metaBadge: "54M² ISLAND BOOTH",
    cadId: "",
    image: "/assets/images/gallery/project_03_cybertruss.jpg",
    altText: "Pharmapack Discovery Stand Exhibition Booth Design & Build",
    category: "booths",
    year: 2025,
    tags: [
      "Exhibition Booth",
      "Modular Truss",
      "Brand Experience",
      "Turnkey Production",
    ],
    stats: "",
    statsSub: "",
    description:
      "High-impact exhibition stand engineered for maximum visitor engagement, featuring private meeting lounges, elevated branding banners, and seamless logistics.",
    client: "Pharmapack Regional Group",
    specs: [
      "Modular Aluminum Structure with Seamless Fabric Graphics",
      "Private Glass-Partitioned VIP Meeting Lounge",
      "Dynamic Ambient LED Floor Perimeter Illumination",
      "Full Dismantling, Packing & Storage Logistics",
    ],
    status: "published",
    order: 3,
    featured: true,
    images: [
      "/assets/images/gallery/project_03_cybertruss.jpg",
      "/assets/images/gallery/project_06_sensory_expo.jpg",
    ],
    pdfUrl: "/assets/docs/booth_spec_proposal.pdf",
    pdfTitle: "Pharmapack 54m² Modular Structural Elevation & Floorplan (PDF)",
    youtubeVideoId: null,
    youtubeUrl: null,
    youtubeTitle: null,
    youtubeDescription: null,
    isShort: false,
  },
];
