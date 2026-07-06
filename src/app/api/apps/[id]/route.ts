import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'apps.json');

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updatedData = await request.json();
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    let apps = JSON.parse(fileContents);
    
    const index = apps.findIndex((app: any) => app.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    apps[index] = { ...apps[index], ...updatedData };
    fs.writeFileSync(dataFilePath, JSON.stringify(apps, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, app: apps[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    let apps = JSON.parse(fileContents);
    
    const initialLength = apps.length;
    apps = apps.filter((app: any) => app.id !== id);
    
    if (apps.length === initialLength) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(apps, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
