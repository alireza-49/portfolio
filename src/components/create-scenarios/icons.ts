import {
  LayoutDashboard,
  LayoutGrid,
  PanelsTopLeft,
} from "lucide-react";
import type { IconLibraryId } from "@/components/create-studio-config";

/**
 * The studio's "icon library" choice, mapped onto concrete glyphs.
 * Kept outside the canvas so scenario views can render the same mark.
 */
export const LIBRARY_ICONS: Record<IconLibraryId, typeof LayoutDashboard> = {
  google: LayoutDashboard,
  lucide: LayoutGrid,
  tabler: PanelsTopLeft,
};
