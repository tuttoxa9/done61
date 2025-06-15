import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS заголовки
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Обработка preflight запроса
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Проверка метода запроса
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Проверяем доступность переменных окружения
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    // Получаем все переменные окружения, связанные с Telegram
    const telegramEnvVars = Object.keys(process.env)
      .filter(key => key.includes('TELEGRAM'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? 'SET' : 'NOT_SET';
        return acc;
      }, {} as Record<string, string>);

    const result = {
      environment: 'netlify',
      timestamp: new Date().toISOString(),
      telegram: {
        botTokenConfigured: !!telegramBotToken,
        chatIdConfigured: !!telegramChatId,
        botTokenLength: telegramBotToken ? telegramBotToken.length : 0,
        chatIdValue: telegramChatId || 'NOT_SET',
        allTelegramVars: telegramEnvVars
      },
      netlifyContext: {
        deployId: process.env.DEPLOY_ID || 'unknown',
        context: process.env.CONTEXT || 'unknown',
        branch: process.env.BRANCH || 'unknown',
        url: process.env.URL || 'unknown'
      }
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result, null, 2),
    };
  } catch (error) {
    console.error("Error checking environment:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
