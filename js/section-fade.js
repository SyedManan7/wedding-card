/* Each page settles as it is arrived at.

   The Lavish card has done this since it was built and it is the thing people
   name when they say that card feels expensive: nothing is on the screen
   before you reach it, and when you do, the words arrive a beat apart rather
   than all at once. This is that behaviour, taken out of one design's file so
   every design in the Signature and Luxury collections can have it.

   What it does is set `.is-seen` on a page once a third of it is showing. The
   stylesheet does the rest -- see /css/section-fade.css -- and the class stays
   on: the words settle rather than fading out again behind whoever read them.

   Measured rather than observed. An IntersectionObserver is the obvious tool
   and it only reports while the page is being composited, so a card in a
   background tab, or in one of the editor's preview frames that is not on
   screen yet, can be scrolled to its second page and told nothing about it. A
   rectangle can be measured whenever it is asked for.
*/
(function () {
  var pages = [].slice.call(document.querySelectorAll('[data-section]'));
  if (!pages.length) return;

  /* A shop photograph shows every page settled. These arrive as they are
     scrolled to, which is right for a guest and wrong for a camera: a picture
     taken while a page is still fading in is a picture of a half-drawn page.

     The same is true of the editor, where somebody is looking at one page at
     a time and would otherwise be shown it arriving on every keystroke. */
  if (/[?&](shot|open)=1\b/.test(location.search)
      || document.documentElement.classList.contains('mk-editing')
      || document.documentElement.classList.contains('ci-editing')) {
    pages.forEach(function (p) { p.classList.add('is-seen'); });
    return;
  }

  var waiting = false;

  function check() {
    waiting = false;
    var h = window.innerHeight || document.documentElement.clientHeight;

    for (var i = pages.length - 1; i >= 0; i--) {
      var el = pages[i];
      var r = el.getBoundingClientRect();
      /* A third of the page showing is enough to have arrived at it. */
      var shown = Math.min(r.bottom, h) - Math.max(r.top, 0);
      if (shown > 0 && shown >= Math.min(r.height, h) * 0.34) {
        el.classList.add('is-seen');
        pages.splice(i, 1);
      }
    }

    if (!pages.length) {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    }
  }

  function queue() {
    if (waiting) return;
    waiting = true;
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(check);
    else setTimeout(check, 60);
  }

  check();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
}());
