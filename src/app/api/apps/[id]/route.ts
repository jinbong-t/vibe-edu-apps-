import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rawData = await request.json();
    
    // body에 id가 포함되어 있으면 제거 (Firestore 충돌 방지)
    const { id: _removeId, ...updatedData } = rawData;
    updatedData.updatedAt = new Date().toISOString();
    
    const docRef = doc(db, 'vibe_apps', id);
    await updateDoc(docRef, updatedData);
    
    return NextResponse.json({ success: true, app: { id, ...updatedData } });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update data in Firebase', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const docRef = doc(db, 'vibe_apps', id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Failed to delete data from Firebase', details: error.message }, { status: 500 });
  }
}
