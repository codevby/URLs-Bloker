document.getElementById("toggleButton").addEventListener("click", () => {
    chrome.storage.local.get("adBlockEnabled", (data) => {
      const isEnabled = data.adBlockEnabled;
      chrome.storage.local.set({ adBlockEnabled: !isEnabled }, () => {
        document.getElementById("toggleButton").textContent = isEnabled
          ? "Activar Bloqueo de Anuncios"
          : "Desactivar Bloqueo de Anuncios";
      });
      chrome.runtime.sendMessage({ action: "toggleAdBlock", enabled: !isEnabled });
    });
  });
  
  // Actualizar el estado del botón al cargar
  chrome.storage.local.get("adBlockEnabled", (data) => {
    const isEnabled = data.adBlockEnabled || false;
    document.getElementById("toggleButton").textContent = isEnabled
      ? "Desactivar Bloqueo de Anuncios"
      : "Activar Bloqueo de Anuncios";
  });
  