// netlify/edge-functions/check-referer-v2.js

export default async (request, context) => {
  const referer = request.headers.get('referer');
  const requestUrl = request.url;

  console.log('Incoming request URL:', requestUrl);
  console.log('Referer header:', referer);

  // Разрешённые домены
  // Здесь мы оставляем домены pro-culinaria.ru
  // и добавляем домены вашего сайта il-gelato (Netlify и кастомный поддомен).
  const allowedReferers = [
    'https://pro-culinaria.ru',
    'http://pro-culinaria.ru',
    'https://www.pro-culinaria.ru',
    'http://www.pro-culinaria.ru',
    'pro-culinaria.ru',
    'www.pro-culinaria.ru',

    // !!! ВАЖНО !!!
    // Добавляем домен самого Netlify сайта (il-gelato.netlify.app),
    // чтобы он мог загружать свои ресурсы (изображения, CSS) и открываться напрямую.
    // Когда браузер запрашивает ресурсы со страницы il-gelato.netlify.app,
    // реферером будет сам il-gelato.netlify.app.
    'https://il-gelato.netlify.app',
    'http://il-gelato.netlify.app',

    // Добавляем ваш кастомный поддомен (il-gelato.proculinaria-book.ru),
    // если он также используется для доступа к сайту.
    'https://il-gelato.proculinaria-book.ru',
    'http://il-gelato.proculinaria-book.ru',
  ];

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      console.log('Parsed Referer Origin:', refererOrigin);

      // Проверяем, входит ли refererOrigin в список разрешённых доменов.
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
    // Если заголовок Referer отсутствует (например, прямой заход, или rel="noreferrer"),
    // текущая логика блокирует доступ.
    console.log('No referer header found. Blocking.');
  }

  // Если реферер отсутствует или не разрешён, блокируем доступ
  console.log('Blocking request: Referer not allowed or missing.');
  return new Response('Access Denied: This page is only accessible from allowed sources.', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
