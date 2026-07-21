/* ==========================================================================
   MelodySaavan - Modern Premium Music Streaming Application Logic
   ========================================================================== */

const BASE_URL = 'https://melodysaavan.onrender.com';
const DEFAULT_PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%2322222d'/><circle cx='50' cy='50' r='22' fill='none' stroke='%238a2bbe' stroke-width='3'/><circle cx='50' cy='50' r='8' fill='%238a2bbe'/><path d='M50 28 L50 16 L72 20 L72 32 Z' fill='%238a2bbe'/></svg>";

function getLoaderHTML(text = 'Loading...') {
  return `
    <div class="loading-spinner">
      <div class="ios-spinner">
        <div class="spoke"></div>
        <div class="spoke"></div>
        <div class="spoke"></div>
        <div class="spoke"></div>
        <div class="spoke"></div>
        <div class="spoke"></div>
        <div class="spoke"></div>
        <div class="spoke"></div>
      </div>
      <span>${text}</span>
    </div>
  `;
}

function getCardSkeletonsHTML(count = 5) {
  let cards = '';
  for (let i = 0; i < count; i++) {
    cards += `
      <div class="music-card skeleton-card" style="pointer-events: none; box-shadow: none;">
        <div class="skeleton-card-img skeleton-shimmer-bg"></div>
        <div class="skeleton-card-title skeleton-pulse-bg"></div>
        <div class="skeleton-card-subtitle skeleton-pulse-bg"></div>
      </div>
    `;
  }
  return cards;
}

function getTrackListSkeletonsHTML(count = 5) {
  let rows = '';
  for (let i = 0; i < count; i++) {
    rows += `
      <tr class="skeleton-track-row-tr" style="pointer-events: none;">
        <td class="col-num" style="text-align: center; vertical-align: middle;">
          <div class="skeleton-pulse-bg" style="width: 14px; height: 14px; border-radius: 4px; margin: 0 auto;"></div>
        </td>
        <td class="col-title" style="display: flex; align-items: center; gap: 12px; border: none; padding: 12px 6px;">
          <div class="skeleton-track-art skeleton-shimmer-bg" style="width: 40px; height: 40px; border-radius: var(--border-radius-sm); flex-shrink: 0;"></div>
          <div style="display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0;">
            <div class="skeleton-track-title skeleton-pulse-bg" style="height: 12px; width: 60%; border-radius: 4px;"></div>
            <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 8px; width: 40%; border-radius: 4px;"></div>
          </div>
        </td>
        <td class="col-album">
          <div class="skeleton-track-album skeleton-pulse-bg" style="height: 12px; width: 50%; border-radius: 4px;"></div>
        </td>
        <td class="col-year">
          <div class="skeleton-track-year skeleton-pulse-bg" style="height: 12px; width: 30px; border-radius: 4px;"></div>
        </td>
        <td class="col-actions">
          <div class="skeleton-pulse-bg" style="width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: middle;"></div>
          <div class="skeleton-pulse-bg" style="width: 20px; height: 20px; border-radius: 50%; display: inline-block; vertical-align: middle;"></div>
        </td>
      </tr>
    `;
  }
  return rows;
}

function getSongRowSkeletonsHTML(count = 5) {
  let rows = '';
  for (let i = 0; i < count; i++) {
    rows += `
      <div class="song-row skeleton-row" style="pointer-events: none; box-shadow: none;">
        <div class="skeleton-track-art skeleton-shimmer-bg" style="width: 44px; height: 44px; border-radius: var(--border-radius-sm); flex-shrink: 0;"></div>
        <div class="song-meta" style="flex: 1; display: flex; flex-direction: column; gap: 6px; padding-left: 12px; min-width: 0;">
          <div class="skeleton-track-title skeleton-pulse-bg" style="height: 14px; width: 60%; border-radius: 4px;"></div>
          <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 10px; width: 40%; border-radius: 4px;"></div>
        </div>
        <div class="skeleton-track-year skeleton-pulse-bg" style="height: 12px; width: 30px; border-radius: 4px; margin-right: 16px;"></div>
      </div>
    `;
  }
  return rows;
}

function getBestMatchSkeletonHTML() {
  return `
    <div class="skeleton-track-art skeleton-shimmer-bg" style="width: 90px; height: 90px; border-radius: var(--border-radius-md); flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);"></div>
    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
      <div class="skeleton-track-title skeleton-pulse-bg" style="height: 10px; width: 45px; border-radius: 4px;"></div>
      <div class="skeleton-track-title skeleton-pulse-bg" style="height: 24px; width: 80%; border-radius: 6px; margin-top: 8px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 14px; width: 50%; border-radius: 4px; margin-top: 4px;"></div>
    </div>
  `;
}

function getHeaderSkeletonHTML() {
  return `
    <div class="skeleton-track-art skeleton-shimmer-bg" style="width: 180px; height: 180px; border-radius: var(--border-radius-lg); flex-shrink: 0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);"></div>
    <div style="flex: 1; display: flex; flex-direction: column; gap: 16px; width: 100%;">
      <div class="skeleton-track-title skeleton-pulse-bg" style="height: 12px; width: 60px; border-radius: 4px;"></div>
      <div class="skeleton-track-title skeleton-pulse-bg" style="height: 36px; width: 60%; border-radius: 6px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 14px; width: 80%; border-radius: 4px;"></div>
    </div>
  `;
}

function getEmptyStateHTML(iconName, title, desc) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="empty-state-title">${title}</div>
      <div class="empty-state-desc">${desc}</div>
    </div>
  `;
}

const preloadedImages = new Set();
function preloadImage(url) {
  if (!url || preloadedImages.has(url)) return;
  preloadedImages.add(url);
  const img = new Image();
  img.src = url;
}

function setAlbumArtWithFade(imgElement, newSrc) {
  if (!imgElement) return;
  imgElement.style.opacity = '0';
  const tempImg = new Image();
  tempImg.onload = () => {
    imgElement.src = newSrc;
    imgElement.style.opacity = '1';
  };
  tempImg.onerror = () => {
    imgElement.src = newSrc;
    imgElement.style.opacity = '1';
  };
  tempImg.src = newSrc;
}

let preloadAudioElement = null;
function preloadAudioStream(url) {
  if (!url) return;
  if (!preloadAudioElement) {
    preloadAudioElement = document.createElement('audio');
    preloadAudioElement.preload = 'auto';
  }
  preloadAudioElement.src = url;
  preloadAudioElement.load();
}

async function preloadNextTrack() {
  if (state.queue.length === 0 || state.currentIndex === -1) return;

  let nextIdx = state.currentIndex + 1;
  if (nextIdx >= state.queue.length) {
    if (state.repeatMode === 'all') {
      nextIdx = 0;
    } else {
      return; // No next track to preload
    }
  }

  const nextTrack = state.queue[nextIdx];
  if (!nextTrack) return;

  // 1. Resolve media url / details if missing
  let detailedTrack = nextTrack;
  if (!nextTrack.more_info?.media_url) {
    try {
      const res = await fetchAPI(`/api/Song/GetById?songId=${nextTrack.id}`);
      if (res && res.songs && res.songs.length > 0) {
        detailedTrack = res.songs[0];
        // Cache the details back into the queue
        state.queue[nextIdx] = detailedTrack;
        renderQueueList(); // Re-render queue with full details
      }
    } catch (e) {
      console.warn("Failed resolving next track for preload:", e);
    }
  }

  // 2. Preload media stream
  if (detailedTrack && detailedTrack.more_info?.media_url) {
    preloadAudioStream(detailedTrack.more_info.media_url);
  }

  // 3. Preload album art image
  if (detailedTrack && detailedTrack.image) {
    const highResImg = detailedTrack.image.replace('150x150', '250x250');
    preloadImage(highResImg);
    preloadImage(detailedTrack.image);
  }
}

// ---------------------------------------------------------
// 1. Application State
// ---------------------------------------------------------
const state = {
  // Audio & Queue State
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  originalQueue: [], // For shuffle reset
  shuffleActive: false,
  repeatMode: 'off', // 'off', 'one', 'all'
  volume: 0.8,
  isMuted: false,

  // Library State (LocalStorage persistent)
  favorites: [],
  customPlaylists: [],

  // Navigation & UI Routing State
  currentView: 'home',
  currentViewData: null,
  navigationHistory: [],
  historyIndex: -1,
  isSearching: false,
  theme: 'dark',

  // Auth & Session State
  isLoggedIn: false,
  phoneNumber: '',
  cookies: '',
  correlationId: '',
  jioPlaylists: [],
  jioLibrary: null,
  libraryAlbums: [],
  libraryPlaylists: [],
  libraryShows: [],
  libraryArtists: [],
  userImage: '',
  recaptchaWidgetId: null,
  wasDraggingMiniPlayer: false
};

// ---------------------------------------------------------
// 2. Audio Engine Setup
// ---------------------------------------------------------
const audio = document.getElementById('audio-element');

function initAudio() {
  audio.volume = state.volume;

  audio.addEventListener('timeupdate', () => {
    updateTimeline();
  });

  audio.addEventListener('durationchange', () => {
    const durationEl = document.getElementById('player-time-duration');
    durationEl.textContent = formatTime(audio.duration || 0);
    const mobileDurationEl = document.getElementById('mobile-player-time-duration');
    if (mobileDurationEl) {
      mobileDurationEl.textContent = formatTime(audio.duration || 0);
    }
  });

  audio.addEventListener('ended', () => {
    handleTrackEnded();
  });

  audio.addEventListener('play', () => {
    state.isPlaying = true;
    updatePlayerUI();
  });

  audio.addEventListener('pause', () => {
    state.isPlaying = false;
    updatePlayerUI();
  });
}

// ---------------------------------------------------------
// 3. API Client Wrapper
// ---------------------------------------------------------
async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    showToast(`Failed to load data. API might be sleeping/scaling.`);
    return null;
  }
}

// ---------------------------------------------------------
// 4. View Router & Navigation Stacks
// ---------------------------------------------------------
function navigateTo(viewName, data = null, pushToHistory = true) {
  const activePanels = document.querySelectorAll('.view-panel.active');
  const targetViewName = (viewName === 'album') ? 'playlist' :
    (['new-releases', 'top-charts', 'featured-playlists', 'top-artists'].includes(viewName)) ? 'category-grid' : viewName;
  const targetView = document.getElementById(`view-${targetViewName}`);

  // Highlight active nav tab if navigation matches
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeNav = document.getElementById(`nav-${viewName}`);
  if (activeNav) {
    activeNav.classList.add('active');
  }

  // Handle Search Input display inside top bar
  const searchBarContainer = document.getElementById('header-search-bar');
  if (viewName === 'search') {
    searchBarContainer.classList.add('visible');
  } else {
    searchBarContainer.classList.remove('visible');
  }

  state.currentView = viewName;
  state.currentViewData = data;

  const performShowNewView = () => {
    if (targetView) {
      targetView.classList.add('active');
      document.getElementById('viewport').scrollTop = 0;
    }

    // View specific loaders
    if (viewName === 'home') {
      loadHomeData();
      startFeaturedPlaylistsAutoplay();
    } else {
      // Clear autoplay when leaving the home view to save CPU cycles
      if (typeof featuredAutoplayInterval !== 'undefined') {
        clearInterval(featuredAutoplayInterval);
      }

      if (viewName === 'library') {
        renderLibraryView();
      } else if (viewName === 'history') {
        renderHistoryView();
      } else if (viewName === 'playlist' && data) {
        loadPlaylistDetail(data);
      } else if (viewName === 'artist' && data) {
        loadArtistDetail(data);
      } else if (viewName === 'album' && data) {
        loadAlbumDetailByToken(data.token);
      } else if (viewName === 'search') {
        loadTrendingSearches();
      } else if (viewName === 'new-releases') {
        loadNewReleasesPage();
      } else if (viewName === 'top-charts') {
        loadTopChartsPage();
      } else if (viewName === 'featured-playlists') {
        loadFeaturedPlaylistsPage();
      } else if (viewName === 'top-artists') {
        loadTopArtistsPage();
      }
    }
  };

  if (activePanels.length > 0 && targetView && activePanels[0].id !== `view-${targetViewName}`) {
    const currentActive = activePanels[0];
    currentActive.classList.add('fading-out');

    setTimeout(() => {
      currentActive.classList.remove('active', 'fading-out');
      performShowNewView();
    }, 150);
  } else {
    activePanels.forEach(p => p.classList.remove('active'));
    performShowNewView();
  }

  // Manage navigation stack history
  if (pushToHistory) {
    // Slice off any "forward" history if we navigated somewhere new
    if (state.historyIndex < state.navigationHistory.length - 1) {
      state.navigationHistory = state.navigationHistory.slice(0, state.historyIndex + 1);
    }
    state.navigationHistory.push({ viewName, data });
    state.historyIndex = state.navigationHistory.length - 1;
  }

  updateHistoryButtons();
}

function goBack() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    const prev = state.navigationHistory[state.historyIndex];
    navigateTo(prev.viewName, prev.data, false);
  }
}

function goForward() {
  if (state.historyIndex < state.navigationHistory.length - 1) {
    state.historyIndex++;
    const next = state.navigationHistory[state.historyIndex];
    navigateTo(next.viewName, next.data, false);
  }
}

function updateHistoryButtons() {
  document.getElementById('btn-history-back').disabled = state.historyIndex <= 0;
  document.getElementById('btn-history-forward').disabled = state.historyIndex >= state.navigationHistory.length - 1;
}

// ---------------------------------------------------------
// 5. Data Loaders & View Renderers
// ---------------------------------------------------------

// --- HOME VIEW ---
let homeDataLoaded = false;
async function loadHomeData() {
  if (homeDataLoaded) return; // Prevent double loads

  const homeData = await fetchAPI('/api/Song/GetHome');
  if (homeData) {
    const container = document.getElementById('home-shelves-container');
    if (container) {
      container.innerHTML = ''; // Clear out the skeleton loader
    }

    // Dynamic shelf mappings for standard hardcoded modules
    const keyMappings = {
      new_trending: {
        title: 'Trending Now',
        subtitle: 'Popular songs and albums trending this week',
        type: 'mixed'
      },
      new_albums: {
        title: 'New Releases',
        subtitle: 'Fresh tracks straight from the charts',
        type: 'mixed'
      },
      radio: {
        title: 'Featured Radio Stations',
        subtitle: 'Tune in to continuous streams of your favorites',
        type: 'mixed'
      },
      charts: {
        title: 'Top Charts',
        subtitle: 'The hottest trending playlists',
        type: 'playlist'
      },
      top_playlists: {
        title: 'Featured Playlists',
        subtitle: 'Curated collections for every mood',
        type: 'playlist'
      }
    };

    // Iterate over all keys in the home response
    for (const key in homeData) {
      const section = homeData[key];
      if (!section) continue;

      let title = '';
      let subtitle = '';
      let items = [];
      let isPlaylistType = false;

      if (keyMappings[key]) {
        title = keyMappings[key].title;
        subtitle = keyMappings[key].subtitle;
        items = section;
        isPlaylistType = keyMappings[key].type === 'playlist';
      } else if (key.startsWith('promo') || (typeof section === 'object' && !Array.isArray(section))) {
        // Handle promotional dynamic blocks (e.g. promo:vx:data:68)
        title = section.title || key;
        subtitle = section.subtitle || '';
        items = section.list || section.data || [];

        // Determine block display layout type
        isPlaylistType = key.includes('fresh-hits') || key.includes('genres') || key.includes('best-90s') || key.includes('charts') || key.includes('playlists') || (items[0] && (items[0].type === 'playlist' || items[0].type === 'album'));
      } else if (Array.isArray(section)) {
        // Fallback for generic arrays
        title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        subtitle = '';
        items = section;
        isPlaylistType = items[0] && (items[0].type === 'playlist' || items[0].type === 'album');
      }

      if (!items || !Array.isArray(items) || items.length === 0) continue;

      const cleanTitle = title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const cleanSubtitle = subtitle.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const shelfId = `shelf-dynamic-${key.replace(/:/g, '-')}`;

      // Create shelf container elements
      const shelfEl = document.createElement('div');
      shelfEl.className = 'shelf';
      shelfEl.innerHTML = `
        <div class="shelf-header">
          <div class="shelf-header-text">
            <h2>${cleanTitle}</h2>
            ${cleanSubtitle ? `<span class="shelf-subtitle">${cleanSubtitle}</span>` : ''}
          </div>
          <div class="shelf-nav-buttons">
            <button class="shelf-nav-btn prev-btn" data-target="${shelfId}" title="Slide Left">
              <i data-lucide="chevron-left"></i>
            </button>
            <button class="shelf-nav-btn next-btn" data-target="${shelfId}" title="Slide Right">
              <i data-lucide="chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="shelf-scroll scroll-gradient" id="${shelfId}"></div>
      `;

      if (container) {
        container.appendChild(shelfEl);
      }

      // Bind dynamic slider click handlers directly
      const prevBtn = shelfEl.querySelector('.prev-btn');
      const nextBtn = shelfEl.querySelector('.next-btn');
      const scrollCarousel = (direction) => {
        const scrollContainer = document.getElementById(shelfId);
        if (scrollContainer) {
          const firstCard = scrollContainer.querySelector('.music-card');
          let cardWidth = 175 + 20;
          if (firstCard) {
            const style = window.getComputedStyle(scrollContainer);
            const gap = parseInt(style.gap) || 20;
            cardWidth = firstCard.offsetWidth + gap;
          }
          scrollContainer.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        }
      };

      if (prevBtn) prevBtn.onclick = () => scrollCarousel(-1);
      if (nextBtn) nextBtn.onclick = () => scrollCarousel(1);

      // Render cards
      if (isPlaylistType) {
        renderPlaylistCards(shelfId, items);
      } else {
        renderMixedCards(shelfId, items);
      }

      // Special case: autoplay featured playlists if loaded
      if (key === 'top_playlists') {
        startFeaturedPlaylistsAutoplay();
      }
    }

    // 11. Render Top Artists and Update Hero Banner
    const topArtistsData = await fetchAPI('/api/Song/TopArtists');
    if (topArtistsData && topArtistsData.top_artists) {
      const topArtists = topArtistsData.top_artists.map(item => ({
        artistid: item.artistid || item.id,
        name: item.name || item.title,
        image: item.image,
        perma_url: item.perma_url,
        follower_count: item.follower_count || (Math.floor(Math.random() * 800000) + 200000)
      }));

      const artistShelfId = 'shelf-dynamic-top-artists';
      const artistShelfEl = document.createElement('div');
      artistShelfEl.className = 'shelf';
      artistShelfEl.innerHTML = `
        <div class="shelf-header">
          <div class="shelf-header-text">
            <h2>Top Artists</h2>
            <span class="shelf-subtitle">Popular musicians globally</span>
          </div>
          <div class="shelf-nav-buttons">
            <button class="shelf-nav-btn prev-btn" data-target="${artistShelfId}" title="Slide Left">
              <i data-lucide="chevron-left"></i>
            </button>
            <button class="shelf-nav-btn next-btn" data-target="${artistShelfId}" title="Slide Right">
              <i data-lucide="chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="shelf-scroll scroll-gradient" id="${artistShelfId}"></div>
      `;

      if (container) {
        container.appendChild(artistShelfEl);
      }

      const prevBtn = artistShelfEl.querySelector('.prev-btn');
      const nextBtn = artistShelfEl.querySelector('.next-btn');
      const scrollCarousel = (direction) => {
        const scrollContainer = document.getElementById(artistShelfId);
        if (scrollContainer) {
          const firstCard = scrollContainer.querySelector('.music-card');
          let cardWidth = 175 + 20;
          if (firstCard) {
            const style = window.getComputedStyle(scrollContainer);
            const gap = parseInt(style.gap) || 20;
            cardWidth = firstCard.offsetWidth + gap;
          }
          scrollContainer.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        }
      };

      if (prevBtn) prevBtn.onclick = () => scrollCarousel(-1);
      if (nextBtn) nextBtn.onclick = () => scrollCarousel(1);

      renderArtistCards(artistShelfId, topArtists);
      updateHeroBanner(topArtists);
    }

    homeDataLoaded = true;
  }
}

async function loadNewReleasesPage() {
  const titleEl = document.getElementById('category-grid-title');
  const subtitleEl = document.getElementById('category-grid-subtitle');
  const container = document.getElementById('category-grid-container');

  titleEl.textContent = 'New Releases';
  subtitleEl.textContent = 'Fresh tracks straight from the charts';

  container.innerHTML = getCardSkeletonsHTML(10);

  const newReleases = await fetchAPI('/api/Song/NewReleases');
  if (newReleases && newReleases.data) {
    renderMixedCards('category-grid-container', newReleases.data);
  } else {
    container.innerHTML = '<div style="color:var(--text-muted); padding: 40px 0;">Failed to load new releases.</div>';
  }
}

async function loadTopChartsPage() {
  const titleEl = document.getElementById('category-grid-title');
  const subtitleEl = document.getElementById('category-grid-subtitle');
  const container = document.getElementById('category-grid-container');

  titleEl.textContent = 'Top Charts';
  subtitleEl.textContent = 'The hottest trending playlists right now';

  container.innerHTML = getCardSkeletonsHTML(10);

  const topCharts = await fetchAPI('/api/Song/TopCharts');
  if (topCharts) {
    renderPlaylistCards('category-grid-container', topCharts);
  } else {
    container.innerHTML = '<div style="color:var(--text-muted); padding: 40px 0;">Failed to load top charts.</div>';
  }
}

async function loadFeaturedPlaylistsPage() {
  const titleEl = document.getElementById('category-grid-title');
  const subtitleEl = document.getElementById('category-grid-subtitle');
  const container = document.getElementById('category-grid-container');

  titleEl.textContent = 'Featured Playlists';
  subtitleEl.textContent = 'Curated collections for every mood and genre';

  container.innerHTML = getCardSkeletonsHTML(10);

  const featured = await fetchAPI('/api/Song/FeaturedPlaylists');
  if (featured && featured.data) {
    renderPlaylistCards('category-grid-container', featured.data);
  } else {
    container.innerHTML = '<div style="color:var(--text-muted); padding: 40px 0;">Failed to load featured playlists.</div>';
  }
}

async function loadTopArtistsPage() {
  const titleEl = document.getElementById('category-grid-title');
  const subtitleEl = document.getElementById('category-grid-subtitle');
  const container = document.getElementById('category-grid-container');

  titleEl.textContent = 'Top Artists';
  subtitleEl.textContent = 'Explore popular musicians globally';

  container.innerHTML = getCardSkeletonsHTML(10);

  const topArtists = await fetchAPI('/api/Song/TopArtists');
  if (topArtists && topArtists.top_artists) {
    const mapped = topArtists.top_artists.map(item => ({
      artistid: item.artistid || item.id,
      name: item.name || item.title,
      image: item.image,
      perma_url: item.perma_url,
      follower_count: item.follower_count || (Math.floor(Math.random() * 800000) + 200000)
    }));
    renderArtistCards('category-grid-container', mapped);
  } else {
    container.innerHTML = '<div style="color:var(--text-muted); padding: 40px 0;">Failed to load top artists.</div>';
  }
}

function updateHeroBanner(artists) {
  if (!artists || artists.length === 0) return;

  // Pick a random artist from the top 5 to make the hero banner dynamic
  const artist = artists[Math.floor(Math.random() * Math.min(artists.length, 5))];

  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-desc');
  const heroImage = document.querySelector('.hero-image');
  const btnHeroPlay = document.getElementById('btn-hero-play');
  const btnHeroExplore = document.getElementById('btn-hero-explore');

  if (heroTitle && artist) {
    heroTitle.textContent = artist.name;
    heroDesc.textContent = `Stream the latest hits, popular tracks, and curated collections from ${artist.name} on MelodySaavan.`;
    heroImage.src = artist.image || 'https://via.placeholder.com/150';
    heroImage.alt = artist.name;

    // Bind Hero Play Button
    btnHeroPlay.onclick = async () => {
      const results = await fetchAPI(`/api/Song/SearchByQuery?query=${encodeURIComponent(artist.name)}`);
      if (results && results.results && results.results.length > 0) {
        playTrackList(results.results, 0);
        showToast(`Playing ${artist.name} Radio`);
      }
    };

    // Bind Hero Explore Button
    btnHeroExplore.onclick = () => {
      const token = artist.perma_url ? artist.perma_url.split('/').filter(Boolean).pop() : null;
      navigateTo('artist', { id: artist.artistid, name: artist.name, image: artist.image, token });
    };
  }
}

let featuredAutoplayInterval;
let lastFeaturedScrollLeft = -1;

function startFeaturedPlaylistsAutoplay() {
  const container = document.getElementById('shelf-featured-playlists');
  if (!container) return;

  // Clear any existing autoplay interval
  clearInterval(featuredAutoplayInterval);

  featuredAutoplayInterval = setInterval(() => {
    const firstCard = container.querySelector('.music-card');
    let cardWidth = 175 + 20; // Default fallback
    if (firstCard) {
      const style = window.getComputedStyle(container);
      const gap = parseInt(style.gap) || 20;
      cardWidth = firstCard.offsetWidth + gap;
    }
    const currentScroll = container.scrollLeft;

    // If the scroll position didn't change since the last check and we are not at 0,
    // we have reached the end of the carousel. Reset scroll back to the start.
    if (currentScroll === lastFeaturedScrollLeft && currentScroll > 0) {
      container.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
      lastFeaturedScrollLeft = 0;
    } else {
      lastFeaturedScrollLeft = currentScroll;
      container.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  }, 5000); // 5 seconds

  // Pause autoplay on mouse hover, resume on mouse leave
  if (!container.dataset.hoverBound) {
    container.addEventListener('mouseenter', () => {
      clearInterval(featuredAutoplayInterval);
    });
    container.addEventListener('mouseleave', () => {
      startFeaturedPlaylistsAutoplay();
    });
    container.dataset.hoverBound = 'true';
  }
}

function renderSongCards(containerId, songs) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  songs.forEach(song => {
    const cleanTitle = song.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanSubtitle = song.subtitle.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const image = song.image || 'https://via.placeholder.com/150';

    const card = document.createElement('div');
    card.className = 'music-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
        <button class="card-play-btn" title="Play Now">
          <i data-lucide="play"></i>
        </button>
      </div>
      <div class="card-info">
        <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
        <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
      </div>
    `;

    // Play button on card click
    card.querySelector('.card-play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      playTrackDirectly(song);
    });

    card.addEventListener('click', () => {
      playTrackDirectly(song);
    });

    container.appendChild(card);
  });

  lucide.createIcons();
}

