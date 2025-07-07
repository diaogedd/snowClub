import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'src/data/marketplace.json');

export async function POST(req: NextRequest) {
  const data = await req.json();
  const listRaw = await fs.readFile(FILE_PATH, 'utf-8');
  const list = JSON.parse(listRaw);
  list.push({ ...data, createdAt: Date.now(), name: data.name });
  await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
} 
export async function GET() {
  const listRaw = await fs.readFile(FILE_PATH, 'utf-8');
  const list = JSON.parse(listRaw);
  return NextResponse.json(list);
} 