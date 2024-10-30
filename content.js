  chrome.storage.local.get("adBlockEnabled", (data) => {
    if (data.adBlockEnabled) {
      // Selectores comunes de anuncios y otros elementos intrusivos
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
        ".sponsored",  // Para eliminar contenido patrocinado
        ".banner"      // Banners
      ];
  
      // Iterar sobre los selectores y ocultar los elementos encontrados
      adSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((ad) => {
          ad.style.display = "none";
        });
      });
  
      // Eliminar iframes de terceros para anuncios, especialmente en sitios como Speedtest.net
      document.querySelectorAll("iframe").forEach((iframe) => {
        const src = iframe.src;
        if (src.includes("ads") || src.includes("doubleclick") || src.includes("googlesyndication")) {
          iframe.remove();
        }
      });
  
      // Observador para eliminar anuncios dinámicos que aparecen después de cargar la página
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Elemento
              adSelectors.forEach((selector) => {
                if (node.matches(selector) || node.querySelector(selector)) {
                  node.style.display = "none";
                }
              });
              // Eliminar iframes en anuncios dinámicos
              if (node.tagName === "IFRAME" && (node.src.includes("ads") || node.src.includes("doubleclick") || node.src.includes("googlesyndication"))) {
                node.remove();
              }
            }
          });
        });
      });
  
      // Configurar el observador para monitorear cambios en el DOM
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
  
  