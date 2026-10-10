const config = window.LoadingScreenConfig || {};

const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("loading-percent");
const statusText = document.getElementById("loading-status");
const loadingLabel = document.querySelector(".loading-label");
const backgroundVideo = document.getElementById("background-video");
const logoImage = document.querySelector(".logo-image");
const music = document.getElementById("music");
const playToggle = document.getElementById("play-toggle");
const previousTrackButton = document.getElementById("previous-track");
const nextTrackButton = document.getElementById("next-track");
const muteToggle = document.getElementById("mute-toggle");
const volumeControl = document.getElementById("volume-control");
const volumePopover = document.getElementById("volume-popover");
const volumeSlider = document.getElementById("volume-slider");
const menu = document.getElementById("info-menu");
const menuClose = document.getElementById("menu-close");
const loadscreen = document.querySelector(".loadscreen");
const topNav = document.querySelector(".top-nav");
const socialsTitle = document.querySelector(".socials p");
const socialRow = document.querySelector(".social-row");
const trackTitle = document.querySelector(".track-title");
const trackArtist = document.querySelector(".track-artist");
const brand = document.querySelector(".brand");
const loadingPanel = document.querySelector(".loading-panel");
const musicCard = document.querySelector(".music-card");
const socials = document.querySelector(".socials");

let navButtons = [];
let menuPanels = [];
let keybindButtons = [];
let displayedProgress = Number(config.loading?.startProgress ?? 73);
let realProgress = displayedProgress;
let musicStarted = false;
let musicTracks = [];
let currentTrackIndex = 0;
let configuredMusicVolume = 0.55;
let audioBootstrapDone = false;
let audioUnlockBound = false;

const DEFAULT_MUSIC_TRACK = {
    name: "Grand Country Radio",
    artist: "GCRP",
    src: "./assets/music/music-gcrp.mp3"
};

function clamp(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return min;
    return Math.max(min, Math.min(max, numeric));
}

function setIfValue(element, property, value) {
    if (element && value !== undefined && value !== null && value !== "") {
        element.style[property] = value;
    }
}

function setText(element, value) {
    if (element && value !== undefined && value !== null) {
        element.textContent = String(value);
    }
}

function createElement(tag, className, attributes = {}) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            element.setAttribute(key, String(value));
        }
    });

    return element;
}

function createImage(src, className, alt = "") {
    const img = createElement("img", className, {
        src,
        alt,
        "aria-hidden": alt ? null : "true"
    });
    return img;
}

function isExternalHref(href) {
    return /^(https?:)?\/\//i.test(String(href || ""));
}

function getMusicTracks() {
    const configuredTracks = Array.isArray(config.music?.tracks) ? config.music.tracks : [];
    const tracks = configuredTracks
        .map((track, index) => ({
            name: track.name || track.songName || track.title || `Track ${index + 1}`,
            artist: track.artist || "",
            src: track.src || track.file || track.path || ""
        }))
        .filter((track) => track.src);

    if (tracks.length) {
        return tracks;
    }

    return [{
        name: config.music?.songName || config.music?.title || DEFAULT_MUSIC_TRACK.name,
        artist: config.music?.artist || DEFAULT_MUSIC_TRACK.artist,
        src: config.assets?.music || music.getAttribute("src") || DEFAULT_MUSIC_TRACK.src
    }];
}

function setTrackText(track) {
    setText(trackTitle, track?.name || DEFAULT_MUSIC_TRACK.name);

    if (trackArtist) {
        const artist = String(track?.artist || DEFAULT_MUSIC_TRACK.artist).trim();
        const [primary, ...rest] = artist.split(" ");
        const primaryElement = createElement("span");
        primaryElement.textContent = primary || "";

        trackArtist.textContent = "";
        trackArtist.appendChild(primaryElement);

        if (rest.length) {
            trackArtist.append(` ${rest.join(" ")}`);
        }
    }
}

function normalizeTrackIndex(index) {
    if (!musicTracks.length) {
        return 0;
    }

    return ((index % musicTracks.length) + musicTracks.length) % musicTracks.length;
}

