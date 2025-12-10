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
    const encryptedBase64 = "/gJQpaqAGH+yWiksWc3puP7SnubpWJgB9p/DE79+e3+nZt4k38Ok01dOX1pAwo82ayr3fDfFpwCBbp/24BDWYLbzJ+ue6ged2Xr/cTdeSZaGW8xMBvoYyIjXVTpLpxHKcyl/TfF5/xCleLxNq3X+/METCcRTJTZ6cxOOVyHRuVd6E92Z5VchjT0lf95RfkeaG/K018Fe3F0DOZMcUSfK/KO+sq6PrWLWr80wS/Hw4xVXPavs1PIZBjj0kDV0gRF18fB0zCuR3vBQbGWrfLEeG4NLOgeRpFprGaBSr/1MTl/8bTmjIqeAG8Yn+o4t1StcEfdMtiFA+TmLid4Pj5b8gJ9sL01im47d/6eLWLcnaanw6IGpGp8xFySxsz8oGRjKLUkmsJXpaxNouYMwvMYC2GBsIW4XMLaE8Dxjhft7JDolUUgQ30FzhjDhydF/vjezKBTa/WO4N9A74J7uDyt91431quVnYwj/18Tc76WG/eQRLkczVfeYts6/X4ulbzByMXc8suPEKhRoQzXYZKwq329zwfkMAEsVR2JrgpBhMA1nHJeEDDWQp5l91yUlu0TdY1udbB/x0SC57O0mBjiWz9GvZPVBlqtx6vVvL2pX5OJkbDEh67nBjSL9mqhvswlztBK2FzOuYEY+YYv4dpWmvBY9LK7h8NWKvsONEER+qM4pyMOvoE9UleRPH1xydiG/VXyHGxGjHifAiJWnmQHBP93PZFWh8PeRgOXPJQ2JURxCjtzFdkh7We1znZMWyT//X2Jw31y7+O0S/wZuJq7zWC2kSZDaAr/KKBOrRBvqbh4whInV8t6S3MgOdX/mgY9rcaxFBFKSZV1EHJtO+0qQIfSl5e69W6w4gvkKI078z38kOWyykTN0gBPsfp+AWlt26KsuKtblA5tuP+EGiIqseRflAad/PHDVGRVGgEXzJnQzUvLtJGaAu5OguKn10VlrH88sNLyip8gx293h0jAVh6W//lyUuItkJkw9TgVUG8kOgrXTMG8v5uPILIKEOsxl33L7aeXRzw3ot1Bcu+RDiJf4OKAXOt7oosEN3mWXuUff/4XE/g5cBKVb4+zgaVGCKlBeU002CrugKct4YaXv5Xms7+DF9YM8ODF4sqRlLzjgJPfbgY4EHlvCGvhcNji+k00X0ZzKhSs3Oh0uvAkUtgX77MxBprjgJhc0u4bHfJSe00GgWUVssLOaxrbxc7MC+aIfE0oWPnc+dbebqq+lhqN/5LobbPsrL08rBGFSLjNqsszuzzfSA8USXOdvEtHxyPax+NCodJFhPhrcPXbSwg1oRsRU8wnocxW2yR2U9HJnK0vGv8TnDL8g/QAwLCSq/SF8fdP6ZbJZQLtpPG/1Y0gS9SjoIfcpMq3l0TPRt5q2ExI6Zte/++dH00X9IHtCuzMttZN/9lZvsgSkbWGI/b4bxAbejJ1YGUaSSleMPepEaCeH8zZiHk5KrW4AfxiQ+j1rJH0v";

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