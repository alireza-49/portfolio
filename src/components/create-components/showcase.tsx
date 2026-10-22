"use client";

import { useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CheckboxField,
  CreateComponentsThemeProvider,
  Field,
  Input,
  Progress,
  RadioGroup,
  RadioGroupField,
  Select,
  Separator,
  Skeleton,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  type CreateComponentTheme,
} from "./index";

const CURRENCIES = [
  { value: "usd", label: "USD — US Dollar" },
  { value: "eur", label: "EUR — Euro" },
  { value: "irr", label: "IRR — Iranian Rial" },
  { value: "jpy", label: "JPY — Japanese Yen", disabled: true },
];

const INVOICES = [
  { id: "INV-1042", client: "Northwind Labs", amount: "$3,850", status: "Paid" },
  {
    id: "INV-1043",
    client: "Kestrel Studio",
    amount: "$1,200",
    status: "Pending",
  },
  { id: "INV-1044", client: "Orbit Foods", amount: "$7,410", status: "Overdue" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[length:calc(var(--cc-font-size)*0.8)] font-semibold uppercase tracking-wider text-[color:var(--cc-muted-foreground)]">
          {title}
        </h3>
        {description ? (
          <p className="text-[length:calc(var(--cc-font-size)*0.85)] text-[color:var(--cc-muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export type CreateComponentsShowcaseProps = {
  theme?: Partial<CreateComponentTheme>;
  className?: string;
};

/**
 * A ready-made composition of every primitive in this folder.
 * Drop it into the studio canvas and drive it with a single theme object.
 */
export function CreateComponentsShowcase({
  theme,
  className,
}: CreateComponentsShowcaseProps) {
  const [notify, setNotify] = useState(true);
  const [accepted, setAccepted] = useState(true);
  const [plan, setPlan] = useState("pro");
  const [currency, setCurrency] = useState("usd");
  const [volume, setVolume] = useState(64);
  const [tab, setTab] = useState("overview");

  return (
    <CreateComponentsThemeProvider
      theme={theme}
      className={cn("w-full p-6", className)}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Section
          title="Buttons"
          description="Seven variants, four sizes, one radius token."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Sparkle">
              <Sparkles className="size-4" />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Separator label="Form controls" />

        <Section title="Inputs">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" htmlFor="cc-name">
              <Input id="cc-name" placeholder="Ada Lovelace" />
            </Field>
            <Field label="Email" htmlFor="cc-email" hint="We never share it.">
              <Input id="cc-email" type="email" placeholder="ada@example.com" />
            </Field>
            <Field label="Currency" className="sm:col-span-1">
              <Select
                options={CURRENCIES}
                value={currency}
                onValueChange={setCurrency}
              />
            </Field>
            <Field label="Notes" htmlFor="cc-notes" className="sm:col-span-1">
              <Textarea id="cc-notes" placeholder="Anything we should know?" />
            </Field>
          </div>
        </Section>

        <Section title="Toggles">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[length:var(--cc-font-size)]">
                Email notifications
              </span>
              <Switch checked={notify} onCheckedChange={setNotify} />
            </div>
            <CheckboxField
              label="I accept the terms of service"
              description="You can revoke this at any time."
              checked={accepted}
              onCheckedChange={setAccepted}
            />
            <RadioGroup value={plan} onValueChange={setPlan}>
              <RadioGroupField
                value="starter"
                label="Starter"
                description="For side projects."
              />
              <RadioGroupField
                value="pro"
                label="Pro"
                description="For growing teams."
              />
              <RadioGroupField
                value="enterprise"
                label="Enterprise"
                description="Custom contracts."
              />
            </RadioGroup>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.85)]">
                <span>Volume</span>
                <span className="font-mono text-[color:var(--cc-muted-foreground)]">
                  {volume}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
            </div>
          </div>
        </Section>

        <Separator label="Surfaces" />

        <Section title="Cards & badges">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Team plan</CardTitle>
                  <Badge variant="solid">New</Badge>
                </div>
                <CardDescription>
                  Everything you need to ship a design system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Avatar alt="Ada Lovelace" size="sm" />
                  <span className="text-[length:calc(var(--cc-font-size)*0.85)] text-[color:var(--cc-muted-foreground)]">
                    Owned by Ada Lovelace
                  </span>
                </div>
                <Progress value={72} showValue />
              </CardContent>
              <CardFooter>
                <Button size="sm">Upgrade</Button>
                <Button size="sm" variant="ghost">
                  Compare
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Every semantic tone.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="solid">Solid</Badge>
                  <Badge variant="soft">Soft</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="accent">Accent</Badge>
                </div>
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Alerts">
          <div className="flex flex-col gap-2">
            <Alert
              variant="info"
              icon={<Info className="size-4" />}
              title="Heads up"
            >
              Your trial ends in 3 days.
            </Alert>
            <Alert
              variant="success"
              icon={<CheckCircle2 className="size-4" />}
              title="Payment received"
            >
              Invoice INV-1042 was settled.
            </Alert>
            <Alert
              variant="warning"
              icon={<TriangleAlert className="size-4" />}
              title="Usage at 80%"
            >
              Consider upgrading before you hit the cap.
            </Alert>
            <Alert
              variant="danger"
              icon={<AlertCircle className="size-4" />}
              title="Card declined"
            >
              Update your billing details to continue.
            </Alert>
          </div>
        </Section>

        <Section title="Tabs & table">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-[color:var(--cc-muted-foreground)]">
                A short summary of the account, rendered inside a tab panel.
              </p>
            </TabsContent>
            <TabsContent value="invoices">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVOICES.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "Paid"
                              ? "success"
                              : invoice.status === "Pending"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-[color:var(--cc-muted-foreground)]">
                Settings live here.
              </p>
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Accordion">
          <Accordion type="single" defaultValue={["shipping"]}>
            <AccordionItem value="shipping">
              <AccordionTrigger>How fast is shipping?</AccordionTrigger>
              <AccordionContent>
                Orders leave the workshop within one business day.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>What is the return policy?</AccordionTrigger>
              <AccordionContent>
                Thirty days, no questions asked, on unopened items.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>How do I reach support?</AccordionTrigger>
              <AccordionContent>
                Reply to any receipt email and a human will answer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]">
            Every value above comes from the theme object.
          </span>
          <Button variant="outline" size="sm">
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </CreateComponentsThemeProvider>
  );
}
