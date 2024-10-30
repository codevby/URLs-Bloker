const dynamicRules = [
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "*://*.doubleclick.net/*",
      "resourceTypes": ["main_frame", "sub_frame", "script", "xmlhttprequest"]
    }
  },
  {
    "id": 2,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "*://*.googlesyndication.com/*",
      "resourceTypes": ["main_frame", "sub_frame", "script", "xmlhttprequest"]
    }
  },
  {
    "id": 3,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "*://*.facebook.com/tr/*",
      "resourceTypes": ["main_frame", "sub_frame", "script", "xmlhttprequest"]
    }
  }
];

// Activar reglas de bloqueo
function enableBlockingRules() {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: dynamicRules,
      removeRuleIds: dynamicRules.map(rule => rule.id)
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Error al activar las reglas de bloqueo:", chrome.runtime.lastError);
      } else {
        console.log("Reglas de bloqueo activadas.");
      }
    }
  );
}

// Desactivar reglas de bloqueo
function disableBlockingRules() {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: [],
      removeRuleIds: dynamicRules.map(rule => rule.id)
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Error al desactivar las reglas de bloqueo:", chrome.runtime.lastError);
      } else {
        console.log("Reglas de bloqueo desactivadas.");
      }
    }
  );
}

// Inicializar estado de bloqueo
chrome.storage.local.get("adBlockEnabled", (data) => {
  if (data.adBlockEnabled) {
    enableBlockingRules();
  } else {
    disableBlockingRules();
  }
});

// Listener para alternar estado de bloqueo desde popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleAdBlock") {
    chrome.storage.local.set({ adBlockEnabled: message.enabled }, () => {
      if (message.enabled) {
        enableBlockingRules();
      } else {
        disableBlockingRules();
      }
    });
  }
});
