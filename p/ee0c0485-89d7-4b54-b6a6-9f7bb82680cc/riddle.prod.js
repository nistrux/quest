/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzU0OTIwODAwMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCX0LDQtNCw0L3QuNC1ICM3PC9oMj5cbiAgICAgICAgICAgIDxwPjxhYmJyIHRpdGxlPVwi0L7Rh9C10YDQtdC00L3QvtC1LCDQtNCwLCDQvdC+INGC0LXQsdC1INCy0LXQtNGMINC/0L7QvdGA0LDQstC40LvQvtGB0Yw/XCI+0JjRgdC/0YvRgtCw0L3QuNC1PC9hYmJyPiDQvdCwINGC0LXRgNC/0LXQvdC40LUg0L/RgNC+0LnQtNC10L3QviDwn5iB8J+YgfCfmIEg0KLQtdC/0LXRgNGMINC80L7QttC90L4g0LfQsNCz0LvRj9C90YPRgtGMINC30LAg0LrRg9C70LjRgdGLLjxiciAvPlxu0KHQvdC40LzQuCDQstGB0LUg0YjQstGLIC0g0YHQsNC80L7QtSDQuNC90YLQtdGA0LXRgdC90L7QtSDQttC00ZHRgiDQstC90YPRgtGA0LguPGJyIC8+XG7QntGC0LLQtdGCINC90LDQv9C40YHQsNC9INGH0LXRgNC90YvQvCDQv9C+INCx0LXQu9C+0LzRgyE8L3A+XG4gICAgICAgICIsCiAgInNhbHQxIjogImUxZDRmYzJiZWQ1ZDZlOGQ3MjRlYTAzMjU2Zjk4MTJhODUxYmFmNTBlYjI3ZDcwZjQ2YWY1YmI1YTczNzdlOTMiLAogICJzYWx0MiI6ICI2NzlmZmFlNDZkZjg0NzNiOTcxNGU3NTRhYjM1Y2NkZWJlMTE4NGU2NWYzOGVlZmQ0ODM0MWY4YWRlYTNiNDVmIiwKICAiY29ycmVjdEFuc3dlckhhc2giOiAiYTMzOGZmYTUxMTcwYzZhZjQ3ZTBiZjRjNjE1ODIxMzVkMzgyMjFhMWFhYjc2ZmYxNWI3ZGM0NTA5YTgyODNkMSIsCiAgImVuY3J5cHRlZE5leHRTdGVwSHRtbEI2NCI6ICJkMktQbVhCYUVWQklUbUptLzRMejRaRXhBcUU4NnFsc1BLVnpTbnJQUFA5UUtEU1FsMWRQSDg3QmRkeDgxc0ErTVAwbjIrUVhWekxXUXFBTnRDVnB6VlBQYXVnb0tkZGd4dE1EZ3NueFFvZVRIR0sxQ2dMTW82bG5GMjVZeDQ1RVNsT1c5VGpZcFFtdVJUakhaUXBJTU1EbTcwcDlPdy81YTVHb3RRVmhVaitXdGkxdGt2T2lBcVdIeEQySmRRL3dtQ2pZVjdFRk5GRUZCcWxVQ3BYL1VYQS9DNHY3NkRQSnpXd1ViVWlSSFFrNVJablZnRVMwdy9nbkFsZlB2QVE9Igp9",

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
