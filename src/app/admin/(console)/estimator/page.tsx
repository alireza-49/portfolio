import type { Metadata } from "next";
import { connection } from "next/server";
import { requireConsolePage } from "@/lib/auth";
import { getEstimatorConfig } from "@/lib/content";
import { EstimatorEditor } from "@/components/admin/estimator/estimator-editor";

export const metadata: Metadata = { title: "برآورد قیمت" };
export const instant = false;

export default async function EstimatorPage() {
  await connection();
  await requireConsolePage();
  const config = await getEstimatorConfig();

  return <EstimatorEditor config={config} />;
}
