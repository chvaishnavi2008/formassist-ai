const WEBHOOK_URL = "https://rushyanth.app.n8n.cloud/webhook-test/formassist-ai";

export interface WebhookResponse {
  text?: string;
  audioUrl?: string;
  service?: string;
  steps?: string[];
  link?: string;
}

export async function sendToWebhook(message: string): Promise<WebhookResponse> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`Webhook returned ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";

    // If the response is audio binary, create a blob URL
    if (contentType.includes("audio")) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      return { text: "Here's the audio response:", audioUrl };
    }

    // Otherwise parse as JSON
    const data = await res.json();

    // Handle various response shapes from n8n
    return {
      text: data.text || data.message || data.output || data.response || "Response received.",
      audioUrl: data.audioUrl || data.audio_url || data.audio || undefined,
      service: data.service || undefined,
      steps: data.steps || undefined,
      link: data.link || undefined,
    };
  } catch (err) {
    console.error("Webhook error:", err);
    return { text: "Sorry, I couldn't reach the server. Please try again." };
  }
}
