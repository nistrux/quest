const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ3456789";
const BASE = ALPHABET.length;


/**
 * @returns {Promise<ArrayBuffer>} - ArrayBuffer.
 */
async function getEncryptionKey() {
    const originalKeyString = atob("aHR0cHM6Ly95b3V0dS5iZS9UOVZMYlI1QjRmRQ==");

    const encoder = new TextEncoder();
    const data = encoder.encode(originalKeyString);

    return await crypto.subtle.digest('SHA-256', data);
}

function decodeShortCode(customBaseString) {
    let num = 0;
    for (let i = 0; i < customBaseString.length; i++) {
        const char = customBaseString[i];
        const charIndex = ALPHABET.indexOf(char);
        if (charIndex === -1) return null;
        num = num * BASE + charIndex;
    }
    return num;
}

// ===================================================================
// (Mappings)
// ===================================================================
async function getMappings_prod() {
    const keyData = await getEncryptionKey();
    const encryptedBase64 = "7bQ2+TE9pyBFv44GKXd6t0blp2hiU/OOcGT5VaU6tawoIN/Eierc3prJdvz1atq1SvGIVbpqTxQTtsrYBl" +
        "4TNuyQCAoIS3XOtkJDYHVjxwchYhCXrdlvP6nD7g==";

    try {
        const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", true, ["decrypt"]);
        const combined = new Uint8Array(atob(encryptedBase64).split('').map(char => char.charCodeAt(0)));
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
        const decodedString = new TextDecoder().decode(decrypted);
        return JSON.parse(decodedString);
    } catch (e) {
        console.error("decrypt error!", e);
        return null;
    }
}

let getMappings = getMappings_prod;

// ===================================================================
// (Main)
// ===================================================================
async function main() {
    const infoBox = document.getElementById('redirect-info');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');

    if (!code) {
        infoBox.innerHTML = `<p>Ошибка: Код не указан в ссылке.</p>`;
        return;
    }

    const mappings = await getMappings();
    const pageId = decodeShortCode(code.trim());

    if (pageId !== null && mappings && mappings[pageId]) {
        const destinationUrl = mappings[pageId];
        infoBox.innerHTML = `<p>Перенаправление... Если ничего не происходит, нажмите <a href="${destinationUrl}">${destinationUrl}</a>.</p>`;
        setTimeout(() => { window.location.href = destinationUrl; }, 500);
    } else {
        infoBox.innerHTML = `<p>Эта ссылка недействительна или устарела. Попробуйте найти другой путь.</p>`;
    }
}

// ===================================================================
// (Entry Point)
// ===================================================================
main().catch(e => {
    console.error("Критическая ошибка в приложении:", e);
    const infoBox = document.getElementById('redirect-info');
    if (infoBox) {
        infoBox.innerHTML = `<p>Произошла системная ошибка. Пожалуйста, попробуйте позже.</p>`;
    }
});