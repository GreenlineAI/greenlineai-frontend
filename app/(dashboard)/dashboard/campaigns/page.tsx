'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Play, Pause, MoreVertical, Trash2, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { CampaignStatusBadge } from '@/components/shared/StatusBadge';
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from '@/hooks/use-campaigns';
import type { Campaign, CampaignType } from '@/lib/types';
import { toast } from 'sonner';

export default function CampaignsPage() {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({ name: '', type: 'phone' as CampaignType });

  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const handleCreate = async () => {
    if (!newCampaign.name.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    try {
      await createCampaign.mutateAsync(newCampaign);
      toast.success('Campaign created');
      setShowCreateDialog(false);
      setNewCampaign({ name: '', type: 'phone' });
    } catch {
      toast.error('Failed to create campaign');
    }
  };

  const handleStatusChange = async (campaign: Campaign, status: 'active' | 'paused') => {
    try {
      await updateCampaign.mutateAsync({ id: campaign.id, updates: { status } });
      toast.success(`Campaign ${status === 'active' ? 'started' : 'paused'}`);
    } catch {
      toast.error('Failed to update campaign');
    }
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    try {
      await deleteCampaign.mutateAsync(selectedCampaign.id);
      toast.success('Campaign deleted');
      setShowDeleteDialog(false);
      setSelectedCampaign(null);
    } catch {
      toast.error('Failed to delete campaign');
    }
  };

  const handleStartDialing = (campaign: Campaign) => {
    router.push(`/dashboard/dialer?campaignId=${campaign.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Campaigns"
          description="Manage your outreach campaigns"
          actions={
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          }
        />
      </div>

      <main className="p-6">
        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="grid gap-6">
            {campaigns.map((campaign) => {
              const progress = campaign.leadsCount > 0
                ? (campaign.contactedCount / campaign.leadsCount) * 100
                : 0;
              const conversionRate = campaign.contactedCount > 0
                ? ((campaign.meetingsBooked / campaign.contactedCount) * 100).toFixed(1)
                : '0';

              return (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {campaign.type.replace('_', ' ')} campaign
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CampaignStatusBadge status={campaign.status} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStartDialing(campaign)}>
                              <PhoneCall className="mr-2 h-4 w-4" />
                              Start Dialing
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/campaigns/${campaign.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {campaign.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'paused')}>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Campaign
                              </DropdownMenuItem>
                            ) : campaign.status !== 'completed' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'active')}>
                                <Play className="mr-2 h-4 w-4" />
                                Start Campaign
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bold">{campaign.leadsCount}</p>
                        <p className="text-sm text-muted-foreground">Total Leads</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.contactedCount}</p>
                        <p className="text-sm text-muted-foreground">Contacted</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.respondedCount}</p>
                        <p className="text-sm text-muted-foreground">Responded</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{campaign.meetingsBooked}</p>
                        <p className="text-sm text-muted-foreground">Meetings</p>
                      </div>
                    </div>

                    <Progress value={progress} className="h-2 mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{Math.round(progress)}% complete</span>
                        <span>{conversionRate}% conversion rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/campaigns/${campaign.id}`}>
                            View Details
                          </Link>
                        </Button>
                        {campaign.status === 'active' && (
                          <Button size="sm" onClick={() => handleStartDialing(campaign)}>
                            <PhoneCall className="mr-2 h-4 w-4" />
                            Start Dialing
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first campaign to start reaching out to leads.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Create a new outreach campaign. You can add leads after creating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                placeholder="e.g., Q4 Landscaping Outreach"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select
                value={newCampaign.type}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value as CampaignType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="multi_channel">Multi-Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createCampaign.isPending}>
              {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCampaign?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCampaign.isPending}>
              {deleteCampaign.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
