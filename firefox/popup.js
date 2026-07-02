let tabs = [];
let selectedIndex = 0;
let tabElements = [];

const fallbackEmojis = ['🚚', '⭐', '🟦', '🙃', '📌', '🌐', '🚀'];

function getDomain(url) {
  if (!url || url.startsWith('about:') || url.startsWith('moz-extension://')) return '';
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    return '';
  }
}

function getFallbackEmoji(url) {
  if (!url) return fallbackEmojis[0];
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  return fallbackEmojis[Math.abs(hash) % fallbackEmojis.length];
}

function initList() {
  const list = document.getElementById('tabList');
  list.innerHTML = '';
  tabElements = [];

  tabs.forEach((tab, i) => {
    const item = document.createElement('div');
    item.className = `tab-item ${i === selectedIndex ? 'selected' : ''}`;

    const fullDomain = getDomain(tab.url);
    const maxChars = fullDomain.length > 20 ? 20 : fullDomain.length;
    const displayDomain = fullDomain.substring(0, maxChars) + (fullDomain.length > maxChars ? '…' : '');

    const isCurrent = i === 0;
    const fallbackEmoji = getFallbackEmoji(tab.url);

    const div = document.createElement('div');
    div.className = 'icon-wrapper';

    let img = null;

    if (tab.favIconUrl && (tab.favIconUrl.startsWith('http') || tab.favIconUrl.startsWith('data:'))) {
      img = document.createElement('img');
      img.className = 'favicon-img';
      img.src = tab.favIconUrl;
    }

    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'favicon-text';
    emojiSpan.textContent = fallbackEmoji;

    if (img) {
      img.onload = () => { emojiSpan.style.display = 'none'; };
      img.onerror = () => { img.style.display = 'none'; emojiSpan.style.display = 'inline'; };
    } else {
      emojiSpan.style.display = 'inline';
    }

    if (img) div.appendChild(img);
    div.appendChild(emojiSpan);
    item.appendChild(div);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'tab-info';
    infoDiv.innerHTML = `
      <span class="tab-title">${tab.title || 'Untitled'}</span>
      <span class="tab-domain">${displayDomain}</span>
    `;
    item.appendChild(infoDiv);

    if (isCurrent) {
      const badge = document.createElement('span');
      badge.className = 'current-badge';
      badge.textContent = 'current';
      item.appendChild(badge);
    }

    item.onclick = () => switchToTab(i);
    list.appendChild(item);
    tabElements.push(item);
  });
}

function updateSelection() {
  tabElements.forEach((el, i) => {
    el.classList.toggle('selected', i === selectedIndex);
  });
  const selectedEl = tabElements[selectedIndex];
  if (selectedEl) {
    selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

function switchToTab(index) {
  const tab = tabs[index];
  chrome.runtime.sendMessage({
    action: 'switchTab',
    tabId: tab.id,
    windowId: tab.windowId
  });
  window.close();
}

function closeSelectedTab() {
  const tab = tabs[selectedIndex];
  chrome.runtime.sendMessage({
    action: 'closeTab',
    tabId: tab.id
  });
  tabs.splice(selectedIndex, 1);
  if (selectedIndex >= tabs.length) selectedIndex = Math.max(0, tabs.length - 1);
  initList();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % tabs.length;
    updateSelection();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + tabs.length) % tabs.length;
    updateSelection();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    switchToTab(selectedIndex);
  } else if (e.key === 'Escape') {
    window.close();
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    closeSelectedTab();
  }
});

chrome.tabs.query({ currentWindow: true }, function(allTabs) {
  const activeTab = allTabs.find(t => t.active);
  const sorted = allTabs
    .filter(t => t.id !== activeTab.id)
    .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
    .slice(0, 10);

  tabs = [activeTab, ...sorted].map(t => ({
    id: t.id,
    title: t.title || 'Untitled',
    favIconUrl: t.favIconUrl,
    url: t.url,
    windowId: t.windowId
  }));

  initList();
  setTimeout(() => document.body.focus(), 50);
});
