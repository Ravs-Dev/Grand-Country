const IconixLinks = {
    discord: "#",
    instagram: "#",
    youtube: "#",
    website: "#"
};

window.LoadingScreenConfig = {
    framework: "standalone",
    pageTitle: "Grand Country Roleplay",
    links: IconixLinks,

    assets: {
        backgroundPoster: "./assets/background-poster.jpg",
        logo: "./assets/logo.png",
        music: "./assets/music/music-gcrp.mp3"
    },

    layout: {
        left: "6.39vw",
        logoTop: "0.7vh",
        navTop: "5.1vh",
        navRight: "6.39vw"
    },

    theme: {
        accent: "#ff7a18",
        accentSoft: "#ffad5c",
        white: "#f8fbff",
        muted: "#a0a3aa"
    },

    loading: {
        startProgress: 0,
        label: "Loading",
        statuses: [
            { percent: 0, text: "Connecting to Grand Country..." },
            { percent: 25, text: "Loading server files..." },
            { percent: 55, text: "Initializing city assets..." },
            { percent: 80, text: "Preparing your session..." },
            { percent: 99, text: "Entering Grand Country..." }
        ]
    },

    music: {
        volume: 55,
        autoplay: true,
        loop: true,
        tracks: [
            {
                name: "Grand Country Radio",
                artist: "GCRP",
                src: "./assets/music/music-gcrp.mp3"
            }
        ]
    },

    nav: [
        { id: "rules", label: "Rules", icon: "./assets/icons/nav-rules.svg", enabled: true },
        { id: "keybinds", label: "Keybinds", icon: "./assets/icons/nav-keybinds.svg", enabled: true },
        { id: "staff", label: "Staff", icon: "./assets/icons/nav-staff.svg", enabled: true }
    ],

    panels: {
        rules: {
            type: "rules",
            title: "Server Rules",
            icon: "./assets/icons/nav-rules.svg",
            action: null,
            items: [
                { icon: "01", title: "Respect Everyone", text: "Be kind and respectful to all players and staff." },
                { icon: "02", title: "No Cheating", text: "Exploiting, cheating, or using prohibited third-party software is not allowed." },
                { icon: "03", title: "RDM & VDM", text: "Random deathmatch and vehicle deathmatch are prohibited." },
                { icon: "04", title: "Respect & Conduct", text: "Keep the roleplay environment respectful and enjoyable." },
                { icon: "05", title: "Metagaming", text: "Do not use out-of-character information to influence in-game actions." },
                { icon: "06", title: "Value Your Roleplay", text: "Roleplay with purpose and keep immersion alive." }
            ]
        },

        keybinds: {
            type: "keybinds",
            title: "Server Keybinds",
            icon: "./assets/icons/nav-keybinds.svg",
            defaultKey: "T",
            defaultAction: "Open Text Chat",
            items: [
                { key: "1", action: "Phone Slot 1" },
                { key: "2", action: "Phone Slot 2" },
                { key: "3", action: "Phone Slot 3" },
                { key: "E", action: "Interact" },
                { key: "T", action: "Open Text Chat" },
                { key: "U", action: "Open Phone" },
                { key: "F", action: "Vehicle Interaction" },
                { key: "G", action: "Toggle Seatbelt" },
                { key: "K", action: "Open Inventory" },
                { key: "Z", action: "Toggle Voice Range" },
                { key: "X", action: "Cancel Animation" },
                { key: "B", action: "Point" },
                { key: "M", action: "Open Map" }
            ],
            keyboard: [
                ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Bksp"],
                ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
                ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
                ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"]
            ]
        },

        staff: {
            type: "staff",
            title: "Staff",
            icon: "./assets/icons/nav-staff.svg",
            action: null,
            groups: [
                { role: "Founder", members: [{ name: "GCRP", title: "Server Management", initial: "G", avatarClass: "avatar-blue" }] },
                { role: "Administration", members: [{ name: "Admin Team", title: "Server Administration", initial: "A", avatarClass: "avatar-gold" }] },
                { role: "Support Team", members: [{ name: "Support", title: "Player Support", initial: "S", avatarClass: "avatar-slate" }] }
            ]
        }
    },

    socials: {
        title: "Connect With Us",
        links: [
            { label: "Discord", href: IconixLinks.discord, icon: "./assets/icons/discord.svg" },
            { label: "Instagram", href: IconixLinks.instagram, icon: "./assets/icons/instagram.svg" },
            { label: "YouTube", href: IconixLinks.youtube, icon: "./assets/icons/youtube.svg" },
            { label: "Website", href: IconixLinks.website, icon: "./assets/icons/globe.svg" }
        ]
    }
};
