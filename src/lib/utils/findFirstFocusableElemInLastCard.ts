export function findFirstFocusable() {
  const allFormSections = document.querySelectorAll("[data-card-type]");
  const focusableElements = allFormSections[
    allFormSections.length - 1
  ].querySelectorAll(
    'a, button, input:not([hidden]):not([disabled]):not([type="hidden"]):not(.disabled), textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  // Return the first element or null if none
  return (focusableElements[0] as HTMLElement) || null;
}
