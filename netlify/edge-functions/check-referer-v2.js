export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Только эти источники разрешены
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      console.log('Parsed Referer Origin:', refererOrigin);

      // Разрешаем только если реферер — pro-culinaria.ru
      if (allowedReferers.includes(refererOrigin)) {
        return context.next(); // Пропускаем запрос
      }
    } catch (e) {
      console.error("Referer parse error:", referer, e);
    }
  }

  // Блокируем все остальные случаи
  console.log('Blocking request: Referer not allowed or missing');
  return new Response('⛔ Доступ разрешён только с https://pro-culinaria.ru', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
