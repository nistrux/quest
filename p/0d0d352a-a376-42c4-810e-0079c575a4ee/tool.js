document.addEventListener('DOMContentLoaded', () => {
    // --- Получение элементов DOM ---
    const alphabetInput = document.getElementById('alphabet-input');
    const plainTextInput = document.getElementById('plain-text');
    const keyTextInput = document.getElementById('key-text');
    const cipherTextInput = document.getElementById('cipher-text');
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const generateKeyBtn = document.getElementById('generate-key-btn');
    const charWarning = document.getElementById('char-warning');
    // ИЗМЕНЕНИЕ: Получаем новую кнопку
    const findKeyBtn = document.getElementById('find-key-btn');

    const IGNORE_CHARS = '.,-!?()[]{}<>:;"\' \n\r\t'; // Символы, которые нужно игнорировать при проверке

    /**
     * Нормализует текст: приводит к верхнему регистру, убирает лишние символы.
     */
    function normalizeText(text, alphabet) {
        const upperAlphabet = alphabet.toUpperCase();
        return text
            .toUpperCase()
            .replace(/Ё/g, 'Е')
            .split('')
            .filter(char => upperAlphabet.includes(char))
            .join('');
    }

    /**
     * Генерирует случайный ключ на основе длины нормализованного текста.
     */
    function generateRandomKey() {
        const alphabet = alphabetInput.value.toUpperCase();
        const normalizedText = normalizeText(plainTextInput.value, alphabet);
        const textLength = normalizedText.length;

        if (textLength === 0) {
            alert('Сначала введите текст в первое поле, чтобы определить длину ключа.');
            return;
        }

        let newKey = '';
        for (let i = 0; i < textLength; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            newKey += alphabet[randomIndex];
        }
        keyTextInput.value = newKey;
    }

    /**
     * Проверяет наличие нешифруемых символов в тексте.
     */
    function checkForInvalidChars() {
        const text = plainTextInput.value;
        const alphabet = alphabetInput.value.toUpperCase();
        const ignoreList = IGNORE_CHARS + alphabet;

        const invalidChars = new Set();
        for (const char of text.toUpperCase()) {
            if (!ignoreList.includes(char)) {
                invalidChars.add(char);
            }
        }

        if (invalidChars.size > 0) {
            charWarning.textContent = `В тексте есть нешифруемые символы: ${[...invalidChars].join(', ')}`;
            charWarning.style.display = 'block';
        } else {
            charWarning.style.display = 'none';
        }
    }

    /**
     * Основная функция шифрования/дешифрования.
     */
    function process(inputText, key, isDecrypt) {
        const alphabet = alphabetInput.value.toUpperCase();
        const alphabetLen = alphabet.length;

        const cleanText = normalizeText(inputText, alphabet);
        const cleanKey = normalizeText(key, alphabet);

        if (cleanText.length === 0 || cleanKey.length === 0) {
            alert('Текст и ключ не могут быть пустыми после очистки!');
            return '';
        }

        let result = '';
        for (let i = 0; i < cleanText.length; i++) {
            const textCharIndex = alphabet.indexOf(cleanText[i]);
            const keyCharIndex = alphabet.indexOf(cleanKey[i % cleanKey.length]);

            let newIndex;
            if (isDecrypt) {
                newIndex = (textCharIndex - keyCharIndex + alphabetLen) % alphabetLen;
            } else {
                newIndex = (textCharIndex + keyCharIndex) % alphabetLen;
            }
            result += alphabet[newIndex];
        }
        return result;
    }

    /**
     * ИЗМЕНЕНИЕ: Новая функция для подбора ключа.
     * Находит ключ, зная шифротекст и исходный текст.
     */
    function findKey() {
        const alphabet = alphabetInput.value.toUpperCase();
        const alphabetLen = alphabet.length;

        const cleanCipherText = normalizeText(cipherTextInput.value, alphabet);
        const cleanPlainText = normalizeText(plainTextInput.value, alphabet);

        if (cleanCipherText.length === 0 || cleanPlainText.length === 0) {
            alert('Шифротекст и исходный текст не могут быть пустыми!');
            return;
        }

        if (cleanCipherText.length !== cleanPlainText.length) {
            alert('Для подбора ключа длина шифротекста и исходного текста после очистки должна совпадать.');
            return;
        }

        let foundKey = '';
        for (let i = 0; i < cleanCipherText.length; i++) {
            const cipherCharIndex = alphabet.indexOf(cleanCipherText[i]);
            const plainCharIndex = alphabet.indexOf(cleanPlainText[i]);

            // Формула: Key = (Cipher - Plain) mod N
            const keyCharIndex = (cipherCharIndex - plainCharIndex + alphabetLen) % alphabetLen;
            foundKey += alphabet[keyCharIndex];
        }
        keyTextInput.value = foundKey;
    }

    // --- Назначение обработчиков событий ---
    plainTextInput.addEventListener('input', checkForInvalidChars);
    generateKeyBtn.addEventListener('click', generateRandomKey);

    encryptBtn.addEventListener('click', () => {
        const result = process(plainTextInput.value, keyTextInput.value, false);
        cipherTextInput.value = result;
    });

    decryptBtn.addEventListener('click', () => {
        const result = process(cipherTextInput.value, keyTextInput.value, true);
        plainTextInput.value = result;
        checkForInvalidChars();
    });

    // ИЗМЕНЕНИЕ: Назначаем обработчик на новую кнопку
    findKeyBtn.addEventListener('click', findKey);
});