export function getStatusClasses(status: string | null): string {
    if (!status) return '';

    if (status === 'completed') {
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    }

    if (status === 'in-progress') {
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    }

    // For custom status values, use neutral theme colors
    return 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-600';
}

export function formatDate(date: Date): string {
    // If the date is at midnight UTC, it was likely a YYYY-MM-DD date
    // that was parsed as UTC but should be treated as local
    if (
        date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0 &&
        date.getUTCSeconds() === 0
    ) {
        // Create a new date in local timezone using the UTC date components
        const localDate = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        );
        return localDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}