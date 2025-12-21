/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzY2Njg5MjAxMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgxPtCU0LAsINC/0YDQuNCy0LXRgiE8L2gxPlxuICAgICAgICAgICAgPHA+0K8g0L/RgNC40LzQtdC90LjQuyDQvtGB0L7QsdGL0LUg0YLQtdGF0L3QvtC70L7Qs9C40Lgg0YfRgtC+0LHRiyDRjdGC0LAg0L/QvtGB0YvQu9C60LAg0L/QvtC/0LDQu9CwINC6INGC0LXQsdC1LjxiciAvPlxuICAgICAgICAgICAg0KLRiyDQvNC+0LbQtdGI0Ywg0L/RgNC10LTQv9C+0LvQvtC20LjRgtGMINGH0YLQviDRjdGC0L4g0LHRi9C70LggPGEgaHJlZj1cImh0dHBzOi8veW91dHUuYmUvSE11WWZTY0dwYkVcIiB0YXJnZXQ9XCJfYmxhbmtcIj4g8J+StSA8L2E+INC4INCx0YPQtNC10YjRjCDRh9Cw0YHRgtC40YfQvdC+INC/0YDQsNCy0LAhPGJyIC8+XG4gICAgICAgICAgICDQndC+INGB0YPRgtGMINC60YDQvtC10YLRgdGPINCyINC00YDRg9Cz0L7QvCwg0L3QtdC80L3QvtCz0L4g0LHQvtC70LXQtSDQv9GL0LvRjNC90L7QvCDQuCDQtNGA0LXQstC90LXQvCDQvNCw0LPQuNGH0LXRgdC60L7QvCDRgdC/0L7RgdC+0LHQtTxiciAvPlxuICAgICAgICAgICAg0J7RgtCy0LXRgiDQt9C90LDQtdGI0Ywg0YLQvtC70YzQutC+INGC0Ysg8J+YiVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAiLAogICJzYWx0MSI6ICI2MTEwYjRjNWNjNDgxMzZiYWYxYTEyZmZhOTcyYjFiMjY5NmI2MDg3ZTgwZjNiZjhlZDI5Mjk4MDk2MjlkY2ZmIiwKICAic2FsdDIiOiAiMTI3N2Q0ZmJlYmJjZDRhMWQyNzJkOWNlMzEwN2Y0MTJjYzNjMDcxY2M2YzFkYjFiNTk3NGIyMzIyMmU5YjkzMCIsCiAgImNvcnJlY3RBbnN3ZXJIYXNoIjogIjI4ZjljZTY0NGE5ZDQ0OGMwODU1YjY5NTMxNjliMzI5YmRiZGQ3NGMzOTU5YWQ1NGQxMmE3MjhjYmVhYWIyYTUiLAogICJlbmNyeXB0ZWROZXh0U3RlcEh0bWxCNjQiOiAiQXpJbFRkT20zZnRDU3Y3NmY4b3VHcTNqbTF0WmJEQnhQK3VaSjdRKzloRFoyMGNCUjNzSWtKRFZMdGJQalBpRkkxc0Iwc3I0VEg2VEF0TVljdTI4dTc5MWdocjVxazdJUGdyeUNCKzlhTWZ2WkpoN0w0Vm0zVVkxakdPSmN1MlUzeWQ5Q2NYQ0R4enlTL1RiZDVFRDQzUVhZbXJnR1Q5Wm01dFdCMm5IdUczdzhEYVUvcTJvOGQxZFNyYXFKdVM4U1N5MkhVYW1JSmM5L0ttbFR1ay84cWM4WVo2YlJRNXoxMjJPMnNZMWhPTTlpZjYzMTBnMWRHdlJRYnJ3V3U1MjF3YW1iOHBDbXBHODR4eUZVZU13R2cxVU1taE1YdEgvTG5Ka1lRM2JzTDY3QmliYkRSbjJOeUtmcVdRaVU0TDE0M3o0STc2c0VSekVieG1rMENQMS9FcTlRZz09Igp9",

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