function setMusicTrack(index, playAfterChange = false) {
    if (!musicTracks.length) {
        return;
    }

    currentTrackIndex = normalizeTrackIndex(index);
    const track = musicTracks[currentTrackIndex];

    if (music.src !== track.src) {
        music.src = track.src;
    }

    music.load();
    setTrackText(track);

    if (playAfterChange) {
        startMusic();
    }
}

function playNextTrack(playAfterChange = true) {
    if (musicTracks.length <= 1) {
        music.currentTime = 0;
        if (playAfterChange) startMusic();
        return;
    }

    setMusicTrack(currentTrackIndex + 1, playAfterChange);
}

function playPreviousTrack(playAfterChange = true) {
    if (music.currentTime > 3) {
        music.currentTime = 0;
        if (playAfterChange) startMusic();
        return;
    }

    if (musicTracks.length <= 1) {
        music.currentTime = 0;
        if (playAfterChange) startMusic();
        return;
    }

    setMusicTrack(currentTrackIndex - 1, playAfterChange);
}

function openExternalUrl(url) {
    if (!isExternalHref(url)) {
        return false;
    }

    if (typeof window.invokeNative === "function") {
        window.invokeNative("openUrl", url);
        return true;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    return true;
}

function applyLinkBehavior(anchor, target) {
    if (!anchor || anchor.tagName !== "A") {
        return;
    }

    const href = anchor.getAttribute("href");

    if (target) {
        anchor.target = target;
    } else if (isExternalHref(href)) {
        anchor.target = "_blank";
    }

    if (anchor.target === "_blank") {
        anchor.rel = "noreferrer";
    }
}

function createActionLink(action) {
    if (!action?.label) {
        return null;
    }

    const link = createElement("a", "panel-action", { href: action.href || "#" });
    link.textContent = action.label;

    applyLinkBehavior(link, action.target);

    return link;
}

function getEnabledNavItems() {
    return (config.nav || []).filter((item) => item.enabled !== false && config.panels?.[item.id]);
}

function hexToRgb(hex) {
    const value = String(hex || "").replace("#", "").trim();
    const normalized = value.length === 3
        ? value.split("").map((char) => char + char).join("")
        : value;

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return null;
    }

    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16)
    };
}

function accentFilterFromHex(hex) {
    const rgb = hexToRgb(hex);

    if (!rgb) {
        return "brightness(0) invert(1)";
    }

    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const lightness = (max + min) / 2 / 255;
    const saturation = max === min ? 0 : (max - min) / (1 - Math.abs(2 * lightness - 1)) / 255;
    let hue = 0;

    if (max !== min) {
        if (max === rgb.r) hue = ((rgb.g - rgb.b) / (max - min)) % 6;
        if (max === rgb.g) hue = (rgb.b - rgb.r) / (max - min) + 2;
        if (max === rgb.b) hue = (rgb.r - rgb.g) / (max - min) + 4;
        hue = Math.round(hue * 60);
        if (hue < 0) hue += 360;
    }

    const invert = Math.round((1 - lightness) * 72 + 12);
    const sepia = Math.round(saturation * 92);
    const saturate = Math.round(900 + saturation * 4200);
    const brightness = Math.round(82 + lightness * 45);

    return `brightness(0) saturate(100%) invert(${invert}%) sepia(${sepia}%) saturate(${saturate}%) hue-rotate(${hue}deg) brightness(${brightness}%) contrast(102%)`;
}

function applyTheme() {
    const root = document.documentElement;
    const theme = config.theme || {};
    const accent = theme.accent || theme.blue;
    const accentSoft = theme.accentSoft || theme.blueSoft || accent;

    if (accent) {
        root.style.setProperty("--blue", accent);
        root.style.setProperty("--accent-icon-filter", accentFilterFromHex(accent));
    }

    if (accentSoft) root.style.setProperty("--blue-soft", accentSoft);
    if (theme.white) root.style.setProperty("--white", theme.white);
    if (theme.muted) root.style.setProperty("--muted", theme.muted);
}

