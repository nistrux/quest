/**
 * RiddleApp: Production Logic
 * Handles displaying and checking the riddle.
 */
const RiddleApp = {
    DATA_PAYLOAD_B64: "ewogICJ1bmxvY2tUaW1lc3RhbXBVVEMiOiAxNzU1MDA3MjAwMDAwLAogICJyaWRkbGVIdG1sIjogIlxuICAgICAgICAgICAgPGgyPtCX0LDQtNCw0L3QuNC1ICM4PC9oMj5cbiAgICAgICAgICAgIDxoND7QoNCw0YHRiNC40YTRgNC+0LLQutCwINCy0L3Rg9GC0YDQtdC90L3QuNGFINCx0LvQvtC60L7QsiAmIzEyODUyMDs8L2g0PlxuICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPG9sIGNsYXNzPVwibGlzdC1kZWNpbWFsIGxpc3QtaW5zaWRlIHNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj7QndCw0YHRgtGA0L7QudC60LAg0LTQuNGB0LrQvtCyLjwvYj4g0JLQvtC30YzQvNC4IDxzdHJvbmc+0L/QtdGA0LLRg9GOPC9zdHJvbmc+INCx0YPQutCy0YMg0LjQtyA8c3Ryb25nPiYjMTI5MDAxOyDQt9C10LvQtdC90L7Qs9C+INCx0LvQvtC60LA8L3N0cm9uZz4gKNC60LvRjtGH0LApLiDQndCw0LnQtNC4INGN0YLRgyDQsdGD0LrQstGDINC90LAgPHN0cm9uZz4mIzk4OTk7INCy0L3QtdGI0L3QtdC8LCDRh9C10YDQvdC+0Lwg0LTQuNGB0LrQtTwvc3Ryb25nPi4g0KLQtdC/0LXRgNGMINC/0L7QstC10YDQvdC4IDxzdHJvbmc+JiMxMjg5OTQ7INCy0L3Rg9GC0YDQtdC90L3QuNC5LCDQt9C10LvQtdC90YvQuSDQtNC40YHQujwvc3Ryb25nPiDRgtCw0LosINGH0YLQvtCx0Ysg0LXQs9C+INCx0YPQutCy0LAgPHN0cm9uZz7Cq9CQwrs8L3N0cm9uZz4g0YHQvtCy0L/QsNC70LAg0YEg0Y3RgtC+0Lkg0LHRg9C60LLQvtC5INC60LvRjtGH0LAuXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxiPtCf0L7QuNGB0Log0LHRg9C60LLRiy48L2I+INCS0L7Qt9GM0LzQuCA8c3Ryb25nPtC/0LXRgNCy0YPRjjwvc3Ryb25nPiDQsdGD0LrQstGDINC40LcgPHN0cm9uZz4mIzExMDM1OyDRh9C10YDQvdC+0LPQviDQsdC70L7QutCwPC9zdHJvbmc+ICjQv9C+0YHQu9Cw0L3QuNGPKS4g0J3QsNC50LTQuCDQtdGRINC90LAgPHN0cm9uZz4mIzk4OTk7INCy0L3QtdGI0L3QtdC8LCDRh9C10YDQvdC+0Lwg0LTQuNGB0LrQtTwvc3Ryb25nPi5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGI+0KfRgtC10L3QuNC1INGB0LXQutGA0LXRgtCwLjwvYj4g0J/QvtGB0LzQvtGC0YDQuCwg0LrQsNC60LDRjyDQsdGD0LrQstCwINC90LAgPHN0cm9uZz4mIzEyODk5NDsg0LLQvdGD0YLRgNC10L3QvdC10LwsINC30LXQu9C10L3QvtC8INC00LjRgdC60LU8L3N0cm9uZz4g0L7QutCw0LfQsNC70LDRgdGMINC/0YDRj9C80L4g0L3QsNC/0YDQvtGC0LjQsi4g0K3RgtC+INC4INC10YHRgtGMINC/0LXRgNCy0LDRjyDQsdGD0LrQstCwINGA0LDRgdGI0LjRhNGA0L7QstCw0L3QvdC+0LPQviDRgdC+0L7QsdGJ0LXQvdC40Y8hINCX0LDQv9C40YjQuCDQtdGRLlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGI+0J/RgNC+0LTQvtC70LbQsNC5INCyINGC0L7QvCDQttC1INC00YPRhdC1ITwvYj4g0KfRgtC+0LHRiyDRgNCw0YHRiNC40YTRgNC+0LLQsNGC0Ywg0LLRgtC+0YDRg9GOINCx0YPQutCy0YMsINC/0L7QstGC0L7RgNC4INCy0YHRkSDRgSDRgdCw0LzQvtCz0L4g0L3QsNGH0LDQu9CwLCDQvdC+INGD0LbQtSDRgdC+IDxzdHJvbmc+0LLRgtC+0YDRi9C80Lg8L3N0cm9uZz4g0LHRg9C60LLQsNC80Lgg0LjQtyDQvtCx0L7QuNGFINCx0LvQvtC60L7Qsi5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L29sPlxuICAgICAgICAgICAgICAgIDxpPijQv9GA0LjQu9Cw0LPQsNGC0LXQu9GM0L3QvtC1LCDQvC7RgC4sINC10LQu0YcuLCDQuNC8LtC/Lik8L2k+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICIsCiAgInNhbHQxIjogIjQxYjdkMGI3MGFmY2RhNTg5N2YzMDYxMjczNmMyNDgzNDMwMTNjODA4MWJjMTYwOTFhNTNlZGExMTYzNjRiZWEiLAogICJzYWx0MiI6ICIxNDRkMDE4ZGVhOGVhZWM0MzQzOGJjOGFiMzI5NGNjZmI3ZjJkMjY1MDRlODFiNzk2ZWQ5ODg1YjhkZWE4Y2Y4IiwKICAiY29ycmVjdEFuc3dlckhhc2giOiAiNzdiZGFjOWFkZWE1NjM0ZTg1ODIyNTJmNjkwYmNiMjFlZWQ4MzQ1N2Y4ZjExMTNkZTA1MzNhMzY5ZDc2ODJiMCIsCiAgImVuY3J5cHRlZE5leHRTdGVwSHRtbEI2NCI6ICJNcW9OYk5QWlo3S3U1Q1MyY2pWRi9JK0xNUnhBakRicHRaRS81djJqWkdoWXhTTVp0QlJodHB3WGZFNm9peEprREtkTGUvTDRsay81WGRlYjRPdUdXUGt2bjFyTFV6cmRuOWRvbTUvSUduZW5Oa2d0ZG4zQUN2OXlrWjRkVXgzWTVmVVkrVGJBMXpOTzZvQnlJZW5vVGRMWm5BTW0zY2ZSeXFkdW1EZGR1NmhBNjMzanhrWlBWeVJWMXFvV1Y2WE9MTTMwbVpKM1NrTENMQjBya3paM0IxeThvOGxkNjBwdHB5elNVUnBqWG00dzJYa0xjNDlnaUtYa2lBWFpjSHZnQitEcGNBS1BYWitybkZWWXczazZoRVNyIgp9",

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
