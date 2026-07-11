/**
 * Vanilla-JS port of src/components/UsaMap.tsx (react-simple-maps + d3-geo), so the
 * homepage's animated "states lighting up one by one" map isn't simplified away in this
 * PHP theme. Renders into any `[data-hh-usa-map]` container. Uses the same topology URL,
 * activation SEQUENCE, and STEP/HOLD_FULL/RESET_FADE timings as the original component,
 * plus the same Lucide "map-pin" icon shape for the dropping marker.
 *
 * Loads the full D3 bundle + topojson-client from CDN (this theme has no JS build step /
 * bundler to import them through instead). The standalone d3-geo-only package depends on
 * d3-array's Adder internally but doesn't bundle it, so the full d3 bundle is used instead
 * of loading d3-geo alone.
 */
(function () {
  'use strict';

  var GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
  var D3_SRC = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
  var TOPOJSON_SRC = 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';

  var SEQUENCE = [
    'California', 'Oregon', 'Washington', 'Nevada', 'Arizona', 'Idaho', 'Utah',
    'Montana', 'Wyoming', 'Colorado', 'New Mexico',
    'North Dakota', 'South Dakota', 'Nebraska', 'Kansas', 'Oklahoma', 'Texas',
    'Minnesota', 'Iowa', 'Missouri', 'Arkansas', 'Louisiana',
    'Wisconsin', 'Illinois', 'Michigan', 'Indiana', 'Ohio', 'Kentucky', 'Tennessee',
    'Mississippi', 'Alabama', 'Georgia', 'Florida', 'South Carolina', 'North Carolina',
    'Virginia', 'West Virginia', 'Pennsylvania', 'Maryland', 'Delaware', 'New Jersey',
    'New York', 'Connecticut', 'Rhode Island', 'Massachusetts', 'Vermont',
    'New Hampshire', 'Maine', 'Alaska', 'Hawaii'
  ];

  var STEP = 260;
  var HOLD_FULL = 1800;
  var RESET_FADE = 700;
  var WIDTH = 980;
  var HEIGHT = 560;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function injectStyleOnce() {
    if (document.getElementById('hh-usa-map-style')) return;
    var style = document.createElement('style');
    style.id = 'hh-usa-map-style';
    style.textContent =
      '@keyframes hh-pin-drop{' +
      '0%{transform:translate(-50%,-180%) scale(.4);opacity:0;}' +
      '60%{transform:translate(-50%,-95%) scale(1.15);opacity:1;}' +
      '80%{transform:translate(-50%,-100%) scale(.95);}' +
      '100%{transform:translate(-50%,-100%) scale(1);opacity:1;}' +
      '}' +
      '.hh-pin-marker{animation:hh-pin-drop 520ms cubic-bezier(.34,1.56,.64,1) both;}' +
      '@keyframes hh-pin-pulse{' +
      '0%,100%{box-shadow:0 0 0 0 hsl(var(--primary) / 0.55);}' +
      '50%{box-shadow:0 0 0 10px hsl(var(--primary) / 0);}' +
      '}';
    document.head.appendChild(style);
  }

  function buildMap(container) {
    injectStyleOnce();

    var wrap = document.createElement('div');
    wrap.className = 'relative w-full';
    container.appendChild(wrap);

    var mapWrap = document.createElement('div');
    mapWrap.className = 'relative';
    wrap.appendChild(mapWrap);

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + WIDTH + ' ' + HEIGHT);
    svg.style.display = 'block';
    svg.style.width = '100%';
    svg.style.height = 'auto';
    mapWrap.appendChild(svg);

    var statesLayer = document.createElementNS(SVG_NS, 'g');
    svg.appendChild(statesLayer);
    var markersLayer = document.createElementNS(SVG_NS, 'g');
    svg.appendChild(markersLayer);

    var counterWrap = document.createElement('div');
    counterWrap.className = 'mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-muted-foreground';
    counterWrap.innerHTML =
      '<span class="inline-flex items-center gap-2">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-primary">' +
      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
      '<span class="text-foreground" data-hh-usa-map-count>0</span> / 50 States Active</span>' +
      '<span class="inline-flex items-center gap-2">' +
      '<span class="h-3 w-3 rounded-sm bg-primary inline-block shadow-[0_0_8px_hsl(var(--primary))]"></span>Dispatched</span>';
    wrap.appendChild(counterWrap);
    var countEl = counterWrap.querySelector('[data-hh-usa-map-count]');

    fetch(GEO_URL)
      .then(function (r) { return r.json(); })
      .then(function (topology) {
        var objectKey = Object.keys(topology.objects)[0];
        var fc = window.topojson.feature(topology, topology.objects[objectKey]);
        var projection = window.d3.geoAlbersUsa().fitSize([WIDTH, HEIGHT], fc);
        var path = window.d3.geoPath(projection);

        var paths = {};
        fc.features.forEach(function (feature) {
          var name = feature.properties.name;
          var el = document.createElementNS(SVG_NS, 'path');
          el.setAttribute('d', path(feature));
          el.setAttribute('stroke', 'hsl(var(--background))');
          el.setAttribute('stroke-width', '0.75');
          el.style.fill = 'hsl(var(--muted))';
          el.style.transition = 'fill 500ms ease, filter 500ms ease';
          el.style.cursor = 'pointer';
          var titleEl = document.createElementNS(SVG_NS, 'title');
          titleEl.textContent = name;
          el.appendChild(titleEl);
          statesLayer.appendChild(el);
          paths[name] = { el: el, feature: feature };
        });

        function setActive(name, on) {
          var entry = paths[name];
          if (!entry) return;
          entry.el.style.fill = on ? 'hsl(var(--primary))' : 'hsl(var(--muted))';
          entry.el.style.filter = on ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.55))' : 'none';
        }

        function dropMarker(name) {
          var entry = paths[name];
          if (!entry) return;
          var centroid = path.centroid(entry.feature);
          if (!centroid || isNaN(centroid[0])) return;

          var g = document.createElementNS(SVG_NS, 'g');
          g.setAttribute('transform', 'translate(' + centroid[0] + ',' + centroid[1] + ')');
          markersLayer.appendChild(g);

          var fo = document.createElementNS(SVG_NS, 'foreignObject');
          fo.setAttribute('x', -18);
          fo.setAttribute('y', -40);
          fo.setAttribute('width', 36);
          fo.setAttribute('height', 42);
          fo.style.overflow = 'visible';
          g.appendChild(fo);

          var div = document.createElement('div');
          div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
          div.className = 'hh-pin-marker';
          div.style.cssText = 'width:0;height:0;transform-origin:50% 100%;position:relative;left:50%;top:100%;';
          div.innerHTML =
            '<div class="flex items-center justify-center rounded-full bg-secondary border-2 border-primary" ' +
            'style="width:26px;height:26px;transform:translate(-50%,-100%);animation:hh-pin-pulse 1.6s ease-out infinite;">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-primary">' +
            '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
            '</div>' +
            '<div style="position:absolute;left:50%;top:calc(-100% + 24px);width:0;height:0;transform:translateX(-50%);' +
            'border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid hsl(var(--secondary));"></div>';
          fo.appendChild(div);
        }

        var timers = [];
        var cancelled = false;

        function runLoop() {
          if (cancelled) return;
          Object.keys(paths).forEach(function (name) { setActive(name, false); });
          markersLayer.innerHTML = '';
          countEl.textContent = '0';
          var activeCount = 0;

          SEQUENCE.forEach(function (name, i) {
            var t = window.setTimeout(function () {
              setActive(name, true);
              dropMarker(name);
              activeCount += 1;
              countEl.textContent = String(activeCount);
            }, 400 + i * STEP);
            timers.push(t);
          });

          var totalMs = 400 + SEQUENCE.length * STEP + HOLD_FULL;
          var resetT = window.setTimeout(function () {
            Object.keys(paths).forEach(function (name) { setActive(name, false); });
            markersLayer.innerHTML = '';
            countEl.textContent = '0';
            var nextT = window.setTimeout(runLoop, RESET_FADE);
            timers.push(nextT);
          }, totalMs);
          timers.push(resetT);
        }

        runLoop();
      })
      .catch(function () {
        container.innerHTML = '<p class="text-center text-muted-foreground text-sm">Map unavailable.</p>';
      });
  }

  function init() {
    var containers = document.querySelectorAll('[data-hh-usa-map]');
    if (!containers.length) return;

    Promise.all([loadScript(D3_SRC), loadScript(TOPOJSON_SRC)])
      .then(function () {
        containers.forEach(buildMap);
      })
      .catch(function () {
        containers.forEach(function (c) {
          c.innerHTML = '<p class="text-center text-muted-foreground text-sm">Map unavailable.</p>';
        });
      });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
