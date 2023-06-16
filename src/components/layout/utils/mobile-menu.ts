import { showCommandBar } from "@/stores/command-bar.store";

document.addEventListener("DOMContentLoaded", () => {
  /* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
  // We know these elements exist, so we can safely disable this rule
  const header = document.querySelector("header") as HTMLElement;
  const mobileMenu = header.querySelector("#mobile-menu") as HTMLElement;
  const triggerContainer = header.querySelector('[for="mobile-menu-trigger"]') as HTMLLabelElement;
  const menuButton = triggerContainer.querySelector("input") as HTMLInputElement;
  const menuIcon = triggerContainer.querySelector("svg") as SVGSVGElement;
  const buttonText = triggerContainer.querySelector("span.sr-only") as HTMLElement;
  const searchButton = header.querySelector("#search-button") as HTMLButtonElement;
  /* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */
  const toggleMobileMenu = setMobileMenu({
    trigger: menuButton,
    menu: mobileMenu,
    icon: menuIcon,
    text: buttonText,
  });
  window.addEventListener("scroll", () => window.scrollY > 30 && toggleMobileMenu(true), { passive: true });
  menuButton.addEventListener("click", () => toggleMobileMenu());
  searchButton.addEventListener("click", showCommandBar);
});

function setMobileMenu({
  trigger,
  menu,
  icon,
  text,
}: {
  trigger: HTMLInputElement;
  menu: HTMLElement;
  icon: SVGSVGElement;
  text: HTMLElement;
}) {
  const openText = text.dataset.openText || "Abrir menú principal";
  const closeText = text.dataset.closeText || "Cerrar menú principal";
  return (isOpen?: boolean) => {
    const expanded = isOpen ?? !trigger.checked;
    if (expanded) {
      trigger.setAttribute("aria-expanded", "false");
      if (trigger.checked) trigger.checked = false;
      text.innerHTML = openText;
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
    } else {
      trigger.setAttribute("aria-expanded", "true");
      menu.querySelector("a")?.focus();
      text.innerHTML = closeText;
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`;
    }
  };
}
