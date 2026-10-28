"use client";

import { Panel, PanelHeading } from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import type { PostInput, PostIssue } from "@/lib/types";
import { PostPublishPanel } from "./post-publish-panel";
import { PostTaxonomyPanel } from "./post-taxonomy-panel";
import { PostRevisionsPanel } from "./post-revisions-panel";
import { PostAuditPanel } from "./post-audit-panel";
import type { OutlineItem } from "./rich-text-editor";

/** Right rail of the editor: publish, metadata, taxonomy and the live outline. */
export function PostSidebar({
  draft,
  patch,
  outline,
  exists,
  dirty,
  pending,
  onSave,
  onTogglePublish,
  postId,
  issues,
  onRestore,
}: {
  draft: PostInput;
  patch: (values: Partial<PostInput>) => void;
  outline: OutlineItem[];
  exists: boolean;
  dirty: boolean;
  pending: boolean;
  onSave: () => void;
  onTogglePublish: () => void;
  postId: string | null;
  issues: PostIssue[];
  onRestore: (html: string) => void;
}) {
  return (
    <div className='flex flex-col gap-3'>
      <PostPublishPanel
        draft={draft}
        patch={patch}
        exists={exists}
        dirty={dirty}
        pending={pending}
        onSave={onSave}
        onTogglePublish={onTogglePublish}
        postId={postId}
      />
      <PostTaxonomyPanel draft={draft} patch={patch} />
      <PostAuditPanel issues={issues} />
      <PostRevisionsPanel postId={postId} onRestore={onRestore} />
      <Panel>
        <PanelHeading
          eyebrow='03 / OUTLINE'
          title='فهرست سرفصل‌ها'
          description='به‌صورت خودکار از تیترهای H1 تا H4 همین متن ساخته می‌شود.'
        />
        <div className='p-3.5'>
          {outline.length === 0 ? (
            <p className='text-[0.6875rem] font-medium text-indigo-light'>
              هنوز تیتری در متن نیست.
            </p>
          ) : (
            <ol className='flex flex-col gap-1'>
              {outline.map((item, index) => (
                <li
                  key={`${item.text}-${index}`}
                  className='flex items-start gap-1.5 text-[0.6875rem] font-bold text-indigo-ink'
                  style={{ paddingInlineStart: `${(item.level - 1) * 10}px` }}
                >
                  <span className='font-mono text-[0.5625rem] text-coral'>
                    {faNumber(index + 1)}
                  </span>
                  <span className='min-w-0 truncate'>{item.text}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </Panel>
    </div>
  );
}
