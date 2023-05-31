import { showCommandBar } from "@/stores/command-bar.store";

document.addEventListener("DOMContentLoaded", () => {
  /* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
  // We know these elements exist, so we can safely disable this rule
  const header = document.querySelector("header") as HTMLElement;
  const menuButton = header.querySelector('button[aria-controls="mobile-menu"]') as HTMLElement;
  const mobileMenu = header.querySelector("#mobile-menu") as HTMLElement;
  const menuIcon = menuButton.querySelector("svg") as SVGSVGElement;
  const buttonText = menuButton.querySelector("span.sr-only") as HTMLElement;
  const searchButton = header.querySelector("#search-button") as HTMLButtonElement;
  /* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */
  const toggleMobileMenu = setMobileMenu({
    button: menuButton,
    menu: mobileMenu,
    icon: menuIcon,
    text: buttonText,
  });
  window.addEventListener("scroll", () => window.scrollY > 30 && toggleMobileMenu(true), { passive: true });
  menuButton.addEventListener("click", () => toggleMobileMenu());
  searchButton.addEventListener("click", showCommandBar);
});

function setMobileMenu({
  button,
  menu,
  icon,
  text,
}: {
  button: HTMLElement;
  menu: HTMLElement;
  icon: SVGSVGElement;
  text: HTMLElement;
}) {
  const openText = text.dataset.openText || "Abrir menú principal";
  const closeText = text.dataset.closeText || "Cerrar menú principal";
  return (isOpen?: boolean) => {
    const expanded = isOpen ?? button.getAttribute("aria-expanded") === "true";
    if (expanded) {
      button.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      text.innerHTML = openText;
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
    } else {
      button.setAttribute("aria-expanded", "true");
      menu.classList.add("open");
      menu.querySelector("a")?.focus();
      text.innerHTML = closeText;
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`;
    }
  };
}
