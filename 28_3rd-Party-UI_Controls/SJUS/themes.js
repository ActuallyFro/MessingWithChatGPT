/*!
 * Dark mode toggler; extended from Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    const storedDarkMode = localStorage.getItem('darkMode') === 'true'
    const toggleButton = document.getElementById('toggleDarkMode');
  
    const setDarkMode = (isDarkMode) => {
      if (isDarkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        toggleButton.innerText = "Light Mode";
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        toggleButton.innerText = "Dark Mode";
      }
    }
  
    setDarkMode(storedDarkMode)
  
    const showActiveTheme = (isDarkMode) => {
      const themeSwitcherText = isDarkMode ? "Dark Mode" : "Light Mode";
      toggleButton.setAttribute('aria-label', themeSwitcherText);
    }
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(storedDarkMode)
  
      toggleButton.addEventListener('click', function () {
        const isContentDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  
        setDarkMode(!isContentDarkMode);
        localStorage.setItem('darkMode', !isContentDarkMode);
        showActiveTheme(!isContentDarkMode);
      });
    })
  })()
  

/////////////////////////
// Scroll to Top button
let currentToTopButton = document.getElementById("scrollButtonToTop");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        currentToTopButton.style.display = "block";
    } else {
        currentToTopButton.style.display = "none";
    }
}

function scrollPageToTopOfPage() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
