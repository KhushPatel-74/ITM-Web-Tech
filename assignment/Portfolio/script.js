const quasar = document.querySelector(".quasar");

window.addEventListener("mousemove", function (event) {
    const position = event.clientX / this.window.innerWidth - 0.5;
    const tilt = position * 16;
    quasar.style.setProperty("--r", tilt + "deg");
});