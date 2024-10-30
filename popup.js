document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleButton");

  // Actualizar el estado del botón al abrir el popup
  chrome.storage.local.get("adBlockEnabled", (data) => {
    toggleButton.textContent = data.adBlockEnabled
      ? "Desactivar Bloqueo de Anuncios"
      : "Activar Bloqueo de Anuncios";
  });

  // Alternar estado al hacer clic en el botón
  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get("adBlockEnabled", (data) => {
      const isEnabled = !data.adBlockEnabled;
      chrome.runtime.sendMessage({ action: "toggleAdBlock", enabled: isEnabled });
      toggleButton.textContent = isEnabled
        ? "Desactivar Bloqueo de Anuncios"
        : "Activar Bloqueo de Anuncios";
    });
  });
});
