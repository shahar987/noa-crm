import { NextRequest, NextResponse } from 'next/server';
import { getProducts, upsertProduct, deleteProduct } from '@/lib/sheets';

export async function GET() {
  try {
    return NextResponse.json(await getProducts());
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'שגיאה בטעינת המוצרים' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const product = await req.json();
    await upsertProduct(product);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ error: 'שגיאה בשמירת המוצר' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/products]', err);
    return NextResponse.json({ error: 'שגיאה במחיקת המוצר' }, { status: 500 });
  }
}
