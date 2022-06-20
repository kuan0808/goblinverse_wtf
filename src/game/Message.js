export default class Message {
  constructor({ src, onComplete }) {
    this.src = src;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add(
      "absolute",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "flex",
      "items-center",
      "justify-center",
      "animate__flash",
      "animate__animated",
      "animate__repeat-5"
    );
    this.element.innerHTML = `
        <img src="${this.src}" class="w-[400px]" />
    `;

    //Close the text message
    this.element.addEventListener("animationend", () => {
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