async function playRadioStation(radio) {
  showToast(`Starting Radio: ${radio.title}...`);
  const results = await fetchAPI(`/api/Song/SearchByQuery?query=${encodeURIComponent(radio.title)}`);
  if (results && results.results && results.results.length > 0) {
    playTrackList(results.results, 0);
  } else {
    showToast(`Could not start radio for ${radio.title}`);
  }
}

function renderMixedCards(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !items || !Array.isArray(items)) return;
  container.innerHTML = '';

  items.forEach(item => {
    const cleanTitle = item.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanSubtitle = (item.subtitle || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const image = item.image || DEFAULT_PLACEHOLDER_IMAGE;

    const card = document.createElement('div');
    card.className = 'music-card';

    let playBtnHTML = '';
    if (item.type === 'song' || item.type === 'radio_station') {
      playBtnHTML = `
        <button class="card-play-btn" title="Play Now">
          <i data-lucide="play"></i>
        </button>
      `;
    } else {
      playBtnHTML = `
        <button class="card-play-btn" title="View Detail">
          <i data-lucide="eye"></i>
        </button>
      `;
    }

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
        ${playBtnHTML}
      </div>
      <div class="card-info">
        <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
        <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
      </div>
    `;

    // Click handler for card
    card.addEventListener('click', () => {
      if (item.type === 'song') {
        playTrackDirectly(item);
      } else if (item.type === 'radio_station') {
        playRadioStation(item);
      } else if (item.type === 'album') {
        const token = item.perma_url ? item.perma_url.split('/').filter(Boolean).pop() : null;
        if (token) {
          navigateTo('album', { token });
        } else {
          navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle });
        }
      } else if (item.type === 'playlist') {
        navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle });
      } else if (item.type === 'channel') {
        navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle || 'Mood Channel' });
      } else if (item.type === 'show') {
        navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle || 'Podcast Show' });
      }
    });

    // Make sure click on play button behaves the same
    const playBtn = card.querySelector('.card-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.type === 'song') {
          playTrackDirectly(item);
        } else if (item.type === 'radio_station') {
          playRadioStation(item);
        } else if (item.type === 'album') {
          const token = item.perma_url ? item.perma_url.split('/').filter(Boolean).pop() : null;
          if (token) {
            navigateTo('album', { token });
          } else {
            navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle });
          }
        } else if (item.type === 'playlist') {
          navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle });
        } else if (item.type === 'channel') {
          navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle || 'Mood Channel' });
        } else if (item.type === 'show') {
          navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle || 'Podcast Show' });
        }
      });
    }

    if (item.type === 'song' || item.type === 'album') {
      bindTrackContextMenu(card, item);
    }

    container.appendChild(card);
  });

  lucide.createIcons();
}

function renderPlaylistCards(containerId, playlists) {
  const container = document.getElementById(containerId);
  if (!container || !playlists || !Array.isArray(playlists)) return;
  container.innerHTML = '';

  playlists.forEach(playlist => {
    const cleanTitle = playlist.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    let cleanSubtitle = (playlist.subtitle || playlist.more_info?.firstname || 'Playlist').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const image = playlist.image || 'https://via.placeholder.com/150';

    const card = document.createElement('div');
    card.className = 'music-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
        <button class="card-play-btn" title="View Playlist">
          <i data-lucide="eye"></i>
        </button>
      </div>
      <div class="card-info">
        <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
        <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      navigateTo('playlist', { id: playlist.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle });
    });

    container.appendChild(card);
  });

  lucide.createIcons();
}

function renderArtistCards(containerId, artists) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  artists.forEach(artist => {
    const image = artist.image || 'https://via.placeholder.com/150';
    const card = document.createElement('div');
    card.className = 'music-card artist-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${image}" alt="${artist.name}" class="card-img" loading="lazy">
      </div>
      <div class="card-info">
        <span class="card-title">${artist.name}</span>
        <span class="card-subtitle">${formatFollowers(artist.follower_count)} Followers</span>
      </div>
    `;

    card.addEventListener('click', () => {
      const token = artist.perma_url ? artist.perma_url.split('/').filter(Boolean).pop() : null;
      navigateTo('artist', { id: artist.artistid, name: artist.name, image, token });
    });

    container.appendChild(card);
  });
}

// --- SEARCH VIEW ---
let searchDebounceTimer;
const searchInput = document.getElementById('input-search');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  const clearBtn = document.getElementById('btn-clear-search');

  if (query.length > 0) {
    clearBtn.style.display = 'flex';
    if (state.currentView !== 'search') {
      navigateTo('search');
    }
  } else {
    clearBtn.style.display = 'none';
  }

  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    executeSearch(query);
  }, 400);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    clearTimeout(searchDebounceTimer);
    executeSearch(searchInput.value.trim());
  }
});

document.getElementById('btn-clear-search').addEventListener('click', () => {
  searchInput.value = '';
  document.getElementById('btn-clear-search').style.display = 'none';
  executeSearch('');
});

searchInput.addEventListener('focus', () => {
  if (state.currentView !== 'search') {
    navigateTo('search');
  }
  loadTrendingSearches();
});

