Reveal.addEventListener('ready', function() {
  'use strict';

  function forEachSlide(action) {
    function forEach(nodes, action) { Array.prototype.forEach.call(nodes, action); }
    var chapters = document.querySelectorAll('.reveal .slides > section');
    forEach(chapters, function(chapter, chapterIndex) {
      var slides = chapter.querySelectorAll('section');
      forEach(slides, function(slide, slideIndex) {
        action(slide, chapterIndex, slideIndex);
      });
    });
  }

  function footer(footerClass, footerContent) {
    var footer = document.createElement('footer');
    footer.classList.add(footerClass);
    footer.innerHTML = footerContent;
    return footer;
  }

  function getSlideNumber(chapterIndex, slideIndex) {
    if (chapterIndex == 0) return '';
    if (slideIndex == 0) return chapterIndex.toString();
    return chapterIndex.toString() + ' - ' + slideIndex.toString();
  }

  function addSlideNumber(slide, chapterIndex, slideIndex) {
    slide.appendChild(footer('slide-number', getSlideNumber(chapterIndex, slideIndex)));
  }

  function addCopyright(slide, chapterIndex, slideIndex) {
    if (slideIndex == 0) return;
    slide.appendChild(footer('copyright', '&copy; Copyright Zenika'));
  }

  forEachSlide(addSlideNumber);
  forEachSlide(addCopyright);
});