function applyLayout() {
    const layout = config.layout || {};

    setIfValue(brand, "left", layout.left);
    setIfValue(loadingPanel, "left", layout.left);
    setIfValue(musicCard, "left", layout.left);
    setIfValue(socials, "left", layout.left);
    setIfValue(brand, "top", layout.logoTop);
    setIfValue(topNav, "top", layout.navTop);
    setIfValue(topNav, "right", layout.navRight);
}

function applyAssets() {
    document.title = config.pageTitle || "FiveM Loading Screen";

    if (config.assets?.backgroundPoster) {
        backgroundVideo.poster = config.assets.backgroundPoster;
    }

    if (config.assets?.logo) {
        logoImage.src = config.assets.logo;
    }

    music.autoplay = config.music?.autoplay !== false;
    music.preload = "auto";
}

function renderNav() {
    topNav.innerHTML = "";

    getEnabledNavItems().forEach((item) => {
        const button = createElement("button", "nav-pill", {
            type: "button",
            "data-menu": item.id,
            "aria-expanded": "false"
        });

        if (item.icon) {
            button.appendChild(createImage(item.icon, "nav-icon"));
        }

        const label = createElement("span");
        label.textContent = item.label || item.id;
        button.appendChild(label);
        topNav.appendChild(button);
    });
}

function createPanelHeader(panel, fallbackClass = "panel-header") {
    const header = createElement("header", fallbackClass);
    const badge = createElement("span", panel.icon ? "panel-icon" : "panel-number");

    if (panel.icon) {
        badge.appendChild(createImage(panel.icon, ""));
    } else {
        badge.textContent = panel.number || "";
    }

    const title = createElement("h2");
    title.textContent = panel.title || "";
    header.appendChild(badge);
    header.appendChild(title);
    return header;
}

function renderRulesPanel(panel) {
    const article = createElement("article", "menu-panel content-panel rules-panel", { "data-panel": "rules" });
    article.appendChild(createPanelHeader(panel));

    const list = createElement("div", "rules-list");
    (panel.items || []).forEach((item, index) => {
        const card = createElement("article", "rule-card");
        const title = createElement("h3");
        const text = createElement("p");
        const number = item.icon || String(index + 1).padStart(2, "0");
        title.textContent = `${number}. ${item.title || ""}`;
        text.textContent = item.text || "";
        card.appendChild(title);
        card.appendChild(text);
        list.appendChild(card);
    });

    article.appendChild(list);
    const action = createActionLink(panel.action);
    if (action) article.appendChild(action);
    return article;
}

function keySizeClass(label) {
    if (label === "Tab" || label === "Bksp") return "wide";
    if (label === "Caps") return "wider";
    if (label === "Enter") return "enter";
    if (label === "Shift") return "shift";
    return "";
}

function renderKeybindsPanel(panel) {
    const article = createElement("article", "menu-panel keybind-panel", { "data-panel": "keybinds" });
    const header = createElement("header", "keybind-header");
    const icon = createElement("span", "keybind-icon");
    icon.appendChild(createImage(panel.icon || "./assets/icons/nav-keybinds.svg", ""));

    const title = createElement("h2");
    title.textContent = panel.title || "Server Keybinds";
    header.appendChild(icon);
    header.appendChild(title);
    article.appendChild(header);

    const selected = createElement("div", "keybind-selected");
    const code = createElement("p", "", { id: "keybind-code" });
    const action = createElement("h3", "", { id: "keybind-action" });
    code.textContent = `Keybind [ ${panel.defaultKey || "T"} ]`;
    action.textContent = panel.defaultAction || "Open Text Chat";
    selected.appendChild(code);
    selected.appendChild(action);
    article.appendChild(selected);

    const keybinds = new Map((panel.items || []).map((item) => [String(item.key).toUpperCase(), item]));
    const keyboard = createElement("div", "keyboard", { "aria-label": "Server keybind keyboard" });
    const rows = panel.keyboard || [];

    rows.forEach((row) => {
        const keyboardRow = createElement("div", "keyboard-row");
        row.forEach((label) => {
            const upper = String(label).toUpperCase();
            const keybind = keybinds.get(upper);
            const classes = ["keycap", keySizeClass(label)];

            if (keybind) {
                classes.push("active-key");
                if (upper === String(panel.defaultKey || "").toUpperCase()) {
                    classes.push("selected-key");
                }
            } else {
                classes.push("muted");
            }

            const button = createElement("button", classes.filter(Boolean).join(" "), {
                type: "button",
                tabindex: keybind ? "0" : "-1"
            });
            button.textContent = label;

            if (keybind) {
                button.dataset.keybind = keybind.key;
                button.dataset.action = keybind.action;
            }

            keyboardRow.appendChild(button);
        });
        keyboard.appendChild(keyboardRow);
    });

    article.appendChild(keyboard);
    return article;
}