let topSearchesLoaded = false;
async function loadTrendingSearches() {
  if (topSearchesLoaded) return;

  const container = document.getElementById('trending-searches-grid');
  const section = document.getElementById('trending-searches-section');
  if (!container || !section) return;

  const data = await fetchAPI('/api/Song/TopSearches');
  if (data && Array.isArray(data) && data.length > 0) {
    container.innerHTML = '';

    data.forEach(item => {
      const cleanTitle = item.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const cleanSubtitle = (item.subtitle || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const image = item.image || 'https://via.placeholder.com/150';
      const badgeText = item.type.toUpperCase();

      const card = document.createElement('div');
      card.className = `music-card ${item.type === 'artist' ? 'artist-card' : ''}`;
      card.style.flex = '0 0 175px';

      let playBtnHTML = '';
      if (item.type === 'song') {
        playBtnHTML = `
          <button class="card-play-btn" title="Play Now">
            <i data-lucide="play"></i>
          </button>
        `;
      } else if (item.type === 'album') {
        playBtnHTML = `
          <button class="card-play-btn" title="View Album">
            <i data-lucide="eye"></i>
          </button>
        `;
      }

      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
          ${playBtnHTML}
        </div>
        <div class="card-info">
          <span style="font-size: 9px; font-weight: 800; color: var(--accent-primary); letter-spacing: 0.05em; display: inline-block;">${badgeText}</span>
          <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
          <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
        </div>
      `;

      // Bind click triggers
      if (item.type === 'song') {
        const playBtn = card.querySelector('.card-play-btn');
        if (playBtn) {
          playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playTrackDirectly(item);
          });
        }
        card.addEventListener('click', () => {
          playTrackDirectly(item);
        });
      } else if (item.type === 'artist') {
        card.addEventListener('click', () => {
          const token = item.perma_url ? item.perma_url.split('/').filter(Boolean).pop() : null;
          navigateTo('artist', { id: item.id, name: item.title, image, token });
        });
      } else if (item.type === 'album') {
        card.addEventListener('click', () => {
          const token = item.perma_url ? item.perma_url.split('/').filter(Boolean).pop() : null;
          if (token) {
            navigateTo('album', { token });
          } else {
            navigateTo('playlist', { id: item.id, title: cleanTitle, image, type: 'api', subtitle: cleanSubtitle });
          }
        });
      }

      container.appendChild(card);
    });

    lucide.createIcons();
    section.style.display = 'block';
    topSearchesLoaded = true;
  }
}

async function executeSearch(query) {
  const defaultState = document.getElementById('search-default-state');
  const resultsState = document.getElementById('search-results-state');
  const queryTextSpan = document.getElementById('search-query-text');

  if (!query) {
    defaultState.classList.remove('hidden');
    resultsState.classList.add('hidden');
    return;
  }

  defaultState.classList.add('hidden');
  resultsState.classList.remove('hidden');
  queryTextSpan.textContent = query;

  // Render loading skeleton/state
  const songsList = document.getElementById('search-songs-list');
  const bestMatchCard = document.getElementById('best-match-card');
  songsList.innerHTML = getSongRowSkeletonsHTML(5);
  bestMatchCard.innerHTML = getBestMatchSkeletonHTML();

  const searchResults = await fetchAPI(`/api/Song/SearchByQuery?query=${encodeURIComponent(query)}`);
  if (searchResults && searchResults.results && searchResults.results.length > 0) {
    renderSearchResults(searchResults.results);
  } else {
    songsList.innerHTML = '<div class="no-results">No songs found.</div>';
    bestMatchCard.innerHTML = '<div class="no-results">No matches found.</div>';
  }
}

function renderSearchResults(results) {
  const bestMatchCard = document.getElementById('best-match-card');
  const songsList = document.getElementById('search-songs-list');

  // 1. Render Best Match (the first result)
  const bestMatch = results[0];
  const cleanTitle = bestMatch.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const cleanSubtitle = bestMatch.subtitle.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const image = bestMatch.image || 'https://via.placeholder.com/150';

  bestMatchCard.innerHTML = `
    <img src="${image}" alt="${cleanTitle}" class="best-match-img">
    <div>
      <span class="best-match-badge">${bestMatch.type}</span>
      <h2 class="best-match-title" style="margin-top: 8px;">${cleanTitle}</h2>
      <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">${cleanSubtitle}</p>
    </div>
    <button class="best-match-play-btn" title="Play">
      <i data-lucide="play"></i>
    </button>
  `;

  bestMatchCard.onclick = () => playTrackDirectly(bestMatch);
  bestMatchCard.querySelector('.best-match-play-btn').onclick = (e) => {
    e.stopPropagation();
    playTrackDirectly(bestMatch);
  };

  // 2. Render Songs list (all results)
  songsList.innerHTML = '';
  const tracksToRender = results;

  tracksToRender.forEach((track, index) => {
    const rowTitle = track.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const rowSubtitle = track.subtitle.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const rowImg = track.image || 'https://via.placeholder.com/60';
    const duration = track.more_info?.duration ? formatTime(track.more_info.duration) : '3:00';

    const row = document.createElement('div');
    row.className = 'song-row';
    if (state.currentTrack?.id === track.id) {
      row.classList.add('active-song');
    }

    row.innerHTML = `
      <img src="${rowImg}" alt="${rowTitle}" class="song-row-img">
      <div class="song-row-meta">
        <span class="song-row-title">${rowTitle}</span>
        <span class="song-row-artist">${rowSubtitle}</span>
      </div>
      <span class="song-row-duration">${duration}</span>
      <div class="song-row-actions">
        <button class="song-row-btn btn-add-fav" title="Like">
          <i data-lucide="heart" class="${isLiked(track.id) ? 'fill-danger text-danger' : ''}"></i>
        </button>
        <button class="song-row-btn btn-add-playlist" title="Add to Playlist">
          <i data-lucide="plus"></i>
        </button>
      </div>
    `;

    // Play on row click (excluding buttons)
    row.addEventListener('click', (e) => {
      if (e.target.closest('.song-row-btn')) return;
      playTrackList(tracksToRender, index);
    });

    // Like button
    row.querySelector('.btn-add-fav').onclick = (e) => {
      e.stopPropagation();
      toggleLikeTrack(track);
      const icon = row.querySelector('.btn-add-fav i, .btn-add-fav svg');
      if (icon) {
        if (isLiked(track.id)) {
          icon.classList.add('fill-danger', 'text-danger');
        } else {
          icon.classList.remove('fill-danger', 'text-danger');
        }
      }
    };

    // Add to playlist button
    row.querySelector('.btn-add-playlist').onclick = (e) => {
      e.stopPropagation();
      openPlaylistSelectModal(track);
    };

    songsList.appendChild(row);
  });

  lucide.createIcons();
}

// --- PLAYLIST / CHART DETAIL VIEW ---
async function loadPlaylistDetail(playlist) {
  const containerHeader = document.getElementById('playlist-detail-header-card');
  const tracksTable = document.getElementById('playlist-tracks-table');

  // Reset/hide custom actions by default
  const deleteBtn = document.getElementById('btn-playlist-delete');
  if (deleteBtn) deleteBtn.style.display = 'none';

  const renameBtn = document.getElementById('btn-playlist-rename');
  if (renameBtn) {
    renameBtn.style.display = 'none';
    renameBtn.onclick = null;
  }

  // Set up header cards with details
  containerHeader.innerHTML = `
    <img src="${playlist.image}" alt="${playlist.title}" class="playlist-header-img">
    <div class="playlist-header-info">
      <span class="playlist-tag">PLAYLIST</span>
      <h1 class="playlist-title">${playlist.title}</h1>
      <p class="playlist-desc">${playlist.subtitle || 'Curated music compilation'}</p>
    </div>
  `;

  // Show options if it's a JioSaavn playlist owned by the logged-in user
  const isUserJioPlaylist = state.isLoggedIn && state.jioPlaylists.some(p => p.id === playlist.id);
  if (isUserJioPlaylist) {
    if (renameBtn) {
      renameBtn.style.display = 'inline-flex';
      renameBtn.onclick = () => {
        openRenamePlaylistModal(playlist);
      };
    }
    if (deleteBtn) {
      deleteBtn.style.display = 'inline-flex';
      deleteBtn.onclick = () => {
        openDeletePlaylistConfirmModal(playlist.id, playlist.title);
      };
    }
  }

  tracksTable.innerHTML = getTrackListSkeletonsHTML(5);

  let tracks = [];

  if (playlist.type === 'api') {
    // Fetch actual tracks using the GetPlaylist API
    const result = await fetchAPI(`/api/Song/GetPlaylist?playlistId=${playlist.id}`);
    if (result && result.list && result.list.length > 0) {
      tracks = result.list;
    } else {
      // Fallback: search the tracks using playlist title if GetPlaylist fails or returns empty
      const searchResults = await fetchAPI(`/api/Song/SearchByQuery?query=${encodeURIComponent(playlist.title)}`);
      if (searchResults && searchResults.results) {
        tracks = searchResults.results;
      }
    }
  } else if (playlist.type === 'local') {
    // Local custom playlist
    const localPlay = state.customPlaylists.find(p => p.id === playlist.id);
    if (localPlay) {
      tracks = localPlay.tracks;
      // Show Delete Playlist button
      document.getElementById('btn-playlist-delete').style.display = 'inline-flex';
      document.getElementById('btn-playlist-delete').onclick = () => {
        deleteCustomPlaylist(playlist.id);
      };
    }
  }

  if (tracks.length === 0) {
    tracksTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No tracks in this playlist.</td></tr>';
    return;
  }

  renderTracklistTable(tracks, tracksTable, playlist.id);

  // Playlist actions setup
  document.getElementById('btn-playlist-play-all').onclick = () => {
    playTrackList(tracks, 0);
  };

  document.getElementById('btn-playlist-shuffle').onclick = () => {
    state.shuffleActive = true;
    playTrackList(tracks, Math.floor(Math.random() * tracks.length));
  };
}

async function loadAlbumDetailByToken(token) {
  const containerHeader = document.getElementById('playlist-detail-header-card');
  const tracksTable = document.getElementById('playlist-tracks-table');

  containerHeader.innerHTML = getHeaderSkeletonHTML();
  tracksTable.innerHTML = getTrackListSkeletonsHTML(5);

  // Hide delete playlist button for API albums
  document.getElementById('btn-playlist-delete').style.display = 'none';

  const album = await fetchAPI(`/api/Song/GetAlbum?token=${encodeURIComponent(token)}`);
  if (album) {
    const cleanTitle = album.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanSubtitle = (album.subtitle || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

    containerHeader.innerHTML = `
      <img src="${album.image || DEFAULT_PLACEHOLDER_IMAGE}" alt="${cleanTitle}" class="playlist-header-img">
      <div class="playlist-header-info">
        <span class="playlist-tag">ALBUM</span>
        <h1 class="playlist-title">${cleanTitle}</h1>
        <p class="playlist-desc">${album.header_desc || cleanSubtitle || 'Album'}</p>
      </div>
    `;

    if (album.list && Array.isArray(album.list) && album.list.length > 0) {
      renderTracklistTable(album.list, tracksTable, album.id);

      // Setup action buttons
      document.getElementById('btn-playlist-play-all').onclick = () => {
        playTrackList(album.list, 0);
      };

      document.getElementById('btn-playlist-shuffle').onclick = () => {
        state.shuffleActive = true;
        playTrackList(album.list, Math.floor(Math.random() * album.list.length));
      };
    } else {
      tracksTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No tracks found in this album.</td></tr>';
    }
  } else {
    containerHeader.innerHTML = `<div style="padding: 40px 0; color: var(--text-muted);">Failed to load album.</div>`;
    tracksTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 0;">Album details unavailable.</td></tr>';
  }
}

// --- ARTIST DETAIL VIEW ---
async function loadArtistDetail(artist) {
  const headerCard = document.getElementById('artist-detail-header-card');
  const tracksTable = document.getElementById('artist-tracks-table');
  const extraContent = document.getElementById('artist-extra-content');

  extraContent.innerHTML = '';

  headerCard.innerHTML = `
    <div class="artist-header-bg" style="background-image: url('${artist.image}');"></div>
    <div class="artist-header-content">
      <img src="${artist.image}" alt="${artist.name}" class="artist-header-avatar">
      <div class="artist-header-meta">
        <span class="playlist-tag">ARTIST</span>
        <h1>${artist.name}</h1>
        <span class="artist-followers">Popular artist on JioSaavn</span>
      </div>
    </div>
  `;

  tracksTable.innerHTML = getTrackListSkeletonsHTML(5);

  let tracks = [];
  if (artist.token) {
    const artistData = await fetchAPI(`/api/Song/GetArtist?token=${encodeURIComponent(artist.token)}`);
    if (artistData) {
      // 1. Update Header Info with details
      let verifiedBadge = '';
      if (artistData.isVerified) {
        verifiedBadge = `<span class="verified-badge" style="display: inline-flex; align-items: center; gap: 4px; background: rgba(0, 180, 216, 0.2); color: #00b4d8; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 12px; margin-left: 10px; vertical-align: middle;"><i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> Verified</span>`;
      }

      const artistSubtitle = artistData.subtitle || `Artist • ${formatFollowers(artistData.follower_count)} Followers`;

      headerCard.innerHTML = `
        <div class="artist-header-bg" style="background-image: url('${artistData.image || artist.image}');"></div>
        <div class="artist-header-content">
          <img src="${artistData.image || artist.image}" alt="${artistData.name || artist.name}" class="artist-header-avatar">
          <div class="artist-header-meta">
            <span class="playlist-tag">ARTIST ${verifiedBadge}</span>
            <h1>${artistData.name || artist.name}</h1>
            <span class="artist-followers">${artistSubtitle}</span>
            <div class="artist-socials" style="display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap;">
              ${artistData.dob ? `<span style="font-size: 12px; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="calendar" style="width:12px;height:12px;"></i>Born: ${artistData.dob}</span>` : ''}
              ${artistData.fb ? `<a href="${artistData.fb}" target="_blank" style="color: var(--text-secondary); font-size:12px; text-decoration:none; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="facebook" style="width:12px;height:12px;"></i>Facebook</a>` : ''}
              ${artistData.twitter ? `<a href="${artistData.twitter}" target="_blank" style="color: var(--text-secondary); font-size:12px; text-decoration:none; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="twitter" style="width:12px;height:12px;"></i>Twitter</a>` : ''}
              ${artistData.wiki ? `<a href="${artistData.wiki}" target="_blank" style="color: var(--text-secondary); font-size:12px; text-decoration:none; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="book-open" style="width:12px;height:12px;"></i>Wikipedia</a>` : ''}
            </div>
          </div>
        </div>
      `;

      // 2. Set tracks
      if (artistData.topSongs && artistData.topSongs.length > 0) {
        tracks = artistData.topSongs;
      }

      // 3. Render Dedicated Playlists (Let's Play - ...)
      if (artistData.dedicated_artist_playlist && artistData.dedicated_artist_playlist.length > 0) {
        const shelfId = `artist-dedicated-${Date.now()}`;
        const shelfHTML = createArtistPlaylistShelfHTML("Dedicated Playlists", shelfId, artistData.dedicated_artist_playlist);
        extraContent.appendChild(shelfHTML);
        bindShelfScroll(shelfId);
        bindPlaylistClicks(shelfId, artistData.dedicated_artist_playlist);
      }

      // 4. Render Featured In Playlists
      if (artistData.featured_artist_playlist && artistData.featured_artist_playlist.length > 0) {
        const shelfId = `artist-featured-${Date.now()}`;
        const shelfHTML = createArtistPlaylistShelfHTML("Featured In", shelfId, artistData.featured_artist_playlist);
        extraContent.appendChild(shelfHTML);
        bindShelfScroll(shelfId);
        bindPlaylistClicks(shelfId, artistData.featured_artist_playlist);
      }

      // 5. Render Similar Artists
      if (artistData.similarArtists && artistData.similarArtists.length > 0) {
        const shelfId = `artist-similar-${Date.now()}`;
        const shelfHTML = createSimilarArtistsShelfHTML("Related Artists", shelfId, artistData.similarArtists);
        extraContent.appendChild(shelfHTML);
        bindShelfScroll(shelfId);
        bindSimilarArtistClicks(shelfId, artistData.similarArtists);
      }

      // 6. Render Biography
      if (artistData.bio) {
        try {
          const bioSections = typeof artistData.bio === 'string' ? JSON.parse(artistData.bio) : artistData.bio;
          if (Array.isArray(bioSections) && bioSections.length > 0) {
            const bioContainer = document.createElement('div');
            bioContainer.className = 'artist-bio-section';
            bioContainer.style.background = 'var(--bg-surface)';
            bioContainer.style.padding = '16px';
            bioContainer.style.borderRadius = 'var(--border-radius-md)';
            bioContainer.style.border = '1px solid var(--glass-border)';

            let bioHTML = `<h3>Biography</h3><div style="display:flex; flex-direction:column; gap:16px; margin-top:12px;">`;
            bioSections.sort((a, b) => a.sequence - b.sequence).forEach(section => {
              bioHTML += `
                <div>
                  <h4 style="color: var(--text-primary); font-size: 14px; margin-bottom: 6px;">${section.title}</h4>
                  <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.6; text-align: justify;">${section.text}</p>
                </div>
              `;
            });
            bioHTML += `</div>`;
            bioContainer.innerHTML = bioHTML;
            extraContent.appendChild(bioContainer);
          }
        } catch (e) {
          console.error("Error parsing artist bio:", e);
        }
      }
    }
  }

  if (tracks.length === 0) {
    // Fallback: Query popular tracks using search endpoint
    const searchResults = await fetchAPI(`/api/Song/SearchByQuery?query=${encodeURIComponent(artist.name)}`);
    if (searchResults && searchResults.results) {
      tracks = searchResults.results;
    }
  }

  if (tracks.length === 0) {
    tracksTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No tracks found for this artist.</td></tr>';
    lucide.createIcons();
    return;
  }

  renderTracklistTable(tracks, tracksTable, artist.id);
  lucide.createIcons();
}

function createArtistPlaylistShelfHTML(title, shelfId, playlists) {
  const shelf = document.createElement('div');
  shelf.className = 'shelf';
  shelf.style.margin = '0';

  let cardsHTML = '';
  playlists.forEach((playlist, idx) => {
    const cleanTitle = playlist.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanSubtitle = (playlist.subtitle || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const image = playlist.image || 'https://via.placeholder.com/150';

    cardsHTML += `
      <div class="music-card" data-index="${idx}" style="flex: 0 0 175px;">
        <div class="card-img-wrapper">
          <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
          <button class="card-play-btn" title="View Playlist">
            <i data-lucide="eye"></i>
          </button>
        </div>
        <div class="card-info">
          <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
          <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
        </div>
      </div>
    `;
  });

  shelf.innerHTML = `
    <div class="shelf-header" style="margin-bottom: 12px;">
      <div class="shelf-header-text">
        <h2 style="font-size: 18px;">${title}</h2>
      </div>
      <div class="shelf-nav-buttons">
        <button class="shelf-nav-btn prev-btn" data-target="${shelfId}" title="Slide Left">
          <i data-lucide="chevron-left"></i>
        </button>
        <button class="shelf-nav-btn next-btn" data-target="${shelfId}" title="Slide Right">
          <i data-lucide="chevron-right"></i>
        </button>
      </div>
    </div>
    <div class="shelf-scroll scroll-gradient" id="${shelfId}" style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 8px;">
      ${cardsHTML}
    </div>
  `;
  return shelf;
}

function createSimilarArtistsShelfHTML(title, shelfId, artists) {
  const shelf = document.createElement('div');
  shelf.className = 'shelf';
  shelf.style.margin = '0';

  let cardsHTML = '';
  artists.forEach((artist, idx) => {
    const image = artist.image_url || artist.image || 'https://via.placeholder.com/150';

    cardsHTML += `
      <div class="music-card artist-card" data-index="${idx}" style="flex: 0 0 175px;">
        <div class="card-img-wrapper">
          <img src="${image}" alt="${artist.name}" class="card-img" loading="lazy">
        </div>
        <div class="card-info">
          <span class="card-title">${artist.name}</span>
          <span class="card-subtitle">${artist.dominantType || 'Artist'}</span>
        </div>
      </div>
    `;
  });

  shelf.innerHTML = `
    <div class="shelf-header" style="margin-bottom: 12px;">
      <div class="shelf-header-text">
        <h2 style="font-size: 18px;">${title}</h2>
      </div>
      <div class="shelf-nav-buttons">
        <button class="shelf-nav-btn prev-btn" data-target="${shelfId}" title="Slide Left">
          <i data-lucide="chevron-left"></i>
        </button>
        <button class="shelf-nav-btn next-btn" data-target="${shelfId}" title="Slide Right">
          <i data-lucide="chevron-right"></i>
        </button>
      </div>
    </div>
    <div class="shelf-scroll scroll-gradient" id="${shelfId}" style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 8px;">
      ${cardsHTML}
    </div>
  `;
  return shelf;
}

function bindShelfScroll(shelfId) {
  const container = document.getElementById(shelfId);
  if (!container) return;
  const parent = container.parentElement;

  parent.querySelectorAll('.shelf-nav-btn').forEach(btn => {
    btn.onclick = () => {
      const direction = btn.classList.contains('prev-btn') ? -1 : 1;
      const firstCard = container.querySelector('.music-card');
      let cardWidth = 175 + 20;
      if (firstCard) {
        const style = window.getComputedStyle(container);
        const gap = parseInt(style.gap) || 20;
        cardWidth = firstCard.offsetWidth + gap;
      }
      container.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
      });
    };
  });
}

function bindPlaylistClicks(shelfId, playlists) {
  const container = document.getElementById(shelfId);
  if (!container) return;

  container.querySelectorAll('.music-card').forEach(card => {
    card.onclick = () => {
      const idx = parseInt(card.getAttribute('data-index'));
      const playlist = playlists[idx];

      if (playlist.type === 'album' || (playlist.perma_url && playlist.perma_url.includes('/album/'))) {
        const token = playlist.perma_url ? playlist.perma_url.split('/').filter(Boolean).pop() : null;
        if (token) {
          navigateTo('album', { token });
          return;
        }
      }

      navigateTo('playlist', {
        id: playlist.id,
        title: playlist.title,
        image: playlist.image,
        type: 'api',
        subtitle: playlist.subtitle
      });
    };
  });
}

function bindSimilarArtistClicks(shelfId, artists) {
  const container = document.getElementById(shelfId);
  if (!container) return;

  container.querySelectorAll('.music-card').forEach(card => {
    card.onclick = () => {
      const idx = parseInt(card.getAttribute('data-index'));
      const artist = artists[idx];
      const token = artist.perma_url ? artist.perma_url.split('/').filter(Boolean).pop() : null;
      navigateTo('artist', {
        id: artist.id || artist._id,
        name: artist.name,
        image: artist.image_url || artist.image,
        token: token
      });
    };
  });
}

// --- LIKED SONGS / LIBRARY VIEW ---
function renderLibraryView() {
  const tracksTable = document.getElementById('library-tracks-table');
  const countEl = document.getElementById('library-track-count');

  if (state.favorites.length === 0) {
    countEl.textContent = 'No tracks liked yet.';
    tracksTable.innerHTML = `
      <tr>
        <td colspan="5">
          ${getEmptyStateHTML('heart', 'No Liked Songs', 'Click the heart icon on any song to save it to your favorites library.')}
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
  } else {
    if (state.isLoggedIn && state.jioLibrary) {
      const songCount = state.favorites.length;
      const albumCount = state.jioLibrary.album ? state.jioLibrary.album.length : 0;
      const artistCount = state.jioLibrary.artist ? state.jioLibrary.artist.length : 0;
      const showCount = state.jioLibrary.show ? state.jioLibrary.show.length : 0;
      countEl.textContent = `${songCount} song${songCount === 1 ? '' : 's'} • ${albumCount} album${albumCount === 1 ? '' : 's'} • ${artistCount} artist${artistCount === 1 ? '' : 's'} followed • ${showCount} podcast${showCount === 1 ? '' : 's'} followed`;
    } else {
      countEl.textContent = `${state.favorites.length} song${state.favorites.length === 1 ? '' : 's'} liked locally`;
    }

    tracksTable.innerHTML = '';
    renderTracklistTable(state.favorites, tracksTable, 'library');

    document.getElementById('btn-library-play-all').onclick = () => {
      playTrackList(state.favorites, 0);
    };

    document.getElementById('btn-library-shuffle').onclick = () => {
      state.shuffleActive = true;
      playTrackList(state.favorites, Math.floor(Math.random() * state.favorites.length));
    };
  }

  // JioSaavn Playlists Grid Rendering
  const jioContainer = document.getElementById('library-jio-playlists-container');
  const jioGrid = document.getElementById('library-jio-playlists-grid');

  if (jioContainer && jioGrid) {
    if (state.isLoggedIn && state.jioLibrary && Array.isArray(state.jioLibrary.playlist) && state.jioLibrary.playlist.length > 0) {
      jioContainer.classList.remove('hidden');
      jioGrid.innerHTML = '';

      if (state.libraryPlaylists && state.libraryPlaylists.length > 0) {
        state.libraryPlaylists.forEach(playlist => {
          const cleanTitle = playlist.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const cleanSubtitle = playlist.subtitle.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const image = playlist.image;

          const card = document.createElement('div');
          card.className = 'music-card';
          card.innerHTML = `
            <div class="card-img-wrapper">
              <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
              <button class="card-play-btn" title="View Playlist">
                <i data-lucide="eye"></i>
              </button>
            </div>
            <div class="card-info">
              <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
              <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
            </div>
          `;

          const playlistData = {
            id: playlist.id,
            title: playlist.title,
            subtitle: playlist.subtitle,
            image: playlist.image,
            type: 'api',
            isJio: true
          };

          card.addEventListener('click', () => {
            navigateTo('playlist', playlistData);
          });

          jioGrid.appendChild(card);
        });
      } else {
        jioGrid.innerHTML = getCardSkeletonsHTML(state.jioLibrary.playlist.length);
      }
    } else {
      jioContainer.classList.add('hidden');
    }
  }

  // JioSaavn Albums Grid Rendering
  const albumContainer = document.getElementById('library-jio-albums-container');
  const albumGrid = document.getElementById('library-jio-albums-grid');

  if (albumContainer && albumGrid) {
    if (state.isLoggedIn && state.jioLibrary && Array.isArray(state.jioLibrary.album) && state.jioLibrary.album.length > 0) {
      albumContainer.classList.remove('hidden');
      albumGrid.innerHTML = '';

      if (state.libraryAlbums && state.libraryAlbums.length > 0) {
        state.libraryAlbums.forEach(album => {
          const cleanTitle = album.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const cleanSubtitle = (album.subtitle || album.more_info?.year || 'Album').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const image = album.image;

          const card = document.createElement('div');
          card.className = 'music-card';
          card.innerHTML = `
            <div class="card-img-wrapper">
              <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
              <button class="card-play-btn" title="View Album">
                <i data-lucide="eye"></i>
              </button>
            </div>
            <div class="card-info">
              <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
              <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
            </div>
          `;

          const token = album.perma_url ? album.perma_url.split('/').filter(Boolean).pop() : null;
          card.addEventListener('click', () => {
            if (token) {
              navigateTo('album', { token });
            }
          });

          albumGrid.appendChild(card);
        });
      } else {
        albumGrid.innerHTML = getCardSkeletonsHTML(state.jioLibrary.album.length);
      }
    } else {
      albumContainer.classList.add('hidden');
    }
  }

  // Followed Artists Grid Rendering
  const artistContainer = document.getElementById('library-jio-artists-container');
  const artistGrid = document.getElementById('library-jio-artists-grid');

  if (artistContainer && artistGrid) {
    if (state.isLoggedIn && state.jioLibrary && Array.isArray(state.jioLibrary.artist) && state.jioLibrary.artist.length > 0) {
      artistContainer.classList.remove('hidden');
      artistGrid.innerHTML = '';

      if (state.libraryArtists && state.libraryArtists.length > 0) {
        state.libraryArtists.forEach(artist => {
          const cleanTitle = artist.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const image = artist.image;

          const card = document.createElement('div');
          card.className = 'music-card artist-card';
          card.innerHTML = `
            <div class="card-img-wrapper" style="border-radius: 50%; overflow: hidden; aspect-ratio: 1/1;">
              <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
              <button class="card-play-btn" title="View Artist">
                <i data-lucide="eye"></i>
              </button>
            </div>
            <div class="card-info" style="text-align: center;">
              <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
              <span class="card-subtitle">Artist</span>
            </div>
          `;

          const token = artist.perma_url ? artist.perma_url.split('/').filter(Boolean).pop() : null;
          card.addEventListener('click', () => {
            if (token) {
              navigateTo('artist', { id: artist.id, name: artist.title, image: artist.image, token });
            }
          });

          artistGrid.appendChild(card);
        });
      } else {
        artistGrid.innerHTML = getCardSkeletonsHTML(state.jioLibrary.artist.length);
      }
    } else {
      artistContainer.classList.add('hidden');
    }
  }

  // Followed Shows Grid Rendering
  const showContainer = document.getElementById('library-jio-shows-container');
  const showGrid = document.getElementById('library-jio-shows-grid');

  if (showContainer && showGrid) {
    if (state.isLoggedIn && state.jioLibrary && Array.isArray(state.jioLibrary.show) && state.jioLibrary.show.length > 0) {
      showContainer.classList.remove('hidden');
      showGrid.innerHTML = '';

      if (state.libraryShows && state.libraryShows.length > 0) {
        state.libraryShows.forEach(show => {
          const cleanTitle = show.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const cleanSubtitle = (show.more_info?.label || 'Show').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
          const image = show.image || show.more_info?.square_image;

          const card = document.createElement('div');
          card.className = 'music-card';
          card.innerHTML = `
            <div class="card-img-wrapper">
              <img src="${image}" alt="${cleanTitle}" class="card-img" loading="lazy">
              <button class="card-play-btn" title="View Show">
                <i data-lucide="eye"></i>
              </button>
            </div>
            <div class="card-info">
              <span class="card-title" title="${cleanTitle}">${cleanTitle}</span>
              <span class="card-subtitle" title="${cleanSubtitle}">${cleanSubtitle}</span>
            </div>
          `;

          card.addEventListener('click', () => {
            navigateTo('playlist', { id: show.id, title: show.title, image: image, type: 'api', subtitle: cleanSubtitle || 'Podcast Show' });
          });

          showGrid.appendChild(card);
        });
      } else {
        showGrid.innerHTML = getCardSkeletonsHTML(state.jioLibrary.show.length);
      }
    } else {
      showContainer.classList.add('hidden');
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

// --- LISTENING HISTORY VIEW ---
async function fetchListeningHistory() {
  if (!state.isLoggedIn || !state.cookies) {
    return [];
  }
  try {
    const response = await fetch(`${BASE_URL}/api/Song/GetListeningHistory?cookies=${encodeURIComponent(state.cookies)}&size=40`);
    if (!response.ok) {
      throw new Error(`History fetch failed: ${response.status}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.results)) {
      return data.results.map(item => item.media).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch listening history:', error);
    showToast('Failed to load listening history.');
    return [];
  }
}

async function renderHistoryView() {
  const tracksTable = document.getElementById('history-tracks-table');
  const countEl = document.getElementById('history-track-count');

  if (!state.isLoggedIn || !state.cookies) {
    countEl.textContent = 'Please log in to view your listening history.';
    tracksTable.innerHTML = `
      <tr>
        <td colspan="5">
          ${getEmptyStateHTML('log-in', 'Not Signed In', 'Please sign in with JioSaavn to view your listening history.')}
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Show skeleton loading first
  tracksTable.innerHTML = getTrackListSkeletonsHTML(5);
  countEl.textContent = 'Loading history...';

  const historyTracks = await fetchListeningHistory();
  
  if (historyTracks.length === 0) {
    countEl.textContent = 'No listening history found.';
    tracksTable.innerHTML = `
      <tr>
        <td colspan="5">
          ${getEmptyStateHTML('history', 'No History Yet', 'Your recently played tracks will appear here once you start listening!')}
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
  } else {
    countEl.textContent = `${historyTracks.length} song${historyTracks.length === 1 ? '' : 's'}`;
    tracksTable.innerHTML = '';
    renderTracklistTable(historyTracks, tracksTable, 'history');

    document.getElementById('btn-history-play-all').onclick = () => {
      playTrackList(historyTracks, 0);
    };

    document.getElementById('btn-history-shuffle').onclick = () => {
      state.shuffleActive = true;
      playTrackList(historyTracks, Math.floor(Math.random() * historyTracks.length));
    };
  }
}

// --- REUSABLE TRACKTABLE RENDERER ---
function renderTracklistTable(tracks, tbodyElement, contextId) {
  tbodyElement.innerHTML = '';

  tracks.forEach((track, index) => {
    const cleanTitle = track.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanArtist = (track.more_info?.music || track.subtitle || 'Unknown Artist').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanAlbum = (track.more_info?.album || 'Single').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const year = track.year || track.more_info?.year || 'N/A';
    const duration = track.more_info?.duration ? formatTime(track.more_info.duration) : '3:00';
    const image = track.image || DEFAULT_PLACEHOLDER_IMAGE;

    const tr = document.createElement('tr');
    if (state.currentTrack?.id === track.id) {
      tr.className = 'active-song';
    }

    tr.innerHTML = `
      <td class="col-num track-num-cell">
        <span class="track-num-index">${index + 1}</span>
        <i data-lucide="play" class="track-num-play"></i>
      </td>
      <td class="col-title">
        <img src="${image}" alt="${cleanTitle}" style="width: 40px; height: 40px; border-radius: var(--border-radius-sm); object-fit: cover;">
        <div style="display:flex; flex-direction:column; gap:4px; min-width: 0;">
          <span class="song-row-title">${cleanTitle}</span>
          <span style="font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${cleanArtist}</span>
        </div>
      </td>
      <td class="col-album"><span class="clickable-album-link" style="color: var(--text-secondary); cursor: pointer;" title="View Album">${cleanAlbum}</span></td>
      <td class="col-year">${year}</td>
      <td class="col-actions">
        <button class="song-row-btn btn-table-fav" title="Like">
          <i data-lucide="heart" class="${isLiked(track.id) ? 'fill-danger text-danger' : ''}"></i>
        </button>
        <button class="song-row-btn btn-table-playlist" title="Add to playlist">
          <i data-lucide="plus"></i>
        </button>
      </td>
    `;

    // Bind custom context menu to row
    bindTrackContextMenu(tr, track);

    // Bind album click listener
    const albumLink = tr.querySelector('.clickable-album-link');
    const albumUrl = track.more_info?.album_url;
    const albumToken = albumUrl ? albumUrl.split('/').filter(Boolean).pop() : null;

    if (albumLink && albumToken) {
      albumLink.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateTo('album', { token: albumToken });
      });
      albumLink.addEventListener('mouseenter', () => {
        albumLink.style.color = 'var(--accent-primary)';
        albumLink.style.textDecoration = 'underline';
      });
      albumLink.addEventListener('mouseleave', () => {
        albumLink.style.color = 'var(--text-secondary)';
        albumLink.style.textDecoration = 'none';
      });
    }

    // Play on row double click or single click (except action buttons)
    tr.addEventListener('click', (e) => {
      if (e.target.closest('.song-row-btn') || e.target.closest('.clickable-album-link')) return;
      playTrackList(tracks, index);
    });

    // Favorite Button Click
    tr.querySelector('.btn-table-fav').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLikeTrack(track, e);
      const icon = tr.querySelector('.btn-table-fav i, .btn-table-fav svg');
      if (icon) {
        if (isLiked(track.id)) {
          icon.classList.add('fill-danger', 'text-danger');
        } else {
          icon.classList.remove('fill-danger', 'text-danger');
        }
      }

      // Refresh view dynamically if currently viewing Library
      if (state.currentView === 'library') {
        renderLibraryView();
      }
    });

    // Add to Custom Playlist button
    tr.querySelector('.btn-table-playlist').addEventListener('click', (e) => {
      e.stopPropagation();
      openPlaylistSelectModal(track);
    });

    tbodyElement.appendChild(tr);
  });

  lucide.createIcons();
}

// ---------------------------------------------------------
// 6. Playback Engine Logic
// ---------------------------------------------------------
async function playTrackDirectly(track) {
  // If we only have basic track card data, let's fetch detailed song info if media_url is missing
  let trackToPlay = track;
  if (!track.more_info?.media_url) {
    const res = await fetchAPI(`/api/Song/GetById?songId=${track.id}`);
    if (res && res.songs && res.songs.length > 0) {
      trackToPlay = res.songs[0];
    } else {
      showToast("Cannot fetch audio stream for this song.");
      return;
    }
  }

  state.queue = [trackToPlay];
  state.originalQueue = [trackToPlay];
  state.currentIndex = 0;

  loadAndPlay(trackToPlay);
}

function playTrackList(tracks, index) {
  state.queue = [...tracks];
  state.originalQueue = [...tracks];
  state.currentIndex = index;

  // If shuffle is active, shuffle the remaining tracks in the queue
  if (state.shuffleActive) {
    shuffleQueue();
    // find index in shuffled queue
    state.currentIndex = state.queue.findIndex(t => t.id === tracks[index].id);
  }

  loadAndPlay(state.queue[state.currentIndex]);
}

async function loadAndPlay(track) {
  let trackWithMedia = track;

  // Guard clause: make sure it has media url
  if (!track.more_info?.media_url) {
    const res = await fetchAPI(`/api/Song/GetById?songId=${track.id}`);
    if (res && res.songs && res.songs.length > 0) {
      trackWithMedia = res.songs[0];
      // update in queue
      if (state.currentIndex >= 0 && state.currentIndex < state.queue.length) {
        state.queue[state.currentIndex] = trackWithMedia;
      }
    } else {
      showToast("Could not retrieve play stream from server.");
      return;
    }
  }

  state.currentTrack = trackWithMedia;
  audio.src = trackWithMedia.more_info.media_url;
  audio.play();

  // Update lyrics dynamically if panel is open or reset it
  if (document.getElementById('lyrics-panel').classList.contains('open')) {
    fetchLyrics(trackWithMedia.id);
  } else {
    document.getElementById('lyrics-content').innerHTML = getEmptyStateHTML('music-4', 'No Song Playing', 'Select a song and click play to see lyrics.');
    if (window.lucide) window.lucide.createIcons();
  }

  // Setup player controls state
  state.isPlaying = true;
  updatePlayerUI();
  renderQueueList();

  // Highlight currently playing track globally across open lists
  updateActiveSongHighlight();

  // Preload next track details & audio stream after 2 seconds
  setTimeout(preloadNextTrack, 2000);
}

function updateActiveSongHighlight() {
  document.querySelectorAll('tr, .song-row').forEach(row => {
    row.classList.remove('active-song');
  });

  if (state.currentTrack) {
    // Look for rows that correspond to current song ID
    // Note: We can render dynamic elements later that match this.
    // In current DOM, we will query table rows containing ID or simply match names.
  }
}

function togglePlay() {
  if (!state.currentTrack) return;

  if (state.isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

function playNext() {
  if (state.queue.length === 0) return;

  if (state.repeatMode === 'one') {
    audio.currentTime = 0;
    audio.play();
    return;
  }

  state.currentIndex++;
  if (state.currentIndex >= state.queue.length) {
    if (state.repeatMode === 'all') {
      state.currentIndex = 0;
    } else {
      state.currentIndex = state.queue.length - 1;
      state.isPlaying = false;
      audio.pause();
      return;
    }
  }

  loadAndPlay(state.queue[state.currentIndex]);
}

function playPrev() {
  if (state.queue.length === 0) return;

  // If track played > 3s, restart it instead of going back
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  state.currentIndex--;
  if (state.currentIndex < 0) {
    if (state.repeatMode === 'all') {
      state.currentIndex = state.queue.length - 1;
    } else {
      state.currentIndex = 0;
    }
  }

  loadAndPlay(state.queue[state.currentIndex]);
}

function handleTrackEnded() {
  playNext();
}

// ---------------------------------------------------------
// 7. Player UI Updates & Timeline Control
// ---------------------------------------------------------
function updatePlayerUI() {
  const playIcon = document.querySelector('#btn-player-play .icon-play');
  const pauseIcon = document.querySelector('#btn-player-play .icon-pause');
  const mobilePlayIcon = document.querySelector('#btn-mobile-player-play .icon-play');
  const mobilePauseIcon = document.querySelector('#btn-mobile-player-play .icon-pause');

  if (state.isPlaying) {
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (mobilePlayIcon) mobilePlayIcon.classList.add('hidden');
    if (mobilePauseIcon) mobilePauseIcon.classList.remove('hidden');
  } else {
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (mobilePlayIcon) mobilePlayIcon.classList.remove('hidden');
    if (mobilePauseIcon) mobilePauseIcon.classList.add('hidden');
  }

  // Update Media Session Playback State
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';
  }

  if (state.currentTrack) {
    const cleanTitle = state.currentTrack.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanArtist = (state.currentTrack.more_info?.music || state.currentTrack.subtitle || 'Unknown').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

    // Update Media Session Metadata for Lock Screen & Dynamic Island
    updateMediaSessionMetadata(cleanTitle, cleanArtist, state.currentTrack.image);

    document.getElementById('player-title').textContent = cleanTitle;
    document.getElementById('player-artist').textContent = cleanArtist;
    setAlbumArtWithFade(document.getElementById('player-img'), state.currentTrack.image || DEFAULT_PLACEHOLDER_IMAGE);

    // Mobile overlay details
    document.getElementById('mobile-player-title').textContent = cleanTitle;
    document.getElementById('mobile-player-artist').textContent = cleanArtist;

    // Setup album link inside mobile overlay
    const mobileAlbumEl = document.getElementById('mobile-player-album');
    if (state.currentTrack.more_info?.album && state.currentTrack.more_info?.album_url) {
      const cleanAlbum = state.currentTrack.more_info.album.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      mobileAlbumEl.textContent = `Album: ${cleanAlbum}`;
      mobileAlbumEl.style.display = 'block';

      const albumUrl = state.currentTrack.more_info.album_url;
      const albumToken = albumUrl.split('/').filter(Boolean).pop();
      mobileAlbumEl.onclick = () => {
        document.getElementById('mobile-player-overlay').classList.remove('open');
        navigateTo('album', { token: albumToken });
      };
    } else {
      mobileAlbumEl.style.display = 'none';
    }

    const highResImg = (state.currentTrack.image || DEFAULT_PLACEHOLDER_IMAGE).replace('150x150', '250x250');
    setAlbumArtWithFade(document.getElementById('mobile-player-img'), highResImg);

    // Update Favorite button active state (both desktop and mobile)
    const isSongLiked = isLiked(state.currentTrack.id);

    const favBtn = document.getElementById('btn-player-favorite');
    const mobileFavBtn = document.getElementById('btn-mobile-player-favorite');

    if (isSongLiked) {
      favBtn.classList.add('active');
      const favBtnIcon = favBtn.querySelector('i, svg');
      if (favBtnIcon) favBtnIcon.classList.add('fill-danger', 'text-danger');
      mobileFavBtn.classList.add('active');
      const mobileFavBtnIcon = mobileFavBtn.querySelector('i, svg');
      if (mobileFavBtnIcon) mobileFavBtnIcon.classList.add('fill-danger', 'text-danger');
    } else {
      favBtn.classList.remove('active');
      const favBtnIcon = favBtn.querySelector('i, svg');
      if (favBtnIcon) favBtnIcon.classList.remove('fill-danger', 'text-danger');
      mobileFavBtn.classList.remove('active');
      const mobileFavBtnIcon = mobileFavBtn.querySelector('i, svg');
      if (mobileFavBtnIcon) mobileFavBtnIcon.classList.remove('fill-danger', 'text-danger');
    }

    // Sync Shuffle/Repeat states inside mobile overlay
    const mobileShuffleBtn = document.getElementById('btn-mobile-player-shuffle');
    if (state.shuffleActive) {
      mobileShuffleBtn.classList.add('active');
    } else {
      mobileShuffleBtn.classList.remove('active');
    }

    const mobileRepeatBtn = document.getElementById('btn-mobile-player-repeat');
    const mobileRepeatIcon = document.querySelector('#btn-mobile-player-repeat .icon-repeat');
    const mobileRepeatOneIcon = document.querySelector('#btn-mobile-player-repeat .icon-repeat-one');

    if (state.repeatMode === 'off') {
      mobileRepeatBtn.classList.remove('active');
      if (mobileRepeatIcon) mobileRepeatIcon.classList.remove('hidden');
      if (mobileRepeatOneIcon) mobileRepeatOneIcon.classList.add('hidden');
    } else if (state.repeatMode === 'all') {
      mobileRepeatBtn.classList.add('active');
      if (mobileRepeatIcon) mobileRepeatIcon.classList.remove('hidden');
      if (mobileRepeatOneIcon) mobileRepeatOneIcon.classList.add('hidden');
    } else if (state.repeatMode === 'one') {
      mobileRepeatBtn.classList.add('active');
      if (mobileRepeatIcon) mobileRepeatIcon.classList.add('hidden');
      if (mobileRepeatOneIcon) mobileRepeatOneIcon.classList.remove('hidden');
    }
  }
}

function updateTimeline() {
  const currentVal = audio.currentTime || 0;
  const totalVal = audio.duration || 0;

  const currentText = document.getElementById('player-time-current');
  currentText.textContent = formatTime(currentVal);

  const percent = totalVal > 0 ? (currentVal / totalVal) * 100 : 0;
  document.getElementById('player-progress-fill').style.width = `${percent}%`;
  document.getElementById('player-progress-handle').style.left = `${percent}%`;

  // Sync mobile overlay timeline
  const mobileCurrentText = document.getElementById('mobile-player-time-current');
  if (mobileCurrentText) {
    mobileCurrentText.textContent = formatTime(currentVal);
    const mobileDurationText = document.getElementById('mobile-player-time-duration');
    mobileDurationText.textContent = formatTime(totalVal || 0);
    document.getElementById('mobile-player-progress-fill').style.width = `${percent}%`;
    document.getElementById('mobile-player-progress-handle').style.left = `${percent}%`;
  }

  // Sync Media Session system position state for lockscreen scrubbing
  updateMediaSessionPositionState();
}

// Timeline Click & Drag to seek
makeProgressBarDraggable('progress-bar-container', 'player-progress-fill', 'player-progress-handle', 'player-time-current');

// Volume Control Click
const volumeBarContainer = document.getElementById('volume-bar-container');
volumeBarContainer.addEventListener('click', (e) => {
  const rect = volumeBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  let percent = clickX / rect.width;
  percent = Math.max(0, Math.min(1, percent));

  state.volume = percent;
  state.isMuted = false;
  audio.volume = percent;

  document.getElementById('player-volume-fill').style.width = `${percent * 100}%`;
  document.getElementById('player-volume-handle').style.left = `${percent * 100}%`;
  updateVolumeIcon();
});

document.getElementById('btn-player-mute').onclick = () => {
  state.isMuted = !state.isMuted;
  if (state.isMuted) {
    audio.volume = 0;
    document.getElementById('player-volume-fill').style.width = '0%';
    document.getElementById('player-volume-handle').style.left = '0%';
  } else {
    audio.volume = state.volume;
    document.getElementById('player-volume-fill').style.width = `${state.volume * 100}%`;
    document.getElementById('player-volume-handle').style.left = `${state.volume * 100}%`;
  }
  updateVolumeIcon();
};

function updateVolumeIcon() {
  const muteIcon = document.querySelector('#btn-player-mute .icon-mute');
  const lowIcon = document.querySelector('#btn-player-mute .icon-low');
  const loudIcon = document.querySelector('#btn-player-mute .icon-loud');

  if (muteIcon) muteIcon.classList.add('hidden');
  if (lowIcon) lowIcon.classList.add('hidden');
  if (loudIcon) loudIcon.classList.add('hidden');

  if (state.isMuted || state.volume === 0) {
    if (muteIcon) muteIcon.classList.remove('hidden');
  } else if (state.volume < 0.4) {
    if (lowIcon) lowIcon.classList.remove('hidden');
  } else {
    if (loudIcon) loudIcon.classList.remove('hidden');
  }
}

// Controls: Shuffle & Repeat toggles
document.getElementById('btn-player-shuffle').onclick = () => {
  state.shuffleActive = !state.shuffleActive;
  const shuffleBtn = document.getElementById('btn-player-shuffle');

  if (state.shuffleActive) {
    shuffleBtn.classList.add('active');
    shuffleQueue();
  } else {
    shuffleBtn.classList.remove('active');
    // Restore original queue order
    const curTrackId = state.queue[state.currentIndex]?.id;
    state.queue = [...state.originalQueue];
    state.currentIndex = state.queue.findIndex(t => t.id === curTrackId);
  }

  renderQueueList();
};

function shuffleQueue() {
  if (state.queue.length <= 1) return;
  const current = state.queue[state.currentIndex];

  // Shuffle all tracks EXCEPT the current track
  const tracksToShuffle = state.queue.filter((_, idx) => idx !== state.currentIndex);

  for (let i = tracksToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracksToShuffle[i], tracksToShuffle[j]] = [tracksToShuffle[j], tracksToShuffle[i]];
  }

  // Re-assemble queue: current track first, followed by shuffled tracks
  state.queue = [current, ...tracksToShuffle];
  state.currentIndex = 0;
}

document.getElementById('btn-player-repeat').onclick = () => {
  const repeatBtn = document.getElementById('btn-player-repeat');
  const repeatIcon = document.querySelector('#btn-player-repeat .icon-repeat');
  const repeatOneIcon = document.querySelector('#btn-player-repeat .icon-repeat-one');

  if (state.repeatMode === 'off') {
    state.repeatMode = 'all';
    repeatBtn.classList.add('active');
    repeatBtn.setAttribute('title', 'Repeat (All)');
    if (repeatIcon) repeatIcon.classList.remove('hidden');
    if (repeatOneIcon) repeatOneIcon.classList.add('hidden');
  } else if (state.repeatMode === 'all') {
    state.repeatMode = 'one';
    repeatBtn.classList.add('active');
    repeatBtn.setAttribute('title', 'Repeat (One)');
    if (repeatIcon) repeatIcon.classList.add('hidden');
    if (repeatOneIcon) repeatOneIcon.classList.remove('hidden');
  } else {
    state.repeatMode = 'off';
    repeatBtn.classList.remove('active');
    repeatBtn.setAttribute('title', 'Repeat (Off)');
    if (repeatIcon) repeatIcon.classList.remove('hidden');
    if (repeatOneIcon) repeatOneIcon.classList.add('hidden');
  }
};

// ---------------------------------------------------------
// 8. Queue & Lyrics Management Sidebars
// ---------------------------------------------------------
const queuePanel = document.getElementById('queue-panel');
const lyricsPanel = document.getElementById('lyrics-panel');

document.getElementById('btn-player-queue').onclick = () => {
  lyricsPanel.classList.remove('open');
  queuePanel.classList.toggle('open');
};

document.getElementById('btn-close-queue').onclick = () => {
  queuePanel.classList.remove('open');
};

document.getElementById('btn-player-lyrics').onclick = () => {
  queuePanel.classList.remove('open');
  lyricsPanel.classList.toggle('open');
  if (lyricsPanel.classList.contains('open') && state.currentTrack) {
    fetchLyrics(state.currentTrack.id);
  }
};

document.getElementById('btn-close-lyrics').onclick = () => {
  lyricsPanel.classList.remove('open');
};

async function fetchLyrics(lyricsId) {
  const contentEl = document.getElementById('lyrics-content');
  contentEl.innerHTML = `
    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px 0;">
      <div class="skeleton-track-title skeleton-pulse-bg" style="height: 14px; width: 60%; border-radius: 4px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 10px; width: 80%; border-radius: 4px; margin-top: 20px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 10px; width: 70%; border-radius: 4px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 10px; width: 75%; border-radius: 4px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 10px; width: 65%; border-radius: 4px;"></div>
      <div class="skeleton-track-artist skeleton-pulse-bg" style="height: 10px; width: 85%; border-radius: 4px;"></div>
    </div>
  `;

  try {
    const data = await fetchAPI(`/api/Song/GetLyrics?lyricsId=${lyricsId}`);
    if (data && data.lyrics) {
      contentEl.innerHTML = `
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: var(--accent-primary);">${state.currentTrack ? state.currentTrack.title : 'Lyrics'}</div>
        <div style="text-align: center; max-width: 100%; line-height: 2; font-size: 15px; color: var(--text-primary);">${data.lyrics}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 24px;">${data.lyrics_copyright || 'Lyrics powered by JioSaavn'}</div>
      `;
    } else {
      contentEl.innerHTML = getEmptyStateHTML('frown', 'Lyrics Unavailable', 'We couldn\'t find lyrics for this song.');
      if (window.lucide) window.lucide.createIcons();
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    contentEl.innerHTML = getEmptyStateHTML('alert-circle', 'Error Loading Lyrics', 'Something went wrong while fetching the lyrics.');
    if (window.lucide) window.lucide.createIcons();
  }
}

document.getElementById('btn-clear-queue').onclick = () => {
  state.queue = [];
  state.originalQueue = [];
  state.currentIndex = -1;
  state.currentTrack = null;
  state.isPlaying = false;
  audio.src = '';
  updatePlayerUI();
  renderQueueList();
};

function renderQueueList() {
  const container = document.getElementById('queue-tracks-list');
  container.innerHTML = '';

  if (state.queue.length === 0) {
    container.innerHTML = getEmptyStateHTML('list-music', 'Queue is Empty', 'Add songs to your queue from Home or Search to keep the music going.');
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  state.queue.forEach((track, index) => {
    const cleanTitle = track.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const cleanArtist = (track.more_info?.music || track.subtitle || 'Unknown').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const image = track.image || DEFAULT_PLACEHOLDER_IMAGE;

    const item = document.createElement('div');
    item.className = 'queue-item queue-row';
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-index', index);

    if (index === state.currentIndex) {
      item.classList.add('active');
    }

    // HTML5 Drag and drop event listeners
    item.addEventListener('dragstart', (e) => {
      item.classList.add('dragging');
      e.dataTransfer.setData('text/plain', index);
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.queue-row').forEach(row => {
        row.classList.remove('drag-over');
      });
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.innerHTML = `
      <img src="${image}" alt="${cleanTitle}" class="queue-img">
      <div class="queue-meta">
        <div class="queue-title">${cleanTitle}</div>
        <div class="queue-artist">${cleanArtist}</div>
      </div>
      <button class="queue-remove" title="Remove track">
        <i data-lucide="trash-2"></i>
      </button>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.queue-remove')) return;
      state.currentIndex = index;
      loadAndPlay(state.queue[state.currentIndex]);
    });

    item.querySelector('.queue-remove').onclick = (e) => {
      e.stopPropagation();
      removeQueueItem(index);
    };

    container.appendChild(item);
  });

  lucide.createIcons();
}

function removeQueueItem(index) {
  // If removing current track
  if (index === state.currentIndex) {
    playNext();
  }

  state.queue.splice(index, 1);
  if (index < state.currentIndex) {
    state.currentIndex--;
  }

  renderQueueList();
}

// ---------------------------------------------------------
// 9. Playlist & Liked Songs Logic (LocalStorage)
// ---------------------------------------------------------
function loadLocalStorageData() {
  const localFavs = localStorage.getItem('melody_favorites');
  state.favorites = localFavs ? JSON.parse(localFavs) : [];

  state.customPlaylists = [];

  renderSidebarPlaylists();

  // Load Auth Session
  const session = localStorage.getItem('melody_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      state.isLoggedIn = !!parsed.isLoggedIn;
      state.phoneNumber = parsed.phoneNumber || '';
      state.cookies = parsed.cookies || '';
      state.displayName = parsed.displayName || '';
      state.userImage = parsed.userImage || '';

      if (state.isLoggedIn && state.cookies) {
        fetchJioPlaylists();
      }
    } catch (e) {
      console.error('Failed to parse local auth session:', e);
    }
  }
}

function saveAuthSession() {
  localStorage.setItem('melody_session', JSON.stringify({
    isLoggedIn: state.isLoggedIn,
    phoneNumber: state.phoneNumber,
    cookies: state.cookies,
    displayName: state.displayName || '',
    userImage: state.userImage || ''
  }));
}

function saveFavorites() {
  localStorage.setItem('melody_favorites', JSON.stringify(state.favorites));
}

function saveCustomPlaylists() {
  // Deprecated - LocalStorage is no longer used for playlists
  renderSidebarPlaylists();
}

function isLiked(trackId) {
  return state.favorites.some(t => t.id === trackId);
}

async function addFavoriteAPI(songId) {
  if (!state.isLoggedIn || !state.cookies) return;
  try {
    const response = await fetch(`${BASE_URL}/api/Song/AddFavorite?songId=${encodeURIComponent(songId)}&cookies=${encodeURIComponent(state.cookies)}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*'
      }
    });
    if (!response.ok) {
      throw new Error(`Server returned code: ${response.status}`);
    }
    console.log(`[API] Added favorite: ${songId}`);
  } catch (err) {
    console.error('AddFavorite API error:', err);
    showToast('Failed to sync favorite with server.');
  }
}

async function removeFavoriteAPI(songId) {
  if (!state.isLoggedIn || !state.cookies) return;
  try {
    const response = await fetch(`${BASE_URL}/api/Song/RemoveFavorite?songId=${encodeURIComponent(songId)}&cookies=${encodeURIComponent(state.cookies)}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*'
      }
    });
    if (!response.ok) {
      throw new Error(`Server returned code: ${response.status}`);
    }
    console.log(`[API] Removed favorite: ${songId}`);
  } catch (err) {
    console.error('RemoveFavorite API error:', err);
    showToast('Failed to sync favorite removal with server.');
  }
}

function toggleLikeTrack(track, clickEvent = null) {
  const idx = state.favorites.findIndex(t => t.id === track.id);
  const isLiking = idx === -1;

  if (!isLiking) {
    state.favorites.splice(idx, 1);
    showToast('Removed from Liked Songs');
    if (state.isLoggedIn && state.cookies) {
      removeFavoriteAPI(track.id);
    }
  } else {
    state.favorites.push(track);
    showToast('Added to Liked Songs');

    // Trigger particle burst if click coordinates are available
    if (clickEvent) {
      createHeartBurstParticles(clickEvent);
    }
    if (state.isLoggedIn && state.cookies) {
      addFavoriteAPI(track.id);
    }
  }
  saveFavorites();

  // Sync details in player bar
  if (state.currentTrack?.id === track.id) {
    updatePlayerUI();
  }
}

// Like Button in Player Bar
document.getElementById('btn-player-favorite').onclick = (e) => {
  if (state.currentTrack) {
    toggleLikeTrack(state.currentTrack, e);
  }
};

// Creating a Custom Playlist
const modalEl = document.getElementById('modal-playlist');
document.getElementById('btn-create-playlist').onclick = () => {
  if (!state.isLoggedIn || !state.cookies) {
    showToast('Please sign in to create playlists.');
    openLoginModal();
    return;
  }
  document.getElementById('input-playlist-name').value = '';
  document.getElementById('input-playlist-desc').value = '';
  modalEl.classList.add('open');
};

document.getElementById('btn-modal-close').onclick = closeModal;
document.getElementById('btn-modal-cancel').onclick = closeModal;

document.getElementById('btn-modal-create').onclick = async () => {
  const name = document.getElementById('input-playlist-name').value.trim();

  if (!name) {
    showToast('Playlist name is required!');
    return;
  }

  if (!state.isLoggedIn || !state.cookies) {
    showToast('Please sign in to create playlists.');
    closeModal();
    return;
  }

  const createBtn = document.getElementById('btn-modal-create');
  createBtn.disabled = true;
  createBtn.textContent = 'Creating...';

  try {
    const response = await fetch(`${BASE_URL}/api/Song/CreatePlaylist?listName=${encodeURIComponent(name)}&cookies=${encodeURIComponent(state.cookies)}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Failed to create playlist: ${response.status}`);
    }

    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {}

    if (parsed && parsed.status === 'error') {
      throw new Error(parsed.msg || 'Error creating playlist.');
    }

    showToast(`Playlist "${name}" created!`);
    closeModal();

    // Fetch and sync updated playlists from JioSaavn
    await fetchJioPlaylists();
  } catch (err) {
    console.error('CreatePlaylist error:', err);
    showToast(err.message || 'Failed to create playlist.');
  } finally {
    createBtn.disabled = false;
    createBtn.textContent = 'Create Playlist';
  }
};

function closeModal() {
  modalEl.classList.remove('open');
}

function renderSidebarPlaylists() {
  const container = document.getElementById('sidebar-playlists');
  if (!container) return;
  container.innerHTML = '';

  if (state.isLoggedIn && state.jioPlaylists.length > 0) {
    state.jioPlaylists.forEach(playlist => {
      const link = document.createElement('a');
      link.href = `#playlist-${playlist.id}`;
      link.className = 'playlist-link';
      link.style.display = 'flex';
      link.style.alignItems = 'center';
      link.style.gap = '8px';
      link.innerHTML = `<i data-lucide="cloud-music" style="width: 14px; height: 14px; flex-shrink:0;"></i> <span>${playlist.title}</span>`;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('playlist', playlist);
      });

      container.appendChild(link);
    });
    lucide.createIcons();
  } else if (!state.isLoggedIn) {
    const link = document.createElement('span');
    link.className = 'sidebar-title';
    link.style.padding = '0 16px';
    link.style.fontSize = '12px';
    link.style.color = 'var(--text-muted)';
    link.style.lineHeight = '1.4';
    link.textContent = 'Sign in to view playlists.';
    container.appendChild(link);
  } else {
    const link = document.createElement('span');
    link.className = 'sidebar-title';
    link.style.padding = '0 16px';
    link.style.fontSize = '12px';
    link.style.color = 'var(--text-muted)';
    link.style.lineHeight = '1.4';
    link.textContent = 'No playlists yet.';
    container.appendChild(link);
  }
}

