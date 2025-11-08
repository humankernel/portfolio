
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
