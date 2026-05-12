export interface Language {
    id: string;
    label: string;
    native: string;
}

export const languages: Language[] = [
    { id: 'en', label: 'English', native: 'English' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
    // You can safely drop your 30+ languages here later!
];