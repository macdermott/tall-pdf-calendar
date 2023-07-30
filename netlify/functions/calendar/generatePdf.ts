//create function that takes a month adn year and returns a pdf
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { start } from "repl";

const document = {
  width: 210,
  height: 594,
  margin: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  font: {
    size: {
      title: 16,
      row: 8,
    },
  },
};

const dayRowHeight = 18;

// Create array of short day names
const dayNames = [...Array(7).keys()].map((day) => {
  const dayName = new Date(2023, 5 - 1, day + 1).toLocaleString("default", {
    weekday: "short",
  });
  return dayName;
});

export async function generatePdf(
  month: number,
  year: number
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([210, 594]);

  const longMonth = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  const monthFontHeight = helveticaBold.heightAtSize(document.font.size.title);
  drawTitle(month, year, page, helveticaBold);
  drawDays(month, year, page, helveticaBold);
  return pdfDoc;
}

function drawTitle(month: number, year: number, page: PDFPage, font: PDFFont) {
  const longMonth = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });
  const monthFontHeight = font.heightAtSize(document.font.size.title);

  // Draw month
  page.drawText(longMonth, {
    font: font,
    x: document.margin.left,
    y: document.height - document.margin.top - monthFontHeight,
    size: document.font.size.title,
  });

  // Draw year
  const yearFontWidth = font.widthOfTextAtSize(
    year.toString(),
    document.font.size.title
  );
  const yearFontHeight = font.heightAtSize(document.font.size.title);
  page.drawText(year.toString(), {
    font: font,
    x: document.width - document.margin.right - yearFontWidth,
    y: document.height - document.margin.top - yearFontHeight,
    size: document.font.size.title,
  });
}

function drawDays(month: number, year: number, page: PDFPage, font: PDFFont) {
  const top =
    document.height -
    document.margin.top -
    font.heightAtSize(document.font.size.title);

  const daysInMonth = new Date(year, month, 0).getDate();
  // Draw days
  for (let i = 1; i <= daysInMonth; i++) {
    const dayFontHeight = top - dayRowHeight * i;

    dayNames.forEach((dayName, j) => {
      const currentDayName = new Date(year, month - 1, i).toLocaleString(
        "default",
        {
          weekday: "short",
        }
      );

      const dayInitial = dayName === currentDayName ? i.toString() : dayName[0];
      const x =
        document.margin.left +
        j * font.widthOfTextAtSize("W1", document.font.size.row);
      const y = dayFontHeight;
      page.drawText(dayInitial, {
        font: font,
        x: x,
        y: y,
        size: document.font.size.row,
        color:
          dayName === currentDayName ? rgb(0.2, 0.2, 0.2) : rgb(0.8, 0.8, 0.8),
      });

      if (!isNaN(parseInt(dayInitial))) {
        page.drawLine({
          start: {
            x: x - 2,
            y: y - 5,
          },
          end: {
            x: document.width - document.margin.right,
            y: y - 5,
          },
          color: rgb(0.8, 0.8, 0.8),
          thickness: 0.5,
        });
      }
    });
  }
}
