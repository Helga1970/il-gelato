export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Request URL:', requestUrl);
  console.log('Referer:', referer);

  // Разрешённые источники перехода
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
  ];

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      const isAllowed = allowedReferers.includes(refererOrigin);

      if (isAllowed) {
        console.log('Referer valid, access allowed.');
        return context.next(); // Разрешаем доступ
      }
    } catch (e) {
      console.error("Referer parsing error:", e);
    }
  }

  console.log('Access denied: invalid or missing referer.');
  return new Response('🚫 Access Denied: Only accessible from pro-culinaria.ru', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
