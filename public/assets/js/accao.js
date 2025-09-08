document.addEventListener('DOMContentLoaded', function() {
    const botao = document.querySelector("#btn");
    const m = document.querySelector(".menu");
    
    if (botao && m) {
        botao.addEventListener("click", function () {
            m.classList.toggle("show");
        });
    }
});