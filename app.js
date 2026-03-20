// ============================================================
// Naglee Park Traffic Safety — app.js
// ============================================================

// ---------- Constants ----------
const API_BASE = 'https://geo.sanjoseca.gov/server/rest/services/OPN/OPN_OpenDataService/MapServer';
const CRASH_LAYER = 512;
const MAP_CENTER = [37.3367, -121.8733];
// Bounding box kept only as a broad pre-filter; actual filtering uses polygon below
const SEVERITY_COLORS = {
  fatal: '#ef4444',
  severe: '#f97316',
  moderate: '#eab308',
  minor: '#9ca3af'
};

// Hardcoded Naglee Park boundary polygon (from City neighborhoods layer 549)
const NAGLEE_PARK_BOUNDARY = [
  [-121.87180206774946,37.328458989328759],[-121.8719090354216,37.328434922148951],
  [-121.87197605841646,37.328518992267838],[-121.87202503022191,37.328579998413652],
  [-121.87213701260006,37.328740950898116],[-121.87231401069576,37.328973940880381],
  [-121.87250688833608,37.329232503810317],[-121.87317510542712,37.330128028806072],
  [-121.87389312928136,37.331091077293195],[-121.87428907991402,37.33162190745368],
  [-121.87468519675464,37.332155911842435],[-121.87539202320708,37.333108932184274],
  [-121.87434908281102,37.333592963947737],[-121.87339004516227,37.33405593597103],
  [-121.87333288331641,37.334081507760324],[-121.87241613242149,37.334490995368718],
  [-121.87150606817546,37.334924885678362],[-121.8721111066363,37.335730990675927],
  [-121.87257107034439,37.336364945925716],[-121.87362203361218,37.337813863186973],
  [-121.87468402780657,37.339264955077681],[-121.875814046803,37.340710028065111],
  [-121.87718909051861,37.342521970155104],[-121.87712892014214,37.342550550255119],
  [-121.87623105673016,37.342977922229167],[-121.87529708850693,37.343420001457069],
  [-121.87458942832963,37.343760629294188],[-121.87438902936373,37.343856900103006],
  [-121.87424512435877,37.343924925164238],[-121.87417108272341,37.343965874633952],
  [-121.87410205375861,37.344002978322358],[-121.87403101966301,37.344042924481975],
  [-121.8739320753138,37.344091895953611],[-121.87350202950689,37.343379888133171],
  [-121.87341812610246,37.343244005720067],[-121.8730980569931,37.342951012737316],
  [-121.87202503186933,37.342590997803654],[-121.87158612688182,37.342419013753627],
  [-121.8711600923039,37.342107970552277],[-121.87058012431338,37.340879005076616],
  [-121.87043906051436,37.340551916467845],[-121.87049906222492,37.340212960560358],
  [-121.87009809850593,37.339567975007967],[-121.87002806770236,37.339433931035494],
  [-121.86996305085586,37.339306906280861],[-121.86992711670142,37.33919492262001],
  [-121.86989302072641,37.339084947048534],[-121.86986410612968,37.338931013198561],
  [-121.86984003745032,37.338738971759376],[-121.86983502270608,37.338551944322703],
  [-121.8698400380584,37.338248922949795],[-121.86985507947831,37.337844950891785],
  [-121.86985006615876,37.337776926231733],[-121.86983602543147,37.337724946017325],
  [-121.86981212559706,37.33766694860546],[-121.8697541274793,37.337594912990681],
  [-121.86967707822699,37.337546944944201],[-121.86940915563461,37.337436966741684],
  [-121.86854806166363,37.337041018289305],[-121.86837005940075,37.336972992968583],
  [-121.86780814290626,37.336757886840793],[-121.86765905557188,37.336686017564055],
  [-121.86754406370967,37.336608966762981],[-121.8674310796948,37.336514867701489],
  [-121.86722416263422,37.336280874888885],[-121.86718304735895,37.336214020070464],
  [-121.86714009151511,37.336117916085605],[-121.86708710887386,37.335919020958691],
  [-121.86703914098256,37.335760909233919],[-121.86700003005002,37.335640903601266],
  [-121.86699100409392,37.335559007242594],[-121.86698615792471,37.335424961770478],
  [-121.86701005864971,37.335160884246186],[-121.86709112066245,37.334621864745408],
  [-121.867226000508,37.333896987839516],[-121.86724003999622,37.33362288092826],
  [-121.86724505401996,37.333512905133205],[-121.86724003995123,37.333334902660738],
  [-121.86723101477631,37.333209883464512],[-121.86721212710484,37.333118961757009],
  [-121.86714911719716,37.332869925526758],[-121.8671461085858,37.33286290610824],
  [-121.86694203391208,37.332439879769126],[-121.86687501106834,37.332295973475752],
  [-121.86682603990629,37.332188002659684],[-121.86681601210456,37.332165940862289],
  [-121.86678509098341,37.332095910425451],[-121.86675701153834,37.332014012676588],
  [-121.86675015862551,37.331984930745087],[-121.86674514463502,37.331943981667486],
  [-121.86674514515212,37.331886988209206],[-121.86675216509687,37.331852891772385],
  [-121.86676403160588,37.331805925975303],[-121.86678509018496,37.331751941009905],
  [-121.86680715238887,37.331716005414101],[-121.86685010795499,37.33165299489778],
  [-121.866893062043,37.331602017685455],[-121.8671800367585,37.331282951367044],
  [-121.86776501945465,37.330721869940042],[-121.86792413625626,37.330561918193979],
  [-121.86815913044103,37.330324916134266],[-121.86821712726704,37.330234997133246],
  [-121.86827512473515,37.33011699873002],[-121.86830203366327,37.330046966674097],
  [-121.86832810647233,37.329969915949427],[-121.8683520089976,37.329855928428628],
  [-121.86836638309865,37.329724056726505],[-121.86844209552271,37.329685949818867],
  [-121.86855223824949,37.329629456322706],[-121.86875012917291,37.32952800468933],
  [-121.86890807544907,37.329451956678007],[-121.86915309967618,37.329338971357238],
  [-121.8695671002701,37.329156958636091],[-121.86981212481697,37.329059014302594],
  [-121.87027910641953,37.328888867878575],[-121.8707340569173,37.328742957686949],
  [-121.87113301512153,37.328623955292983],[-121.87128711622938,37.328585011419825],
  [-121.87149303033888,37.328532028980703],[-121.87180206774946,37.328458989328759]
];

