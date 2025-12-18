/**
 * Cal.com API Integration Utilities
 *
 * Provides encryption for API keys and helper functions for Cal.com API calls.
 */

import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Get the encryption key from environment variables.
 * Must be a 32-byte (256-bit) key in hex format.
 */
function getEncryptionKey(): Buffer {
  const key = process.env.CAL_COM_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('CAL_COM_ENCRYPTION_KEY environment variable is not set');
  }
  // If key is hex string (64 chars = 32 bytes), convert to buffer
  if (key.length === 64) {
    return Buffer.from(key, 'hex');
  }
  // If key is raw string, hash it to get 32 bytes
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt a Cal.com API key for secure storage.
 */
export function encryptApiKey(apiKey: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Return IV + encrypted data, separated by colon
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt a stored Cal.com API key.
 */
export function decryptApiKey(encryptedKey: string): string {
  const key = getEncryptionKey();
  const parts = encryptedKey.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted key format');
  }
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Cal.com API base URL
const CAL_COM_API_BASE = 'https://api.cal.com/v1';

/**
 * Cal.com API error response
 */
export interface CalComError {
  message: string;
  statusCode: number;
}

/**
 * Cal.com event type
 */
export interface CalComEventType {
  id: number;
  title: string;
  slug: string;
  length: number;
  description: string | null;
}

/**
 * Cal.com user profile
 */
export interface CalComUser {
  id: number;
  email: string;
  name: string;
  username: string;
  timeZone: string;
}

/**
 * Cal.com availability slot
 */
export interface CalComSlot {
  time: string; // ISO datetime
}

/**
 * Cal.com booking
 */
export interface CalComBooking {
  id: number;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

/**
 * Make a request to the Cal.com API.
 */
export async function calComRequest<T>(
  apiKey: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${CAL_COM_API_BASE}${endpoint}`;
  const separator = endpoint.includes('?') ? '&' : '?';

  const response = await fetch(`${url}${separator}apiKey=${apiKey}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Cal.com API error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Validate a Cal.com API key by fetching the user profile.
 */
export async function validateCalComApiKey(apiKey: string): Promise<{
  valid: boolean;
  user?: CalComUser;
  error?: string;
}> {
  try {
    const response = await calComRequest<{ user: CalComUser }>(apiKey, '/me');
    return {
      valid: true,
      user: response.user,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid API key',
    };
  }
}

/**
 * Get event types for a Cal.com user.
 */
export async function getCalComEventTypes(apiKey: string): Promise<CalComEventType[]> {
  const response = await calComRequest<{ event_types: CalComEventType[] }>(
    apiKey,
    '/event-types'
  );
  return response.event_types || [];
}

/**
 * Get available slots for a specific event type.
 */
export async function getCalComAvailability(
  apiKey: string,
  eventTypeId: string | number,
  startTime: string,
  endTime: string,
  timeZone: string = 'America/New_York'
): Promise<CalComSlot[]> {
  const params = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    startTime,
    endTime,
    timeZone,
  });

  const response = await calComRequest<{ slots: Record<string, CalComSlot[]> }>(
    apiKey,
    `/slots?${params.toString()}`
  );

  // Flatten slots from all dates into a single array
  const allSlots: CalComSlot[] = [];
  if (response.slots) {
    for (const dateSlots of Object.values(response.slots)) {
      allSlots.push(...dateSlots);
    }
  }
  return allSlots;
}

/**
 * Create a booking in Cal.com.
 */
export async function createCalComBooking(
  apiKey: string,
  eventTypeId: string | number,
  options: {
    start: string; // ISO datetime
    name: string;
    email: string;
    phone?: string;
    notes?: string;
    timeZone?: string;
    language?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<CalComBooking> {
  const response = await calComRequest<CalComBooking>(apiKey, '/bookings', {
    method: 'POST',
    body: JSON.stringify({
      eventTypeId: Number(eventTypeId),
      start: options.start,
      responses: {
        name: options.name,
        email: options.email,
        phone: options.phone,
        notes: options.notes,
      },
      timeZone: options.timeZone || 'America/New_York',
      language: options.language || 'en',
      metadata: options.metadata || {},
    }),
  });

  return response;
}

/**
 * Format a slot time for display to callers.
 * Example: "2024-01-15T09:00:00" -> "Monday, January 15th at 9:00 AM"
 */
export function formatSlotForDisplay(isoTime: string, timeZone: string = 'America/New_York'): string {
  const date = new Date(isoTime);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });
}

/**
 * Get human-readable date range description.
 * Maps common phrases to actual date ranges.
 */
export function getDateRange(preference: string): { startTime: string; endTime: string } {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startTime: Date;
  let endTime: Date;

  switch (preference.toLowerCase()) {
    case 'today':
      startTime = now;
      endTime = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      break;
    case 'tomorrow':
      startTime = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      endTime = new Date(startOfDay.getTime() + 48 * 60 * 60 * 1000);
      break;
    case 'this_week':
    case 'this week':
      startTime = now;
      // End of week (Sunday)
      const daysUntilSunday = 7 - now.getDay();
      endTime = new Date(startOfDay.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
      break;
    case 'next_week':
    case 'next week':
      // Start of next week (Monday)
      const daysUntilNextMonday = (8 - now.getDay()) % 7 || 7;
      startTime = new Date(startOfDay.getTime() + daysUntilNextMonday * 24 * 60 * 60 * 1000);
      endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'next_7_days':
    case 'next 7 days':
    default:
      startTime = now;
      endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
  }

  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
}
