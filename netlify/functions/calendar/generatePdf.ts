//create function that takes a month adn year and returns a pdf
import { PDFDocument, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export async function generatePdf(
  month: number,
  year: number
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([210, 594]);

  page.drawText(month + " " + year, { font: helveticaBold });
  return pdfDoc;
}
