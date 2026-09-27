import type { Tag } from '@/types/tag';

type TagTableProps = {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: number) => void;
  isLoading?: boolean;
};

export default function TagTable({
  tags,
  onEdit,
  onDelete,
  isLoading = false,
}: TagTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-amber-500" />
          Loading tags...
        </div>
      </div>
    );
  }

  if (!tags.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        No tags found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Tag Name</th>
            <th className="border-b border-slate-200 px-4 py-3 font-semibold">Color</th>
            <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.tagId} className="align-middle hover:bg-slate-50">
              <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-900">
                {tag.tagName}
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 rounded-full border border-slate-200"
                    style={{ backgroundColor: tag.color || '#3b82f6' }}
                  />
                  <span className="text-slate-600">{tag.color || '#3b82f6'}</span>
                </div>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(tag)}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tag.tagId)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
