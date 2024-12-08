export { }; // Ensure this file is treated as a module

declare global {
    interface SavedDraft {
        title: string;
        subtitle: string;
        content: string;
        createdOn: string;
    }
}
