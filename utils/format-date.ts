// Converts a YYYY-MM-DD string into "Today", "Yesterday", or a full weekday + date label
export function formatHistoryLabel(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
    });
}