function renderStaffPanel(panel) {
    const article = createElement("article", "menu-panel content-panel", { "data-panel": "staff" });
    article.appendChild(createPanelHeader(panel));

    const list = createElement("div", "staff-list");
    (panel.groups || []).forEach((group) => {
        const groupElement = createElement("div", "staff-group");
        const role = createElement("p", "panel-kicker");
        role.textContent = group.role || "";
        groupElement.appendChild(role);

        (group.members || []).forEach((member) => {
            const memberElement = createElement("div", "staff-member");
            const avatar = createElement("span", `staff-avatar ${member.avatarClass || "avatar-blue"}`);
            avatar.textContent = member.initial || (member.name || "?").slice(0, 1);

            const body = createElement("div");
            const name = createElement("h3");
            const title = createElement("p");
            name.textContent = member.name || "";
            title.textContent = member.title || "";
            body.appendChild(name);
            body.appendChild(title);

            memberElement.appendChild(avatar);
            memberElement.appendChild(body);
            groupElement.appendChild(memberElement);
        });

        list.appendChild(groupElement);
    });

    article.appendChild(list);
    const action = createActionLink(panel.action);
    if (action) article.appendChild(action);
    return article;
}

function renderwebPanel(panel) {
    const article = createElement("article", "menu-panel content-panel", { "data-panel": "web" });
    article.appendChild(createPanelHeader(panel));

    const list = createElement("div", "web-list");
    (panel.items || []).forEach((item) => {
        const card = createElement("article", "web-card");
        const body = createElement("div");
        const title = createElement("h3");
        const text = createElement("p");
        title.textContent = item.title || "";
        text.textContent = item.text || "";
        body.appendChild(title);
        body.appendChild(text);

        const price = createElement(item.href ? "a" : "span", "web-price", {
            href: item.href || null
        });
        price.textContent = item.price || item.badge || "";
        applyLinkBehavior(price, item.target);

        card.appendChild(body);
        if (price.textContent) {
            card.appendChild(price);
        }
        list.appendChild(card);
    });

    article.appendChild(list);
    const action = createActionLink(panel.action);
    if (action) article.appendChild(action);
    return article;
}

function renderGenericPanel(id, panel) {
    const article = createElement("article", "menu-panel content-panel", { "data-panel": id });
    article.appendChild(createPanelHeader(panel));

    const list = createElement("div", "rules-list");
    (panel.items || []).forEach((item, index) => {
        const card = createElement("article", "rule-card");
        const icon = createElement("span", "rule-icon");
        const iconText = createElement("span");
        iconText.textContent = item.icon || String(index + 1).padStart(2, "0");
        icon.appendChild(iconText);

        const body = createElement("div");
        const title = createElement("h3");
        const text = createElement("p");
        title.textContent = item.title || "";
        text.textContent = item.text || "";
        body.appendChild(title);
        body.appendChild(text);

        card.appendChild(icon);
        card.appendChild(body);
        list.appendChild(card);
    });

    article.appendChild(list);
    const action = createActionLink(panel.action);
    if (action) article.appendChild(action);
    return article;
}

