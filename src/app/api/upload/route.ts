import { NextRequest, NextResponse } from 'next/server';
import { uploadPhoto, deletePhoto } from '@/lib/drive';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'לא נבחר קובץ' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadPhoto(buffer, file.name, file.type || 'image/jpeg');
    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/upload]', err);
    return NextResponse.json({ error: 'שגיאה בהעלאת התמונה' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { fileId } = await req.json();
    await deletePhoto(fileId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/upload]', err);
    return NextResponse.json({ error: 'שגיאה במחיקת התמונה' }, { status: 500 });
  }
}
