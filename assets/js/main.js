(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  let logoItem = select('#logo')
  let logoScrollItem = select('#logo-scrolled')
  let downArrow = select('#down-arrow')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 80) {
        selectHeader.classList.add('header-scrolled')
        logoItem.classList.add('removed');
        logoScrollItem.classList.remove('removed');
        downArrow.classList.add('scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled')
        logoScrollItem.classList.add('removed');
        logoItem.classList.remove('removed');
        downArrow.classList.remove('scrolled');
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  on('click', '#lp-download', function(e) {
      e.preventDefault();
      window.location.href = "assets/downloads/Gero_LP.pdf"
  }, true);

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

/**
 * Skills animation
 */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(remover, 3000);
    });
  }

  function remover() {
    $('#preloader').fadeOut(600);
  }

   $(".bio-hover").click(function(){

     let bioId = $(this).find(".img-container[id$='-pic']:first").data('bio');

    if($('#'+bioId).hasClass('bio-expanded')) {
      $('#'+bioId).slideUp(500).addClass('bio-collapsed').removeClass('bio-expanded');
    } else {
      $(".bio[id$='-bio']").slideUp(0).addClass('bio-collapsed').removeClass('bio-expanded');
      $('#' + bioId).removeClass('bio-collapsed').addClass('bio-expanded').slideDown(500);
    }
  });

  $(".bio-hover").mouseenter(function(){
    $(this).find('.bio-img:first').css("border", "2px solid #00C77A");
    $(this).css('cursor','pointer');
  });

  $(".bio-hover").mouseleave(function(){
    $(this).find('.bio-img:first').css("border", "0px");
  });

  /**
   * Check if contact fields are valid
   */
  const contactFieldsValid = () => {
    const contactName = $('#contact-name').val().trim();
    const contactEmail = $('#contact-email').val().trim();
    const contactMessage = $('#contact-message').val().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const validEmail = emailRegex.test(contactEmail);

    return (
      contactName.length >= 1 &&
      contactMessage.length >= 1 &&
      validEmail
    );
  }

  /**
   * Update disabled/enabled state of contact form submit button
   */
  const updateContactSubmitState = () => {
    if (contactFieldsValid()) {
      $('.contact-btn').removeAttr('disabled');
      $('.contact-btn').removeClass('disabled');
    } else {
      $('.contact-btn').attr('disabled');
      $('.contact-btn').addClass('disabled');
    } 
  }

  /**
   * Add event listeners to contact form fields
   */
  $("#contact .form-control").on("keyup", updateContactSubmitState);
  $("#contact .form-control").on("change", updateContactSubmitState);

  /**
   * Handle contact form submit
   */
  $('#contact-form').submit((e) => {
    e.preventDefault();
    $('.contact-status').removeClass('show');
    $('.contact-btn').attr('disabled');
    $('.contact-btn').addClass('disabled');
    if (contactFieldsValid()) {
      $('.contact-error').removeClass('show');
      const contactFormData = new FormData(e.target);
      const formStatus = $('.contact-status');
      fetch(e.target.action, {
        method: e.target.method,
        body: contactFormData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(res => {
        formStatus.html("Thanks for your submission!");
        formStatus.addClass('show');
        $('#contact-form')[0].reset();
      }).catch(err => {
        formStatus.html("Oops! There was a problem submitting your contact request");
        formStatus.addClass('show error');
      });
    } else {
      $('.contact-error').addClass('show');
    }
  })
})()
