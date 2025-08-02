/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzU0NTc1MjAwMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCX0LDQtNCw0L3QuNC1ICMzPC9oMj5cbiAgICAgICAgICAgIDxwPtCd0LUg0LLRgdC1INC/0L7RgdC70LDQvdC40Y8g0L3QsNC/0LjRgdCw0L3RiyDRh9C10YDQvdC40LvQsNC80LguINCd0LXQutC+0YLQvtGA0YvQtSDQstGI0LjRgtGLLlxuXG7QotCy0L7QuSDRgdC70LXQtNGD0Y7RidC40Lkg0LrQu9GO0YcgLSDQvdCwINGB0LDQvNC+0Lwg0LrRgNCw0Y4gPGFiYnIgdGl0bGU9XCLwn5iBXCI+0LjQt9C00LXQu9C40Y88L2FiYnI+LiDQp9GC0L7QsdGLINC10LPQviDQv9GA0L7Rh9C10YHRgtGMLCDRgtC10LHQtSDQvdC1INC/0L7QvdCw0LTQvtCx0Y/RgtGB0Y8g0L3QuCDQvdC+0LbQvdC40YbRiywg0L3QuCDQuNCz0LvQsCwg0LAg0LvQuNGI0Ywg0Y/Qt9GL0LosINGA0L7QttC00LXQvdC90YvQuSDQtNC70Y8g0LzQvtGA0Y8g0Lgg0L3QvtCy0YvRhSDQstC+0LvQvTwvcD5cbiAgICAgICAgIiwKICAic2FsdDEiOiAiZTg3MGRkNjU4ZjRlNWUyNjJiNDU2YTYxZDYxNDUxYTY2MWJjZTM5YmU0ZGUyMTRkMDA1ZTZmYWU3ZWZlYThmNSIsCiAgInNhbHQyIjogIjcxNjVlNDYyZWZjNmMyODE5NzM2NDg5Y2RlN2YyMDNjYjc1ZjY3Y2UwNWQ2NzJkYjAyYjhlYTlmYzhkNDAxZDIiLAogICJjb3JyZWN0QW5zd2VySGFzaCI6ICIwMTZlYzRlOGE2MmZjMDNhMTM4MzcxMjk0MDY2NmQ4YjQxZmI2NGIzMDQyODBlMGUxODdiMjU1NWM2MmYzMmRkIiwKICAiZW5jcnlwdGVkTmV4dFN0ZXBIdG1sQjY0IjogImVIM1dqT3Q2MVNLK2Y4NGhidFpRMUpIR0E0Z0Z2VEhZdUVwTXliRDlGRWtrNU5WNHNhL1RUZ3gvc2swK2pFRmQyVWl4VE5ZQUNxY3RONk8yNStEOXc3cTVjSUJ0c2xFekZwLzRjakxNNE9wV1Zmd285bDB0SmlabEJCakRMZDZmMEllRG9jZ2tBdzFmcmxxcWxZWU92OWxoRVBhOWRYY2JTcmdGOHRQSEdla0JlUmZtNU5raFFMalpaaXdZTTEwN2lBRnp4bWdZT2dEeE1KblM1QTdQREROK1htcUtNZ0J3eWtBKyIKfQ==",

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