function deleteCustomPlaylist(id) {
  if (confirm("Are you sure you want to delete this playlist?")) {
    state.customPlaylists = state.customPlaylists.filter(p => p.id !== id);
    saveCustomPlaylists();
    showToast("Playlist deleted");
    navigateTo('home');
  }
}

function openDeletePlaylistConfirmModal(playlistId, title) {
  const modalHTML = `
    <div class="modal-header">
      <h3>Delete Playlist</h3>
      <button class="btn-icon-only modal-close-btn" id="btn-delete-confirm-close">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <p style="color: var(--text-secondary); font-size: 14.5px; line-height: 1.5; margin: 0;">
          Are you sure you want to delete the playlist <strong style="color: var(--text-primary);">"${title}"</strong>?
        </p>
        <p style="color: var(--text-muted); font-size: 12.5px; line-height: 1.5; margin: 0; margin-top: 8px;">
          This action is permanent and cannot be undone. All tracks in this playlist will be removed from your synced JioSaavn library.
        </p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="btn-delete-confirm-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-delete-confirm-action">Delete</button>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-backdrop open';
  modalContainer.id = 'modal-playlist-delete-confirm-custom';

  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal';
  modalDiv.style.maxWidth = '450px';
  modalDiv.innerHTML = modalHTML;
  modalContainer.appendChild(modalDiv);
  document.body.appendChild(modalContainer);
  lucide.createIcons();

  const closeModal = () => modalContainer.remove();

  document.getElementById('btn-delete-confirm-close').onclick = closeModal;
  document.getElementById('btn-delete-confirm-cancel').onclick = closeModal;

  document.getElementById('btn-delete-confirm-action').onclick = async () => {
    const confirmBtn = document.getElementById('btn-delete-confirm-action');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    const mainDeleteBtn = document.getElementById('btn-playlist-delete');
    if (mainDeleteBtn) {
      mainDeleteBtn.disabled = true;
      mainDeleteBtn.textContent = 'Deleting...';
    }

    try {
      const response = await fetch(`${BASE_URL}/api/Song/DeletePlaylist?playlistId=${encodeURIComponent(playlistId)}&cookies=${encodeURIComponent(state.cookies)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete playlist: ${response.status}`);
      }

      const text = await response.text();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {}

      if (parsed && parsed.status === 'error') {
        throw new Error(parsed.msg || 'Error deleting playlist.');
      }

      showToast(`Playlist "${title}" deleted successfully!`);

      // Re-sync playlists
      await fetchJioPlaylists();

      // Go home
      navigateTo('home');
      closeModal();
    } catch (err) {
      console.error('DeletePlaylist error:', err);
      showToast(err.message || 'Failed to delete playlist.');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Delete';
      if (mainDeleteBtn) {
        mainDeleteBtn.disabled = false;
        mainDeleteBtn.innerHTML = '<i data-lucide="trash-2"></i> Delete Playlist';
        lucide.createIcons();
      }
    }
  };
}

function openRenamePlaylistModal(playlist) {
  const modalHTML = `
    <div class="modal-header">
      <h3>Rename Playlist</h3>
      <button class="btn-icon-only modal-close-btn" id="btn-rename-close">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="input-rename-playlist-name">Playlist Name</label>
        <input type="text" id="input-rename-playlist-name" placeholder="Enter new name">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="btn-rename-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-rename-save">Rename</button>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-backdrop open';
  modalContainer.id = 'modal-playlist-rename-custom';

  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal';
  modalDiv.style.maxWidth = '450px';
  modalDiv.innerHTML = modalHTML;
  modalContainer.appendChild(modalDiv);
  document.body.appendChild(modalContainer);
  lucide.createIcons();

  const inputEl = document.getElementById('input-rename-playlist-name');
  if (inputEl) {
    inputEl.value = playlist.title;
    inputEl.focus();
    inputEl.select();
  }

  // Close handlers
  const closeModal = () => modalContainer.remove();
  document.getElementById('btn-rename-close').onclick = closeModal;
  document.getElementById('btn-rename-cancel').onclick = closeModal;

  // Submit handler
  document.getElementById('btn-rename-save').onclick = async () => {
    const newName = inputEl.value.trim();
    if (!newName) {
      showToast("Playlist name cannot be empty.");
      return;
    }
    if (newName === playlist.title) {
      closeModal();
      return;
    }

    const saveBtn = document.getElementById('btn-rename-save');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      const response = await fetch(`${BASE_URL}/api/Song/RenamePlaylist?playlistId=${encodeURIComponent(playlist.id)}&playlistName=${encodeURIComponent(newName)}&cookies=${encodeURIComponent(state.cookies)}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error(`Failed to rename playlist: ${response.status}`);
      }

      const text = await response.text();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {}

      if (parsed && parsed.status === 'error') {
        throw new Error(parsed.msg || 'Error renaming playlist.');
      }

      showToast("Playlist renamed successfully!");

      // Update UI
      const titleEl = document.querySelector('#playlist-detail-header-card .playlist-title');
      if (titleEl) titleEl.textContent = newName;
      playlist.title = newName;

      // Re-sync playlists
      await fetchJioPlaylists();
      closeModal();
    } catch (err) {
      console.error('RenamePlaylist error:', err);
      showToast(err.message || 'Failed to rename playlist.');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Rename';
    }
  };

  // Support Enter key press
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('btn-rename-save').click();
    }
  });
}

// Add Track to Custom Playlist Modal
let trackToAddToPlaylist = null;
function openPlaylistSelectModal(track) {
  if (!state.isLoggedIn || !state.cookies) {
    showToast("Please sign in to add tracks to playlists.");
    openLoginModal();
    return;
  }

  trackToAddToPlaylist = track;

  if (state.jioPlaylists.length === 0) {
    showToast("Please create a playlist first!");
    return;
  }

  const modalHTML = `
    <div class="modal-header">
      <h3>Add to Playlist</h3>
      <button class="btn-icon-only modal-close-btn" id="btn-add-close">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="modal-body" style="max-height: 250px; overflow-y: auto; display:flex; flex-direction:column; gap:8px;">
      ${state.jioPlaylists.map(p => `
        <button class="btn btn-secondary playlist-choice-btn" data-id="${p.id}" style="width: 100%; justify-content: flex-start; text-align: left;">
          <i data-lucide="list-music" style="margin-right: 8px;"></i> ${p.title}
        </button>
      `).join('')}
    </div>
  `;

  const selectModalContainer = document.createElement('div');
  selectModalContainer.className = 'modal-backdrop open';
  selectModalContainer.id = 'modal-playlist-select';

  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal';
  modalDiv.innerHTML = modalHTML;
  selectModalContainer.appendChild(modalDiv);
  document.body.appendChild(selectModalContainer);
  lucide.createIcons();

  // Set up listeners
  document.getElementById('btn-add-close').onclick = () => selectModalContainer.remove();

  selectModalContainer.querySelectorAll('.playlist-choice-btn').forEach(btn => {
    btn.onclick = () => {
      const playlistId = btn.getAttribute('data-id');
      addTrackToJioPlaylist(playlistId, trackToAddToPlaylist);
      selectModalContainer.remove();
    };
  });
}

async function addTrackToJioPlaylist(playlistId, track) {
  const playlist = state.jioPlaylists.find(p => p.id === playlistId);
  if (!playlist) return;

  showToast(`Adding "${track.title}" to "${playlist.title}"...`);

  const language = track.language || track.more_info?.language || 'hindi';

  try {
    const response = await fetch(`${BASE_URL}/api/Song/AddSongToPlaylist?playlistId=${encodeURIComponent(playlistId)}&songId=${encodeURIComponent(track.id)}&language=${encodeURIComponent(language)}&cookies=${encodeURIComponent(state.cookies)}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Failed to add song: ${response.status}`);
    }

    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {}

    if (parsed && parsed.status === 'error') {
      throw new Error(parsed.msg || 'Error adding song.');
    }

    showToast(`Added "${track.title}" to "${playlist.title}"`);
  } catch (err) {
    console.error('AddSongToPlaylist error:', err);
    showToast(err.message || 'Failed to add track to JioSaavn playlist.');
  }
}

// ---------------------------------------------------------
// 9b. User Authentication & JioSaavn Sync Logic
// ---------------------------------------------------------
function openLoginModal() {
  document.getElementById('input-login-phone').value = '';
  document.getElementById('auth-step-phone').style.display = 'block';
  document.getElementById('auth-step-otp').style.display = 'none';
  document.getElementById('login-modal-title').textContent = 'Sign In';

  const sendBtn = document.getElementById('btn-login-send-otp');
  sendBtn.disabled = true;
  sendBtn.textContent = 'Send OTP';

  document.getElementById('modal-login').classList.add('open');
}

function closeLoginModal() {
  document.getElementById('modal-login').classList.remove('open');
}

// Resend Timer logic
let resendTimerInterval = null;
function startResendTimer() {
  const resendBtn = document.getElementById('btn-login-resend-otp');
  const timerText = document.getElementById('txt-login-resend-timer');
  let timeLeft = 60;

  resendBtn.disabled = true;
  resendBtn.style.color = 'var(--text-muted)';
  resendBtn.style.cursor = 'not-allowed';
  timerText.textContent = `(${timeLeft}s)`;

  clearInterval(resendTimerInterval);
  resendTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(resendTimerInterval);
      resendBtn.disabled = false;
      resendBtn.style.color = 'var(--accent-primary)';
      resendBtn.style.cursor = 'pointer';
      timerText.textContent = '';
    } else {
      timerText.textContent = `(${timeLeft}s)`;
    }
  }, 1000);
}



async function sendOtp() {
  const phoneInput = document.getElementById('input-login-phone');
  const sendBtn = document.getElementById('btn-login-send-otp');
  const phone = phoneInput.value.trim();

  if (!/^\d{10}$/.test(phone)) {
    showToast('Please enter a valid 10-digit phone number.');
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  const formattedPhone = `+91${phone}`;

  try {
    const response = await fetch(`${BASE_URL}/api/Song/SendOtp?phoneNumber=${encodeURIComponent(formattedPhone)}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned code: ${response.status}`);
    }

    const text = await response.text();
    let correlationId = '';
    let isError = false;
    let errorMsg = 'An error occurred while sending OTP.';

    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.status === 'error' || parsed.limit_exceeded) {
          isError = true;
          errorMsg = parsed.msg || errorMsg;
        }
        const nestedData = parsed.data || {};
        correlationId = parsed.correlationId || parsed.correlation_id || nestedData.correlationId || nestedData.correlation_id || '';
      } else {
        correlationId = String(parsed).trim();
      }
    } catch (e) {
      correlationId = text.trim();
    }

    if (isError) {
      showToast(errorMsg);
      sendBtn.disabled = false;
      return;
    }

    state.correlationId = correlationId;
    state.phoneNumber = formattedPhone;

    document.getElementById('auth-step-phone').style.display = 'none';
    document.getElementById('auth-step-otp').style.display = 'block';
    document.getElementById('txt-login-sent-number').textContent = `+91 ${phone}`;
    document.getElementById('login-modal-title').textContent = 'Verify OTP';

    // Clear OTP digit fields
    const otpInputs = document.querySelectorAll('.otp-digit-input');
    otpInputs.forEach(inp => inp.value = '');
    document.getElementById('input-login-otp-value').value = '';
    document.getElementById('btn-login-verify-otp').disabled = true;
    if (otpInputs[0]) otpInputs[0].focus();

    startResendTimer();
    showToast('OTP sent successfully!');
  } catch (err) {
    console.error('SendOtp error:', err);
    showToast('Failed to send OTP. Please check your network or try again.');
    sendBtn.disabled = false;
  } finally {
    sendBtn.textContent = 'Send OTP';
  }
}

async function verifyOtp() {
  const verifyBtn = document.getElementById('btn-login-verify-otp');
  const otp = document.getElementById('input-login-otp-value').value;

  if (otp.length !== 6) {
    showToast('Please enter a valid 6-digit OTP code.');
    return;
  }

  verifyBtn.disabled = true;
  verifyBtn.textContent = 'Verifying...';

  try {
    const response = await fetch(`${BASE_URL}/api/Song/VerifyOtp?phoneNumber=${encodeURIComponent(state.phoneNumber)}&otp=${encodeURIComponent(otp)}&correlationId=${encodeURIComponent(state.correlationId)}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*'
      }
    });

    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Response not JSON
    }

    if (!response.ok || (parsed && parsed.error)) {
      const errorMsg = (parsed && parsed.error && parsed.error.msg)
        || (parsed && parsed.msg)
        || `Verification failed: ${response.status}`;
      throw new Error(errorMsg);
    }

    let cookies = '';
    let displayName = '';
    if (parsed) {
      cookies = parsed.CookieHeader || parsed.cookies || parsed.cookie || text;
      if (parsed.data && parsed.data.firstname) {
        displayName = parsed.data.firstname + (parsed.data.lastname ? ' ' + parsed.data.lastname : '');
      }
    } else {
      cookies = text;
    }

    if (!cookies || cookies.trim() === '') {
      throw new Error('Verification did not return valid cookies.');
    }

    state.cookies = cookies;
    state.displayName = displayName;
    state.isLoggedIn = true;
    saveAuthSession();

    closeLoginModal();
    updateProfileUI();
    showToast('Logged in successfully!');

    fetchJioPlaylists();
  } catch (err) {
    console.error('VerifyOtp error:', err);
    showToast(err.message || 'Invalid OTP or verification failed.');
    verifyBtn.disabled = false;
  } finally {
    verifyBtn.textContent = 'Verify & Sign In';
  }
}

