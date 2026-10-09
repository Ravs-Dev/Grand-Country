const IconixLinks = {
    discord: "#",
    instagram: "#",
    youtube: "#",
    website: "#",
    tebex: "#"
};

window.LoadingScreenConfig = {
    framework: "standalone", // standalone, qbcore, qbox, esx
    pageTitle: "Iconix Loading Screen",
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
        // Change these two values to recolor the main theme.
        // Most servers only need to change "accent".
        accent: "#2daae1",
        accentSoft: "#5aa8ff",
        white: "#f8fbff",
        muted: "#a0a3aa"
    },

    loading: {
        startProgress: 73,
        label: "Loading",
        statuses: [
            { percent: 0, text: "Connecting to server..." },
            { percent: 30, text: "Loading server files..." },
            { percent: 60, text: "Initializing assets..." },
            { percent: 90, text: "Finalizing session..." }
        ]
    },

    music: {
        volume: 35,
        autoplay: true,
        loop: true,
        tracks: [
            { name: "Late Nights", artist: "Iconix Beats", src: "./assets/music/late-nights.mp3" }
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
                { icon: "02", title: "No Cheating", text: "Exploiting, cheating, or using third-party software is prohibited." },
                { icon: "03", title: "RDM & VDM", text: "Random deathmatch and vehicle deathmatch are strictly prohibited." },
                { icon: "04", title: "Respect & Conduct", text: "Maintain a respectful environment. Toxicity, hate speech, and harassment will not be tolerated." },
                { icon: "05", title: "Metagaming", text: "Using out-of-character information to influence in-game actions is forbidden." },
                { icon: "06", title: "Value Your Roleplay", text: "Always roleplay with purpose and keep immersion alive." }
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
                { role: "Founder", members: [{ name: "Iconix", title: "Project Founder", initial: "I", avatarClass: "avatar-blue" }] },
                { role: "Head Administrator", members: [{ name: "Nova", title: "Head Administrator", initial: "N", avatarClass: "avatar-gold" }] },
                { role: "Senior Administrator", members: [{ name: "Aura", title: "Senior Administrator", initial: "A", avatarClass: "avatar-slate" }] },
                { role: "Support Team", members: [{ name: "Support", title: "Player Support", initial: "S", avatarClass: "avatar-rose" }] }
            ]
        },
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
