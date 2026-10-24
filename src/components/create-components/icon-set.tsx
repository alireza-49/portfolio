"use client";

import {
  createContext,
  useContext,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Bell,
  Boxes,
  CalendarCheck2,
  CalendarDays,
  ChartArea,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Filter,
  Gauge,
  Heart,
  HeartPulse,
  Info,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Trash2,
  TriangleAlert,
  Truck,
  Users,
  Video,
  Wallet,
  X,
} from "lucide-react";
import {
  IconActivity,
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBell,
  IconCalendarCheck,
  IconCalendarEvent,
  IconChartArea,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconClock,
  IconCreditCard,
  IconDownload,
  IconFilter,
  IconGauge,
  IconHeart,
  IconHeartbeat,
  IconInfoCircle,
  IconLayoutDashboard,
  IconLayoutGrid,
  IconMapPin,
  IconMenu2,
  IconMinus,
  IconPackages,
  IconPhone,
  IconPlus,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconShoppingBag,
  IconSparkles,
  IconStethoscope,
  IconTrash,
  IconTruckDelivery,
  IconUsers,
  IconVideo,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import {
  MdAccountBalanceWallet,
  MdAdd,
  MdAreaChart,
  MdArrowBack,
  MdArrowDownward,
  MdArrowForward,
  MdArrowUpward,
  MdAutoAwesome,
  MdCalendarToday,
  MdCheck,
  MdCheckCircleOutline,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdCreditCard,
  MdDashboard,
  MdDeleteOutline,
  MdDownload,
  MdErrorOutline,
  MdEventAvailable,
  MdExpandMore,
  MdFavoriteBorder,
  MdFilterList,
  MdGridView,
  MdInfoOutline,
  MdInventory2,
  MdMedicalServices,
  MdMenu,
  MdLocalShipping,
  MdMonitorHeart,
  MdNotificationsNone,
  MdPeople,
  MdPhone,
  MdPlace,
  MdRefresh,
  MdRemove,
  MdSchedule,
  MdSearch,
  MdSettings,
  MdShoppingBag,
  MdSpeed,
  MdTimeline,
  MdVerified,
  MdVerifiedUser,
  MdVideocam,
  MdWarningAmber,
} from "react-icons/md";
import { useCreateComponentTheme } from "./theme-provider";

/**
 * The studio's icon libraries.
 *
 * Every glyph on the preview canvas goes through the semantic registry below,
 * so picking a library really re-skins the whole site instead of swapping one
 * logo mark. Names are kebab-case and describe the *meaning*, never the
 * library's internal export (`check-circle`, not `CheckCircle2`), which keeps
 * the three sets in sync.
 */
export type IconLibraryId = "google" | "lucide" | "tabler";

/**
 * Props every glyph accepts. Each library's icon component takes its own
 * superset of these, so the union above stays assignable to all three.
 */
export type GlyphProps = {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  fill?: string;
  title?: string;
  role?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
};

export type Glyph = ComponentType<GlyphProps>;

const LUCIDE_ICONS = {
  brand: LayoutGrid,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  check: Check,
  "check-circle": CheckCircle2,
  clock: Clock,
  calendar: CalendarDays,
  "calendar-check": CalendarCheck2,
  video: Video,
  search: Search,
  users: Users,
  bell: Bell,
  activity: Activity,
  "chart-area": ChartArea,
  "credit-card": CreditCard,
  download: Download,
  filter: Filter,
  gauge: Gauge,
  dashboard: LayoutDashboard,
  refresh: RefreshCw,
  settings: Settings2,
  "shield-check": ShieldCheck,
  "shopping-bag": ShoppingBag,
  "badge-check": BadgeCheck,
  "heart-pulse": HeartPulse,
  "map-pin": MapPin,
  phone: Phone,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  wallet: Wallet,
  heart: Heart,
  menu: Menu,
  minus: Minus,
  plus: Plus,
  trash: Trash2,
  truck: Truck,
  close: X,
  "alert-circle": AlertCircle,
  "alert-triangle": TriangleAlert,
  info: Info,
  boxes: Boxes,
} satisfies Record<string, Glyph>;

/** Every glyph the studio can render, named by meaning rather than by export. */
export type IconName = keyof typeof LUCIDE_ICONS;

const TABLER_ICONS: Record<IconName, Glyph> = {
  brand: IconLayoutGrid,
  "arrow-left": IconArrowLeft,
  "arrow-right": IconArrowRight,
  "arrow-up": IconArrowUp,
  "arrow-down": IconArrowDown,
  "chevron-left": IconChevronLeft,
  "chevron-right": IconChevronRight,
  "chevron-down": IconChevronDown,
  check: IconCheck,
  "check-circle": IconCircleCheck,
  clock: IconClock,
  calendar: IconCalendarEvent,
  "calendar-check": IconCalendarCheck,
  video: IconVideo,
  search: IconSearch,
  users: IconUsers,
  bell: IconBell,
  activity: IconActivity,
  "chart-area": IconChartArea,
  "credit-card": IconCreditCard,
  download: IconDownload,
  filter: IconFilter,
  gauge: IconGauge,
  dashboard: IconLayoutDashboard,
  refresh: IconRefresh,
  settings: IconSettings,
  "shield-check": IconShieldCheck,
  "shopping-bag": IconShoppingBag,
  "badge-check": IconRosetteDiscountCheck,
  "heart-pulse": IconHeartbeat,
  "map-pin": IconMapPin,
  phone: IconPhone,
  sparkles: IconSparkles,
  stethoscope: IconStethoscope,
  wallet: IconWallet,
  heart: IconHeart,
  menu: IconMenu2,
  minus: IconMinus,
  plus: IconPlus,
  trash: IconTrash,
  close: IconX,
  "alert-circle": IconAlertCircle,
  "alert-triangle": IconAlertTriangle,
  info: IconInfoCircle,
  boxes: IconPackages,
  truck: IconTruckDelivery,
};

const GOOGLE_ICONS: Record<IconName, Glyph> = {
  brand: MdGridView,
  "arrow-left": MdArrowBack,
  "arrow-right": MdArrowForward,
  "arrow-up": MdArrowUpward,
  "arrow-down": MdArrowDownward,
  "chevron-left": MdChevronLeft,
  "chevron-right": MdChevronRight,
  "chevron-down": MdExpandMore,
  check: MdCheck,
  "check-circle": MdCheckCircleOutline,
  clock: MdSchedule,
  calendar: MdCalendarToday,
  "calendar-check": MdEventAvailable,
  video: MdVideocam,
  search: MdSearch,
  users: MdPeople,
  bell: MdNotificationsNone,
  activity: MdTimeline,
  "chart-area": MdAreaChart,
  "credit-card": MdCreditCard,
  download: MdDownload,
  filter: MdFilterList,
  gauge: MdSpeed,
  dashboard: MdDashboard,
  refresh: MdRefresh,
  settings: MdSettings,
  "shield-check": MdVerifiedUser,
  "shopping-bag": MdShoppingBag,
  "badge-check": MdVerified,
  "heart-pulse": MdMonitorHeart,
  "map-pin": MdPlace,
  phone: MdPhone,
  sparkles: MdAutoAwesome,
  stethoscope: MdMedicalServices,
  wallet: MdAccountBalanceWallet,
  heart: MdFavoriteBorder,
  menu: MdMenu,
  minus: MdRemove,
  plus: MdAdd,
  trash: MdDeleteOutline,
  close: MdClose,
  "alert-circle": MdErrorOutline,
  "alert-triangle": MdWarningAmber,
  info: MdInfoOutline,
  boxes: MdInventory2,
  truck: MdLocalShipping,
};

export const ICON_SETS: Record<IconLibraryId, Record<IconName, Glyph>> = {
  google: GOOGLE_ICONS,
  lucide: LUCIDE_ICONS,
  tabler: TABLER_ICONS,
};

/** Three contrasting glyphs used to preview a library or an icon style. */
export const ICON_PREVIEW_NAMES: IconName[] = [
  "search",
  "heart",
  "calendar",
];

const IconSetContext = createContext<IconLibraryId>("lucide");

/** Scopes the icon library to the canvas (the studio frame stays Lucide). */
export function IconSetProvider({
  library,
  children,
}: {
  library: IconLibraryId;
  children: ReactNode;
}) {
  return (
    <IconSetContext.Provider value={library}>{children}</IconSetContext.Provider>
  );
}

/** Active library, or the default when rendered outside the preview. */
export function useIconLibrary(): IconLibraryId {
  return useContext(IconSetContext);
}

export type IconProps = GlyphProps & {
  name: IconName;
  /** Override the ambient library; used by the sidebar's library previews. */
  library?: IconLibraryId;
};

/**
 * One themed icon. Size comes from the call site (`size-4` and friends), the
 * library from `IconSetProvider`, and the scale / stroke / colour from the
 * `--cc-icon-*` tokens, so style edits repaint every glyph at once.
 */
export function Icon({
  name,
  library,
  strokeWidth,
  className,
  style,
  ...props
}: IconProps) {
  const ambient = useIconLibrary();
  const theme = useCreateComponentTheme();
  const activeLibrary = library ?? ambient;
  const Glyph = ICON_SETS[activeLibrary][name];
  // Material glyphs are filled shapes: a non-zero stroke width would outline
  // and fatten them. Line sets (Lucide, Tabler) read it as the stroke weight.
  const lineWeight =
    activeLibrary === "google" ? undefined : (strokeWidth ?? theme.iconStroke);

  return (
    <Glyph
      aria-hidden='true'
      data-cc-icon={name}
      size='1em'
      strokeWidth={lineWeight}
      className={className}
      style={{
        color: theme.iconColor,
        transform:
          theme.iconScale === 1 ? undefined : `scale(${theme.iconScale})`,
        transformOrigin: "center",
        ...style,
      }}
      {...props}
    />
  );
}
