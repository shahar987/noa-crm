import { NextRequest, NextResponse } from 'next/server';
import { getClients, upsertClient, deleteClient } from '@/lib/sheets';

export async function GET() {
  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/clients]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await req.json();
    await upsertClient(client);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/clients]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[DELETE /api/clients]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
