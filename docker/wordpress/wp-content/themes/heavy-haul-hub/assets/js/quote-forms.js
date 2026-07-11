/**
 * Lead-capture form behavior — posts to this theme's own `hh/v1/submit-lead` REST route
 * (inc/leads.php), which stores leads as a `hh_lead` CPT and emails a notification. Plus
 * the step-wizard logic from InstantQuoteCalculator.tsx and the plain-form logic from
 * QuoteForm.tsx / ServiceQuoteForm.tsx. `hhConfig.submitLeadUrl` is localized in functions.php.
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function formatPhone(raw) {
    var d = raw.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  function showNotice(container, message, isError) {
    var el = container.querySelector('[data-hh-notice]');
    if (!el) {
      el = document.createElement('div');
      el.setAttribute('data-hh-notice', '');
      el.className = 'text-sm rounded-md px-3 py-2 mt-2';
      container.appendChild(el);
    }
    el.textContent = message;
    el.className = 'text-sm rounded-md px-3 py-2 mt-2 ' + (isError ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-foreground');
  }

  async function submitLead(payload) {
    var body = Object.assign({}, payload, { page_url: window.location.href });
    var res = await fetch(window.hhConfig.submitLeadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    var data = await res.json().catch(function () { return null; });
    if (!res.ok) {
      throw new Error((data && data.error) || 'Could not send your request. Please call us instead.');
    }
    return data;
  }

  window.hhSubmitLead = submitLead;

  // ---- Simple "bare"/"card" quote forms (QuoteForm.tsx / ServiceQuoteForm.tsx equivalents) ----
  function initSimpleQuoteForms() {
    document.querySelectorAll('[data-hh-quote-form]').forEach(function (form) {
      if (form.dataset.hhBound) return;
      form.dataset.hhBound = '1';

      var phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        phoneInput.addEventListener('input', function () {
          phoneInput.value = formatPhone(phoneInput.value);
        });
      }

      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalLabel = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending…';
        }
        try {
          var fd = new FormData(form);
          await submitLead({
            name: fd.get('name') || '',
            phone: fd.get('phone') || '',
            origin: fd.get('pickup') || '',
            destination: fd.get('delivery') || '',
            equipment: fd.get('brand') || fd.get('equipment') || '',
            message: fd.get('model') ? 'Model: ' + fd.get('model') : '',
            source: form.dataset.hhSource || 'quote_form',
          });
          showNotice(form, 'Quote request received — a dispatcher will call you within 10 minutes.', false);
          form.reset();
        } catch (err) {
          showNotice(form, err.message || 'Could not send. Please try again or call us.', true);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalLabel;
          }
        }
      });
    });
  }

  // ---- ZIP autocomplete (free Zippopotam API), used by the Instant Quote Calculator ----
  function initZipAutocomplete() {
    document.querySelectorAll('[data-hh-zip-input]').forEach(function (input) {
      if (input.dataset.hhBound) return;
      input.dataset.hhBound = '1';

      var wrap = input.closest('[data-hh-zip-wrap]');
      var panel = wrap ? wrap.querySelector('[data-hh-zip-suggestions]') : null;
      if (!panel) return;

      var timer = null;

      function renderSuggestions(list) {
        panel.innerHTML = '';
        if (!list.length) {
          panel.classList.add('hidden');
          return;
        }
        list.forEach(function (s) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 border-b border-border last:border-0 flex items-center gap-2';
          btn.innerHTML = '<span class="font-bold">' + s.label + '</span>';
          btn.addEventListener('click', function () {
            input.value = s.label;
            panel.classList.add('hidden');
          });
          panel.appendChild(btn);
        });
        panel.classList.remove('hidden');
      }

      input.addEventListener('input', function () {
        var digits = input.value.replace(/\D/g, '');
        clearTimeout(timer);
        if (digits.length !== 5) {
          panel.classList.add('hidden');
          return;
        }
        timer = setTimeout(function () {
          fetch('https://api.zippopotam.us/us/' + digits)
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
              if (!data || !data.places) return renderSuggestions([]);
              var list = data.places.map(function (p) {
                return {
                  label: String(p['place name']).toUpperCase() + ', ' + p['state abbreviation'] + ' ' + digits,
                };
              });
              // Auto-fill as soon as it resolves, matching the original UX.
              if (list.length > 0) {
                input.value = list[0].label;
                panel.classList.add('hidden');
              } else {
                renderSuggestions(list);
              }
            })
            .catch(function () { renderSuggestions([]); });
        }, 200);
      });

      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) panel.classList.add('hidden');
      });
    });
  }

  // ---- Instant Quote Calculator (3-step wizard) ----
  function initInstantQuoteCalculators() {
    document.querySelectorAll('[data-hh-iqc]').forEach(function (root) {
      if (root.dataset.hhBound) return;
      root.dataset.hhBound = '1';

      var steps = Array.prototype.slice.call(root.querySelectorAll('[data-hh-iqc-step]'));
      var progressBars = Array.prototype.slice.call(root.querySelectorAll('[data-hh-iqc-progress]'));
      var titleEls = Array.prototype.slice.call(root.querySelectorAll('[data-hh-iqc-title]'));

      function goTo(stepNum) {
        steps.forEach(function (el) {
          el.classList.toggle('hidden', el.getAttribute('data-hh-iqc-step') !== String(stepNum));
        });
        titleEls.forEach(function (el) {
          el.classList.toggle('hidden', el.getAttribute('data-hh-iqc-title') !== String(stepNum));
        });
        progressBars.forEach(function (el, i) {
          el.classList.toggle('bg-primary', i < stepNum);
          el.classList.toggle('bg-white/15', i >= stepNum);
        });
      }

      var step1Form = root.querySelector('[data-hh-iqc-step="1"] form');
      var step2Form = root.querySelector('[data-hh-iqc-step="2"] form');
      var step3 = root.querySelector('[data-hh-iqc-step="3"]');
      var summaryRoute = root.querySelector('[data-hh-iqc-summary-route]');
      var summaryEquip = root.querySelector('[data-hh-iqc-summary-equip]');
      var confirmName = root.querySelector('[data-hh-iqc-confirm-name]');
      var confirmDetails = root.querySelector('[data-hh-iqc-confirm-details]');
      var confirmPhone = root.querySelector('[data-hh-iqc-confirm-phone]');

      var phoneInput = step2Form ? step2Form.querySelector('input[type="tel"]') : null;
      if (phoneInput) {
        phoneInput.addEventListener('input', function () {
          phoneInput.value = formatPhone(phoneInput.value);
        });
      }

      if (step1Form) {
        step1Form.addEventListener('submit', function (e) {
          e.preventDefault();
          var pickup = step1Form.querySelector('[name="pickup"]').value.trim();
          var delivery = step1Form.querySelector('[name="delivery"]').value.trim();
          var equipment = step1Form.querySelector('[name="equipment"]').value.trim();
          if (!pickup || !delivery || equipment.length < 2) {
            showNotice(step1Form, 'Please fill in pickup, delivery, and equipment type.', true);
            return;
          }
          if (summaryRoute) summaryRoute.textContent = pickup + ' → ' + delivery;
          if (summaryEquip) {
            var model = step1Form.querySelector('[name="model"]').value.trim();
            summaryEquip.textContent = equipment + (model ? ' · ' + model : '');
          }
          goTo(2);
        });
      }

      var backBtn = root.querySelector('[data-hh-iqc-back]');
      if (backBtn) {
        backBtn.addEventListener('click', function () { goTo(1); });
      }

      if (step2Form) {
        step2Form.addEventListener('submit', async function (e) {
          e.preventDefault();
          var name = step2Form.querySelector('[name="name"]').value.trim();
          var phone = step2Form.querySelector('[name="phone"]').value.trim();
          var email = step2Form.querySelector('[name="email"]').value.trim();
          if (name.length < 2 || phone.length < 10 || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            showNotice(step2Form, 'Please enter a valid name, phone, and email.', true);
            return;
          }
          var submitBtn = step2Form.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.disabled = true;
          try {
            var pickup = step1Form.querySelector('[name="pickup"]').value.trim();
            var delivery = step1Form.querySelector('[name="delivery"]').value.trim();
            var equipment = step1Form.querySelector('[name="equipment"]').value.trim();
            var model = step1Form.querySelector('[name="model"]').value.trim();
            await submitLead({
              name: name, email: email, phone: phone,
              origin: pickup, destination: delivery,
              equipment: equipment, message: model ? 'Model: ' + model : '',
              source: 'instant_quote',
            });
            if (confirmName) confirmName.textContent = name.split(' ')[0];
            if (confirmDetails) confirmDetails.textContent = equipment + (model ? ' · ' + model : '') + ' from ' + pickup + ' → ' + delivery;
            if (confirmPhone) confirmPhone.textContent = phone;
            goTo(3);
          } catch (err) {
            showNotice(step2Form, err.message || 'Could not send. Please try again or call us.', true);
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }

      var restartBtn = root.querySelector('[data-hh-iqc-restart]');
      if (restartBtn) {
        restartBtn.addEventListener('click', function () {
          if (step1Form) step1Form.reset();
          if (step2Form) step2Form.reset();
          goTo(1);
        });
      }
    });
  }

  onReady(function () {
    initSimpleQuoteForms();
    initZipAutocomplete();
    initInstantQuoteCalculators();
  });
})();
