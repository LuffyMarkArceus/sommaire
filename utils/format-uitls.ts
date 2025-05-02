export function formatFilenameAsTitle(fileName: string): string {
  // Remove file extension
  const title = fileName.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces
  const withSpaces = title
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1, $2");

  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
