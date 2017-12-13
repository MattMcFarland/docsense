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

  function initRouter() {
    window.onpopstate = function(e) {
      replaceContent(window.location.href);
    };

    dom.forEach('#sidenav a', el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        history.pushState({}, e.target.title, e.target.href);
        replaceContent(e.target.href);
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
            const regxp = /<!-- @XHR-CONTENT-AREA --->+[\s\S]*<!-- @\/XHR-CONTENT-AREA --->/;
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

    let startX = null;
    let startWidth = parseInt(
      document.defaultView.getComputedStyle(sidenav).width
    );

    sidenav.style.width = startWidth + 'px';

    function initDrag(e) {
      startX = e.clientX;
      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
      setTimeout(() => {
        document.documentElement.style.cursor = 'ew-resize';
        document.documentElement.style.userSelect = 'none';
        document.documentElement.style.pointerEvents = 'none';
      }, 0);
    }

    function doDrag(e) {
      const calcWidth = startWidth + e.clientX - startX;
      setTimeout(() => {
        sidenav.style.width = clamp(calcWidth, 200, 860) + 'px';
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
}

function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}
