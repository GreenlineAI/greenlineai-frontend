'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, Trash2, FolderPlus, Edit, Download, X } from 'lucide-react';
import type { LeadStatus, Campaign } from '@/lib/types';
import { useCampaigns, useAddLeadsToCampaign } from '@/hooks/use-campaigns';
import { useBulkUpdateLeads, useDeleteLeads } from '@/hooks/use-leads';
import { toast } from 'sonner';

interface BulkActionsProps {
  selectedCount: number;
  selectedIds: Set<string>;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedCount,
  selectedIds,
  onClearSelection,
}: BulkActionsProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>('new');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  const { data: campaigns = [] } = useCampaigns();
  const addLeadsToCampaign = useAddLeadsToCampaign();
  const bulkUpdateLeads = useBulkUpdateLeads();
  const deleteLeads = useDeleteLeads();

  const handleStatusChange = async () => {
    try {
      await bulkUpdateLeads.mutateAsync({
        ids: Array.from(selectedIds),
        updates: { status: selectedStatus },
      });
      toast.success(`Updated ${selectedCount} leads`);
      onClearSelection();
      setShowStatusDialog(false);
    } catch {
      toast.error('Failed to update leads');
    }
  };

  const handleAddToCampaign = async () => {
    try {
      await addLeadsToCampaign.mutateAsync({
        campaignId: selectedCampaignId,
        leadIds: Array.from(selectedIds),
      });
      toast.success(`Added ${selectedCount} leads to campaign`);
      onClearSelection();
      setShowCampaignDialog(false);
    } catch {
      toast.error('Failed to add leads to campaign');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLeads.mutateAsync(Array.from(selectedIds));
      toast.success(`Deleted ${selectedCount} leads`);
      onClearSelection();
      setShowDeleteDialog(false);
    } catch {
      toast.error('Failed to delete leads');
    }
  };

  const handleExport = () => {
    // For now, just show a toast - full CSV export would need API endpoint
    toast.info('Export feature coming soon');
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </Button>
        <div className="mx-2 h-4 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setShowCampaignDialog(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add to Campaign
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Change Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedCount} selected leads.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as LeadStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                <SelectItem value="not_interested">Not Interested</SelectItem>
                <SelectItem value="no_answer">No Answer</SelectItem>
                <SelectItem value="invalid">Invalid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} disabled={bulkUpdateLeads.isPending}>
              {bulkUpdateLeads.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Campaign</DialogTitle>
            <DialogDescription>
              Add {selectedCount} leads to a campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign: Campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToCampaign}
              disabled={!selectedCampaignId || addLeadsToCampaign.isPending}
            >
              {addLeadsToCampaign.isPending ? 'Adding...' : 'Add to Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Leads</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} leads? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLeads.isPending}
            >
              {deleteLeads.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
