import { SendEmailParams } from "@/interfaces/utils-interfaces";

export const SendEmail = async (params: SendEmailParams): Promise<boolean> => {
  try {
    const response = await fetch("/api/email/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
