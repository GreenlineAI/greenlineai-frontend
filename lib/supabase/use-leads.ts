"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "./client";
import { Lead } from "../types";

// Re-export Lead for convenience
export type { Lead };

// Transform Supabase row to Lead interface
function transformLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    businessName: row.business_name as string,
    contactName: row.contact_name as string | null,
    email: row.email as string | null,
    phone: row.phone as string,
    address: row.address as string | null,
    city: row.city as string,
    state: row.state as string,
    zip: row.zip as string | null,
    industry: row.industry as string,
    googleRating: row.google_rating as number | null,
    reviewCount: row.review_count as number | null,
    website: row.website as string | null,
    employeeCount: row.employee_count as string | null,
    yearEstablished: row.year_established as number | null,
    status: row.status as Lead["status"],
    score: row.score as Lead["score"],
    lastContacted: row.last_contacted as string | null,
    notes: row.notes as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching leads:", fetchError.message);
        setError(fetchError.message);
        setLeads([]);
      } else {
        setLeads(data ? data.map(transformLead) : []);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const supabase = createClient();

    // Transform camelCase to snake_case
    const dbUpdates: Record<string, unknown> = {};
    if (updates.businessName !== undefined) dbUpdates.business_name = updates.businessName;
    if (updates.contactName !== undefined) dbUpdates.contact_name = updates.contactName;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.score !== undefined) dbUpdates.score = updates.score;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.lastContacted !== undefined) dbUpdates.last_contacted = updates.lastContacted;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("leads") as any).update(dbUpdates).eq("id", id);

    if (error) {
      return { error: error.message };
    }

    // Optimistically update local state
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );

    return { success: true };
  };

  const deleteLead = async (id: string) => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("leads") as any).delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    return { success: true };
  };

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    updateLead,
    deleteLead,
  };
}
