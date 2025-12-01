'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';

interface ImportLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ParsedLead {
  businessName: string;
  contactName?: string;
  email?: string;
  phone: string;
  address?: string;
  city: string;
  state: string;
  zip?: string;
  industry: string;
  googleRating?: number;
  reviewCount?: number;
  website?: string;
  status: 'new' | 'contacted' | 'interested' | 'meeting_scheduled' | 'not_interested' | 'no_answer' | 'invalid';
  score: 'hot' | 'warm' | 'cold';
  notes?: string;
}

export function ImportLeadsDialog({ open, onOpenChange, onSuccess }: ImportLeadsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ imported: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const parseCSV = (text: string): ParsedLead[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid');
    }

    // Parse CSV properly handling quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const leads: ParsedLead[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const lead: any = {
        status: 'new',
        score: 'warm',
        industry: 'Landscaping', // Default industry
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        // Map CSV headers to lead fields
        switch (header) {
          case 'businessname':
          case 'business':
          case 'name':
            lead.businessName = value;
            break;
          case 'contactname':
          case 'ownername':
            lead.contactName = value || null;
            break;
          case 'email':
          case 'contactemail':
          case 'owneremail':
            lead.email = value || null;
            break;
          case 'phone':
          case 'phonenumber':
            lead.phone = value;
            break;
          case 'address':
            lead.address = value || null;
            break;
          case 'city':
            lead.city = value;
            break;
          case 'state':
            lead.state = value;
            break;
          case 'zip':
          case 'zipcode':
            lead.zip = value || null;
            break;
          case 'industry':
            if (value) lead.industry = value;
            break;
          case 'rating':
          case 'googlerating':
            lead.googleRating = value ? parseFloat(value) : null;
            break;
          case 'reviewcount':
          case 'reviews':
            lead.reviewCount = value ? parseInt(value) : null;
            break;
          case 'website':
            lead.website = value || null;
            break;
          case 'status':
          case 'callstatus':
            if (value && ['new', 'contacted', 'interested', 'meeting_scheduled', 'not_interested', 'no_answer', 'invalid'].includes(value.toLowerCase())) {
              lead.status = value.toLowerCase();
            }
            break;
          case 'score':
          case 'qualityscore':
          case 'leadquality':
            const scoreMap: any = { 
              'high': 'hot', 
              'urgent': 'hot',
              'hot': 'hot',
              'medium': 'warm',
              'warm': 'warm',
              'low': 'cold',
              'cold': 'cold'
            };
            if (value && scoreMap[value.toLowerCase()]) {
              lead.score = scoreMap[value.toLowerCase()];
            }
            break;
          case 'notes':
            lead.notes = value || null;
            break;
        }
      });

      // Validate required fields
      if (lead.businessName && lead.phone && lead.city && lead.state) {
        leads.push({
          ...lead,
          status: lead.status || 'new',
          score: lead.score || 'warm',
        } as ParsedLead);
      }
    }

    return leads;
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const parsedLeads = parseCSV(text);

      if (parsedLeads.length === 0) {
        throw new Error('No valid leads found in CSV file');
      }

      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Insert leads in batches
      const batchSize = 100;
      let imported = 0;
      let failed = 0;

      for (let i = 0; i < parsedLeads.length; i += batchSize) {
        const batch = parsedLeads.slice(i, i + batchSize).map(lead => ({
          user_id: user.id,
          business_name: lead.businessName,
          contact_name: lead.contactName,
          email: lead.email,
          phone: lead.phone,
          address: lead.address,
          city: lead.city,
          state: lead.state,
          zip: lead.zip,
          industry: lead.industry,
          google_rating: lead.googleRating,
          review_count: lead.reviewCount,
          website: lead.website,
          status: lead.status,
          score: lead.score,
          notes: lead.notes,
        }));

        const { error: insertError } = await supabase
          .from('leads')
          .insert(batch as any);

        if (insertError) {
          console.error('Error importing batch:', insertError);
          failed += batch.length;
        } else {
          imported += batch.length;
        }
      }

      setSuccess({ imported, failed });
      
      if (imported > 0) {
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Import error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null) {
        setError(JSON.stringify(err));
      } else {
        setError('Failed to import leads. Please check the file format.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setError(null);
      setSuccess(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your leads. Required columns: business_name, phone, city, state, industry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File input */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">{file.name}</span>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium mb-1">Click to upload CSV</p>
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </>
            )}
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {success && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Successfully imported {success.imported} leads
                {success.failed > 0 && `, ${success.failed} failed`}
              </AlertDescription>
            </Alert>
          )}

          {/* CSV format help */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">CSV Format Example:</p>
            <code className="block bg-muted p-2 rounded text-xs">
              business_name,phone,city,state,industry,email,website
            </code>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isUploading}
          >
            {isUploading ? 'Importing...' : 'Import Leads'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
