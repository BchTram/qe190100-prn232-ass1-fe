'use client';

import { useEffect, useMemo, useState } from 'react';
import TagForm, { type TagFormValues } from '@/components/TagForm';
import TagTable from '@/components/TagTable';
import { tagApi } from '@/services/tagApi';
import type { Tag, TagCreateRequest, TagUpdateRequest } from '@/types/tag';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingTag = useMemo(
    () => tags.find((tag) => tag.tagId === editingId) ?? null,
    [tags, editingId],
  );

  const loadTags = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tagApi.getAll();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags.');
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTags();
  }, []);

  const handleCreate = async (values: TagCreateRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const created = await tagApi.create(values);
      setTags((prev) => [created, ...prev]);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create tag.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: TagUpdateRequest) => {
    if (editingId === null) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await tagApi.update(editingId, values);
      setTags((prev) =>
        prev.map((tag) =>
          tag.tagId === editingId ? updated : tag,
        ),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update tag.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: TagFormValues) => {
    const payload: TagCreateRequest = {
      tagName: values.tagName,
      color: values.color || undefined,
    };

    if (editingId !== null) {
      await handleUpdate(payload);
      return;
    }

    await handleCreate(payload);
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.tagId);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleDelete = async (tagId: number) => {
    const tag = tags.find((item) => item.tagId === tagId);
    if (!tag) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${tag.tagName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await tagApi.remove(tagId);
      setTags((prev) => prev.filter((item) => item.tagId !== tagId));
      if (editingId === tagId) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete tag.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Labels</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Tags</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <TagForm
              mode={editingId !== null ? 'edit' : 'create'}
              initialValues={
                editingTag
                  ? {
                      tagName: editingTag.tagName,
                      color: editingTag.color ?? '#3b82f6',
                    }
                  : undefined
              }
              isLoading={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <TagTable
              tags={tags}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
