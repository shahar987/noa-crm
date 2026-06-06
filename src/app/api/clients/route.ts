import { NextRequest, NextResponse } from 'next/server';
import { getClients, upsertClient, deleteClient } from '@/lib/sheets';

export async function GET() {
  try {
    return NextResponse.json(await getClients());
  } catch (err) {
    console.error('[GET /api/clients]', err);
    return NextResponse.json({ error: 'שגיאה בטעינת הלקוחות' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await req.json();
    await upsertClient(client);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/clients]', err);
    return NextResponse.json({ error: 'שגיאה בשמירת הלקוחה' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/clients]', err);
    return NextResponse.json({ error: 'שגיאה במחיקת הלקוחה' }, { status: 500 });
  }
}
