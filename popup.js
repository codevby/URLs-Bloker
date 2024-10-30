document.getElementById('block-site').addEventListener('click', () => {
    const urlInput = document.getElementById('url-to-block');
    const url = urlInput.value.trim();

    // Validar que la URL no esté vacía
    if (!url) {
        alert("Por favor, ingresa una URL válida.");
        return;
    }

    // Agregar la URL al almacenamiento
    chrome.storage.sync.get({ blockedSites: [] }, (data) => {
        const blockedSites = [...new Set([...data.blockedSites, url])]; // Usar Set para evitar duplicados
        chrome.storage.sync.set({ blockedSites }, () => {
            localStorage.setItem('blocked_urls', JSON.stringify([...new Set([...JSON.parse(localStorage.getItem('blocked_urls')), url])]));
            console.log(`Sitio bloqueado: ${url}`);
            updateBlockedSitesList();
            updateRules(); // Actualiza las reglas después de bloquear un sitio
        });
    });

    // Limpiar el campo de entrada
    urlInput.value = '';
});

document.getElementById('clear-blocked-sites').addEventListener('click', () => {
    chrome.storage.sync.set({ blockedSites: [] }, () => {
        console.log("Lista de bloqueados limpiada.");
        updateBlockedSitesList();
        updateRules(); // Actualiza las reglas después de limpiar la lista
    });
});

function updateBlockedSitesList() {
    chrome.storage.sync.get({ blockedSites: [] }, (data) => {
        const list = document.getElementById('blocked-sites-list');
        list.innerHTML = ''; // Limpiar la lista actual

        data.blockedSites.forEach(site => {
            const li = document.createElement('li');
            li.textContent = site;
            list.appendChild(li);
        });
    });
}

// Actualizar las reglas de bloqueo
function updateRules() {
    chrome.storage.sync.get({ blockedSites: [] }, (data) => {
        const blockedUrls = JSON.parse(localStorage.getItem('blocked_urls'));
        if(!blockedUrls) return;

        const rules = [];
        blockedUrls.forEach((url, index) => {
            rules.push({
                id: index + 1,
                priority: index + 1,
                action: {
                    type: "redirect",
                    redirect: {
                        extensionPath: "/blocked.html"
                    }
                },
                condition: {
                    urlFilter: `||${url}`,
                    resourceTypes: ["main_frame"]
                }
            });
        });

        // Actualizar las reglas dinámicamente
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: Array.from({ length: data.blockedSites.length }, (_, i) => (i + 1).toString()),
            addRules: rules
        });

    });
}

// Inicializar la lista de sitios bloqueados al cargar
updateBlockedSitesList();