// Convert to Leaflet [lat, lng] format
const BOUNDARY_LATLNGS = NAGLEE_PARK_BOUNDARY.map(c => [c[1], c[0]]);

// Chart.js defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

// ---------- Point-in-Polygon (ray casting) ----------
function pointInPolygon(lng, lat, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if ((yi > lat) !== (yj > lat) &&
        lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// ---------- API Service ----------
function buildSpatialFilter() {
  return JSON.stringify({
    rings: [NAGLEE_PARK_BOUNDARY],
    spatialReference: { wkid: 4326 }
  });
}

async function queryAPI(params) {
  const url = new URL(`${API_BASE}/${CRASH_LAYER}/query`);
  const defaults = {
    f: 'json',
    geometryType: 'esriGeometryPolygon',
    spatialRel: 'esriSpatialRelIntersects',
    geometry: buildSpatialFilter(),
    inSR: 4326,
    outSR: 4326
  };
  const merged = { ...defaults, ...params };
  const body = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => body.set(k, v));
  const resp = await fetch(url, { method: 'POST', body });
  if (!resp.ok) throw new Error(`API error: ${resp.status}`);
  return resp.json();
}

async function fetchCrashStats(groupBy, statFields, where = '1=1') {
  return queryAPI({
    where,
    groupByFieldsForStatistics: groupBy,
    outStatistics: JSON.stringify(statFields),
    orderByFields: groupBy
  });
}

async function fetchCrashPoints(yearStart, yearEnd) {
  const where = `YEAR>='${yearStart}' AND YEAR<='${yearEnd}'`;
  const outFields = 'YEAR,CRASHDATETIME,LATITUDE,LONGITUDE,COLLISIONTYPE,VEHICLEINVOLVEDWITH,FATALINJURIES,SEVEREINJURIES,INJURYSEVERITY,PRIMARYCOLLISIONFACTOR,SPEEDINGFLAG,HITANDRUNFLAG,INTASTREETNAME,INTBSTREETNAME';
  let allFeatures = [];
  let offset = 0;
  const batchSize = 2000;

  while (true) {
    const data = await queryAPI({
      where,
      outFields,
      resultOffset: offset,
      resultRecordCount: batchSize,
      returnGeometry: true
    });
    if (data.features) allFeatures = allFeatures.concat(data.features);
    if (!data.exceededTransferLimit) break;
    offset += batchSize;
  }
  // Client-side filter: only keep points inside the Naglee Park polygon
  return allFeatures.filter(f => {
    const a = f.attributes;
    const lat = a.LATITUDE || (f.geometry && f.geometry.y);
    const lng = a.LONGITUDE || (f.geometry && f.geometry.x);
    return lat && lng && pointInPolygon(lng, lat, NAGLEE_PARK_BOUNDARY);
  });
}

// ---------- Map Module ----------
let map, clusterGroup, boundaryLayer;

function initMap() {
  map = L.map('map', {
    center: MAP_CENTER,
    zoom: 15,
    scrollWheelZoom: true,
    zoomControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    maxZoom: 19
  }).addTo(map);

  // Add boundary polygon
  boundaryLayer = L.polygon(BOUNDARY_LATLNGS, {
    color: '#f59e0b',
    weight: 2,
    fillColor: '#f59e0b',
    fillOpacity: 0.07,
    dashArray: '6 4'
  }).addTo(map);

  // Cluster group
  clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 40,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      let size = 'small';
      if (count > 100) size = 'large';
      else if (count > 30) size = 'medium';
      return L.divIcon({
        html: '<div>' + count + '</div>',
        className: 'marker-cluster marker-cluster-' + size,
        iconSize: L.point(36, 36)
      });
    }
  });
  map.addLayer(clusterGroup);

  // Legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML =
      '<strong>Severity</strong><br>' +
      '<i style="background:#ef4444"></i> Fatal<br>' +
      '<i style="background:#f97316"></i> Severe Injury<br>' +
      '<i style="background:#eab308"></i> Moderate Injury<br>' +
      '<i style="background:#9ca3af"></i> Minor / PDO';
    return div;
  };
  legend.addTo(map);
}

