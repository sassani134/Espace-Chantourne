// app/javascript/controllers/mobile_menu_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="mobile-menu"
export default class extends Controller {
  static targets = ["menu", "button"]

  connect() {
    console.log("Mobile menu controller connected")
    // Empêcher le scroll du body quand le menu est ouvert
    this.body = document.querySelector('body')
  }

  toggle() {
    // console.log("toggle", this.menuTarget.classList.contains('hidden'))
    if (this.menuTarget.classList.contains('hidden')) {
      this.open()
    } else {
      this.close()
    }

  }

  open() {
    this.menuTarget.classList.remove('hidden', 'translate-x-full', 'opacity-0')
    this.menuTarget.classList.add('translate-x-0', 'opacity-100')
    this.body.classList.add('overflow-hidden')

    // Animation d'entrée des liens (effet cascade)
    const links = this.menuTarget.querySelectorAll('.menu-link')
    links.forEach((link, index) => {
      link.style.transitionDelay = `${index * 50}ms`
      link.classList.add('opacity-100', 'translate-y-0')
      link.classList.remove('opacity-0', 'translate-y-8')
    })
  }

  close() {
    this.menuTarget.classList.remove('translate-x-0', 'opacity-100')
    this.menuTarget.classList.add('translate-x-full', 'opacity-0')
    this.body.classList.remove('overflow-hidden')

    // Réinitialiser l'état des liens
    const links = this.menuTarget.querySelectorAll('.menu-link')
    links.forEach((link) => {
      link.style.transitionDelay = '0ms'
      link.classList.remove('opacity-100', 'translate-y-0')
      link.classList.add('opacity-0', 'translate-y-8')
    })
    this.menuTarget.classList.add('hidden')
  }

  closeOnLinkClick(event) {
    // Fermer le menu quand on clique sur un lien
    this.close()
  }

}
