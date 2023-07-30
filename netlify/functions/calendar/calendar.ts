import { Handler } from "@netlify/functions";
import { generatePdf } from "./generatePdf";

export const handler: Handler = async (event, context) => {
  const today = new Date();
  const month = event?.queryStringParameters?.month
    ? parseInt(event?.queryStringParameters.month)
    : today.getUTCMonth() + 1;
  const year = event?.queryStringParameters?.year
    ? parseInt(event?.queryStringParameters.year)
    : today.getUTCFullYear();

  if (month < 1 || month > 12) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid month",
      }),
    };
  }
  const pdfDoc = await generatePdf(month, year);
  const pdfBytes = await pdfDoc.saveAsBase64();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/pdf",
    },
    body: pdfBytes,
    isBase64Encoded: true,
  };
};
