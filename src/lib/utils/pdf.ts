import jsPDF from "jspdf";
import type { GetStoryResponse } from "@/types/api";

// Children's book print specifications
// Using 8x10 inch landscape format (common for picture books)
const PAGE_WIDTH_MM = 254; // 10 inches
const PAGE_HEIGHT_MM = 203; // 8 inches
const MARGIN_MM = 12.7; // 0.5 inch margin
const BLEED_MM = 3; // Standard bleed

// Load and register Roboto font for Cyrillic support
async function loadRobotoFont(pdf: jsPDF): Promise<void> {
  try {
    // Fetch Roboto Regular
    const regularResponse = await fetch("/fonts/Roboto-Regular.ttf");
    if (regularResponse.ok) {
      const regularBuffer = await regularResponse.arrayBuffer();
      const regularBase64 = arrayBufferToBase64(regularBuffer);
      pdf.addFileToVFS("Roboto-Regular.ttf", regularBase64);
      pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    }

    // Fetch Roboto Bold
    const boldResponse = await fetch("/fonts/Roboto-Bold.ttf");
    if (boldResponse.ok) {
      const boldBuffer = await boldResponse.arrayBuffer();
      const boldBase64 = arrayBufferToBase64(boldBuffer);
      pdf.addFileToVFS("Roboto-Bold.ttf", boldBase64);
      pdf.addFont("Roboto-Bold.ttf", "Roboto", "bold");
    }
  } catch (error) {
    console.warn("Failed to load Roboto font, falling back to Helvetica:", error);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function generateStoryPDF(story: GetStoryResponse): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [PAGE_WIDTH_MM, PAGE_HEIGHT_MM],
  });

  // Load Roboto font for Cyrillic support
  await loadRobotoFont(pdf);

  const usableWidth = PAGE_WIDTH_MM - MARGIN_MM * 2;
  const usableHeight = PAGE_HEIGHT_MM - MARGIN_MM * 2;

  // ===== COVER PAGE =====
  await renderCoverPage(pdf, story, PAGE_WIDTH_MM, PAGE_HEIGHT_MM, MARGIN_MM);

  // ===== STORY PAGES =====
  for (const page of story.pages) {
    pdf.addPage([PAGE_WIDTH_MM, PAGE_HEIGHT_MM], "landscape");
    await renderStoryPage(
      pdf,
      page,
      story.childName,
      PAGE_WIDTH_MM,
      PAGE_HEIGHT_MM,
      MARGIN_MM,
      usableWidth,
      usableHeight
    );
  }

  // ===== END PAGE =====
  pdf.addPage([PAGE_WIDTH_MM, PAGE_HEIGHT_MM], "landscape");
  renderEndPage(pdf, story, PAGE_WIDTH_MM, PAGE_HEIGHT_MM, MARGIN_MM);

  return pdf.output("blob");
}

