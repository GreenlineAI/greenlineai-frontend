// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lead-engager-production.up.railway.app';

export const API_ENDPOINTS = {
  // Leads
  leads: `${API_BASE_URL}/api/leads`,
  lead: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
  leadsImport: `${API_BASE_URL}/api/leads/import`,
  leadsBulk: `${API_BASE_URL}/api/leads/bulk`,

  // Campaigns
  campaigns: `${API_BASE_URL}/api/campaigns`,
  campaign: (id: string) => `${API_BASE_URL}/api/campaigns/${id}`,
  campaignStart: (id: string) => `${API_BASE_URL}/api/campaigns/${id}/start`,
  campaignPause: (id: string) => `${API_BASE_URL}/api/campaigns/${id}/pause`,
  campaignLeads: (id: string) => `${API_BASE_URL}/api/campaigns/${id}/leads`,

  // Calls
  calls: `${API_BASE_URL}/api/calls`,
  call: (id: string) => `${API_BASE_URL}/api/calls/${id}`,
  callInitiate: `${API_BASE_URL}/api/calls/initiate`,

  // Analytics
  analytics: `${API_BASE_URL}/api/analytics`,
  analyticsDaily: `${API_BASE_URL}/api/analytics/daily`,
  analyticsExport: `${API_BASE_URL}/api/analytics/export`,

  // Vapi Webhook
  vapiWebhook: `${API_BASE_URL}/api/vapi/webhook`,
} as const;
