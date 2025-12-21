/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzY2ODExNjAxMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCb0LjRgdGC0L7QuiDQuCDRgNGD0YfQutCwPC9oMj5cbiAgICAgICAgICAgIDxwPtCd0LDQutC+0L3QtdGGINGC0L4g0YHQsdC+0YDQutCwINC/0LDQt9C70LAg0LTQsNGB0YIg0YDQtdC30YPQu9GM0YLQsNGCITxiciAvPjxiciAvPiBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAg0JjQvdGB0YLRgNGD0LrRhtC40Y8gPGEgaHJlZj1cIi9yLz9jPWNuYzlcIj7QutCw0Log0YDQsNC90YzRiNC1PC9hPiwg0L3QviDQv9C10YDQtdC0INGC0L7QsdC+0Lkg0L3QvtCy0YvQuSDQutC70Y7RhyDwn5+pPC9wPlxuICAgICAgICAiLAogICJzYWx0MSI6ICJkMjIwMGJmZGE4ODkyMGVhNjIxYWUwNzIyNjE5ZDQ2MzU1MTAyYzg2MjEwNTkwOWNkZDQ4MGU5NTFkZTYyNGYzIiwKICAic2FsdDIiOiAiZWJlYWE1Njg2NWQyNDczYTZlOGUzMzdjZjk5Y2E1NmExN2JkODE4YzlmMWViMDE2NWFmMGE4MWRmMGJlM2JlZSIsCiAgImNvcnJlY3RBbnN3ZXJIYXNoIjogIjMzNjc1NGI5NTQyN2Y1MmU1YTEyNGNlMDg4MWVjNWY3MDk4ZDJiZmJkMjZhZGFiODNlZmM4OWFlZGRkZjM3ZTYiLAogICJlbmNyeXB0ZWROZXh0U3RlcEh0bWxCNjQiOiAienlHVjdXZjZoTlp4UGVrS09mc2lEaUEvYlRQOWNYOG5zckxsYUljV2F6bTJ4WmFKQU5mZkJwZk1JQnc4cWlvNW12MjRoWXZXSDltY0YxRERmTDJDYWVYQVFPZjd1OGc3R1hDNVpVK2VpMnZhRnZCa3VWQktLNkdmMmF3OTRSMnloTGZPc1pybWkxOUs4SVpHdFRmTGVzbkFOWDQ2R0RyV1c0ejNQSkpqaHVuN0tPbDArOHAxUDhaVjVhZEZ3bnpZNWxUYzZxeTBJVnJjMmR5TXRZV1owQkhMTFd4U1U5bnoxVW9sUkJCS04wdWZObGxHS21md3hYR3I0clBPaFREV0g1enZRdzYvVzdkdlVrY0Jyd21UWHIrOHBFWHBIbEpYOUMwZmVNTXBJT2V3a0VqS0d2L0Vaejl0ZGRTNC9YUE1JQVVSdHU1b09kSFM1ZS8zK1NyU2lZTXVNSytHT0Q4RVlvUVFYSEhIdC9GM2NjeG9UWkN4dC9iSEl5eGJ0TU90VGVNZU4zeDk2Sm9ubGlIYnduM2pzbFlIZ2Q2OHZRbktldms0S1BONksvQ3d3c2drSzNtTTRZOUxqTk5pL0tFRnNaYTciCn0=",

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