async function renderCoverPage(
  pdf: jsPDF,
  story: GetStoryResponse,
  pageWidth: number,
  pageHeight: number,
  margin: number
): Promise<void> {
  // Soft background
  pdf.setFillColor(250, 247, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Cover image - LARGE, almost full page (the hero!)
  if (story.coverImageUrl) {
    try {
      const imageData = await fetchImageAsBase64(story.coverImageUrl);
      if (imageData) {
        // Image fills most of the page
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (imgWidth * 3) / 4; // 4:3 aspect ratio
        const imgX = margin;
        const imgY = margin;

        // Subtle shadow behind image
        pdf.setFillColor(200, 190, 210);
        pdf.roundedRect(imgX + 2, imgY + 2, imgWidth, imgHeight, 4, 4, "F");

        // Image with rounded corners effect (clip not supported, so we draw border)
        pdf.addImage(imageData, "PNG", imgX, imgY, imgWidth, imgHeight);

        // Decorative frame around image
        pdf.setDrawColor(147, 51, 234);
        pdf.setLineWidth(2);
        pdf.roundedRect(imgX, imgY, imgWidth, imgHeight, 4, 4, "S");
      }
    } catch {
      // Skip if image fails
    }
  }

  // Dedication ribbon at bottom - elegant and minimal
  if (story.parentName) {
    // Small elegant banner
    const ribbonY = pageHeight - 28;
    const ribbonHeight = 18;

    pdf.setFillColor(147, 51, 234); // Purple ribbon
    pdf.roundedRect(pageWidth / 2 - 60, ribbonY, 120, ribbonHeight, 3, 3, "F");

    pdf.setFont("Roboto", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`With love from ${story.parentName}`, pageWidth / 2, ribbonY + 12, {
      align: "center",
    });
  }

  // Footer branding - very subtle at bottom
  pdf.setFont("Roboto", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(160, 150, 170);
  pdf.text("Cone Red AI • linkedin.com/in/leeevind", pageWidth / 2, pageHeight - 4, {
    align: "center",
  });
}

async function renderStoryPage(
  pdf: jsPDF,
  page: { pageNumber: number; text: string; imageUrl: string },
  childName: string,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  usableWidth: number,
  usableHeight: number
): Promise<void> {
  // Soft background
  pdf.setFillColor(255, 252, 250);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative page border
  pdf.setDrawColor(230, 220, 240);
  pdf.setLineWidth(1);
  pdf.rect(margin - 2, margin - 2, usableWidth + 4, usableHeight + 4);

  // Calculate layout - image takes ~65% of page height
  const imageAreaHeight = usableHeight * 0.65;
  const textAreaHeight = usableHeight * 0.35;
  const textAreaY = margin + imageAreaHeight;

  // Image
  if (page.imageUrl) {
    try {
      const imageData = await fetchImageAsBase64(page.imageUrl);
      if (imageData) {
        // Center image in upper portion
        const imgMaxWidth = usableWidth - 10;
        const imgMaxHeight = imageAreaHeight - 10;
        // Assuming 4:3 aspect ratio
        let imgWidth = imgMaxWidth;
        let imgHeight = (imgWidth * 3) / 4;
        if (imgHeight > imgMaxHeight) {
          imgHeight = imgMaxHeight;
          imgWidth = (imgHeight * 4) / 3;
        }
        const imgX = margin + (usableWidth - imgWidth) / 2;
        const imgY = margin + (imageAreaHeight - imgHeight) / 2;

        // Add shadow effect
        pdf.setFillColor(200, 200, 200);
        pdf.roundedRect(imgX + 2, imgY + 2, imgWidth, imgHeight, 3, 3, "F");

        pdf.addImage(imageData, "PNG", imgX, imgY, imgWidth, imgHeight);
      }
    } catch {
      // Skip if image fails
    }
  }

  // Decorative divider
  pdf.setDrawColor(200, 180, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 20, textAreaY + 2, pageWidth - margin - 20, textAreaY + 2);

  // Story text - large, readable, centered
  pdf.setFont("Roboto", "normal");
  pdf.setFontSize(16); // Large for children
  pdf.setTextColor(50, 50, 50);

  const textWidth = usableWidth - 20;
  const textLines = pdf.splitTextToSize(page.text, textWidth);

  // Center text vertically in text area
  const lineHeight = 8;
  const textBlockHeight = textLines.length * lineHeight;
  const textStartY = textAreaY + 10 + (textAreaHeight - 15 - textBlockHeight) / 2;

  pdf.text(textLines, pageWidth / 2, textStartY, { align: "center", lineHeightFactor: 1.5 });

  // Page number in decorative circle
  pdf.setFillColor(147, 51, 234);
  pdf.circle(pageWidth - margin - 8, pageHeight - margin - 8, 6, "F");
  pdf.setFont("Roboto", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(String(page.pageNumber), pageWidth - margin - 8, pageHeight - margin - 6, {
    align: "center",
  });
}

function renderEndPage(
  pdf: jsPDF,
  story: GetStoryResponse,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  // Gradient-like background
  pdf.setFillColor(245, 235, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative elements
  pdf.setFillColor(147, 51, 234);
  pdf.rect(0, pageHeight - 8, pageWidth, 8, "F");

  // "The End" title
  pdf.setFont("Roboto", "bold");
  pdf.setFontSize(48);
  pdf.setTextColor(88, 28, 135);
  pdf.text("The End", pageWidth / 2, 60, { align: "center" });

  // Dedication
  pdf.setFont("Roboto", "normal");
  pdf.setFontSize(20);
  pdf.setTextColor(107, 33, 168);
  const dedication = story.parentName
    ? `For ${story.childName}, with love from ${story.parentName}`
    : `A special story for ${story.childName}`;
  pdf.text(dedication, pageWidth / 2, 85, { align: "center" });

  // Lesson learned (if available)
  if (story.lesson) {
    pdf.setFont("Roboto", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    const lessonText = `Lesson: ${story.lesson}`;
    const lessonLines = pdf.splitTextToSize(lessonText, pageWidth - margin * 4);
    pdf.text(lessonLines, pageWidth / 2, 110, { align: "center" });
  }

  // Footer branding
  pdf.setFont("Roboto", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Created with StoryForge AI by Cone Red", pageWidth / 2, pageHeight - 25, { align: "center" });
  pdf.setFontSize(9);
  pdf.text("by Dima Levin with love • linkedin.com/in/leeevind • cone.red", pageWidth / 2, pageHeight - 15, {
    align: "center",
  });
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  if (!url || !url.startsWith("/generated/")) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
