import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'src/data/users.json');

type User = { username: string; password: string };

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ success: false, message: '用户名和密码不能为空' }, { status: 400 });
  }
  const usersRaw = await fs.readFile(USERS_PATH, 'utf-8');
  const users: User[] = JSON.parse(usersRaw);
  if (users.find((u) => u.username === username)) {
    return NextResponse.json({ success: false, message: '用户名已存在' }, { status: 409 });
  }
  users.push({ username, password });
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
  return NextResponse.json({ success: true });
}
