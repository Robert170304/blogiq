export { }; // Ensure this file is treated as a module

declare global {
    interface SavedDraft {
        title: string;
        subtitle: string;
        content: string;
        createdOn: string;
    }
    interface oauth2userinfo {
        id?: string;
        email?: string;
        verified_email?: string;
        name?: string;
        given_name?: string;
        family_name?: string;
        picture?: string;
    }
}
