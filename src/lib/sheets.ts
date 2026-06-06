import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';
import type { Client, Product } from '@/types';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;

async function sheets() {
  const auth = await getGoogleAuth().getClient();
  return google.sheets({ version: 'v4', auth: auth as never });
}

// ── Clients ──────────────────────────────────────────────────────────────────

export async function getClients(): Promise<Client[]> {
  const api = await sheets();
  const res = await api.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'clients!A2:H',
  });
  return (res.data.values ?? []).map(rowToClient);
}

export async function upsertClient(client: Client): Promise<void> {
  const api = await sheets();
  const existing = await getClients();
  const idx = existing.findIndex(c => c.id === client.id);
  const row = clientToRow(client);

  if (idx >= 0) {
    await api.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `clients!A${idx + 2}:H${idx + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
  } else {
    await api.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'clients!A:H',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
  }
}

export async function deleteClient(id: string): Promise<void> {
  const api = await sheets();
  const existing = await getClients();
  const idx = existing.findIndex(c => c.id === id);
  if (idx < 0) return;
  await deleteRow(api, 'clients', idx + 1);
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const api = await sheets();
  const res = await api.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'products!A2:B',
  });
  return (res.data.values ?? []).map(r => ({ id: r[0] ?? '', name: r[1] ?? '' }));
}

export async function upsertProduct(product: Product): Promise<void> {
  const api = await sheets();
  const existing = await getProducts();
  const idx = existing.findIndex(p => p.id === product.id);
  const row = [product.id, product.name];

  if (idx >= 0) {
    await api.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `products!A${idx + 2}:B${idx + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
  } else {
    await api.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'products!A:B',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const api = await sheets();
  const existing = await getProducts();
  const idx = existing.findIndex(p => p.id === id);
  if (idx < 0) return;
  await deleteRow(api, 'products', idx + 1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type SheetsAPI = Awaited<ReturnType<typeof sheets>>;

async function deleteRow(api: SheetsAPI, sheetName: string, rowIndex: number) {
  const meta = await api.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheet = meta.data.sheets?.find(s => s.properties?.title === sheetName);
  const sheetId = sheet?.properties?.sheetId;
  await api.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex,     // 0-based; header is row 0, data starts at 1
            endIndex: rowIndex + 1,
          },
        },
      }],
    },
  });
}

function rowToClient(r: string[]): Client {
  return {
    id:       r[0] ?? '',
    name:     r[1] ?? '',
    phone:    r[2] ?? '',
    since:    r[3] ?? '',
    creams:   safeJson(r[4], []),
    notes:    r[5] ?? '',
    nextAppt: r[6] || undefined,
    photos:   safeJson(r[7], []),
  };
}

function clientToRow(c: Client): string[] {
  return [
    c.id,
    c.name,
    c.phone,
    c.since,
    JSON.stringify(c.creams),
    c.notes,
    c.nextAppt ?? '',
    JSON.stringify(c.photos),
  ];
}

function safeJson<T>(raw: string | undefined, fallback: T): T {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
