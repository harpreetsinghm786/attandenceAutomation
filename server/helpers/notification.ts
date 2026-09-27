import "dotenv/config";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(
  message: string,
  maxRetries = 3
) {
  if (!botToken || !chatId) {
    console.error("Telegram configuration is missing");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const delays = [2000, 5000, 10000];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (response.ok) {
        console.log(
          `Telegram notification sent successfully on attempt ${attempt}`
        );
        return;
      }

      const responseText = await response.text();

      // Don't retry permanent 4xx errors except 429
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        console.error(
          `Telegram notification failed permanently: ${response.status} ${responseText}`
        );
        return;
      }

      console.error(
        `Telegram notification failed on attempt ${attempt}: ` +
        `${response.status} ${responseText}`
      );
    } catch (error) {
      console.error(
        `Telegram notification attempt ${attempt} failed:`,
        error instanceof Error ? error.message : String(error)
      );
    }

    // Don't wait after the final attempt
    if (attempt < maxRetries) {
      const delay = delays[attempt - 1] ?? 10000;

      console.log(
        `Retrying Telegram notification in ${delay / 1000}s...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error(
    `Telegram notification failed after ${maxRetries} attempts`
  );
}