function createPanel(id, panel) {
    if (panel.type === "rules") return renderRulesPanel(panel);
    if (panel.type === "keybinds") return renderKeybindsPanel(panel);
    if (panel.type === "staff") return renderStaffPanel(panel);
    if (panel.type === "web") return renderwebPanel(panel);
    return renderGenericPanel(id, panel);
}

function renderPanels() {
    menu.querySelectorAll(".menu-panel").forEach((panel) => panel.remove());

    getEnabledNavItems().forEach((item) => {
        menu.appendChild(createPanel(item.id, config.panels[item.id]));
    });
}

function renderSocials() {
    setText(socialsTitle, config.socials?.title || "Connect With Us");
    socialRow.innerHTML = "";

    (config.socials?.links || []).forEach((link) => {
        if (link.enabled === false) return;

        const anchor = createElement("a", "", {
            href: link.href || "#",
            "aria-label": link.label || "Social link"
        });

        applyLinkBehavior(anchor, link.target);

        if (link.icon) {
            anchor.appendChild(createImage(link.icon, "social-icon"));
        }

        socialRow.appendChild(anchor);
    });
}

function applyTextConfig() {
    setText(loadingLabel, config.loading?.label || "Loading");
    setTrackText(getMusicTracks()[0]);
}

function loadingStatusFor(percent) {
    const statuses = config.loading?.statuses || [];
    let current = statuses[0]?.text || "Initializing assets...";

    statuses.forEach((status) => {
        if (percent >= Number(status.percent || 0)) {
            current = status.text;
        }
    });

    return current;
}

function setProgress(value) {
    const percent = clamp(Math.round(value), 0, 100);
    displayedProgress = percent;
    progressText.textContent = String(percent);
    progressFill.style.width = `${percent}%`;
    statusText.textContent = loadingStatusFor(percent);
}

function bindMenuEvents() {
    navButtons = document.querySelectorAll(".nav-pill[data-menu]");
    menuPanels = document.querySelectorAll(".menu-panel");

    menuClose.addEventListener("click", (event) => {
        event.stopPropagation();
        closeInfoMenu();
    });

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const panelName = button.dataset.menu;
            const isOpenPanel = !menu.hidden && button.classList.contains("active");

            if (isOpenPanel) {
                closeInfoMenu();
                return;
            }

            openInfoMenu(panelName);
        });
    });
}

function bindKeybindEvents() {
    keybindButtons = document.querySelectorAll(".active-key[data-keybind]");

    keybindButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const keybindCode = document.getElementById("keybind-code");
            const keybindAction = document.getElementById("keybind-action");

            keybindButtons.forEach((key) => key.classList.remove("selected-key"));
            button.classList.add("selected-key");
            keybindCode.textContent = `Keybind [ ${button.dataset.keybind} ]`;
            keybindAction.textContent = button.dataset.action;
        });
    });
}

function closeInfoMenu() {
    menu.hidden = true;
    loadscreen.classList.remove("menu-open");
    menu.classList.remove("modal-menu");
    menu.classList.remove("keybind-menu");
    navButtons.forEach((button) => {
        button.classList.remove("active");
        button.setAttribute("aria-expanded", "false");
    });
}

function openInfoMenu(panelName) {
    menu.hidden = false;
    loadscreen.classList.add("menu-open");
    menu.classList.add("modal-menu");
    menu.classList.toggle("keybind-menu", panelName === "keybinds");

    navButtons.forEach((button) => {
        const isActive = button.dataset.menu === panelName;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-expanded", String(isActive));
    });

    menuPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === panelName);
    });
}

function setMusicVolume(value) {
    const volume = clamp(value, 0, 100) / 100;
    configuredMusicVolume = volume;
    music.volume = volume;
    music.muted = volume === 0;
    volumeSlider.value = String(Math.round(volume * 100));
    muteToggle.classList.toggle("is-muted", music.muted || volume === 0);
}

function setVolumePopover(open) {
    volumePopover.hidden = !open;
    muteToggle.setAttribute("aria-expanded", String(open));
}

