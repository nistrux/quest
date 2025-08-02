/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzU1MDkzNjAwMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCX0LDQtNCw0L3QuNC1ICM5PC9oMj5cbiAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgINCd0LXQutC+0YLQvtGA0YvQtSDQv9GD0YLQtdGI0LXRgdGC0LLQuNGPINCy0LjQtNC90Ysg0LvQuNGI0Ywg0YHQtdGA0LTRhtC10LwuINCt0YLQvtGCINC/0YPRgtGMIC0g0L7QtNC40L0g0LjQtyDQvdC40YUuXG4gICAgICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgICAgINCn0YLQvtCx0Ysg0YPQstC40LTQtdGC0Ywg0YHQutGA0YvRgtC+0LUsINC/0YDQvtCy0LXQtNC4INC90LXQsdC+0LvRjNGI0L7QuSDRgNC40YLRg9Cw0LsuINCS0L7Qt9GM0LzQuCA8YWJiciB0aXRsZT1cIiYjMTI4OTk0O1wiPtC30LXQu9C10L3QvtC1INGB0LXRgNC00YbQtTwvYWJicj4g0Y3RgtC+0Lkg0LPQvtC70L7QstC+0LvQvtC80LrQuCDQuCDQv9C+0LvQvtC20Lgg0LXQs9C+INC90LAg0YHQstC10YLQu9GL0Lkg0YTQvtC9LlxuICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICDQn9GD0YHRgtGMINC10LPQviDQv9C10YDQstCw0Y8g0LHRg9C60LLQsCAoJ9CQJykg0LfQsNC50LzQtdGCINCy0YvRgdGI0YPRjiDRgtC+0YfQutGDINC90LAg0Y3RgtC+0Lwg0YbQuNGE0LXRgNCx0LvQsNGC0LUsINC60LDQuiDQs9C70LDQstC90YvQuSDRgdC40LzQstC+0Lsg0LIg0YDQuNGC0YPQsNC70LUuXG4gICAgICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgICAgINCa0L7Qs9C00LAg0LLRgdC1INCx0YPQtNC10YIg0LPQvtGC0L7QstC+LCDQuNGB0L/QvtC70YzQt9GD0Lkg0LzQsNCz0LjRjiA8YSBocmVmPVwiL3IvP2M9aGpmbVwiPtC+0YLRgdGO0LTQsDwvYT4gKNGA0LDQt9GA0LXRiNC4INC4INC10Lkg0L/QvtGB0LzQvtGC0YDQtdGC0Ywg8J+YiSkg0L3QsCDRgNCw0YHRgdGC0L7Rj9C90LjQuCDQu9Cw0LTQvtC90LguINCS0LfQs9C70Y/QvdC4INGH0LXRgNC10Lcg0L3QtdC1LCDQuCDQvtC90LAg0L7RgtC60YDQvtC10YIg0YLQtdCx0LUg0LjRgdGC0LjQvdC90L7QtSDQvdCw0L/RgNCw0LLQu9C10L3QuNC1LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAiLAogICJzYWx0MSI6ICI5ZDM3ZTAyNzE4YjZlNzQ0NTAzOTcyNWVlMjVhMDY3ZjRiMzA1MzZmYWRmNDE1NTk4OGFhYjRiYjQ3MDM4YWQzIiwKICAic2FsdDIiOiAiYTdmODZiNzI3OGUyNjg5ZmQzNzQ0NDEwN2I2NDI3YzIwMTg5ZTI4MTU5YTM3OTExMmQyN2I2Y2EwZGI0MjhkNSIsCiAgImNvcnJlY3RBbnN3ZXJIYXNoIjogImQ4YTAwODk0MTZlMmJiYzVlZmRkYzU0OWY1MmI2ZDFlNTFlZmE3ODRlZGY0NDAxM2FhODAzMGFhNWYxZWU0MTYiLAogICJlbmNyeXB0ZWROZXh0U3RlcEh0bWxCNjQiOiAidUI2OEpSekpJdnRWT0crNWdLZEtxOU9wcFZwMDlVdGVLMW5xVmxmbDF3ZjlOcDdielNaRXJ3eHlpN0tXdVpaRWFoS3NPQ0xPSlk1My8vbEs2V0k4c0hEMmJZempKQnZ0SEZsUkQxaXlMVGVKRGpHWGJVbEJ0am1sMEREVGZJSWFaWk5La2tLbmZwbnVIRWpvcnk1U3VJYmxZd1J4WlZhM3ZzTnVKZ2FlK1dGc0EwWVY3algxd1FsVGxZZ2I0V2k1cnVHT3FEbjI3UW9NRWNUMUxLajRCdkRsOXh5MVRnbGFJcFROMnhqcmZDUnl5emwwdjk0Y3hjR0dQSHpHZDZaZXRPclhDak1oVDdWNVR2Q3l1R2txTEVJPSIKfQ==",

    elements: {
        container: null,
    },

    state: {
        data: null, // Здесь будет храниться расшифрованный объект
        countdownInterval: null,
    },

    /**
     * Helper to correctly decode Base64 to Unicode strings
     */
    b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    /**
     * Инициализация приложения
     */
    init() {
        this.elements.container = document.getElementById('riddle-container');
        if (!this.elements.container) {
            console.error("Контейнер #riddle-container не найден!");
            return;
        }

        try {
            // 1. Декодируем основной payload из Base64 в JSON, используя Unicode-safe функцию
            const decodedJson = this.b64DecodeUnicode(this.DATA_PAYLOAD_B64);
            this.state.data = JSON.parse(decodedJson);
            // 2. Проверяем дату и решаем, что отображать
            this.checkDateAndRender();
        } catch (error) {
            this.elements.container.innerHTML = `<p style="color: red;">Ошибка загрузки задания: ${error.message}</p>`;
            console.error(error);
        }
    },

    /**
     * Проверяет дату и решает, что отображать: таймер или загадку
     */
    checkDateAndRender() {
        if (this.state.countdownInterval) {
            clearInterval(this.state.countdownInterval);
            this.state.countdownInterval = null;
        }
        // Создаем дату из числового timestamp - это самый надежный способ
        const unlockDate = new Date(this.state.data.unlockTimestampUTC);
        const now = new Date();

        if (now < unlockDate) {
            this.renderTimer(unlockDate);
        } else {
            this.renderRiddle();
        }
    },

    /**
     * Отображает таймер обратного отсчета
     */
    renderTimer(unlockDate) {
        const formattedDate = unlockDate.toLocaleString(undefined, {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        });

        this.elements.container.innerHTML = `
            <div class="timer-container">
                <h2>Это задание еще не доступно</h2>
                <p>Осталось до открытия:</p>
                <div id="countdown-timer">--:--:--:--</div>
                <p id="unlock-date">Задание откроется: ${formattedDate}</p>
            </div>
        `;

        const timerEl = document.getElementById('countdown-timer');
        const updateCountdown = () => {
            const now = new Date();
            const totalSeconds = Math.floor((unlockDate - now) / 1000);

            if (totalSeconds < 1) {
                // ИСПРАВЛЕНО: Прямо останавливаем таймер и отображаем загадку, чтобы избежать рекурсии.
                clearInterval(this.state.countdownInterval);
                this.state.countdownInterval = null;
                this.renderRiddle();
                return;
            }
            const days = Math.floor(totalSeconds / 3600 / 24);
            const hours = Math.floor(totalSeconds / 3600) % 24;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const seconds = totalSeconds % 60;
            timerEl.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };
        updateCountdown();
        this.state.countdownInterval = setInterval(updateCountdown, 1000);
    },

    /**
     * Отображает саму загадку и форму для ответа
     */
    renderRiddle() {
        // HTML теперь в открытом виде, декодировать его отдельно не нужно
        const riddleHtml = this.state.data.riddleHtml;
        this.elements.container.innerHTML = `
            <div class="riddle-container">
                <div class="riddle-content">${riddleHtml}</div>
                <div class="answer-form">
                    <input type="text" id="answer-input" placeholder="Введите ваш ответ...">
                    <button id="check-answer-btn">Проверить</button>
                </div>
                <div id="feedback-container"></div>
            </div>
        `;
        document.getElementById('check-answer-btn').addEventListener('click', () => this.checkAnswer());
        document.getElementById('answer-input').addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.checkAnswer();
            }
        });
    },

    /**
     * Проверяет ответ пользователя
     */
    async checkAnswer() {
        const btn = document.getElementById('check-answer-btn');
        const input = document.getElementById('answer-input');
        const feedbackContainer = document.getElementById('feedback-container');

        btn.classList.add('loading');
        btn.disabled = true;
        feedbackContainer.innerHTML = '';

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const normalizedAnswer = input.value.toUpperCase().replace(/[^А-ЯЁ0-9]/g, '');
            const stringToHash = this.state.data.salt1 + normalizedAnswer;
            const answerHash = await this.sha256(stringToHash);

            if (answerHash === this.state.data.correctAnswerHash) {
                // Ответ верный, генерируем ключ для расшифровки
                const decryptionKeyString = this.state.data.salt1 + normalizedAnswer + this.state.data.salt2;
                const decryptionKey = await this.deriveKey(decryptionKeyString);

                // Расшифровываем следующий шаг
                const encryptedData = new Uint8Array(atob(this.state.data.encryptedNextStepHtmlB64).split('').map(c => c.charCodeAt(0)));
                const iv = encryptedData.slice(0, 12);
                const data = encryptedData.slice(12);
                const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await crypto.subtle.importKey("raw", decryptionKey, "AES-GCM", true, ["decrypt"]), data);
                const nextStepHtml = new TextDecoder().decode(decrypted);

                // Отображаем результат
                this.elements.container.innerHTML = `<div class="riddle-container"><div class="unlocked-content">${nextStepHtml}</div></div>`;
            } else {
                feedbackContainer.innerHTML = `<p class="feedback-message error">Неверно. Попробуйте еще раз.</p>`;
            }
        } catch (error) {
            feedbackContainer.innerHTML = `<p class="feedback-message error">Ошибка проверки: ${error.message}</p>`;
        } finally {
            if (document.contains(btn)) {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        }
    },

    // --- Криптографические утилиты ---
    async deriveKey(keyString) {
        const data = new TextEncoder().encode(keyString);
        return await crypto.subtle.digest('SHA-256', data);
    },
    async sha256(str) {
        const key = await this.deriveKey(str);
        return Array.prototype.map.call(new Uint8Array(key), x => (('00' + x.toString(16)).slice(-2))).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => RiddleApp.init());
