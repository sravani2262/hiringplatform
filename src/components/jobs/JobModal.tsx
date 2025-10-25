import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Job, JobStatus } from '@/lib/db';

interface JobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job;
}

export function JobModal({ open, onOpenChange, job }: JobModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    location: string;
    type: string;
    status: JobStatus;
    tags: string;
  }>({
    title: job?.title || '',
    slug: job?.slug || '',
    description: job?.description || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    status: job?.status || 'active',
    tags: job?.tags?.join(', ') || '',
  });

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        order: job?.order || 0,
      };

      const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
      const method = job ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save job');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success(job ? 'Job updated successfully' : 'Job created successfully');
      onOpenChange(false);
      setFormData({
        title: '',
        slug: '',
        description: '',
        location: '',
        type: 'Full-time',
        status: 'active',
        tags: '',
      });
    },
    onError: () => {
      toast.error('Failed to save job. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogDescription>
            {job ? 'Update the job details below.' : 'Fill in the details to create a new job posting.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. senior-frontend-engineer"
              />
              <p className="text-xs text-muted-foreground">Leave empty to auto-generate from title</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Remote, Senior, Engineering"
              />
              <p className="text-xs text-muted-foreground">Comma-separated values</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role, requirements, and what you're looking for..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
