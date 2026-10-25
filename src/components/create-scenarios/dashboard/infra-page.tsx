"use client";

import { Badge, Icon } from "@/components/create-components";
import { InfraPanel } from "./infra-panel";
import { INFRA_PAGE } from "./pages";
import { DashboardPage } from "./section-heading";

export function InfraPage() {
  return (
    <DashboardPage
      page={INFRA_PAGE}
      trailing={
        <Badge variant='success' className='gap-1'>
          <Icon name='shield-check' className='size-3' />
          پایش فعال
        </Badge>
      }
    >
      <InfraPanel />
    </DashboardPage>
  );
}