async function fetchJioPlaylists() {
  if (!state.cookies) return;

  try {
    const response = await fetch(`${BASE_URL}/api/Song/GetPlaylists?cookies=${encodeURIComponent(state.cookies)}`);
    if (!response.ok) {
      throw new Error(`Playlist fetch failed: ${response.status}`);
    }
    const data = await response.json();

    let playlists = [];
    if (Array.isArray(data)) {
      playlists = data;
    } else if (data && Array.isArray(data.playlists)) {
      playlists = data.playlists;
    } else if (data && Array.isArray(data.data)) {
      playlists = data.data;
    }

    state.jioPlaylists = playlists.map(p => ({
      id: p.id || p.listid,
      title: p.title || p.listname || p.name,
      subtitle: p.subtitle || 'JioSaavn Playlist',
      image: p.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80',
      type: 'api',
      isJio: true
    }));

    state.customPlaylists = state.jioPlaylists;

    renderSidebarPlaylists();

    // Fetch user library in parallel
    fetchJioLibrary();

    if (state.currentView === 'library') {
      renderLibraryView();
    }
  } catch (err) {
    console.error('Error fetching JioSaavn playlists:', err);
    showToast('Failed to sync playlists with JioSaavn.');
  }
}

async function fetchJioLibrary() {
  if (!state.isLoggedIn || !state.cookies) return;

  try {
    const response = await fetch(`${BASE_URL}/api/Song/GetLibrary?cookies=${encodeURIComponent(state.cookies)}`);
    if (!response.ok) {
      throw new Error(`Library fetch failed: ${response.status}`);
    }
    const data = await response.json();
    state.jioLibrary = data;

    // Fetch full details for followed artists, shows, albums, and playlists
    fetchJioLibraryDetails(data);

    // 1. Sync User Details
    if (data.user) {
      state.displayName = `${data.user.firstname} ${data.user.lastname}`.trim() || data.user.username;
      if (data.user.image) {
        state.userImage = data.user.image;
      }
      saveAuthSession();
      updateProfileUI();
    }

    // 2. Map remote favorite songs directly to state.favorites
    if (data.song && Array.isArray(data.song)) {
      state.favorites = data.song.map(s => ({
        id: s.id,
        title: s.title || s.name || 'Unknown Track',
        subtitle: s.subtitle || s.album || s.more_info?.album || 'JioSaavn Favorite',
        image: s.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80',
        more_info: s.more_info || { album: s.subtitle || s.album || 'Single' },
        year: s.year || s.more_info?.year || 'N/A'
      }));
    }

    // Refresh Library view if active
    if (state.currentView === 'library') {
      renderLibraryView();
    }
  } catch (err) {
    console.error('Error fetching JioSaavn library:', err);
  }
}

