import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'src/data/users.json');

type User = { username: string; password: string };

export async function POST(req: NextRequest) {
  const { username, password ,pathname} = await req.json();
  if (!username || !password) {
    return NextResponse.json({ success: false, message: '用户名和密码不能为空' }, { status: 400 });
  }
  const usersRaw = await fs.readFile(USERS_PATH, 'utf-8');
  const users: User[] = JSON.parse(usersRaw);
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('user_info', JSON.stringify({ username }), { httpOnly: false, path: pathname });
    return res;
  } else {
    return NextResponse.json({ success: false, message: '用户名或密码错误' }, { status: 401 });
  }
}
