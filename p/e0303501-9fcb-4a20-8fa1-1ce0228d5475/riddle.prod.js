/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzU1MTgwMDAwMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCX0LDQtNCw0L3QuNC1ICMxMDwvaDI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICDQmNGB0YLQuNC90L3Ri9C5INGD0LfQvtGAINC+0YLQutGA0L7QtdGC0YHRjywg0LXRgdC70Lgg0L/QvtGB0LzQvtGC0YDQtdGC0Ywg0L3QtSDQndCQINC00LjRgdC6LCDQsCDQodCa0JLQntCX0Kwg0L3QtdCz0L4uINCf0L7Qt9Cy0L7Qu9GMINGB0LLQtdGC0YMg0L/RgNC+0LnRgtC4INGH0LXRgNC10Lcg0L3QtdCz0L4sINC4INC+0L0g0L3QsNGA0LjRgdGD0LXRgiDQsiDRgtCy0L7QuNGFINCz0LvQsNC30LDRhSDRhNC40L3QsNC70YzQvdGL0Lkg0L7QsdGA0LDQty48YnIgLz5cbtCt0YLQvtGCINC+0LHRgNCw0LcgLSDQstC10L3QtdGGINCy0YHQtdCz0L4g0LrQstC10YHRgtCwLiDQotC10LHQtSDQvtGB0YLQsNC70L7RgdGMINC70LjRiNGMINGD0LfQvdCw0YLRjCDQtdCz0L4g0LjQvNGPLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAiLAogICJzYWx0MSI6ICJjYTJhOTUzYjU0OWQxOGZkMjUwYzhjZWJjNDhjM2ZmNjYzNTkyZTg5Yzk3NGYzMTgyMzE2NTYzZmZmNDg3MTY1IiwKICAic2FsdDIiOiAiZmU5Mzk1ZWU4YjQyNWExNzYzNGQwZjIwMGRiNDNjMjkyMmQ4YzQ2NTc3MGZkMTI0MzRkZTIzYzljNDk4NWFkMyIsCiAgImNvcnJlY3RBbnN3ZXJIYXNoIjogIjllYzdlYTQ1MWIzNDVkNTUxODljMTRkNzEwYWQxZjhmZWJmMGFkNmE1YzQ1ZjZmOGRhYjlmMzdkYjIxYTk4NzUiLAogICJlbmNyeXB0ZWROZXh0U3RlcEh0bWxCNjQiOiAiU01va3RnWk5GaFQvYmFpMUVIRVVqTHRpaDdCMDlRVDJmcUJURS9WK2w2NC9nb3NxY0s3ckZxOGQvVEhlcVUvN2oyMDVwbEZReUh4ZXBXRWU3OW1QZGhqNHFCbUpJL1JQcG9GTUhaUFB5UThDaXk1cDlPTDRBTEFuUFRHR2M5Y3JSZm0zdWJ5THRrVW1mTktxalpLU3lVMVAvek9Nd3ZLc2FRRTRpa2xEdTVtaDJ0QU1wU3hrQjV6aC9rUm1MRzlMcFJ5UVhwZWFyRWpzdFlHV3BFYWkzdzN6TWdFK0VOMUFvcnMvS3V6KzJCa3RJbnBqaldRZk8xSmNMV29HVUpjcXl0OG9EVWltWDVtN25GeE5WODVUR1AvQllObHpVU2JodGVMVTZ5UXFZT0htNUg3a1RuL29RU21FQ1ZmTEEyUmMrbEFobE5HNWtyaUtxK3l5WjRkQmE2YlUxN1V4Y0UxUDRMa0FaYWlxYmtZT0d3aS9IQ0lOY2lMaUlobk9JaE4zVER3UmszeCszTDVXcmNPWXdSREdoWXUveUpua2N2VzNnRmJnTkk3MllYTy9qK2ZYY29jTTBlNHZic1JoR3JLTUFKSWFLZG9RSzB0bmNSTEVPZGdwYktuZGpUa2NTU240cXp5VTBHU1NvWFY0Rkp1Qys4RytLWHNGVVJBeTRRbis0NkRRYXVvYW1FWUJOMlEvcWN6SGIxa2Zlb2JYNnhRN0FmbjVVdjBwMnFCRGNUMW5YZkZ6NTlKelJiZWp0ZWV0NXhoRHhodlFjOUtvcFkxOHQ3aUFXUzd6TTA1QSIKfQ==",

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