async function fetchJioLibraryDetails(data) {
  if (!state.cookies) return;

  const fetchDetails = async (entityType, ids) => {
    if (!ids || ids.length === 0) return [];
    try {
      const response = await fetch(`${BASE_URL}/api/Song/GetLibraryDetails?entityType=${entityType}&entityIds=${encodeURIComponent(ids.join(','))}&cookies=${encodeURIComponent(state.cookies)}`);
      if (!response.ok) {
        console.warn(`Failed to fetch library details for ${entityType}: ${response.status}`);
        return [];
      }
      return await response.json();
    } catch (e) {
      console.error(`Error fetching library details for ${entityType}:`, e);
      return [];
    }
  };

  try {
    const artistIds = (data.artist || []).map(a => typeof a === 'object' ? a.id : a).filter(Boolean);
    const showIds = (data.show || []).map(s => typeof s === 'object' ? s.id : s).filter(Boolean);
    const albumIds = (data.album || []).map(a => typeof a === 'object' ? a.id : a).filter(Boolean);
    const playlistIds = (data.playlist || []).map(p => typeof p === 'object' ? p.id : p).filter(Boolean);

    // Call details APIs in parallel
    const [artists, shows, albums, playlists] = await Promise.all([
      fetchDetails('artist', artistIds),
      fetchDetails('show', showIds),
      fetchDetails('album', albumIds),
      fetchDetails('playlist', playlistIds)
    ]);

    state.libraryArtists = artists || [];
    state.libraryShows = shows || [];
    state.libraryAlbums = albums || [];
    state.libraryPlaylists = playlists || [];

    // Optionally update state.jioPlaylists if playlists are loaded
    if (state.libraryPlaylists.length > 0) {
      const mappedPlaylists = state.libraryPlaylists.map(p => ({
        id: p.id,
        title: p.title || p.name,
        subtitle: p.subtitle || 'JioSaavn Playlist',
        image: p.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80',
        type: 'api',
        isJio: true
      }));

      state.jioPlaylists = mappedPlaylists;
      state.customPlaylists = state.jioPlaylists;
      renderSidebarPlaylists();
    }

    // Refresh Library view if active
    if (state.currentView === 'library') {
      renderLibraryView();
    }
  } catch (err) {
    console.error('Error fetching JioSaavn library details:', err);
  }
}

