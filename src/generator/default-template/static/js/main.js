/**
 * WARNING WARNING:
 * This file is not transpiled.
 * Lets try to avoid using nonsupported JS, and really avoid using as much JS as possible
 */

(function() {
  if (bowser.msie) {
    var hiddenElements = document.querySelectorAll('.dn');
    for (i = 0; i < hiddenElements.length; ++i) {
      hiddenElements[i].style.display = 'block';
    }
    return;
  }
})();

function main() {
  'use strict';

  if (bowser.msie) return;
  const dom = {
    forEach: function(selector, cb) {
      const elems = document.querySelectorAll(selector);
      for (let i = 0; i < elems.length; ++i) {
        cb(elems[i]);
      }
    },
  };

  initRouter();
  initResizable();
  initToggles();

  function initRouter() {
    window.onpopstate = function(e) {
      replaceContent(window.location.href);
    };

    dom.forEach('#sidenav a', el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (e.currentTarget.href && e.currentTarget.href !== '#') {
          history.pushState({}, e.currentTarget.title, e.currentTarget.href);
          replaceContent(e.currentTarget.href);
        }
      });
    });

    function replaceContent(url) {
      const xhr = new XMLHttpRequest();
      const contentElement = document.getElementById('content');
      xhr.open('GET', url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          scroll(0, 0);
          if (xhr.status === 200) {
            const regxp = /<!-- @XHR-CONTENT-AREA -->+[\s\S]*<!-- @\/XHR-CONTENT-AREA -->/;
            contentElement.innerHTML = xhr.responseText.match(regxp);
          } else {
            contentElement.innerHTML = xhr.status + ' ' + xhr.statusText;
          }
        }
      };
      xhr.send();
    }
  }
  function initResizable() {
    const sidenav = document.getElementById('sidenav');
    const resizer = document.getElementById('resizer');

    resizer.addEventListener('mousedown', initDrag, false);

    const savedWidth = parseInt(localStorage.getItem('sidenavWidth'));

    let startX = null;
    let startWidth = !isNaN(savedWidth)
      ? savedWidth
      : document.defaultView.getComputedStyle(sidenav).width;

    sidenav.style.width = startWidth + 'px';

    function initDrag(e) {
      startX = e.clientX;
      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
      document.documentElement.style.cursor = 'ew-resize';
      document.documentElement.style.userSelect = 'none';
      document.documentElement.style.pointerEvents = 'none';
    }

    function doDrag(e) {
      const calcWidth = clamp(
        startWidth + e.clientX - startX,
        200,
        window.innerWidth / 2
      );
      setTimeout(() => {
        sidenav.style.width = calcWidth + 'px';
        localStorage.setItem('sidenavWidth', calcWidth);
      }, 0);
    }

    function stopDrag(e) {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);
      setTimeout(() => {
        document.documentElement.style.cursor = 'auto';
        document.documentElement.style.userSelect = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        startWidth = parseInt(sidenav.style.width.split('px')[0]);
      }, 0);
    }
  }
  function initToggles() {
    dom.forEach('#sidenav a', el => {
      el.addEventListener('click', e => {
        if (e.currentTarget.hasAttribute('data-toggle')) {
          flipToggler(e.currentTarget);
        }
      });
    });

    function flipToggler(node) {
      const coordinates = node.getAttribute('data-toggle');
      const isOpen = localStorage.getItem(`toggle(${coordinates})`) === 'on';
      if (isOpen) {
        localStorage.setItem(`toggle(${coordinates})`, 'off');
      } else {
        localStorage.setItem(`toggle(${coordinates})`, 'on');
      }
      refreshToggles();
    }
    function refreshToggles() {
      dom.forEach('.toggler', toggler => {
        const coordinates = toggler.getAttribute('data-toggle');
        const isOpen = localStorage.getItem(`toggle(${coordinates})`) === 'on';
        return isOpen
          ? toggleOn(toggler, coordinates)
          : toggleOff(toggler, coordinates);
      });
    }
    function toggleOff(toggler, coordinates) {
      const toggleTarget = document.querySelector(
        `ul[data-coordinates="${coordinates}"]`
      );

      const iconSlot = toggler.querySelector('span[data-slot="icons"]');
      const dataType = toggler.getAttribute('data-type');
      if (dataType === 'folder') {
        iconSlot.innerHTML = `
        <i class="white-40 icon-caret-right"></i>
        <i class="white-40 icon-folder mr2"></i>
        `;
      }
      if (dataType === 'daam') {
        iconSlot.innerHTML = `
        <i class="white-40 icon-caret-right"></i>
        <i class="white-40 icon-cubes mr2"></i>
        `;
      }
      if (toggleTarget) toggleTarget.style.display = 'none';
    }
    function toggleOn(toggler, coordinates) {
      const toggleTarget = document.querySelector(
        `ul[data-coordinates="${coordinates}"]`
      );
      const iconSlot = toggler.querySelector('span[data-slot="icons"]');
      const dataType = toggler.getAttribute('data-type');
      if (dataType === 'folder') {
        iconSlot.innerHTML = `
        <i class="white-40 icon-caret-down"></i>
        <i class="white-40 icon-folder-open mr2"></i>
        `;
      }
      if (dataType === 'daam') {
        iconSlot.innerHTML = `
        <i class="white-40 icon-caret-down"></i>
        <i class="white-40 icon-cubes mr2"></i>
        `;
      }
      if (toggleTarget) toggleTarget.style.display = 'block';
    }
    refreshToggles();
    showPage();
  }
  function hidePage() {
    document.querySelector('#page').style.display = 'none';
  }
  function showPage() {
    document.querySelector('#page').style.display = 'block';
  }
}

function clamp(val, min, max) {
  if (isNaN(val)) return window.innerWidth / 3;
  if (val < min) return min;
  if (val > max) return max;
  return val;
}
