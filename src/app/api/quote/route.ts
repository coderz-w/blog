import { NextResponse } from 'next/server';

// 处理 GET 请求的处理器
export async function GET() {
  try {
    // 向第三方 API 请求数据，并禁用缓存
    const response = await fetch('https://v1.hitokoto.cn', { cache: 'no-store', method: 'GET' });

    const data = await response.json();

    // 成功响应，使用 NextResponse 包装响应
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching quote:', error);

    // 错误响应
    return NextResponse.json(
      { hitokoto: '奋斗的目标就是为了躺平，就是为了过上不被闹钟叫醒的日子', from: '余华' },
      { status: 200 },
    );
  }
}
