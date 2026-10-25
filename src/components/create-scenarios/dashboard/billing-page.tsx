"use client";

import { Badge, Icon } from "@/components/create-components";
import { PLAN_MIX } from "../data/dashboard";
import { formatNumber } from "../format";
import { OrdersPanel } from "./orders-panel";
import { BILLING_PAGE } from "./pages";
import { DashboardPage } from "./section-heading";

export function BillingPage() {
  return (
    <DashboardPage
      page={BILLING_PAGE}
      trailing={
        <Badge variant='outline' className='gap-1'>
          <Icon name='credit-card' className='size-3' />
          {formatNumber(PLAN_MIX.length)} پلن
        </Badge>
      }
    >
      <OrdersPanel />
    </DashboardPage>
  );
}
