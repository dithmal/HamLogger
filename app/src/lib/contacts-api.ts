import type { Contact, ContactDetails, LogsResponse } from '@/types/contact';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const bandRanges = [
  { max: 2, band: 'B_160M' },
  { max: 4, band: 'B_80M' },
  { max: 8, band: 'B_40M' },
  { max: 11, band: 'B_30M' },
  { max: 15, band: 'B_20M' },
  { max: 19, band: 'B_17M' },
  { max: 22, band: 'B_15M' },
  { max: 25, band: 'B_12M' },
  { max: 30, band: 'B_10M' },
  { max: 55, band: 'B_6M' },
  { max: 150, band: 'B_2M' },
  { max: 500, band: 'B_70CM' }
] as const;

export function interpretBand(frequency: number) {
  return bandRanges.find((range) => frequency <= range.max)?.band ?? null;
}

export async function fetchContacts(): Promise<Contact[]> {
  const response = await fetch(`${apiBaseUrl}/logs?limit=50`);
  if (!response.ok) throw new Error(`Unable to load contacts (${response.status})`);
  const payload = (await response.json()) as LogsResponse;
  return payload.data;
}

export async function fetchContact(id: string): Promise<ContactDetails> {
  const response = await fetch(`${apiBaseUrl}/logs/${id}`);
  if (!response.ok) throw new Error(`Unable to load contact (${response.status})`);
  return (await response.json()) as ContactDetails;
}

export async function updateContact(id: string, payload: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/logs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Unable to update contact (${response.status})`);
}

export async function createContact(formData: FormData): Promise<void> {
  const frequency = Number(formData.get('frequency'));
  const band = Number.isFinite(frequency) ? interpretBand(frequency) : null;
  if (!band) throw new Error('Enter a frequency in MHz that maps to a supported amateur band.');

  const now = new Date();
  const response = await fetch(`${apiBaseUrl}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: formData.get('callsign'),
      qsoDate: now.toISOString().slice(0, 10),
      timeOn: now.toISOString().slice(11, 19),
      band,
      freq: frequency,
      mode: formData.get('mode'),
      rstSent: formData.get('rstSent'),
      rstRcvd: formData.get('rstReceived'),
      stationCallsign: '4S7NAD',
      operator: 'Noob Ham'
    })
  });

  if (!response.ok) throw new Error(`Unable to save contact (${response.status})`);
}

export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/logs/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`Unable to delete contact (${response.status})`);
}
