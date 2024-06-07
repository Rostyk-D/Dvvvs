document.addEventListener("DOMContentLoaded", function() {
    // Перенаправлення через 3 секунди після завантаження сторінки
    setTimeout(function() {
        window.location.href = "/home";
    }, 3000); // Час у мілісекундах, що відповідає тривалості анімації

    // Хаотична анімація миготіння букв
    const letters = document.querySelectorAll(".letter-animation");
    letters.forEach(letter => {
        const delay = Math.random() * 2; // Затримка до 2 секунд
        letter.style.animationDelay = `${delay}s`;
    });
});
