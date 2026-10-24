import type { Project, ProjectInput } from "@/lib/types";

/** Project row → editable draft (arrays cloned so edits never mutate props). */
export function projectToDraft(project: Project): ProjectInput {
  return {
    code: project.code,
    title: project.title,
    clientName: project.clientName,
    clientOrg: project.clientOrg,
    clientMobile: project.clientMobile,
    clientEmail: project.clientEmail,
    summary: project.summary,
    status: project.status,
    progress: project.progress,
    currentPhase: project.currentPhase,
    startDate: project.startDate,
    dueDate: project.dueDate,
    amount: project.amount,
    paid: project.paid,
    showFinancials: project.showFinancials,
    stagingUrl: project.stagingUrl,
    repoUrl: project.repoUrl,
    published: project.published,
    steps: project.steps.map((step) => ({ ...step })),
    updates: project.updates.map((update) => ({ ...update })),
  };
}

export const EMPTY_PROJECT: ProjectInput = {
  code: "",
  title: "",
  clientName: "",
  clientOrg: "",
  clientMobile: "",
  clientEmail: "",
  summary: "",
  status: "planning",
  progress: 0,
  currentPhase: "",
  startDate: null,
  dueDate: null,
  amount: 0,
  paid: 0,
  showFinancials: false,
  stagingUrl: "",
  repoUrl: "",
  published: false,
  steps: [],
  updates: [],
};