function getSeverityColor(feature) {
  const attrs = feature.attributes;
  if (attrs.FATALINJURIES > 0) return SEVERITY_COLORS.fatal;
  if (attrs.SEVEREINJURIES > 0) return SEVERITY_COLORS.severe;
  if (attrs.INJURYSEVERITY === 'Moderate Injury' || attrs.INJURYSEVERITY === 'Other Visible Injury')
    return SEVERITY_COLORS.moderate;
  return SEVERITY_COLORS.minor;
}

function formatDate(epoch) {
  if (!epoch) return 'Unknown';
  return new Date(epoch).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function updateMapMarkers(features) {
  clusterGroup.clearLayers();
  let fatalCount = 0;
  let totalCount = features.length;

  features.forEach(f => {
    const a = f.attributes;
    const lat = a.LATITUDE || (f.geometry && f.geometry.y);
    const lng = a.LONGITUDE || (f.geometry && f.geometry.x);
    if (!lat || !lng) return;

    if (a.FATALINJURIES > 0) fatalCount++;

    const color = getSeverityColor(f);
    const marker = L.circleMarker([lat, lng], {
      radius: a.FATALINJURIES > 0 ? 7 : 5,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.6
    });

    const streets = [a.INTASTREETNAME, a.INTBSTREETNAME].filter(Boolean).join(' & ') || 'Unknown location';
    marker.bindPopup(
      `<div style="font-family:Inter,sans-serif;font-size:.85rem;line-height:1.5;min-width:180px">` +
      `<strong>${streets}</strong><br>` +
      `<span style="color:#94a3b8">${formatDate(a.CRASHDATETIME)}</span><br>` +
      `<b>Type:</b> ${a.COLLISIONTYPE || '—'}<br>` +
      `<b>Severity:</b> ${a.INJURYSEVERITY || '—'}<br>` +
      (a.FATALINJURIES > 0 ? `<b style="color:#ef4444">Fatal: ${a.FATALINJURIES}</b><br>` : '') +
      (a.SEVEREINJURIES > 0 ? `<b style="color:#f97316">Severe: ${a.SEVEREINJURIES}</b><br>` : '') +
      (a.PRIMARYCOLLISIONFACTOR ? `<b>Factor:</b> ${a.PRIMARYCOLLISIONFACTOR}<br>` : '') +
      (a.SPEEDINGFLAG === 'Y' ? '<span style="color:#eab308">Speeding</span> ' : '') +
      (a.HITANDRUNFLAG === 'Y' ? '<span style="color:#f97316">Hit & Run</span>' : '') +
      `</div>`,
      { maxWidth: 260 }
    );

    clusterGroup.addLayer(marker);
  });

  document.getElementById('crash-count').innerHTML = `Showing <strong>${totalCount.toLocaleString()}</strong> crashes`;
  document.getElementById('fatal-count').innerHTML = totalCount > 0
    ? `<strong style="color:#ef4444">${fatalCount}</strong> fatal`
    : '';
}

// ---------- Slider Module ----------
let sliderTimeout;
const pointCache = {};

function initSlider() {
  const slider = document.getElementById('year-slider');
  noUiSlider.create(slider, {
    start: [1977, 2025],
    connect: true,
    step: 1,
    range: { min: 1977, max: 2025 },
    tooltips: [
      { to: v => Math.round(v) },
      { to: v => Math.round(v) }
    ],
    pips: {
      mode: 'values',
      values: [1977, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025],
      density: 4
    }
  });

  slider.noUiSlider.on('change', function(values) {
    const start = Math.round(values[0]);
    const end = Math.round(values[1]);
    document.getElementById('slider-start').textContent = start;
    document.getElementById('slider-end').textContent = end;

    clearTimeout(sliderTimeout);
    sliderTimeout = setTimeout(() => loadMapData(start, end), 300);
  });
}

async function loadMapData(yearStart, yearEnd) {
  const cacheKey = `${yearStart}-${yearEnd}`;
  if (pointCache[cacheKey]) {
    updateMapMarkers(pointCache[cacheKey]);
    return;
  }

  document.getElementById('crash-count').innerHTML = 'Loading…';
  try {
    const features = await fetchCrashPoints(yearStart, yearEnd);
    pointCache[cacheKey] = features;
    updateMapMarkers(features);
  } catch (err) {
    console.error('Failed to load crash data:', err);
    document.getElementById('crash-count').innerHTML = 'Error loading data';
  }
}

// ---------- Charts Module ----------
async function fetchAllStats() {
  const yearStats = [
    { statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'total' },
    { statisticType: 'sum', onStatisticField: 'FATALINJURIES', outStatisticFieldName: 'fatal' },
    { statisticType: 'sum', onStatisticField: 'SEVEREINJURIES', outStatisticFieldName: 'severe' }
  ];

  const typeStats = [
    { statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'total' }
  ];

  const factorStats = [
    { statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'total' }
  ];

  const [yearData, typeData, factorData, hourData, dayData] = await Promise.all([
    fetchCrashStats('YEAR', yearStats),
    fetchCrashStats('COLLISIONTYPE', typeStats),
    fetchCrashStats('PRIMARYCOLLISIONFACTOR', factorStats),
    fetchCrashStats('HOUR', [{ statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'total' }]),
    fetchCrashStats('DAYOFWEEKNAME', [{ statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'total' }])
  ]);

  return { yearData, typeData, factorData, hourData, dayData };
}

function renderTimelineChart(data) {
  if (!data.features || !data.features.length) return;

  const sorted = data.features
    .map(f => f.attributes)
    .sort((a, b) => (a.YEAR || '').localeCompare(b.YEAR || ''));

  const labels = sorted.map(r => r.YEAR);
  const totals = sorted.map(r => r.total);
  const ksi = sorted.map(r => (r.fatal || 0) + (r.severe || 0));

  // Annotation positions
  const interventions = [
    { year: '1988', label: 'Medians Installed', color: '#22c55e' },
    { year: '2000', label: 'Policy 5-6', color: '#3b82f6' },
    { year: '2015', label: 'Vision Zero', color: '#8b5cf6' },
    { year: '2018', label: 'Better Bikeways', color: '#06b6d4' },
    { year: '2022', label: 'Record Deaths', color: '#ef4444' }
  ];

  const annotationLines = {};
  interventions.forEach((iv, i) => {
    const idx = labels.indexOf(iv.year);
    if (idx === -1) return;
    annotationLines['line' + i] = {
      type: 'line',
      xMin: idx, xMax: idx,
      borderColor: iv.color,
      borderWidth: 1.5,
      borderDash: [4, 4],
      label: {
        display: true,
        content: iv.label,
        position: 'start',
        backgroundColor: iv.color,
        color: '#fff',
        font: { size: 10, weight: '600' },
        padding: { x: 4, y: 2 },
        borderRadius: 3
      }
    };
  });

  new Chart(document.getElementById('timelineChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Crashes',
          data: totals,
          backgroundColor: 'rgba(59,130,246,0.5)',
          borderColor: 'rgba(59,130,246,0.8)',
          borderWidth: 1,
          order: 2
        },
        {
          label: 'Fatal + Severe',
          data: ksi,
          type: 'line',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          borderWidth: 2,
          pointRadius: 1.5,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.3,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
        annotation: { annotations: annotationLines }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 20 } },
        y: { beginAtZero: true, title: { display: true, text: 'Count' } }
      }
    },
    plugins: [{
      id: 'chartAreaBg',
      beforeDraw(chart) {
        const { ctx, chartArea: { left, top, width, height } } = chart;
        ctx.save();
        ctx.fillStyle = 'rgba(17,29,53,0.5)';
        ctx.fillRect(left, top, width, height);
        ctx.restore();
      }
    }]
  });

  // Set container height
  document.getElementById('timelineChart').parentElement.style.height = '400px';
}

