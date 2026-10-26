let owners = 0;
let original = "", priority = "";

/** A menu and its nested native dialogs must release only their own scroll lock. */
export function lockDocumentScroll() {
  const body = document.body;
  if (owners++ === 0) {
    original = body.style.getPropertyValue("overflow");
    priority = body.style.getPropertyPriority("overflow");
    body.style.setProperty("overflow", "hidden");
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--owners === 0) {
      if (original) body.style.setProperty("overflow", original, priority);
      else body.style.removeProperty("overflow");
    }
  };
}
