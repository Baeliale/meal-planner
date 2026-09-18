export interface ChangelogEntry {
    // Stable, unique identifier for this entry - never reuse or change an
    // existing id, since it's what's persisted to know what a user has
    // already seen. Newest entry goes first in the array.
    id: string;
    version: string;
    date: string;
    items: string[];
}

export const changelog: ChangelogEntry[] = [
    {
        id: '2.1.0-changelog-and-layout',
        version: '2.1.0',
        date: '2026-09-19',
        items: [
            "This \"What's New\" popup - shows what changed after an update, whether it came through automatically or as a full reinstall",
            'Fixed the logo and language switcher overlapping on narrow phone screens',
            'Fixed long recipe/item names overlapping their action buttons on narrow phone screens',
            'Updates now apply as soon as they finish downloading, instead of needing the app to be reopened twice',
        ],
    },
    {
        id: '2.1.0-ux-fixes',
        version: '2.1.0',
        date: '2026-09-19',
        items: [
            'Recipes now open when you tap them, instead of only through a hidden menu',
            'Fixed the shopping list showing confusing quantities like "Pasta 1"',
            'Fixed a bug where dismissing a notification could make nearby buttons stop responding',
            "You can now change a day's assigned dish directly, without clearing it first",
            'Required-field errors now show inline instead of as a popup',
        ],
    },
    {
        id: '2.1.0',
        version: '2.1.0',
        date: '2026-09-18',
        items: [
            'Bugfixes and small features can now be pushed to your phone automatically, without a full reinstall',
            'Added a notice that lets you know when a new version is available to download',
        ],
    },
];
