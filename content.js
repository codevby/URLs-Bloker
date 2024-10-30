chrome.storage.local.get("adBlockEnabled", (data) => {
  if (data.adBlockEnabled) {
    const adSelectors = [
      "#ads",
      ".ad",
      ".advertisement",
      "iframe[src*='ad']",
      "iframe[src*='doubleclick.net']",
      "iframe[src*='googlesyndication.com']",
      "[id*='ad']",
      "[class*='ad']",
      "[data-ad]",
      ".sponsored",
      ".banner"
    ];

    adSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((ad) => {
        ad.style.display = "none";
      });
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            adSelectors.forEach((selector) => {
              if (node.matches(selector) || node.querySelector(selector)) {
                node.style.display = "none";
              }
            });
            if (node.tagName === "IFRAME" && (node.src.includes("ads") || node.src.includes("doubleclick") || node.src.includes("googlesyndication"))) {
              node.remove();
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
