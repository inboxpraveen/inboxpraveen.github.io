// Menu
const Menu = (() => {
  let s;

  return {
    settings() {
      return {
        body: $('body'),
        hamburger: $('.hamburger'),
        open: 'js-menu-open',
        visible: 'js-menu-visible',
        overflow: 'js-overflow',
        width: $(window).width(),
        prevWidth: $(window).width(),
      };
    },

    init() {
      s = this.settings();
      this.bindEvents();
    },

    bindEvents() {
      let menuContainerWidth;

      if (s.width < 864) {
        menuContainerWidth = 100;
      } else if (s.width < 1456) {
        menuContainerWidth = 50;
      } else {
        menuContainerWidth = 45;
      }

      $(window).on('resize', () => {
        s.width = $(window).width();

        if (s.width < 864) {
          menuContainerWidth = 100;
        } else if (s.width < 1456) {
          menuContainerWidth = 50;
        } else {
          menuContainerWidth = 45;
        }
      });

      s.hamburger.on('click', () => {
        Menu.toggleMenu(menuContainerWidth);
      });

      s.body.on('keyup', e => {
        if (s.body.hasClass(s.open) && e.which === 27) {
          Menu.toggleMenu(menuContainerWidth);
        }
      });
    },

    toggleMenu(width) {
      s.hamburger.toggleClass('js-hamburger');
      s.body.toggleClass(s.open);
      s.body.toggleClass(s.overflow);

      // Opening transition
      if (s.body.hasClass(s.open)) {
        s.prevWidth = width;

        anime.timeline({
          easing: 'easeOutQuart',
          duration: 600,
          begin() {
            $('.menu__img').css('left', `${width}%`);
            s.body.addClass(s.visible);
          }
        })
        .add({
          targets: '.menu__container',
          width: [0, `${width}%`]
        })
        .add({
          targets: '.menu__img',
          width: [0, `${100 - width}%`]
        }, 0);
      }

      // Closing transition
      if (!s.body.hasClass(s.open)) {
        anime.timeline({
          easing: 'easeInQuart',
          duration: 600,
          delay: 200,
          complete() {
            s.body.removeClass(s.visible);
          }
        })
        .add({
          targets: '.menu__container',
          width: [`${s.prevWidth}%`, 0]
        })
        .add({
          targets: '.menu__img',
          width: [`${100 - s.prevWidth}%`, 0]
        }, 0);
      }
    }
  };
})();

// Inits
$(() => {
  // Spanize
  const span = $('.js-span');
  let $ele, words;

  for (let i = 0; i < span.length; i++) {
    $ele = $(span).eq(i);
    words = $ele.html();

    $ele.html(words.replace(/([A-z0-9'@+-<>.,'"“”‘’?!*&/]+)/g, '<span>$&</span>'));
  }
  
  Menu.init();
});
