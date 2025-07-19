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
    const encryptedBase64 = "uEbkN4bVzZhWPY9L17Jt9aVj6szI1zNE3SWE4pDi4LwyF4bArHRXrLjVBzZf5nkXjO/wHPRa7ABr4E5MQe4y3+eZiUELpa89KJ1LCauk+peuEGjUp0sqmV7sdwDmf4NQ1nKeCAk8dbH6gS9kxm2vH5Ae4eNU/6qN2CBdiVDfHVS5K5rZ32aWtEocmr9VVCUvFuCk/0o8FGeJWPkemaqExEWUrn328JiBCY8HTTBqMpTsN34NGiUQztH2Cp+vUu78ZXOCPb4Qo1c2CJ8ev4YtP0cHJF72S3lYefbh3eBJ50jeSluVAPetS9T8YvSgH5QbmPK3+j97q12/0pC+FYwOviwBrFVN6tyw9vUzm8qTpRnSGSFMO/Enakiae4ZOK3O6fXyTaHgQq90A5Ha8SSSdLRdHbmvOuujBX7L/HhfgiVODe4NGiSjz+bAtUfP7PNQ2Dzo1YmNjwDQjdnvo3fm5udpqf8WYozN+QWxDCAvGZzDHP6MOPMB/xiGq3binEAtMJ2hGAPt5I3aLm+RH6UPQ1AgJzjl7kyJrOup8Pjjl+ku5HFnFoZMdRcNQbifUYBJ5ZmMnq4ZDfhbes0RzpcTnSmL4ltuz+rIHJJGIKNDZ35XZJHl71EijSXfUZ1Oyq3Lw30Fr3Cst5JK8RUvFeQQce+spERC5BamS5pofhVFTbwGNhJtmd9K0gIeZPHxz/Mam4JSPGVQDKkz9SOv3DH5oDm6MWwaTx7Z3FkY6fmSdasSdHucPr0V3F7Lcuat30GfxiJMC84me/3CudRdPww5c8r03MdCOVPVCbmsBp5RTp3N9U0RaiKUp9TwjIiLCQWwbv44fZ0XM629KCCMoRaC4DHLa0bWNgzYlk1qdF5xsDDavUWn4o0gnwuPLQ8KUwW6NzoD7JBAA5wQossefoi51NIhEh5FpVJLoflNEJOid6jFXiebp1n29KlWBJDvaMKpfAHXrFhLO197DrBGvwsqv8JTIkhdfJgUwsdMps36bwM6oDiBeg/3d2oCjSTrfeWFU7mMtmcnytHsjycrLBKnBF5UiVpedg0DCXq2O4ti+kY0=";

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