import { headers } from 'next/headers';

export function getUserLocale(): 'zh' | 'en' {
  const h = headers();
  const langHeader = h.get('accept-language') || 'en';
  const primaryLang = langHeader.split(',')[0].trim().toLowerCase(); // 例如：'zh-CN' => 'zh-cn'

  if (primaryLang.startsWith('en')) {
    return 'en';
  } else {
    return 'zh';
  }
}