function muteBackgroundVideo() {
    backgroundVideo.defaultMuted = true;
    backgroundVideo.muted = true;
    backgroundVideo.volume = 0;
    backgroundVideo.setAttribute("muted", "");

    if (backgroundVideo.audioTracks) {
        for (const track of backgroundVideo.audioTracks) {
            track.enabled = false;
        }
    }
}

function showBackgroundVideo() {
    document.body.classList.add("video-playing");
}

function markBackgroundVideoUnavailable() {
    document.body.classList.remove("video-playing");
}

function setupBackgroundVideo() {
    muteBackgroundVideo();
    showBackgroundVideo();
    backgroundVideo.addEventListener("loadedmetadata", muteBackgroundVideo);
    backgroundVideo.addEventListener("canplay", showBackgroundVideo);
    backgroundVideo.addEventListener("playing", showBackgroundVideo);
    backgroundVideo.addEventListener("error", markBackgroundVideoUnavailable);
    backgroundVideo.addEventListener("play", muteBackgroundVideo);
    backgroundVideo.addEventListener("volumechange", () => {
        if (!backgroundVideo.muted || backgroundVideo.volume !== 0) {
            muteBackgroundVideo();
        }
    });
}

function markMusicPlaying() {
    musicStarted = !music.paused;
    playToggle.classList.toggle("is-paused", music.paused);
    muteToggle.classList.toggle("is-muted", music.muted || music.volume === 0);
}

function unlockMusicAudio() {
    if (configuredMusicVolume <= 0) return;

    music.muted = false;
    music.volume = configuredMusicVolume;

    if (music.paused) {
        music.play().then(markMusicPlaying).catch(() => {});
    } else {
        markMusicPlaying();
    }
}

function bindAudioUnlock() {
    if (audioUnlockBound) return;
    audioUnlockBound = true;

    const unlock = () => {
        unlockMusicAudio();
        ["pointerdown", "mousedown", "click", "touchstart", "keydown"].forEach((name) => {
            window.removeEventListener(name, unlock, true);
        });
    };

    ["pointerdown", "mousedown", "click", "touchstart", "keydown"].forEach((name) => {
        window.addEventListener(name, unlock, { capture: true, once: true });
    });
}

async function startMusic() {
    if (!music || configuredMusicVolume <= 0) {
        markMusicPlaying();
        return;
    }

    // First try normal audible autoplay.
    music.volume = configuredMusicVolume;
    music.muted = false;

    try {
        await music.play();
        audioBootstrapDone = true;
        markMusicPlaying();
        return;
    } catch (error) {
        console.warn("[GCRP] Audible autoplay was blocked, using CEF muted bootstrap.", error);
    }

    // FiveM uses CEF/Chromium. Muted autoplay is allowed more reliably, then
    // we restore the configured volume once playback has actually started.
    try {
        music.muted = true;
        music.volume = configuredMusicVolume;
        await music.play();
        audioBootstrapDone = true;
        markMusicPlaying();

        setTimeout(() => {
            music.muted = false;
            music.volume = configuredMusicVolume;
            markMusicPlaying();
        }, 150);
    } catch (error) {
        console.warn("[GCRP] Music autoplay failed. Waiting for player input.", error);
        musicStarted = false;
        playToggle.classList.add("is-paused");
        bindAudioUnlock();
    }
}

function retryMusicStart() {
    if (music.paused) {
        startMusic();
        return;
    }

    if (music.muted && configuredMusicVolume > 0) {
        unlockMusicAudio();
    }
}

