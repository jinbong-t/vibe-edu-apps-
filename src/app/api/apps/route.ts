import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const appsRef = collection(db, 'vibe_apps');
    const snapshot = await getDocs(appsRef);
    const apps = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    // createdAt 기준 정렬 (최신순)
    apps.sort((a: any, b: any) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return NextResponse.json(apps);
  } catch (error: any) {
    console.error('Firebase DB Error:', error);
    return NextResponse.json({ error: 'Failed to read data from Firebase', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newApp = await request.json();
    
    newApp.createdAt = new Date().toISOString();
    newApp.updatedAt = new Date().toISOString();
    newApp.isActive = true;
    
    const appsRef = collection(db, 'vibe_apps');
    const docRef = await addDoc(appsRef, newApp);
    
    return NextResponse.json({ ...newApp, id: docRef.id }, { status: 201 });
  } catch (error: any) {
    console.error('Firebase DB Error:', error);
    return NextResponse.json({ error: 'Failed to save data to Firebase', details: error.message }, { status: 500 });
  }
}
