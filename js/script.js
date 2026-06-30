(function ($) {
    "use strict";
    const $window = $(window);
    const CONFIG = { mobileBreakpoint: 768, formAction: "form-process.php" };

    // Preloader
    $window.on("load", () => setTimeout(() => $(".sis-preloader").fadeOut(1000), 700));

    // Sticky Header
    if ($('.sis-active-sticky-header').length) {

        const $window = $(window);
        const $mainHeader = $(".sis-main-header");
        const $stickyHeader = $('header .sis-header-sticky');

        function setHeaderHeight() {
            $mainHeader.css("height", $stickyHeader.outerHeight());
        }

        $window.on('resize', setHeaderHeight);

        $stickyHeader.removeClass("active hide");

        $window.on("scroll", function () {
            var fromTop = $window.scrollTop();
            setHeaderHeight();

            var siteHeaderHeight = $mainHeader.outerHeight();

            if (fromTop > siteHeaderHeight) {
                $stickyHeader.addClass("active").removeClass("hide");
            } else {
                $stickyHeader.removeClass("active hide");
            }
        });
    }

    // Mobile Menu

    // Mobile Menu
    const initialMenuItems = $('#menu > li').toArray();
    const initialMenu2Items = $('#menu2 > li').toArray();

    const handleMobileMenus = () => {
        const isMobile = $window.width() <= CONFIG.mobileBreakpoint;
        const hasSlickNav = $(".slicknav_nav").length;

        if (isMobile && !hasSlickNav && $.fn.slicknav) {

            $("#menu2").children().appendTo("#menu");

            $("#menu").slicknav({
                label: "",
                prependTo: ".responsive-menu",

                beforeOpen: function () {
                    $('body').addClass('mobile-menu-open');
                },

                beforeClose: function () {
                    $('body').removeClass('mobile-menu-open');
                }
            });

        } else if (!isMobile && hasSlickNav) {

            $("#menu").slicknav("destroy");

            initialMenuItems.forEach(item => $("#menu").append(item));
            initialMenu2Items.forEach(item => $("#menu2").append(item));
        }
    };

    handleMobileMenus();

    let resizeTimer;
    $window.on("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleMobileMenus, 200);
    });


    // submenu scroll fix
    $(document).on('click', '.slicknav_arrow', function () {
        setTimeout(() => {
            const parent = $(this).closest('.slicknav_parent');
            const menu = $('.slicknav_menu');

            menu.animate({
                scrollTop: parent.position().top + menu.scrollTop() - 80
            }, 300);
        }, 200);
    });

    // Active Navigation
    $(() => {
        let page = location.pathname.split("/").pop().toLowerCase() || "index.html";
        document.querySelectorAll("#sisf-page-header .nav-link").forEach(link => {
            const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase() || "index.html";
            if (href === page) {
                link.classList.add("active");
                let parent = link.closest("li.submenu");
                while (parent) {
                    parent.querySelector(":scope > .nav-link")?.classList.add("active");
                    parent = parent.parentElement.closest("li.submenu");
                }
            }
        });
    });

    // Skills Progress Bar
    if ($.fn.waypoint && $('.sis-skills-progress-bar').length) {
        let animated = false;
        $('.sis-skills-progress-bar').waypoint(() => {
            if (animated) return;
            animated = true;
            $('.sis-skillbar').each(function () {
                const $this = $(this);
                const percent = parseInt($this.attr('data-percent'), 10) || 0;
                const $bar = $this.find('.sis-count-bar');
                const $text = $this.find('.sis-skill-no');

                $bar.css('width', '0%').animate({ width: percent + '%' }, 2000, 'swing');
                $({ value: 0 }).animate({ value: percent }, { duration: 2000, easing: 'swing', step: val => $text.text(Math.ceil(val) + '%') });
            });
        }, { offset: '50%' });
    }

    // GSAP Reveal & Text Animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll(".sis-reveal").forEach(container => {
            const image = container.querySelector("img"); if (!image) return;
            const tl = gsap.timeline({ scrollTrigger: { trigger: container, toggleActions: "play none none none" } });
            tl.set(container, { autoAlpha: 1 });
            tl.from(container, { xPercent: -100, duration: 1, ease: "power2.out" });
            tl.from(image, { xPercent: 100, duration: 1, delay: -1, scale: 1, ease: "power2.out" });
        });

        ['.sis-text-anime-style-1', '.sis-text-anime-style-3'].forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const split = new SplitText(element, { type: selector === '.sis-text-anime-style-1' ? "chars, words" : "chars, words" });
                gsap.from(selector === '.sis-text-anime-style-1' ? split.words : split.chars, {
                    duration: 1, delay: selector === '.sis-text-anime-style-1' ? 0.5 : 0.2, x: selector === '.sis-text-anime-style-1' ? 20 : 40,
                    autoAlpha: 0, stagger: selector === '.sis-text-anime-style-1' ? 0.05 : 0.03, ease: "power2.out",
                    scrollTrigger: { trigger: element, start: "top 85%" }
                });
            });
        });
    }

    // Animation On Scroll Js
    AOS.init();

    // Counter Up
    if ($.fn.counterUp && $('.sis-counter').length) $('.sis-counter').counterUp({ delay: 6, time: 3000 });

    // Back to Top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        $window.on('scroll', () => backToTop.classList.toggle('show', window.scrollY > 300));
        backToTop.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // Forms
    if ($.fn.validator && $("#enquiryForm").length) {
        $("#enquiryForm").validator({ focus: false }).on("submit", e => {
            if (!e.isDefaultPrevented()) { e.preventDefault(); submitForm($(e.target)); }
        });
    }
    function submitForm($form) {
        $.post(CONFIG.formAction, $form.serialize(), response => {
            if (response?.trim() === "success") { $form[0].reset(); showMsg(true, "Booking email sent successfully!"); }
            else showMsg(false, response || "Something went wrong.");
        });
    }
    function showMsg(valid, msg) { $("#msgSubmit").removeClass().addClass(valid ? "text-success" : "text-danger").text(msg); }

    /* Initialize Swiper Sliders */
    const initSwiper = (selector, options) => {
        if ($(selector).length) {
            return new Swiper(selector, options);
        }
        return null;
    };

    const swiperOptions = {
        slidesPerView: 1,
        speed: 1000,
        loop: true,
        autoplay: { delay: 5000 },
    };

    // Three Slide Per View - Swiper Slider Js
    initSwiper(".comman-swiper-slider .swiper", {
        ...swiperOptions,
        spaceBetween: 20,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2, centeredSlides: false }, 1024: { slidesPerView: 3 } }
    });

    // Five Slide Per View - Swiper Slider Js
    initSwiper(".comman-swiper--slider .swiper", {
        ...swiperOptions,
        spaceBetween: 20,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: { 0: { slidesPerView: 2 }, 768: { slidesPerView: 2, centeredSlides: false }, 1024: { slidesPerView: 5 } }
    });

    // Hero Slider Start 
    function animateActiveSlideText() {
        gsap.set(".sis-text-anime-style-2", { clearProps: "all" });

        const activeSlide = document.querySelector(".swiper-slide-active");
        const animatedTextElements = activeSlide.querySelectorAll(".sis-text-anime-style-2");

        animatedTextElements.forEach((element) => {
            const animationSplitText = new SplitText(element, { type: "chars, words" });

            gsap.from(animationSplitText.chars, {
                opacity: 0,
                duration: 0.11,
                delay: 0.14,
                x: 250,
                autoAlpha: 0,
                stagger: 0.09,
                ease: "power5.out",
            });
        });
    }

    initSwiper(".hero-slider-layout .swiper", {
        ...swiperOptions,
        autoplay: { delay: 6000 },
        pagination: { el: ".hero-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        on: {
            init: function () {
                animateActiveSlideText();
            },
            slideChangeTransitionStart: function () {
                animateActiveSlideText();
            }
        }
    });
    // Hero Slider End

    // Magnific Popup - Gallery
    if ($.fn.magnificPopup && $('.sis-gallery-items').length) {
        $('.sis-gallery-items').magnificPopup({
            delegate: 'a', type: 'image', closeOnContentClick: false, closeBtnInside: false,
            mainClass: 'mfp-with-zoom', image: { verticalFit: true }, gallery: { enabled: true },
            zoom: { enabled: true, duration: 300, opener: el => el.find('img') }
        });
    }

    /* Comparision Slider JS */
    function initComparisons() {
        const containers = document.querySelectorAll(".sis-img-comparition-container");

        containers.forEach(container => {
            const overlay = container.querySelector(".sis-img-comparition-overlay");
            const direction = container.getAttribute("data-direction") || "horizontal";

            let slider = document.createElement("div");
            slider.className = "img-comp-slider";
            container.appendChild(slider);

            let clicked = false;
            let w = container.offsetWidth;
            let h = container.offsetHeight;

            function setPosition(pos) {
                if (direction === "vertical") {
                    overlay.style.height = pos + "px";
                    slider.style.top = pos + "px";
                    slider.style.left = (w / 2) + "px";
                } else {
                    overlay.style.width = pos + "px";
                    slider.style.left = pos + "px";
                    slider.style.top = (h / 2) + "px";
                }
            }

            // Start at center
            setPosition(direction === "vertical" ? h / 2 : w / 2);

            slider.addEventListener("mousedown", start);
            slider.addEventListener("touchstart", start);

            window.addEventListener("mouseup", stop);
            window.addEventListener("touchend", stop);

            function start(e) {
                e.preventDefault();
                clicked = true;
                window.addEventListener("mousemove", move);
                window.addEventListener("touchmove", move);
            }

            function stop() {
                clicked = false;
                window.removeEventListener("mousemove", move);
                window.removeEventListener("touchmove", move);
            }

            function move(e) {
                if (!clicked) return;

                let rect = container.getBoundingClientRect();
                let pos;

                if (direction === "vertical") {
                    pos = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
                    pos = Math.max(0, Math.min(pos, h));
                } else {
                    pos = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
                    pos = Math.max(0, Math.min(pos, w));
                }

                setPosition(pos);
            }

            // Responsive fix
            window.addEventListener("resize", () => {
                w = container.offsetWidth;
                h = container.offsetHeight;
                setPosition(direction === "vertical" ? h / 2 : w / 2);
            });
        });
    }

    window.addEventListener("load", initComparisons);

    // Magnific Popup - Video
    if ($.fn.magnificPopup && $('.popup-video').length) {
        $('.popup-video').magnificPopup({
            type: 'iframe', mainClass: 'mfp-fade', removalDelay: 160, preloader: false, fixedContentPos: true,
            callbacks: {
                open: function () {
                    const videoSrc = $.magnificPopup.instance.currItem.src;
                    setTimeout(() => {
                        const content = document.querySelector('.mfp-content'); if (!content) return;
                        const iframe = content.querySelector('iframe'); if (iframe) iframe.remove();
                        const video = document.createElement('video');
                        video.src = videoSrc; video.autoplay = true; video.muted = true;
                        video.controls = true; video.playsInline = true;
                        video.style.width = '100%'; video.style.height = 'auto';
                        video.addEventListener('click', e => e.stopPropagation());
                        content.appendChild(video); video.play().catch(() => { });
                    }, 50);
                },
                close: function () {
                    const video = document.querySelector('.mfp-content video');
                    if (video) { video.pause(); video.remove(); }
                }
            }
        });
    }

    /* Product Quantity Plus Minus JS */
    $(document).on("click", ".sisf-quantity-minus, .sisf-quantity-plus", function (e) {
        e.preventDefault();
        const $button = $(this);
        const $inputField = $button.siblings(".sisf-quantity-input");
        const step = parseFloat($inputField.data("step")) || 1;
        const max = parseFloat($inputField.data("max"));
        const min = parseFloat($inputField.data("min")) || 1;
        let inputValue = parseFloat($inputField.val()) || min;

        inputValue = $button.hasClass("sisf-quantity-minus") ? Math.max(min, inputValue - step) : (Number.isNaN(max) ? inputValue + step : Math.min(max, inputValue + step));
        $inputField.val(inputValue).trigger("change");
    });

})(jQuery);


