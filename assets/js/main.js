/* ============================================================
   GreenLine Royal — main.js
   Typeahead search, date picker, slider, header, cookie, scroll
   ============================================================ */
(function () {
    "use strict";

    /* ---------- Preloader ---------- */
    window.addEventListener('load', function () {
        var pre = document.getElementById('preloader');
        if (pre) setTimeout(function () { pre.classList.add('hidden'); }, 400);
    });
    // Fallback: hide preloader after 4s even if load is slow
    setTimeout(function () {
        var pre = document.getElementById('preloader');
        if (pre) pre.classList.add('hidden');
    }, 4000);

    /* ---------- Header scroll state + mobile nav ---------- */
    var header = document.getElementById('siteHeader');
    var navToggle = document.getElementById('navToggle');
    var mainNav = document.getElementById('mainNav');

    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 30);
        var st = document.getElementById('scrollTop');
        if (st) st.classList.toggle('show', window.scrollY > 480);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('open');
        });
        mainNav.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                mainNav.classList.remove('open');
                navToggle.classList.remove('open');
            }
        });
    }

    /* ---------- Scroll to top ---------- */
    var scrollTop = document.getElementById('scrollTop');
    if (scrollTop) scrollTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* ---------- Reveal on scroll ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Ticket form: flatpickr date ---------- */
    function initDatePicker() {
        var el = document.getElementById('banner_doj');
        if (!el || typeof flatpickr === 'undefined') return;
        if (el._flatpickr) return;
        flatpickr(el, {
            dateFormat: "m/d/Y",
            minDate: "today",
            defaultDate: null,
            disableMobile: true,
            onChange: function () { clearFieldError('gl_date_field'); }
        });
    }
    document.addEventListener('DOMContentLoaded', initDatePicker);
    window.addEventListener('load', initDatePicker);
    setTimeout(initDatePicker, 500);

    /* ---------- Locations (same route network as the live site) ---------- */
    var glCounters = [
        "NAIROBI","MOMBASA","KISUMU","KITALE","NAKURU","ELDORET","KAKAMEGA","BUNGOMA","MBALE UGANDA",
        "KERICHO","KISII","MIGORI","HOMABAY","SIAYA","BUSIA","MALABA","WEBUYE","KIMILILI","MUMIAS",
        "LUANDA","VIHIGA","BUTERE","KAKAMEGA","MBALE KE","KILIFI","MALINDI","VOI","MTWAPA","CHANGAMWE",
        "NAIVASHA","GILGIL","LIMURU","UTHIRU","NGONG ROAD STATION","KANGEMI","MAKUTANO","NJORO","OLKALOU",
        "ELDAMA RAVINE","KAPSABET","KABARNET","KAPENGURIA","CHEPTERWAI","TURBO","SOY","MOI'S BRIDGE",
        "KIMININI","SEREM","ENDEBESS","MACHERWA","CHEPSIR","KAIMOSI","BOMET","SOTIK","NAROK","KILGORIS",
        "EMALI","WOTE","MTITO ANDEI","MAVUENI","KIBWEZI","MAKINDU","KONDOA","MACHAKOS","ATHI RIVER",
        "THIKA","JUA KALI","KWA MUTHONI","SYOKIMAU","IMARA DAIMA","LANGATA","WESTLANDS","MUTHIGA",
        "GITHURAI","KAYOLE","DONHOLM","RIVER ROAD","ACCRA ROAD","COUNTRY BUS - NAIROBI","BAMBURI",
        "NYALI","MARIJANI","MWEMBE TAYARI","PORT REITZ","LIKONI","CHANGAMWE","MOMBASA CBD","UKUNDA",
        "DIANI","KWALE","LUNGA LUNGA","BONDO","UGENYA","URANGA","SIAYA","RANGALA","YALA","NG'IA",
        "UDENDA","KOMBEWA","AWASI","RABUOR","KISUMU AIRPORT","KOGELO","AHERO","GOMBEI","KAMUSINGA GIRLS",
        "NYAMONYE","SIGULU","SONDU","OPARANY","OSWAL","TULIENGE","NGIYA","MIGORI TOWN","SUNSET","KARUNGU",
        "KILGORIS TOWN","MULTAN","BORO","NYADORERA","NDORI","HOLO","MASENO","WINAM","LUNYONJO","CHIMORI",
        "KODIAGA","SAMIA","BUSIA TOWN","SIFUYO","BUBANGO","BUBULO","BUNYALA","NAMBALE","KHAYEGA",
        "SHINYALU","LURAMBI","KAKAMEGA TOWN","MUKUMU BOYS","MUDAVADI GIRLS","NYAWARA GIRLS","MAUTUMA",
        "LUMAKANDA","MATUNGU","MUMIAS TOWN","MISIKHU","MUNGATSI","NAMWELA","LWAKHAKHA","LWANDETI",
        "SHAMAKHOKHO","KWAMBERA","KOYONZO","MATISI","MAYANJA","CHESIKAKI","BUGWERI","MUSENGE",
        "BUNGOMA TOWN","KIBABII","CHEPTAIS","BOKOLI","BURGARET","KIMININI TOWN","SABATIA","ELDORET TOWN",
        "ANNEX ELDORET","KIPKAREN","KAPSOWAR","KABIEMIT","MOIBEN","ITEN","ELGEYO","CHEPKORIO","KAKAMEGA FOREST",
        "CHEPCHOINA","KABARNET TOWN","ELDAMA RAVINE TOWN","SIGOR","CHEMOLINGOT","KAPCHORWA","KACHELIBA",
        "ENDABU","KAPKATENY","KERINGET","CHEPKALIA","WESTPOKOT","KANYARKWET","MAU SUMMIT JUNCTION",
        "NJORO TOWN","TURU","RONGAI","SACCO","LANET","LONDIANI","KEDOWA","SALGAA","NAROK TOWN","MAASAI MARA",
        "SEKANANI","OLOLULUNG'A","ENTASEKERA","KILGORIS TOWN","KISII TOWN","KISII MUNICIPALITY","NYANCHWA",
        "RANGENYO","KEROKA","IRIBA","RIANANA","ETAGO","OGEMBO","NYAMIRA","MIRIGA","IKONGE","KIBERA",
        "KENYA NATIONAL ARCHIVES","NAIROBI CBD","BARAZA","BURI BURI","DAGORETTI","KAWANGWARE","RUAKA","ZIMMERMAN",
        "KENYATTA UNIVERSITY","JOMO KENYATTA AIRPORT","WILSON AIRPORT","GREENPARK","AGAKHAN WALK","YAYA CENTRE",
        "KAREN","ROSSLYN","LIVINGSTONE","MOUNTAIN VIEW","MUTHIGA TOWN","GIGIRI","KILIMANI","HURLINGHAM",
        "SOUTH C","MADARAKA","STAREHE","EASTLEIGH","PANGANI","BAKRI","ABABU","MARURA","BABA DOGO","KOROGOCHO"
    ];

    // Deduplicate the route-stop list (case-insensitive)
    (function dedupeCounters() {
        var seen = {};
        glCounters = glCounters.filter(function (c) {
            var key = c.toLowerCase();
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
    })();

    function glEscapeHtml(str) {
        return (str == null ? '' : str).toString()
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function clearFieldError(fieldId) {
        var f = document.getElementById(fieldId);
        if (f) f.classList.remove('has-error');
    }

    function glSetupAutocomplete(inputId, hiddenId, listId, fieldId) {
        var input = document.getElementById(inputId);
        var hidden = document.getElementById(hiddenId);
        var list = document.getElementById(listId);
        if (!input || !hidden || !list) return;

        list.setAttribute('role', 'listbox');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-autocomplete', 'list');

        var activeIndex = -1;
        var currentMatches = [];

        function updateAria() {
            input.setAttribute('aria-expanded', list.style.display === 'block' ? 'true' : 'false');
        }

        function render(filterText) {
            var term = (filterText || '').trim().toLowerCase();
            currentMatches = term
                ? glCounters.filter(function (c) { return c.toLowerCase().indexOf(term) !== -1; })
                : glCounters.slice();
            activeIndex = -1;

            if (currentMatches.length === 0) {
                list.innerHTML = '<div class="gl-autocomplete-empty">No matching location</div>';
            } else {
                list.innerHTML = currentMatches.slice(0, 60).map(function (c, i) {
                    return '<div class="gl-autocomplete-item" data-index="' + i + '">' + glEscapeHtml(c) + '</div>';
                }).join('');
            }
            list.style.display = 'block';
            updateAria();
        }

        function pick(index) {
            if (index < 0 || index >= currentMatches.length) return;
            hidden.value = currentMatches[index];
            input.value = currentMatches[index];
            list.style.display = 'none';
            updateAria();
            clearFieldError(fieldId);
        }

        function closeList() {
            list.style.display = 'none';
            updateAria();
            activeIndex = -1;
        }

        input.addEventListener('focus', function () { render(input.value); });
        input.addEventListener('input', function () { render(input.value); });
        input.addEventListener('keyup', updateAria);
        input.addEventListener('keydown', function (e) {
            var items = list.querySelectorAll('.gl-autocomplete-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, items.length - 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
            } else if (e.key === 'Enter') {
                if (activeIndex >= 0) { e.preventDefault(); pick(activeIndex); }
            } else if (e.key === 'Escape') {
                closeList();
            } else { return; }
            items.forEach(function (it, i) {
                it.classList.toggle('is-active', i === activeIndex);
            });
            if (activeIndex >= 0 && items[activeIndex]) {
                items[activeIndex].scrollIntoView({ block: 'nearest' });
            }
        });

        list.addEventListener('mousedown', function (e) {
            var item = e.target.closest('.gl-autocomplete-item');
            if (item) pick(parseInt(item.dataset.index, 10));
        });

        document.addEventListener('click', function (e) {
            if (!input.contains(e.target) && !list.contains(e.target)) closeList();
        });
    }

    glSetupAutocomplete('gl_pickup_search', 'gl_pickup_id', 'gl_pickup_list', 'gl_pickup_field');
    glSetupAutocomplete('gl_destination_search', 'gl_destination_id', 'gl_destination_list', 'gl_destination_field');

    /* ---------- Form validation ---------- */
    var form = document.getElementById('glTicketForm');
    var errorsBox = document.getElementById('glFormErrors');
    if (form) {
        form.addEventListener('submit', function (e) {
            var pickup = document.getElementById('gl_pickup_id').value.trim();
            var dest = document.getElementById('gl_destination_id').value.trim();
            var date = document.getElementById('banner_doj').value.trim();
            var errors = [];
            var pickupField = document.getElementById('gl_pickup_field');
            var destField = document.getElementById('gl_destination_field');
            var dateField = document.getElementById('gl_date_field');

            if (!pickup) { errors.push('Please choose a pickup point.'); if (pickupField) pickupField.classList.add('has-error'); }
            if (!dest) { errors.push('Please choose a dropping point.'); if (destField) destField.classList.add('has-error'); }
            if (pickup && dest && pickup === dest) { errors.push('Pickup and destination cannot be the same.'); }
            if (!date) { errors.push('Please select a travel date.'); if (dateField) dateField.classList.add('has-error'); }

            e.preventDefault();
            if (errors.length) {
                if (errorsBox) {
                    errorsBox.innerHTML = errors.map(function (er) { return '<div class="gl-form-error">' + glEscapeHtml(er) + '</div>'; }).join('');
                }
            } else if (errorsBox) {
                errorsBox.innerHTML = '<div class="gl-form-ok">Online booking is coming soon — call <a href="tel:+254798546817">+254798546817</a> or WhatsApp us to reserve your seat.</div>';
            }
        });
    }

    /* ---------- Testimonial slider ---------- */
    var track = document.getElementById('testimonialTrack');
    var prev = document.getElementById('prevSlide');
    var next = document.getElementById('nextSlide');
    var dotsBox = document.getElementById('sliderDots');
    var slides = track ? track.children.length : 0;
    var current = 0;

    if (track && slides > 0) {
        function goTo(index) {
            current = (index + slides) % slides;
            track.style.transform = 'translateX(-' + current * 100 + '%)';
            var dots = dotsBox ? dotsBox.children : [];
            for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('active', i === current);
        }
        if (dotsBox) {
            for (var i = 0; i < slides; i++) {
                var b = document.createElement('button');
                b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                b.addEventListener('click', function (idx) { return function () { goTo(idx); }; }(i));
                dotsBox.appendChild(b);
            }
        }
        if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
        if (next) next.addEventListener('click', function () { goTo(current + 1); });
        goTo(0);

        var touchX = null;
        track.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (touchX === null) return;
            var dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
            touchX = null;
        }, { passive: true });
    }

    /* ---------- Cookie notice ---------- */
    var cookieCard = document.getElementById('cookiePolicy');
    var cookieAccept = document.getElementById('cookieAccept');
    if (cookieCard) {
        try {
            if (!localStorage.getItem('gl_cookie_ok')) cookieCard.classList.add('show');
        } catch (e) { cookieCard.classList.add('show'); }
        if (cookieAccept) {
            cookieAccept.addEventListener('click', function () {
                try { localStorage.setItem('gl_cookie_ok', '1'); } catch (e) {}
                cookieCard.classList.remove('show');
            });
        }
    }
})();
