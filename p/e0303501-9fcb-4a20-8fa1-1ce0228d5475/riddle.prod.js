/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzUyMzM4MjIwMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCX0LDQtNCw0L3QuNC1ICMxMDwvaDI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICDQmNGB0YLQuNC90L3Ri9C5INGD0LfQvtGAINC+0YLQutGA0L7QtdGC0YHRjywg0LXRgdC70Lgg0L/QvtGB0LzQvtGC0YDQtdGC0Ywg0L3QtSDQndCQINC00LjRgdC6LCDQsCDQodCa0JLQntCX0Kwg0L3QtdCz0L4uINCf0L7Qt9Cy0L7Qu9GMINGB0LLQtdGC0YMg0L/RgNC+0LnRgtC4INGH0LXRgNC10Lcg0L3QtdCz0L4sINC4INC+0L0g0L3QsNGA0LjRgdGD0LXRgiDQsiDRgtCy0L7QuNGFINCz0LvQsNC30LDRhSDRhNC40L3QsNC70YzQvdGL0Lkg0L7QsdGA0LDQty48YnIgLz5cbtCt0YLQvtGCINC+0LHRgNCw0Lcg4oCUINCy0LXQvdC10YYg0LLRgdC10LPQviDQutCy0LXRgdGC0LAuINCi0LXQsdC1INC+0YHRgtCw0LvQvtGB0Ywg0LvQuNGI0Ywg0YPQt9C90LDRgtGMINC10LPQviDQuNC80Y8uXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICIsCiAgInNhbHQxIjogImNhMmE5NTNiNTQ5ZDE4ZmQyNTBjOGNlYmM0OGMzZmY2NjM1OTJlODljOTc0ZjMxODIzMTY1NjNmZmY0ODcxNjUiLAogICJzYWx0MiI6ICJmZTkzOTVlZThiNDI1YTE3NjM0ZDBmMjAwZGI0M2MyOTIyZDhjNDY1NzcwZmQxMjQzNGRlMjNjOWM0OTg1YWQzIiwKICAiY29ycmVjdEFuc3dlckhhc2giOiAiOWVjN2VhNDUxYjM0NWQ1NTE4OWMxNGQ3MTBhZDFmOGZlYmYwYWQ2YTVjNDVmNmY4ZGFiOWYzN2RiMjFhOTg3NSIsCiAgImVuY3J5cHRlZE5leHRTdGVwSHRtbEI2NCI6ICJzVnRUSm16NFhrZDByU1ZRd2hGMmNPL2xUREcxN0RGWmpLdXI1d1V2cDkxUkFzUURaQ2ZDclJVMFFuczdUeDBMUys0VU1PR21na1hMcjBscDVBMlJSRXFiV25mdkdLL2tXYk4wV3dkODdFMm16TFdtVU9CckZiZ1ZJWXVQdi85TWxwL2ZMd1U4RGtRMENvWllZaVA2OUVwblZyT1M0OHlPR3BaNGd4NVdKazMzZ0k0WVZ1MDVpTlBNcXVYWjdSbVVYakE2eTF5VWY5MVBXcVlvY2FQdFZ3MTQyS0hhdHdCSDRPZTFLSGRBNHZjclhPdi9la1h5K0dHczRsN2s5dlpOU3VZc0hHUHhoQklJZDJoeGwwMjdTSWRpK0VTdmMvK21XbE1ocWxnRnorRXlEYkdHTFNXQmNGSzNwSVlMQUFvSmVFZCtiRXRZS1ZseE5udmgrRjRUZXU4ZGNRbzdjRTg5M1RjUlFRbmtEL3JuQXJzVVk3Y1V6YlVNbDBLMlp2by96N1d5bVlIeld4dno2Y3RKK2hhSjZUMEpsZldtZXdiV05aNnFGWlZMYXhkR09iUVQwZ0xhY1p4d2Vjc2pNNnpscjd4UUhJRGVnVnlaUnRWSkZVM3NGSmVZWnB3cXo5U1Y1RFlaOVp3VXJ6dDhlY1dBNkpWL0d0L3U3Z3FXZkYzU1dCbmJrdWFwd2lvWWZUWmNqcDV1dWhnT3FGOWQyRE9UK2ozcDRoQmlvVHNUR0p5SFdvSW5RMjl4VFQ4QnltRW05WWpUREZWRWYyNTk4ZzNiaXpLckg1eTBXZTl5bzhvQVg4RlNCWTFUcjNrVHRRM3V1MWI3bFZSdVk4UVdiSHFnc0Q1NmxRPT0iCn0=",

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