function renderCollisionTypeChart(data) {
  if (!data.features || !data.features.length) return;

  const items = data.features
    .map(f => f.attributes)
    .filter(a => a.COLLISIONTYPE && a.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const colors = ['#3b82f6','#f59e0b','#ef4444','#22c55e','#8b5cf6','#06b6d4','#f97316','#ec4899'];

  new Chart(document.getElementById('collisionTypeChart'), {
    type: 'doughnut',
    data: {
      labels: items.map(r => r.COLLISIONTYPE),
      datasets: [{
        data: items.map(r => r.total),
        backgroundColor: colors,
        borderColor: '#111d35',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 12, usePointStyle: true, font: { size: 11 } }
        }
      }
    }
  });
}

function renderFactorsChart(data) {
  if (!data.features || !data.features.length) return;

  const items = data.features
    .map(f => f.attributes)
    .filter(a => a.PRIMARYCOLLISIONFACTOR && a.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  new Chart(document.getElementById('factorsChart'), {
    type: 'bar',
    data: {
      labels: items.map(r => r.PRIMARYCOLLISIONFACTOR),
      datasets: [{
        label: 'Crashes',
        data: items.map(r => r.total),
        backgroundColor: 'rgba(245,158,11,0.5)',
        borderColor: 'rgba(245,158,11,0.8)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function renderHourChart(data) {
  if (!data.features || !data.features.length) return;

  // Build 0–23 array
  const hourMap = {};
  data.features.forEach(f => {
    const h = f.attributes.HOUR;
    if (h != null) hourMap[h] = f.attributes.total;
  });

  const labels = Array.from({ length: 24 }, (_, i) => i);
  const values = labels.map(h => hourMap[h] || 0);

  new Chart(document.getElementById('hourChart'), {
    type: 'bar',
    data: {
      labels: labels.map(h => {
        if (h === 0) return '12am';
        if (h === 12) return '12pm';
        return h < 12 ? h + 'am' : (h - 12) + 'pm';
      }),
      datasets: [{
        label: 'Crashes',
        data: values,
        backgroundColor: values.map((_v, i) =>
          i >= 18 || i < 6 ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)'
        ),
        borderColor: values.map((_v, i) =>
          i >= 18 || i < 6 ? 'rgba(239,68,68,0.8)' : 'rgba(59,130,246,0.8)'
        ),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } },
        y: { beginAtZero: true }
      }
    }
  });
}

function renderDayChart(data) {
  if (!data.features || !data.features.length) return;

  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap = {};
  data.features.forEach(f => {
    const d = f.attributes.DAYOFWEEKNAME;
    if (d) dayMap[d] = f.attributes.total;
  });

  const values = dayOrder.map(d => dayMap[d] || 0);

  new Chart(document.getElementById('dayChart'), {
    type: 'bar',
    data: {
      labels: dayNames,
      datasets: [{
        label: 'Crashes',
        data: values,
        backgroundColor: 'rgba(139,92,246,0.5)',
        borderColor: 'rgba(139,92,246,0.8)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    }
  });
}

// ---------- Scroll Animations ----------
function initScrollAnimations() {
  // Fade in sections
  const sections = document.querySelectorAll('.chart-section, #stats-section, #pedestrian-section, #interventions-section, #future-section');
  sections.forEach(s => s.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));

  // Count-up for stat cards
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));
}

function animateCount(card) {
  const target = parseInt(card.dataset.target, 10);
  const prefix = card.dataset.prefix || '';
  const suffix = card.dataset.suffix || '';
  const numEl = card.querySelector('.stat-number');
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(target * eased);
    numEl.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', async () => {
  initMap();
  initSlider();
  initScrollAnimations();

  // Set last updated
  document.getElementById('last-updated').textContent = 'Page loaded ' + new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Load data in parallel
  const mapPromise = loadMapData(1977, 2025);

  const chartPromise = fetchAllStats().then(({ yearData, typeData, factorData, hourData, dayData }) => {
    renderTimelineChart(yearData);
    renderCollisionTypeChart(typeData);
    renderFactorsChart(factorData);
    renderHourChart(hourData);
    renderDayChart(dayData);
  }).catch(err => {
    console.error('Failed to load chart data:', err);
  });

  await Promise.all([mapPromise, chartPromise]);
});