gsap.registerPlugin(ScrollTrigger);
// Apply natural rotation to each card; store rest rotation; start off-screen
document.querySelectorAll(".pcard").forEach((card) => {
  const rot = parseFloat(card.dataset.rot) || 0;
  card.dataset.restRot = rot;
  gsap.set(card, {
    rotation: rot + 25,
    y: -500,
    opacity: 0,
    scale: 0.7
  });
});
gsap.set(".nav", {
  opacity: 0,
  y: -20
});
gsap.set(".top-left .word > span", {
  y: "105%"
});
gsap.set("#topRight > div", {
  opacity: 0,
  x: 30
});
gsap.set(".listen .letter, .listen .paren, .listen .dollar", {
  y: 200,
  opacity: 0
});
gsap.set("#desc", {
  opacity: 0,
  y: 20
});
gsap.set(".ep-card, .sub-inner", {
  opacity: 0
});
// ============================================================
// INTRO TIMELINE
// ============================================================
const intro = gsap.timeline({
  defaults: {
    ease: "power3.out"
  }
});
intro
  .to(
    ".nav",
    {
      opacity: 1,
      y: 0,
      duration: 0.8
    },
    0.1
  )
  .to(
    ".top-left .word > span",
    {
      y: "0%",
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out"
    },
    0.3
  )
  .to(
    "#topRight > div",
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.08
    },
    0.6
  )
  .to(
    ".pcard",
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
      duration: 1.1,
      stagger: {
        each: 0.08,
        from: "center"
      },
      ease: "back.out(1.4)"
    },
    0.7
  )
  .to(
    ".listen .letter, .listen .paren, .listen .dollar",
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.06,
      ease: "back.out(1.6)"
    },
    1.2
  )
  .to(
    "#desc",
    {
      opacity: 1,
      y: 0,
      duration: 0.8
    },
    1.8
  );
