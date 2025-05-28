// netlify/edge-functions/check-referer-v2.js

export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Разрешённые домены-источники (ОТКУДА ПРИШЕЛ ЗАПРОС)
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
    // Домены без протокола здесь не будут работать с refererUrl.origin,
    // но мы их оставляем по вашей просьбе.
    'pro-culinaria.ru',
    'www.pro-culinaria.ru',
  ];

  // Разрешённые домены-цели (КУДА ИДЕТ ЗАПРОС)
  // Это нужно для обработки случаев, когда Referer равен null (прямой заход, noreferrer)
  const allowedTargetDomains = [
    'https://il-gelato.netlify.app',
    'http://il-gelato.netlify.app',
    'https://il-gelato.proculinaria-book.ru',
    'http://il-gelato.proculinaria-book.ru',
  ];

  if (referer) {
    // Если заголовок Referer ЕСТЬ
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      console.log('Parsed Referer Origin:', refererOrigin);

      // Проверяем, входит ли refererOrigin в список разрешённых ДОМЕНОВ-ИСТОЧНИКОВ
      const isAllowed = allowedReferers.includes(refererOrigin);

      console.log('Is referer allowed?', isAllowed);

      if (isAllowed) {
        // Если реферер разрешён, пропускаем запрос
        return context.next();
      }
    } catch (e) {
      console.error("Invalid referer URL or parsing error:", referer, e);
    }
  } else {
    // Если заголовок Referer ОТСУТСТВУЕТ (null)
    // Проверяем, идет ли запрос напрямую к одному из разрешенных ДОМЕНОВ-ЦЕЛЕЙ
    const requestOrigin = new URL(requestUrl).origin; // Получаем Origin текущего запроса

    const isDirectAccessToAllowedTarget = allowedTargetDomains.includes(requestOrigin);

    if (isDirectAccessToAllowedTarget) {
      console.log('No referer header, but direct access to an allowed target. Allowing.');
      return context.next(); // Разрешаем, если это прямой заход на разрешенный домен
    } else {
      console.log('No referer header found. Blocking.'); // Блокируем, если нет Referer и это не прямой заход на нашу страницу
    }
  }

  // Если реферер есть, но не разрешен, ИЛИ если реферера нет, и это не прямой заход на нашу страницу, то блокируем
  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Access Denied: This page is only accessible from allowed sources.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
