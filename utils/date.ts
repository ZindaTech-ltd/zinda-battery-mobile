export function formatPakistanDateTime(timestamp?: string | null) {
    if (!timestamp) return "Unknown";
    return new Intl.DateTimeFormat("en-PK", {
        timeZone: "Asia/Karachi",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

export function formatPakistanTime(timestamp?: string | null) {
    if (!timestamp) return "--";
    return new Intl.DateTimeFormat("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

export function formatPakistanDate(timestamp?: string | null) {
    if (!timestamp) return "--";

    return new Intl.DateTimeFormat("en-PK", {
        timeZone: "Asia/Karachi",
        day: "numeric",
        month: "short",
    }).format(new Date(timestamp));
}

export function timeAgo(timestamp?: string | null) {
    if (!timestamp) return "Never";
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}
