// В будущем здесь можно добавить логику, например:
document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');

    sceneEl.addEventListener('targetFound', event => {
        console.log("Маркер найден!");
        // Можно запустить анимацию, показать скрытые элементы и т.д.
    });

    sceneEl.addEventListener('targetLost', event => {
        console.log("Маркер потерян.");
    });
});