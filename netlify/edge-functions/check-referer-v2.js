// netlify/edge-functions/check-referer-v2.js

export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Разрешённые домены
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
    'pro-culinaria.ru',
    'www.pro-culinaria.ru',

    'https://il-gelato.netlify.app',
    'http://il-gelato.netlify.app',

    'https://il-gelato.proculinaria-book.ru',
    'http://il-gelato.proculinaria-book.ru',
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      console.log('Parsed Referer Origin:', refererOrigin);

      const isAllowed = allowedReferers.includes(refererOrigin);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        return context.next();
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    // --- ИЗМЕНЕНИЕ НАЧИНАЕТСЯ ЗДЕСЬ ---
    // Если Referer отсутствует, проверяем, является ли запрос прямым доступом к целевому сайту
    const targetDomains = [
        'https://il-gelato.netlify.app',
        'http://il-gelato.netlify.app',
        'https://il-gelato.proculinaria-book.ru',
        'http://il-gelato.proculinaria-book.ru',
        // Добавьте сюда другие URLы, если они являются целевыми для вашей страницы
    ];

    const isDirectAccessToTarget = targetDomains.some(domain => requestUrl.startsWith(domain));

    if (isDirectAccessToTarget) {
        console.log('No referer, but direct access to an allowed target. Allowing.');
        return context.next();
    } else {
        // Если Referer отсутствует И это не прямой доступ к разрешенному целевому сайту
        console.log('No referer header found. Blocking.');
    }
    // --- ИЗМЕНЕНИЕ ЗАВЕРШАЕТСЯ ЗДЕСЬ ---
  }

  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Access Denied: This page is only accessible from allowed sources.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
