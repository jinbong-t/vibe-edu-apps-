import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'apps.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const apps = JSON.parse(fileContents);
    return NextResponse.json(apps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newApp = await request.json();
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const apps = JSON.parse(fileContents);
    
    // 간단한 ID 생성 (실제로는 uuid 등을 사용하는 것이 좋습니다)
    newApp.id = `app-${Date.now()}`;
    newApp.isActive = true;
    
    apps.push(newApp);
    fs.writeFileSync(dataFilePath, JSON.stringify(apps, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, app: newApp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
