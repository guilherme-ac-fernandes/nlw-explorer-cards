import "./css/index.css";
import IMask from "imask";
// import { cardsDynamicMasks } from "./cardsRegex";

// Selectors
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const securityCode = document.querySelector("#security-code");
const expirationDate = document.querySelector("#expiration-date");
const cardNumber = document.querySelector("#card-number");
const cardHolder = document.querySelector("#card-holder");
const addButton = document.querySelector("#add-button");
const ccHolder = document.querySelector(".cc-holder .value");
const ccSecurity = document.querySelector(".cc-security .value");
const ccNumber = document.querySelector(".cc-number");
const ccExpiration = document.querySelector(".cc-expiration .value");

// Colorações padrões dos cartões
const colors = {
  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#DF6F29", "#C69347"],
  default: ["black", "gray"],
};

// Função para alterar as informações do tipo do cartão
const setCardType = (type) => {
  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
};
globalThis.setCardType = setCardType;

// Máscaras
const securityCodePattern = { mask: "0000" };
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex));
    return foundMask;
  },
};

// Aplicação das Máscaras
const securityCodeMasked = IMask(securityCode, securityCodePattern);
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

// Remover a ação padrão de carregamento do formulário - submit
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

// All AddEventListenerd
addButton.addEventListener('click', () => {
  alert("Cartão adicionado com sucesso!")
});
cardHolder.addEventListener("input", () => {
  const condition = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value.substring(0, 30);
  ccHolder.innerText = condition;
});
securityCodeMasked.on("accept", () => {
  const condition = securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value;
  ccSecurity.innerText = condition;
});
cardNumberMasked.on("accept", () => {
  const condition = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value;
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  ccNumber.innerText = condition;
  setCardType(cardType);
});
expirationDateMasked.on("accept", () => {
  const condition = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value;
  ccExpiration.innerText = condition;
});
