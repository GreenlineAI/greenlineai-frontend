"use server";

import { createClient } from "./server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Database } from "./types";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const company = formData.get("company") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        company,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// Lead actions
export async function getLeads() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  return data;
}

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const leadData: LeadInsert = {
    user_id: user.id,
    business_name: formData.get("business_name") as string,
    contact_name: formData.get("contact_name") as string || null,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    industry: formData.get("industry") as string,
    google_rating: formData.get("google_rating") ? parseFloat(formData.get("google_rating") as string) : null,
    status: "new",
    score: "warm",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("leads") as any).insert(leadData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function updateLead(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("leads") as any)
    .update(updates)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function deleteLead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/leads");
  return { success: true };
}

// Campaign actions
export async function getCampaigns() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }

  return data;
}

// Dashboard stats
export async function getDashboardStats() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  // Get lead counts
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { count: contactedLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .neq("status", "new");

  const { count: meetingsBooked } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "meeting_scheduled");

  // Get leads from this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: leadsThisMonth } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  return {
    totalLeads: totalLeads || 0,
    leadsThisMonth: leadsThisMonth || 0,
    totalContacted: contactedLeads || 0,
    responseRate: totalLeads ? Math.round(((contactedLeads || 0) / totalLeads) * 100 * 10) / 10 : 0,
    meetingsBooked: meetingsBooked || 0,
    conversionRate: contactedLeads ? Math.round(((meetingsBooked || 0) / contactedLeads) * 100 * 10) / 10 : 0,
  };
}
