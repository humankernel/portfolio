
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

// Process Obsidian bracket syntax in image field (copy from PostCard)
export function processMarkdownImages(rawImage?: string) {
    if (!rawImage) return rawImage;

    // Handle case where rawImage is an array (unquoted YAML syntax)
    let imageValue = rawImage;
    if (Array.isArray(rawImage)) {
        // If it's an array, take the first element
        imageValue = rawImage[0];
    }

    // Ensure imageValue is a string before calling string methods
    if (typeof imageValue !== 'string') {
        console.warn('ProjectCard: imageValue is not a string:', imageValue);
        return imageValue;
    }

    // Check if it's Obsidian double bracket syntax
    if (imageValue.startsWith('[[') && imageValue.endsWith(']]')) {
        // Extract the content inside the double brackets
        return imageValue.slice(2, -2);
    }

    return imageValue;
}