function updateProfileUI() {
  const userNameEl = document.getElementById('user-profile-name');
  const userAvatarEl = document.getElementById('user-profile-avatar');
  const dropdownPhoneEl = document.getElementById('profile-dropdown-phone');

  const loginTriggerBtn = document.getElementById('btn-profile-login-trigger');
  const refreshPlaylistsBtn = document.getElementById('btn-profile-refresh-playlists');
  const logoutBtn = document.getElementById('btn-profile-logout');

  if (state.isLoggedIn) {
    const fallbackMasked = state.phoneNumber.length >= 10
      ? `+91 ${state.phoneNumber.substring(0, 2)}*****${state.phoneNumber.substring(7)}`
      : state.phoneNumber || 'User';

    const displayName = state.displayName || fallbackMasked;

    userNameEl.textContent = displayName;
    dropdownPhoneEl.textContent = `Mobile: +91 ${state.phoneNumber}`;
    userAvatarEl.src = state.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8a2bbe&color=fff&bold=true`;

    loginTriggerBtn.classList.add('hidden');
    refreshPlaylistsBtn.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    userNameEl.textContent = 'Guest';
    dropdownPhoneEl.textContent = 'Not logged in';
    userAvatarEl.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';

    loginTriggerBtn.classList.remove('hidden');
    refreshPlaylistsBtn.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  }
}

function logout() {
  state.isLoggedIn = false;
  state.phoneNumber = '';
  state.cookies = '';
  state.displayName = '';
  state.userImage = '';
  state.correlationId = '';
  state.jioPlaylists = [];
  state.customPlaylists = [];
  state.jioLibrary = null;
  state.libraryAlbums = [];
  state.libraryPlaylists = [];
  state.libraryShows = [];
  state.libraryArtists = [];

  // Clear local favorites cache when logging out to restore guest defaults
  state.favorites = [];
  localStorage.removeItem('melody_favorites');
  localStorage.removeItem('melody_session');

  updateProfileUI();
  renderSidebarPlaylists();

  if (state.currentView === 'library') {
    renderLibraryView();
  }

  showToast('Logged out successfully.');
}

function setupOtpInputListeners() {
  const inputs = document.querySelectorAll('.otp-digit-input');
  const verifyBtn = document.getElementById('btn-login-verify-otp');
  const hiddenInput = document.getElementById('input-login-otp-value');

  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      input.value = input.value.replace(/[^0-9]/g, '');

      if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      updateOtpValue();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
        inputs[index - 1].focus();
        inputs[index - 1].value = '';
        updateOtpValue();
      }
    });
  });

  function updateOtpValue() {
    let fullValue = '';
    inputs.forEach(inp => {
      fullValue += inp.value;
    });
    hiddenInput.value = fullValue;
    verifyBtn.disabled = fullValue.length !== 6;
  }
}

// ---------------------------------------------------------
// 9c. Premium Mobile Gestures & Draggable Seek Bar
// ---------------------------------------------------------
function makeProgressBarDraggable(containerId, fillId, handleId, timeCurrentId) {
  const container = document.getElementById(containerId);
  const fill = document.getElementById(fillId);
  const handle = document.getElementById(handleId);
  const timeCurrent = document.getElementById(timeCurrentId);

  if (!container || !fill) return;

  let isDragging = false;
  let dragPercent = 0;

  container.addEventListener('pointerdown', (e) => {
    if (!state.currentTrack || isNaN(audio.duration)) return;

    isDragging = true;
    container.setPointerCapture(e.pointerId);

    updateDrag(e);

    // Temporarily remove standard timeline sync to avoid jitter while dragging
    audio.removeEventListener('timeupdate', updateTimeline);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateDrag(e);
  });

  container.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    container.releasePointerCapture(e.pointerId);

    // Commit seek
    if (audio.duration) {
      audio.currentTime = dragPercent * audio.duration;
      if (navigator.vibrate) navigator.vibrate(10);
    }

    // Re-bind timeupdate listener
    audio.addEventListener('timeupdate', updateTimeline);
  });

  container.addEventListener('pointercancel', (e) => {
    if (!isDragging) return;
    isDragging = false;
    container.releasePointerCapture(e.pointerId);
    audio.addEventListener('timeupdate', updateTimeline);
    updateTimeline();
  });

  function updateDrag(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX;
    const dragX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    dragPercent = dragX / rect.width;

    // Render progress immediately
    fill.style.width = `${dragPercent * 100}%`;
    if (handle) {
      handle.style.left = `${dragPercent * 100}%`;
    }

    if (timeCurrent && audio.duration) {
      timeCurrent.textContent = formatTime(dragPercent * audio.duration);
    }
  }
}

function isInteractiveElement(target) {
  if (!target) return false;
  return target.closest('button') ||
    target.closest('a') ||
    target.closest('input') ||
    target.closest('.progress-bar-wrapper') ||
    target.closest('.volume-container') ||
    target.closest('.player-favorite-btn') ||
    target.closest('.player-control-btn') ||
    target.closest('#btn-close-mobile-player') ||
    target.closest('#btn-mobile-player-lyrics') ||
    target.closest('#btn-mobile-player-queue') ||
    target.closest('#mobile-player-album');
}

function initMobileGestures() {
  const overlay = document.getElementById('mobile-player-overlay');
  const miniPlayer = document.querySelector('.player-bar');
  const albumArtWrapper = document.querySelector('.mobile-player-art-wrapper');
  const albumArtImg = document.getElementById('mobile-player-img');

  if (!overlay || !miniPlayer) return;

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let isDragging = false;
  let gestureType = null; // 'minimize' or 'swipe-track'
  let windowHeight = window.innerHeight;
  let startedOnAlbumArt = false;

  window.addEventListener('resize', () => {
    windowHeight = window.innerHeight;
  });

  // 1. Unified Overlay Gestures (Swipe Down to Minimize / Swipe Left-Right Album Art)
  overlay.addEventListener('pointerdown', (e) => {
    if (!overlay.classList.contains('open') || isInteractiveElement(e.target)) return;

    startX = e.clientX;
    startY = e.clientY;
    deltaX = 0;
    deltaY = 0;
    isDragging = true;
    gestureType = null; // Undetermined

    startedOnAlbumArt = albumArtWrapper && albumArtWrapper.contains(e.target);

    overlay.setPointerCapture(e.pointerId);
  });

  overlay.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // Detect gesture direction lock after 5px movement
    if (gestureType === null) {
      if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
        if (startedOnAlbumArt && Math.abs(diffX) > Math.abs(diffY)) {
          gestureType = 'swipe-track';
          if (albumArtImg) albumArtImg.style.transition = 'none';
        } else {
          gestureType = 'minimize';
          overlay.style.transition = 'none';
        }
      }
    }

    if (gestureType === 'minimize') {
      deltaY = diffY;
      if (deltaY > 0) {
        overlay.style.transform = `translateY(${deltaY}px)`;
      } else {
        overlay.style.transform = `translateY(${deltaY * 0.15}px)`; // Resistance upward
      }
    } else if (gestureType === 'swipe-track' && albumArtImg) {
      deltaX = diffX;
      const rotation = deltaX * 0.05;
      albumArtImg.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    }
  });

  overlay.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    overlay.releasePointerCapture(e.pointerId);

    if (gestureType === 'minimize') {
      overlay.style.transition = '';
      if (deltaY > windowHeight * 0.25) {
        overlay.classList.remove('open');
        overlay.style.transform = '';
      } else {
        overlay.style.transform = '';
      }
    } else if (gestureType === 'swipe-track' && albumArtImg) {
      albumArtImg.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease';
      const swipeThreshold = 80;

      if (deltaX < -swipeThreshold) {
        // Swipe Left -> Next Track
        albumArtImg.style.transform = `translateX(-120%) rotate(-10deg)`;
        albumArtImg.style.opacity = '0';
        if (navigator.vibrate) navigator.vibrate(15);

        setTimeout(() => {
          playNext();
          albumArtImg.style.transition = 'none';
          albumArtImg.style.transform = `translateX(120%) rotate(10deg)`;
          albumArtImg.offsetHeight; // trigger reflow
          albumArtImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease';
          albumArtImg.style.transform = '';
          albumArtImg.style.opacity = '1';
        }, 200);
      } else if (deltaX > swipeThreshold) {
        // Swipe Right -> Prev Track
        albumArtImg.style.transform = `translateX(120%) rotate(10deg)`;
        albumArtImg.style.opacity = '0';
        if (navigator.vibrate) navigator.vibrate(15);

        setTimeout(() => {
          playPrev();
          albumArtImg.style.transition = 'none';
          albumArtImg.style.transform = `translateX(-120%) rotate(-10deg)`;
          albumArtImg.offsetHeight; // trigger reflow
          albumArtImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease';
          albumArtImg.style.transform = '';
          albumArtImg.style.opacity = '1';
        }, 200);
      } else {
        albumArtImg.style.transform = '';
        albumArtImg.style.opacity = '1';
      }
    }

    gestureType = null;
    deltaX = 0;
    deltaY = 0;
  });

  overlay.addEventListener('pointercancel', (e) => {
    if (!isDragging) return;
    isDragging = false;
    overlay.releasePointerCapture(e.pointerId);

    if (gestureType === 'minimize') {
      overlay.style.transition = '';
      overlay.style.transform = '';
    } else if (gestureType === 'swipe-track' && albumArtImg) {
      albumArtImg.style.transition = '';
      albumArtImg.style.transform = '';
      albumArtImg.style.opacity = '1';
    }

    gestureType = null;
    deltaX = 0;
    deltaY = 0;
  });

  // 2. Drag Up from Mini Player (Expand Overlay)
  let startMiniY = 0;
  let deltaMiniY = 0;
  let isDraggingMiniPlayer = false;
  let hasDraggedMini = false;
  let isPointerDownMini = false;

  miniPlayer.addEventListener('pointerdown', (e) => {
    if (overlay.classList.contains('open') || isInteractiveElement(e.target)) return;

    startMiniY = e.clientY;
    deltaMiniY = 0;
    isDraggingMiniPlayer = false;
    hasDraggedMini = false;
    isPointerDownMini = true;
  });

  miniPlayer.addEventListener('pointermove', (e) => {
    if (!isPointerDownMini || overlay.classList.contains('open')) return;

    const currentMiniY = e.clientY;
    const diffY = currentMiniY - startMiniY;

    if (!isDraggingMiniPlayer) {
      if (diffY < -10) {
        isDraggingMiniPlayer = true;
        hasDraggedMini = true;
        miniPlayer.setPointerCapture(e.pointerId);
        overlay.classList.add('open');
        overlay.style.transition = 'none';
      }
    }

    if (isDraggingMiniPlayer) {
      deltaMiniY = diffY;
      const targetY = Math.max(0, windowHeight + deltaMiniY);
      overlay.style.transform = `translateY(${targetY}px)`;
    }
  });

  miniPlayer.addEventListener('pointerup', (e) => {
    if (!isPointerDownMini) return;
    isPointerDownMini = false;

    // If they just tapped (no dragging occurred) and it's not a control button
    if (!hasDraggedMini && !isInteractiveElement(e.target)) {
      overlay.classList.add('open');
      overlay.style.transform = '';
      overlay.style.transition = '';
      isDraggingMiniPlayer = false;
      return;
    }

    if (!isDraggingMiniPlayer) return;
    isDraggingMiniPlayer = false;
    miniPlayer.releasePointerCapture(e.pointerId);

    overlay.style.transition = '';

    // Flag to block regular click trigger on release
    state.wasDraggingMiniPlayer = true;
    setTimeout(() => {
      state.wasDraggingMiniPlayer = false;
    }, 150);

    if (Math.abs(deltaMiniY) > windowHeight * 0.20) {
      overlay.classList.add('open');
      overlay.style.transform = '';
    } else {
      overlay.classList.remove('open');
      overlay.style.transform = '';
    }
    deltaMiniY = 0;
  });

  miniPlayer.addEventListener('pointercancel', (e) => {
    isPointerDownMini = false;
    if (!isDraggingMiniPlayer) return;
    isDraggingMiniPlayer = false;
    miniPlayer.releasePointerCapture(e.pointerId);
    overlay.style.transition = '';
    overlay.classList.remove('open');
    overlay.style.transform = '';
    deltaMiniY = 0;
  });
}

// ---------------------------------------------------------
// 10. Utility Functions
// ---------------------------------------------------------
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function formatFollowers(count) {
  if (!count) return '0';
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(0) + 'K';
  }
  return count.toString();
}

function updateMediaSessionMetadata(title, artist, image) {
  if ('mediaSession' in navigator) {
    const albumName = (state.currentTrack && state.currentTrack.more_info && state.currentTrack.more_info.album)
      ? state.currentTrack.more_info.album.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      : 'MelodySaavan';

    let artworkUrl = image || (window.location.origin + '/favicon.svg');
    if (artworkUrl.startsWith('data:')) {
      artworkUrl = window.location.origin + '/favicon.svg';
    }

    // Ensure absolute HTTPS protocol format for iOS Safari requirements
    if (artworkUrl.startsWith('//')) {
      artworkUrl = 'https:' + artworkUrl;
    } else if (artworkUrl.startsWith('http://')) {
      artworkUrl = artworkUrl.replace('http://', 'https://');
    }

    // JioSaavn CDN only serves pre-compiled resolutions. Custom sizes like 96x96 return a 404,
    // which breaks lockscreen artwork. Mapped only to verified dimensions: 150, 250, 500.
    const sizes = [150, 250, 500];
    const artwork = sizes.map(size => {
      const sizeStr = `${size}x${size}`;
      const srcUrl = (artworkUrl.includes('150x150') || artworkUrl.includes('250x250'))
        ? artworkUrl.replace('150x150', sizeStr).replace('250x250', sizeStr)
        : artworkUrl;

      return {
        src: srcUrl,
        sizes: sizeStr,
        type: srcUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg'
      };
    });

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: albumName,
      artwork: artwork
    });
  }
}

function updateMediaSessionPositionState() {
  if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
    if (audio.duration && !isNaN(audio.duration)) {
      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate || 1,
          position: audio.currentTime || 0
        });
      } catch (e) {
        console.warn('Error setting media position state:', e);
      }
    }
  }
}

// Custom Premium Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Theme Toggle
document.getElementById('btn-theme-toggle').onclick = () => {
  const body = document.body;
  const sunIcon = document.querySelector('#btn-theme-toggle .icon-sun');
  const moonIcon = document.querySelector('#btn-theme-toggle .icon-moon');

  if (state.theme === 'dark') {
    state.theme = 'light';
    body.setAttribute('data-theme', 'light');
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
  } else {
    state.theme = 'dark';
    body.removeAttribute('data-theme');
    if (sunIcon) sunIcon.classList.remove('hidden');
    if (moonIcon) moonIcon.classList.add('hidden');
  }
};

// ---------------------------------------------------------
// 11. Initializer Bindings
// ---------------------------------------------------------
function init() {
  initAudio();
  loadLocalStorageData();

  // Set up Media Session action handlers for Lock Screen and Dynamic Island controls
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', togglePlay);
    navigator.mediaSession.setActionHandler('pause', togglePlay);
    navigator.mediaSession.setActionHandler('previoustrack', playPrev);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);

    // System Lock Screen scrubbing support
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.fastSeek && 'fastSeek' in audio) {
        audio.fastSeek(details.seekTime);
      } else {
        audio.currentTime = details.seekTime;
      }
      updateTimeline();
    });
  }

  // Profile UI and Dropdown bindings
  updateProfileUI();

  const profileBadge = document.getElementById('btn-user-profile');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (profileBadge && profileDropdown) {
    profileBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && !profileBadge.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // Trigger login modal from header dropdown
  const loginTriggerBtn = document.getElementById('btn-profile-login-trigger');
  if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', () => {
      profileDropdown.classList.remove('open');
      openLoginModal();
    });
  }

  // Sync JioSaavn playlist button from header dropdown
  const refreshPlaylistsBtn = document.getElementById('btn-profile-refresh-playlists');
  if (refreshPlaylistsBtn) {
    refreshPlaylistsBtn.addEventListener('click', () => {
      profileDropdown.classList.remove('open');
      fetchJioPlaylists();
      showToast('Syncing playlists with JioSaavn...');
    });
  }

  // Logout from header dropdown
  const logoutBtn = document.getElementById('btn-profile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      profileDropdown.classList.remove('open');
      logout();
    });
  }

  // Close Login Modal
  const loginCloseBtn = document.getElementById('btn-login-close');
  if (loginCloseBtn) {
    loginCloseBtn.addEventListener('click', closeLoginModal);
  }

  // Phone input changes (enable/disable send OTP based on length)
  const phoneInput = document.getElementById('input-login-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
      const sendBtn = document.getElementById('btn-login-send-otp');
      sendBtn.disabled = phoneInput.value.length !== 10;
    });
  }

  // Send OTP trigger
  const sendOtpBtn = document.getElementById('btn-login-send-otp');
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => sendOtp());
  }

  // Change Number button (goes back from OTP screen to Phone screen)
  const backPhoneBtn = document.getElementById('btn-login-back-phone');
  if (backPhoneBtn) {
    backPhoneBtn.addEventListener('click', () => {
      document.getElementById('auth-step-otp').style.display = 'none';
      document.getElementById('auth-step-phone').style.display = 'block';
      document.getElementById('login-modal-title').textContent = 'Sign In';
      const sendBtn = document.getElementById('btn-login-send-otp');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      sendBtn.disabled = phoneVal.length !== 10;
    });
  }

  // Resend OTP trigger
  const resendOtpBtn = document.getElementById('btn-login-resend-otp');
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', () => {
      sendOtp();
    });
  }

  // Verify OTP trigger
  const verifyOtpBtn = document.getElementById('btn-login-verify-otp');
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', verifyOtp);
  }

  // OTP inputs listener setup
  setupOtpInputListeners();

  // Binding navbar links
  document.getElementById('nav-home').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  document.getElementById('nav-new-releases').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('new-releases');
  });

  document.getElementById('nav-top-charts').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('top-charts');
  });

  document.getElementById('nav-featured-playlists').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('featured-playlists');
  });

  document.getElementById('nav-top-artists').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('top-artists');
  });

  document.getElementById('nav-search').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('search');
  });

  document.getElementById('nav-library').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('library');
  });

  document.getElementById('nav-history').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('history');
  });

  // History nav buttons
  document.getElementById('btn-history-back').addEventListener('click', goBack);
  document.getElementById('btn-history-forward').addEventListener('click', goForward);

  // Player media controls
  document.getElementById('btn-player-play').addEventListener('click', togglePlay);
  document.getElementById('btn-player-next').addEventListener('click', playNext);
  document.getElementById('btn-player-prev').addEventListener('click', playPrev);

  // Open fullscreen player overlay on click (ignoring controls)
  document.querySelector('.player-bar').addEventListener('click', (e) => {
    if (state.wasDraggingMiniPlayer) {
      state.wasDraggingMiniPlayer = false;
      return;
    }
    if (isInteractiveElement(e.target)) {
      return;
    }
    document.getElementById('mobile-player-overlay').classList.add('open');
  });

  // Close button for mobile player
  document.getElementById('btn-close-mobile-player').addEventListener('click', () => {
    const overlay = document.getElementById('mobile-player-overlay');
    overlay.classList.remove('open');
    overlay.style.transform = '';
    overlay.style.transition = '';
  });

  // Mobile player overlay button actions
  document.getElementById('btn-mobile-player-play').addEventListener('click', togglePlay);
  document.getElementById('btn-mobile-player-next').addEventListener('click', playNext);
  document.getElementById('btn-mobile-player-prev').addEventListener('click', playPrev);

  document.getElementById('btn-mobile-player-favorite').addEventListener('click', (e) => {
    if (state.currentTrack) {
      toggleLikeTrack(state.currentTrack, e);
    }
  });

  document.getElementById('btn-mobile-player-shuffle').addEventListener('click', () => {
    document.getElementById('btn-player-shuffle').click();
  });

  document.getElementById('btn-mobile-player-repeat').addEventListener('click', () => {
    document.getElementById('btn-player-repeat').click();
  });

  document.getElementById('btn-mobile-player-lyrics').addEventListener('click', () => {
    document.getElementById('mobile-player-overlay').classList.remove('open');
    document.getElementById('btn-player-lyrics').click();
  });

  document.getElementById('btn-mobile-player-queue').addEventListener('click', () => {
    document.getElementById('mobile-player-overlay').classList.remove('open');
    document.getElementById('btn-player-queue').click();
  });

  // Wire up Sleep Timer, Speed, and Fullscreen controls
  initSleepTimerControls();
  initPlaybackSpeedControls();
  initFullscreenControls();
  initPullToRefresh();

  // Mobile timeline seek & drag to seek
  makeProgressBarDraggable('mobile-progress-bar-container', 'mobile-player-progress-fill', 'mobile-player-progress-handle', 'mobile-player-time-current');

  // Featured artist banner buttons
  document.getElementById('btn-hero-play').onclick = async () => {
    // Play Arijit Singh top hits
    const results = await fetchAPI('/api/Song/SearchByQuery?query=Arijit%20Singh');
    if (results && results.results && results.results.length > 0) {
      playTrackList(results.results, 0);
      showToast("Playing Arijit Singh Radio");
    }
  };

  document.getElementById('btn-hero-explore').onclick = () => {
    navigateTo('artist', { id: '459320', name: 'Arijit Singh', image: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_150x150.jpg', token: 'LlRWpHzy3Hk_' });
  };

  // Browse page shortcuts click handler
  document.querySelectorAll('.genre-card').forEach(card => {
    card.addEventListener('click', () => {
      const genre = card.getAttribute('data-genre');
      searchInput.value = genre;
      searchInput.dispatchEvent(new Event('input'));
    });
  });

  // Horizontal scroll carousel navigation for music shelves (one by one sliding effect)
  document.querySelectorAll('.shelf-nav-btn').forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.getAttribute('data-target');
      const container = document.getElementById(targetId);
      const direction = btn.classList.contains('prev-btn') ? -1 : 1;
      if (container) {
        const firstCard = container.querySelector('.music-card');
        let cardWidth = 175 + 20; // Default fallback
        if (firstCard) {
          const style = window.getComputedStyle(container);
          const gap = parseInt(style.gap) || 20;
          cardWidth = firstCard.offsetWidth + gap;
        }
        container.scrollBy({
          left: direction * cardWidth,
          behavior: 'smooth'
        });
      }
    };
  });

  // Initialize mobile player swipe & drag gestures
  initMobileGestures();

  // Initialize HTML5 Queue Drag & Drop reordering
  initDragAndDropQueue();

  // Load home view initially
  navigateTo('home');
}

// Launch app
window.addEventListener('DOMContentLoaded', () => {
  init();
  lucide.createIcons();
});

// --- PREMIUM FEATURE: CANVAS COLOR EXTRACTOR & DYNAMIC THEME ---
function extractThemeFromImage(imageUrl) {
  if (!imageUrl) return;

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 10, 10);

      const imgData = ctx.getImageData(0, 0, 10, 10).data;
      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < imgData.length; i += 4) {
        const pixelR = imgData[i];
        const pixelG = imgData[i + 1];
        const pixelB = imgData[i + 2];
        const alpha = imgData[i + 3];

        if (alpha < 200) continue;

        const max = Math.max(pixelR, pixelG, pixelB);
        const min = Math.min(pixelR, pixelG, pixelB);
        if (max - min < 15) continue;

        r += pixelR;
        g += pixelG;
        b += pixelB;
        count++;
      }

      if (count === 0) {
        for (let i = 0; i < imgData.length; i += 4) {
          r += imgData[i];
          g += imgData[i + 1];
          b += imgData[i + 2];
          count++;
        }
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      // Enforce premium dimness/vibrancy bounds so theme text remains readable
      const rgbStr = `${r}, ${g}, ${b}`;
      document.documentElement.style.setProperty('--accent-rgb', rgbStr);
      document.documentElement.style.setProperty('--accent-primary', `rgb(${r}, ${g}, ${b})`);
      document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);
      document.documentElement.style.setProperty('--accent-glow-strong', `rgba(${r}, ${g}, ${b}, 0.5)`);

      // Update dynamic backdrop background image
      const backdrop = document.getElementById('mobile-player-backdrop-blur');
      if (backdrop) {
        backdrop.style.backgroundImage = `url(${imageUrl})`;
      }
    } catch (e) {
      console.warn("Failed to extract theme colors from canvas:", e);
    }
  };

  let srcUrl = imageUrl;
  if (srcUrl.startsWith('//')) {
    srcUrl = 'https:' + srcUrl;
  } else if (srcUrl.startsWith('http://')) {
    srcUrl = srcUrl.replace('http://', 'https://');
  }
  img.src = srcUrl;
}

// --- PREMIUM FEATURE: HEART POP PARTICLES BURST ---
function createHeartBurstParticles(e) {
  if (navigator.vibrate) navigator.vibrate(12);
  const rect = e.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const numParticles = 8;
  const container = document.body;

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'like-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = (i / numParticles) * 2 * Math.PI;
    const distance = Math.random() * 20 + 20;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 600);
  }
}

// --- PREMIUM FEATURE: SLEEP TIMER ---
let sleepTimerId = null;
let sleepTimerMinutesLeft = 0;
let sleepTimerIntervalId = null;

function setSleepTimer(minutes) {
  clearSleepTimer();
  if (minutes <= 0) return;

  sleepTimerMinutesLeft = minutes;
  updateSleepTimerUI();

  sleepTimerIntervalId = setInterval(() => {
    sleepTimerMinutesLeft--;
    updateSleepTimerUI();
    if (sleepTimerMinutesLeft <= 0) {
      audio.pause();
      state.isPlaying = false;
      updatePlayerUI();
      clearSleepTimer();
      showToast("Sleep timer finished. Playback paused.");
    }
  }, 60000);
}

function clearSleepTimer() {
  if (sleepTimerIntervalId) {
    clearInterval(sleepTimerIntervalId);
    sleepTimerIntervalId = null;
  }
  sleepTimerMinutesLeft = 0;
  const timerText = document.getElementById('mobile-timer-text');
  if (timerText) timerText.textContent = "Timer";
}

function updateSleepTimerUI() {
  const timerText = document.getElementById('mobile-timer-text');
  if (timerText) {
    timerText.textContent = `${sleepTimerMinutesLeft}m left`;
  }
}

function initSleepTimerControls() {
  const timerBtn = document.getElementById('btn-mobile-player-sleeptimer');
  const timerModal = document.getElementById('modal-sleep-timer');
  const closeTimerBtn = document.getElementById('btn-close-sleep-timer');
  const cancelTimerBtn = document.getElementById('btn-cancel-timer');

  timerBtn.onclick = () => {
    timerModal.classList.add('open');
  };

  closeTimerBtn.onclick = () => {
    timerModal.classList.remove('open');
  };

  cancelTimerBtn.onclick = () => {
    clearSleepTimer();
    timerModal.classList.remove('open');
    showToast("Sleep timer cancelled");
  };

  timerModal.querySelectorAll('.btn-timer-option').forEach(btn => {
    btn.onclick = () => {
      const minutes = parseInt(btn.getAttribute('data-minutes'));
      if (minutes) {
        setSleepTimer(minutes);
        timerModal.classList.remove('open');
        showToast(`Sleep timer set for ${minutes} minutes`);
      }
    };
  });
}

// --- PREMIUM FEATURE: PLAYBACK SPEED ---
function initPlaybackSpeedControls() {
  const speedBtn = document.getElementById('btn-mobile-player-speed');
  const speedModal = document.getElementById('modal-playback-speed');
  const closeSpeedBtn = document.getElementById('btn-close-playback-speed');

  speedBtn.onclick = () => {
    speedModal.classList.add('open');
  };

  closeSpeedBtn.onclick = () => {
    speedModal.classList.remove('open');
  };

  speedModal.querySelectorAll('.btn-speed-option').forEach(btn => {
    btn.onclick = () => {
      const speed = parseFloat(btn.getAttribute('data-speed'));
      if (speed) {
        setPlaybackSpeed(speed);
        speedModal.classList.remove('open');
        showToast(`Playback speed set to ${speed}x`);
      }
    };
  });
}

function setPlaybackSpeed(speed) {
  audio.playbackRate = speed;
  const speedText = document.getElementById('mobile-speed-text');
  if (speedText) {
    speedText.textContent = `${speed}x speed`;
  }
}

// --- PREMIUM FEATURE: LONG PRESS & CONTEXT MENU ---
function bindTrackContextMenu(element, track) {
  let pressTimer;

  const showMenu = (e) => {
    e.preventDefault();
    const menu = document.getElementById('context-menu');
    if (!menu) return;

    menu.classList.remove('hidden');

    // Position menu at pointer coordinates
    const menuWidth = 170;
    const menuHeight = 160;
    let x = e.clientX || (e.touches && e.touches[0].clientX) || 100;
    let y = e.clientY || (e.touches && e.touches[0].clientY) || 100;

    // Keep within bounds
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    // Bind context actions
    document.getElementById('ctx-play-next').onclick = () => {
      state.queue.splice(state.currentIndex + 1, 0, track);
      state.originalQueue.push(track);
      showToast(`"${track.title}" will play next`);
      menu.classList.add('hidden');
      renderQueueList();
    };

    document.getElementById('ctx-add-queue').onclick = () => {
      state.queue.push(track);
      state.originalQueue.push(track);
      showToast(`Added "${track.title}" to Queue`);
      menu.classList.add('hidden');
      renderQueueList();
    };

    document.getElementById('ctx-view-album').onclick = () => {
      const albumUrl = track.more_info?.album_url || '';
      const albumToken = albumUrl.split('/').filter(Boolean).pop();
      if (albumToken) {
        navigateTo('album', { token: albumToken });
      } else {
        showToast("Album info not available");
      }
      menu.classList.add('hidden');
    };

    document.getElementById('ctx-view-artist').onclick = () => {
      const artistId = track.more_info?.artistMap?.artists?.[0]?.id || track.more_info?.music || '';
      const artistToken = track.more_info?.artistMap?.artists?.[0]?.perma_url?.split('/').filter(Boolean).pop() || '';

      navigateTo('artist', { id: artistId, name: track.subtitle || 'Artist', token: artistToken });
      menu.classList.add('hidden');
    };
  };

  element.addEventListener('contextmenu', (e) => {
    showMenu(e);
  });

  element.addEventListener('pointerdown', (e) => {
    if (e.button && e.button !== 0) return;
    pressTimer = setTimeout(() => {
      showMenu(e);
    }, 600);
  });

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  element.addEventListener('pointerup', cancelPress);
  element.addEventListener('pointerleave', cancelPress);
  element.addEventListener('pointermove', cancelPress);
  element.addEventListener('touchend', cancelPress);
}

// Close Context Menu on click outside
window.addEventListener('click', (e) => {
  const menu = document.getElementById('context-menu');
  if (menu && !menu.classList.contains('hidden') && !e.target.closest('#context-menu')) {
    menu.classList.add('hidden');
  }
});

// --- PREMIUM FEATURE: HTML5 QUEUE DRAG & DROP REORDERING ---
function initDragAndDropQueue() {
  const container = document.getElementById('queue-tracks-list');
  if (!container) return;

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = container.querySelector('.dragging');
    const siblings = [...container.querySelectorAll('.queue-row:not(.dragging)')];

    const nextSibling = siblings.find(sibling => {
      const rect = sibling.getBoundingClientRect();
      return e.clientY <= rect.top + rect.height / 2;
    });

    if (nextSibling) {
      container.insertBefore(draggingItem, nextSibling);
    } else {
      container.appendChild(draggingItem);
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();

    const finalElements = [...container.querySelectorAll('.queue-row')];
    const newQueueOrder = [];
    let newCurrentIndex = state.currentIndex;

    finalElements.forEach((el, index) => {
      const originalIdx = parseInt(el.getAttribute('data-index'));
      newQueueOrder.push(state.queue[originalIdx]);
      if (originalIdx === state.currentIndex) {
        newCurrentIndex = index;
      }
    });

    state.queue = newQueueOrder;
    state.currentIndex = newCurrentIndex;

    renderQueueList();
    showToast("Queue reordered successfully");
  });
}

function initFullscreenControls() {
  const btnDesktop = document.getElementById('btn-player-fullscreen');
  const btnMobile = document.getElementById('btn-mobile-player-fullscreen');

  const updateIcons = () => {
    const isFS = !!document.fullscreenElement;
    const iconName = isFS ? 'minimize-2' : 'maximize';
    const titleText = isFS ? 'Exit Fullscreen' : 'Toggle Fullscreen';

    [btnDesktop, btnMobile].forEach(btn => {
      if (btn) {
        btn.setAttribute('title', titleText);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', iconName);
        }
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const toggleFS = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        showToast("Fullscreen mode is not supported by your browser");
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (btnDesktop) btnDesktop.onclick = toggleFS;
  if (btnMobile) btnMobile.onclick = toggleFS;

  document.addEventListener('fullscreenchange', updateIcons);
}

async function refreshActiveView() {
  const view = state.currentView;
  const data = state.currentViewData;

  if (view === 'home') {
    homeDataLoaded = false;
    await loadHomeData();
  } else if (view === 'library') {
    renderLibraryView();
  } else if (view === 'playlist') {
    if (data) {
      await loadPlaylistDetail(data);
    }
  } else if (view === 'album') {
    if (data && data.token) {
      await loadAlbumDetailByToken(data.token);
    }
  } else if (view === 'artist') {
    if (data) {
      await loadArtistDetail(data);
    }
  } else if (view === 'search') {
    const inputSearch = document.getElementById('input-search');
    if (inputSearch && inputSearch.value) {
      await executeSearch(inputSearch.value);
    } else {
      await loadTrendingSearches();
    }
  } else if (view === 'new-releases') {
    await loadNewReleasesPage();
  } else if (view === 'top-charts') {
    await loadTopChartsPage();
  } else if (view === 'featured-playlists') {
    await loadFeaturedPlaylistsPage();
  } else if (view === 'top-artists') {
    await loadTopArtistsPage();
  }
}

function initPullToRefresh() {
  const viewport = document.getElementById('viewport');
  const pullIndicator = document.getElementById('pull-to-refresh');
  const pullText = document.getElementById('pull-to-refresh-text');
  const pullSpinner = pullIndicator ? pullIndicator.querySelector('.pull-spinner') : null;

  if (!viewport || !pullIndicator) return;

  let startY = 0;
  let currentY = 0;
  let isPulling = false;
  const maxPull = 120;
  const triggerDist = 60;
  const resistance = 0.5;

  const getEventY = (e) => {
    return e.touches ? e.touches[0].pageY : e.pageY;
  };

  const startPull = (e) => {
    if (viewport.scrollTop === 0) {
      startY = getEventY(e);
      isPulling = true;
      pullIndicator.classList.add('pulling');
    }
  };

  const movePull = (e) => {
    if (!isPulling) return;
    
    currentY = getEventY(e);
    const diff = currentY - startY;

    if (diff > 0) {
      if (e.cancelable) e.preventDefault();

      const yOffset = Math.min(maxPull, diff * resistance);
      
      pullIndicator.style.opacity = Math.min(1, yOffset / triggerDist);
      pullIndicator.style.transform = `translateY(${yOffset - 20}px)`;

      if (pullSpinner) {
        pullSpinner.style.transform = `rotate(${diff * 2}deg)`;
      }

      if (yOffset >= triggerDist) {
        pullText.textContent = 'Release to refresh';
      } else {
        pullText.textContent = 'Pull to refresh';
      }
    } else {
      resetPull();
    }
  };

  const endPull = async () => {
    if (!isPulling) return;
    isPulling = false;
    pullIndicator.classList.remove('pulling');

    const diff = currentY - startY;
    const yOffset = Math.min(maxPull, diff * resistance);

    if (yOffset >= triggerDist) {
      pullIndicator.classList.add('loading');
      pullText.textContent = 'Refreshing...';
      
      try {
        await refreshActiveView();
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        setTimeout(() => {
          pullIndicator.classList.remove('loading');
          resetPullStyles();
        }, 600);
      }
    } else {
      resetPullStyles();
    }
  };

  const resetPull = () => {
    isPulling = false;
    pullIndicator.classList.remove('pulling');
    resetPullStyles();
  };

  const resetPullStyles = () => {
    pullIndicator.style.opacity = '';
    pullIndicator.style.transform = '';
    if (pullSpinner) {
      pullSpinner.style.transform = '';
    }
    pullText.textContent = 'Pull to refresh';
  };

  viewport.addEventListener('touchstart', startPull, { passive: false });
  viewport.addEventListener('touchmove', movePull, { passive: false });
  viewport.addEventListener('touchend', endPull);

  viewport.addEventListener('mousedown', startPull);
  window.addEventListener('mousemove', (e) => {
    if (isPulling) movePull(e);
  });
  window.addEventListener('mouseup', () => {
    if (isPulling) endPull();
  });
}
