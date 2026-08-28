// Netlify Function: прокси к Google Apps Script.
// Браузер обращается сюда (на тот же домен netlify.app, поэтому CORS не мешает),
// а эта функция уже сама, на сервере, обращается к Apps Script и отдаёт ответ обратно.

const APP_URL = "https://script.google.com/macros/s/AKfycbzzGLIhdNrPvWD29qSGnZ58ki8Ya4ImkTXlq5HNrpmZLe_KKkrZIioaLIrMPBDnql2Z/exec"
exports.handler = async function (event) {
  try {
    const url = new URL(APP_URL);
    const params = event.queryStringParameters || {};
    Object.keys(params).forEach((k) => {
      if (params[k] !== undefined && params[k] !== null) url.searchParams.set(k, params[k]);
    });

    const res = await fetch(url.toString());
    const text = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ ok: false, error: "Ошибка прокси: " + (err.message || String(err)) }),
    };
  }
};
