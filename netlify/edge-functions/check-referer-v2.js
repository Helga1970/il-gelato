export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Разрешённые источники
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
  ];

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      console.log('Parsed Referer Origin:', refererOrigin);

      const isAllowed = allowedReferers.includes(refererOrigin);
      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        return context.next();
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  }

  // Если реферера нет или он неразрешён — блокируем
  console.log('Access denied: invalid or missing referer.');
  return new Response('Access Denied: This page is only accessible from pro-culinaria.ru', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