function setupMusicControls() {
    musicTracks = getMusicTracks();
    setMusicTrack(0, false);

    const configuredVolume = clamp(config.music?.volume ?? 55, 0, 100);
    configuredMusicVolume = configuredVolume / 100;
    setMusicVolume(configuredVolume);

    // Native loop is the most reliable option for a single loading-screen song.
    music.loop = musicTracks.length === 1 && config.music?.loop !== false;

    previousTrackButton.addEventListener("click", () => {
        playPreviousTrack(true);
    });

    nextTrackButton.addEventListener("click", () => {
        playNextTrack(true);
    });

    playToggle.addEventListener("click", async () => {
        if (music.paused) {
            await startMusic();
            return;
        }

        music.pause();
        playToggle.classList.add("is-paused");
    });

    muteToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        setVolumePopover(volumePopover.hidden);
    });

    volumeSlider.addEventListener("input", () => {
        setMusicVolume(volumeSlider.value);
        retryMusicStart();
    });

    volumeControl.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        setVolumePopover(false);
    });

    music.addEventListener("playing", () => {
        musicStarted = true;
        playToggle.classList.remove("is-paused");
        muteToggle.classList.toggle("is-muted", music.muted || music.volume === 0);
    });

    music.addEventListener("canplay", () => {
        if (!musicStarted && config.music?.autoplay !== false) {
            startMusic();
        }
    }, { once: true });

    music.addEventListener("loadeddata", () => {
        if (!audioBootstrapDone && config.music?.autoplay !== false) {
            startMusic();
        }
    }, { once: true });

    music.addEventListener("pause", () => {
        if (!music.ended) playToggle.classList.add("is-paused");
    });

    music.addEventListener("error", () => {
        musicStarted = false;
        playToggle.classList.add("is-paused");

        // If a playlist item is missing, skip it instead of leaving the player dead.
        if (musicTracks.length > 1) {
            playNextTrack(true);
        }
    });

    music.addEventListener("ended", () => {
        const isLastTrack = currentTrackIndex >= musicTracks.length - 1;

        if (musicTracks.length > 1 && (!isLastTrack || config.music?.loop !== false)) {
            playNextTrack(true);
            return;
        }

        if (config.music?.loop !== false) {
            music.currentTime = 0;
            startMusic();
            return;
        }

        musicStarted = false;
        playToggle.classList.add("is-paused");
    });

    document.addEventListener("click", retryMusicStart, { once: true });
    document.addEventListener("keydown", retryMusicStart, { once: true });
}

function setupMusicRecovery() {
    window.addEventListener("focus", retryMusicStart);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) retryMusicStart();
    });
}

function setupFiveMLoadProgress() {
    window.addEventListener("message", (event) => {
        const data = event.data || {};

        if (data.eventName === "loadProgress") {
            const fraction = clamp(data.loadFraction ?? 0, 0, 1);
            realProgress = fraction * 100;
            setProgress(Math.min(realProgress, 99));
            return;
        }

        if (data.action === "finalizeLoading") {
            setProgress(100);
            if (statusText) statusText.textContent = "Entering Grand Country...";
            document.body.classList.add("is-finishing");
            return;
        }

        if (data.type === "setProgress" || data.action === "setProgress") {
            setProgress(data.progress ?? data.percent ?? displayedProgress);
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && !volumePopover.hidden) {
            setVolumePopover(false);
            return;
        }

        if (event.code === "Escape" && !menu.hidden) {
            closeInfoMenu();
            return;
        }

        if (event.code === "Space") {
            const interactiveTags = ["A", "BUTTON", "INPUT"];

            if (interactiveTags.includes(document.activeElement.tagName)) {
                return;
            }

            event.preventDefault();
            playToggle.click();
        }
    });
}

function bindExternalLinks() {
    document.addEventListener("click", (event) => {
        const anchor = event.target.closest("a[href]");

        if (!anchor) {
            return;
        }

        const href = anchor.getAttribute("href");

        if (!isExternalHref(href)) {
            return;
        }

        event.preventDefault();
        openExternalUrl(href);
    });
}

function boot() {
    applyTheme();
    applyLayout();
    applyAssets();
    applyTextConfig();
    renderNav();
    renderPanels();
    renderSocials();
    bindMenuEvents();
    bindKeybindEvents();
    setProgress(displayedProgress);
    setupMusicControls();
    setupMusicRecovery();
    setupFiveMLoadProgress();
    setupKeyboardShortcuts();
    bindExternalLinks();

    setupBackgroundVideo();

    if (config.music?.autoplay !== false) {
        startMusic();
    }
}

boot();
