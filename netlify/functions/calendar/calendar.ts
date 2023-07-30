import { Handler } from "@netlify/functions";
import { PDFDocument } from "pdf-lib";

export const handler: Handler = async (event) => {
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

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText("You can create PDFs!");
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
