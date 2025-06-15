import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Интерфейс для данных заявки
interface ApplicationData {
  fullName: string;
  birthDate: string;
  phone: string;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS заголовки
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Получаем данные из тела запроса
    const data: ApplicationData = JSON.parse(event.body || "{}");

    // Проверка наличия необходимых данных
    if (!data.fullName || !data.birthDate || !data.phone) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing required fields: fullName, birthDate, and phone" }),
      };
    }

    // Получаем токен бота и ID чата из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Проверка наличия переменных окружения
    if (!botToken || !chatId) {
      console.error("Missing environment variables: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      console.error("Available env vars:", Object.keys(process.env).filter(key => key.includes('TELEGRAM')));
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Server configuration error" }),
      };
    }

    // Формируем сообщение для отправки
    const message = `🔔 *Новая заявка с сайта*\n\n📋 *ФИО*: ${data.fullName}\n🎂 *Дата рождения*: ${data.birthDate}\n📱 *Телефон*: ${data.phone}\n\n⏰ *Дата заявки*: ${new Date().toLocaleString('ru-RU')}`;

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.json();
      console.error("Telegram API error:", telegramError);
      throw new Error("Failed to send message to Telegram");
    }

    // Возвращаем успешный ответ
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Application submitted successfully" }),
    };
  } catch (error) {
    console.error("Error processing application:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

export { handler };
