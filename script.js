'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//////////////////////////////////////////////////////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////
//      Selecting elements
const header = document.querySelector('.header');

//    creating and inserting the elements

// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);

// // message.textContent = `We use cookies to improve functionality and analytics`;
// message.innerHTML = `We use cookies to improve functionality and analytics.<button class="btn btn--close-cookie">Got IT!</button>`;

// header.append(message);

// //deleting elements  (the cookie pop up)

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// ///////  styles

// //setting styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '80%';

// //another method of setting styles
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //how to print out the styles
// console.log(getComputedStyle(message).height);

//Attributes
const logo = document.querySelector('.nav__logo');

console.log(logo.src);
console.log(logo.className);
//getting and setting attributes
console.log(logo.getAttribute('src'));

//scrolling to a certain location
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollto.addEventListener('click', function (e) {
  const sc1coords = section1.getBoundingClientRect();

  console.log(e.target.getBoundingClientRect());
  console.log(sc1coords);

  //scrolling to section 1

  section1.scrollIntoView({ behavior: 'smooth' });
});

//////       Page navigation  //////////////////////////////////////////////////////////

//////the old school way

// document.querySelectorAll('nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = e.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//another way to navigate which is more efficient
////event delegation----uses the concept of bubbling to create a more efficient way of page navigation
//how to perform event delegation

//1.Add event listener to the parent element
//2.determine the exact element where the event(click) happened

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy targets

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//DOM Traversing

// const h1 = document.querySelector('h1');
// //moving upwards (parents)
// console.log(h1.closest('h1'));
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';
// console.log(h1.parentElement);
// //moving downwards (children)
// console.log(h1.querySelector('h1')); //result is null because there is no child to the h1 element

// //moving sideways (siblings)
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

//Tabbed components

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // console.log(clicked);

  //guard clause
  if (!clicked) return;

  //remove active classes in order to hide them
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //activate tab
  clicked.classList.add('operations__tab--active');

  //activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing 'argument' into handler using the bind method which helps us transfer the body of a function into another function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////Sticky navigation using inersection observer API

const navheight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
});

headerObserver.observe(header);

/// reveal on scroll animation using intersection observer API

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading images using intersection observer api

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  //replacing the image using src
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', /// to cause the images to load early enough for the users to not notice
});

imgTargets.forEach(img => imgObserver.observe(img));

//implementing the slider effect using vanilla js rather than slider js

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

let currSlide = 0;
const maxSlide = slides.length;

// const slider = document.querySelector('.slider');

// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

//next slide function
const gotoSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`; //0% 100% 200% 300%
  });
};
gotoSlide(0);

const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  gotoSlide(currSlide);
  activateDot(currSlide);
};
const prevSlide = function () {
  if (currSlide === 0) {
    currSlide === maxSlide - 1;
  } else {
    currSlide--;
  }

  gotoSlide(currSlide);
  activateDot(currSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//slider but using the arrow keys on the keyboard
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

//adding the dots to the slider for other navigation technique

const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    gotoSlide(slide);
    activateDot(slide);
  }
});
