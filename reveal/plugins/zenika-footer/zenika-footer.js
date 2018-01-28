/* global Reveal */

Reveal.addEventListener('ready', () => {
  function forEachSlide(slideIteratee) {
    function forEach(nodes, nodeIteratee) { Array.prototype.forEach.call(nodes, nodeIteratee) }
    const chapters = document.querySelectorAll('.reveal .slides > section')
    forEach(chapters, (chapter, chapterIndex) => {
      const slides = chapter.querySelectorAll('section')
      forEach(slides, (slide, slideIndex) => {
        slideIteratee(slide, chapterIndex, slideIndex)
      })
    })
  }

  function footer(footerClass, footerContent) {
    const footerElement = document.createElement('footer')
    footerElement.classList.add(footerClass)
    footerElement.innerHTML = footerContent
    return footerElement
  }

  function getSlideNumber(chapterIndex, slideIndex) {
    if (chapterIndex === 0) return ''
    if (slideIndex === 0) return chapterIndex.toString()
    return `${chapterIndex.toString()} - ${slideIndex.toString()}`
  }

  function addSlideNumber(slide, chapterIndex, slideIndex) {
    slide.appendChild(footer('slide-number', getSlideNumber(chapterIndex, slideIndex)))
  }

  function addCopyright(slide, chapterIndex, slideIndex) {
    if (slideIndex === 0) return
    slide.appendChild(footer('copyright', `&copy; Copyright ${new Date().getFullYear()} Zenika. All rights reserved`))
  }

  forEachSlide(addSlideNumber)
  forEachSlide(addCopyright)
})
