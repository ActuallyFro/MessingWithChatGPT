document.addEventListener('DOMContentLoaded', (event) => {
    const toggleButton = document.getElementById('toggleDarkMode');

    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleButton.innerText = "Toggle Light Mode";
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        toggleButton.innerText = "Toggle Dark Mode";
    }

    console.log('current html attribute for data-theme: ' + document.documentElement.getAttribute('data-theme'));
    console.log('current localstorage value for darkMode: ' + localStorage.getItem('darkMode'));

    // Attach click event listener to the button
    toggleButton.addEventListener('click', function () {
        const isContentDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isContentDarkMode) {
            // document.body.classList.remove('dark-mode');
            // navbar.classList.remove('SJSC-darkmode');
            // container.classList.remove('SJSC-darkmode');
            // card.classList.remove('SJSC-darkmode');
            // modalContent.classList.remove('SJSC-darkmode');
            // listItems.forEach(item => item.classList.remove('SJSC-darkmode'));
            toggleButton.innerText = "Toggle Dark Mode";
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('darkMode', false);
            console.log('light mode set');

        } else {
            // document.body.classList.add('dark-mode');
            // navbar.classList.add('SJSC-darkmode');
            // container.classList.add('SJSC-darkmode');
            // card.classList.add('SJSC-darkmode');
            // modalContent.classList.add('SJSC-darkmode');
            // listItems.forEach(item => item.classList.add('SJSC-darkmode'));
            toggleButton.innerText = "Toggle Light Mode";
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', true);
            console.log('dark mode set');
        }

        console.log('current html attribute for data-theme: ' + document.documentElement.getAttribute('data-theme'));
        console.log('current localstorage value for darkMode: ' + localStorage.getItem('darkMode'));
        //reload 
    });
});


/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    const storedTheme = localStorage.getItem('theme')
  
    const getPreferredTheme = () => {
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = function (theme) {
      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
  
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
  
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelector('#bd-theme-text')
      const activeThemeIcon = document.querySelector('.theme-icon-active use')
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
      const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
  
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
  
      btnToActive.classList.add('active')
      btnToActive.setAttribute('aria-pressed', 'true')
      activeThemeIcon.setAttribute('href', svgOfActiveBtn)
      const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
      themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (storedTheme !== 'light' || storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            localStorage.setItem('theme', theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          })
        })
    })
  })()

/////////////////////////
// Get the button
let mybutton = document.getElementById("scrollButtonToTop");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function scrollPageToTopOfPage() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
