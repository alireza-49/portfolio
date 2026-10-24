"use client";

import type { RangeId } from "../data/dashboard";
import { SETTINGS_PAGE } from "./pages";
import { DashboardPage } from "./section-heading";
import { SettingsPanel } from "./settings-panel";

export function SettingsPage({
  live,
  onLiveChange,
  range,
  onRangeChange,
}: {
  live: boolean;
  onLiveChange: (value: boolean) => void;
  range: RangeId;
  onRangeChange: (value: RangeId) => void;
}) {
  return (
    <DashboardPage page={SETTINGS_PAGE}>
      <SettingsPanel
        live={live}
        onLiveChange={onLiveChange}
        range={range}
        onRangeChange={onRangeChange}
      />
    </DashboardPage>
  );
}
