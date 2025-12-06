import { ITip } from "@/types/tips.type";

/**
 * Get display content from ITip content property
 * If content is an object with html property, return the html
 * If content is a string, wrap it in a simple HTML paragraph
 */
export const getTipContent = (tip: ITip): string => {
  if (typeof tip.content === "string") {
    return `<div><p>${tip.content}</p></div>`;
  }

  if (typeof tip.content === "object" && tip.content.html) {
    return tip.content.html;
  }

  return `<div><p>Nội dung không khả dụng</p></div>`;
};

/**
 * Get plain text content from ITip for previews
 * Removes HTML tags and returns clean text
 */
export const getTipPlainText = (tip: ITip): string => {
  if (typeof tip.content === "string") {
    return tip.content;
  }

  if (typeof tip.content === "object" && tip.content.html) {
    // Remove HTML tags for plain text preview
    return tip.content.html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
      .replace(/&amp;/g, "&") // Replace &amp; with &
      .replace(/&lt;/g, "<") // Replace &lt; with <
      .replace(/&gt;/g, ">") // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .trim();
  }

  return "Nội dung không khả dụng";
};