// ============================================================
// CONTINUOUS FLOAT ON CARDS
// ============================================================
document.querySelectorAll(".pcard").forEach((card, i) => {
  const rot = parseFloat(card.dataset.restRot) || 0;
  gsap.to(card, {
    y: `+=${6 + (i % 3) * 4}`,
    rotation: rot + (i % 2 === 0 ? 1.2 : -1.2),
    duration: 3 + (i % 3) * 0.6,
    delay: 2 + i * 0.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });
});
// ============================================================
// MOUSE PARALLAX
// ============================================================
const hero = document.querySelector(".hero");
let mx = 0,
  my = 0,
  tx = 0,
  ty = 0;
hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
  my = ((e.clientY - r.top) / r.height - 0.5) * 2;
});
hero.addEventListener("mouseleave", () => {
  mx = 0;
  my = 0;
});

function parallax() {
  tx += (mx - tx) * 0.05;
  ty += (my - ty) * 0.05;
  document.querySelectorAll(".pcard").forEach((card) => {
    const d = parseFloat(card.dataset.depth) || 8;
    card.style.translate = `${tx * d}px ${ty * d * 0.6}px`;
  });
  requestAnimationFrame(parallax);
}
parallax();
// ============================================================
// CARD HOVER 3D LIFT (rotates to upright temporarily)
// ============================================================
document.querySelectorAll(".pcard").forEach((card) => {
  const restRot = parseFloat(card.dataset.restRot) || 0;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateX: -py * 14,
      rotateY: px * 14,
      rotation: restRot * 0.3, // straighten up
      scale: 1.1,
      zIndex: 20,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 700,
      overwrite: "auto"
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      rotation: restRot,
      scale: 1,
      zIndex: "",
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto"
    });
  });
  card.addEventListener("click", () => {
    gsap.fromTo(
      card,
      {
        scale: 1.1
      },
      {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      }
    );
  });
});
// ============================================================
// SCROLL: cards fan out, "listen($)" spreads horizontally
// ============================================================
ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom top",
  scrub: 0.8,
  onUpdate: (self) => {
    const p = self.progress;
    // Cards explode outward
    const moves = [
      {
        x: -260,
        y: -80,
        rot: -30
      },
      {
        x: -200,
        y: -40,
        rot: -22
      },
      {
        x: -120,
        y: 40,
        rot: -10
      },
      {
        x: 0,
        y: 80,
        rot: 0
      },
      {
        x: 120,
        y: 40,
        rot: 10
      },
      {
        x: 200,
        y: -40,
        rot: 22
      },
      {
        x: 260,
        y: -80,
        rot: 30
      }
    ];
    document.querySelectorAll(".pcard").forEach((card, i) => {
      const m = moves[i];
      const rest = parseFloat(card.dataset.restRot) || 0;
      gsap.set(card, {
        x: m.x * p,
        y: m.y * p,
        rotation: rest + m.rot * p
      });
    });
    // listen($) letters spread apart
    const letters = document.querySelectorAll(
      ".listen .letter, .listen .paren, .listen .dollar"
    );
    const cx = letters.length / 2;
    letters.forEach((l, i) => {
      const dist = i - cx;
      gsap.set(l, {
        x: dist * 8 * p,
        y: -30 * p
      });
    });
    // Fade other elements
    gsap.set(".top-left, .top-right, #desc", {
      opacity: 1 - p * 1.5
    });
    gsap.set(".listen", {
      opacity: 1 - p * 0.4
    });
  }
});
// ============================================================
// EPISODES REVEAL
// ============================================================
gsap.from(".eyebrow, .ep-head h2, .ep-head p", {
  opacity: 0,
  y: 30,
  duration: 0.9,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".ep-head",
    start: "top 80%"
  }
});
gsap.to(".ep-card", {
  opacity: 1,
  y: 0,
  duration: 1,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".ep-grid",
    start: "top 80%"
  }
});
gsap.from(".ep-card", {
  y: 70,
  scale: 0.95,
  rotation: (i) => (i % 2 === 0 ? -2 : 2),
  duration: 1,
  stagger: 0.1,
  ease: "back.out(1.3)",
  scrollTrigger: {
    trigger: ".ep-grid",
    start: "top 80%"
  }
});
// ============================================================
// SUBSCRIBE CTA REVEAL
// ============================================================
gsap.to(".sub-inner", {
  opacity: 1,
  y: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".sub-cta",
    start: "top 80%"
  }
});
gsap.from(".sub-inner", {
  y: 60,
  scale: 0.97,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".sub-cta",
    start: "top 80%"
  }
});
// Button clicks
document
  .querySelectorAll(".sub-pill, .sub-form button, .ep-play")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      gsap.fromTo(
        btn,
        {
          scale: 1
        },
        {
          scale: 0.92,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        }
      );
    });
  });



  