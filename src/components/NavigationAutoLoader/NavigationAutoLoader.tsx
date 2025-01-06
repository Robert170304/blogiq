'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useScreenLoader } from '@blogiq/context/ScreenLoaderContext';
import { pageRenderLoaderTexts } from '@blogiq/app/utils/utility';

export default function NavigationAutoLoader() {
    const { showLoader, hideLoader } = useScreenLoader();
    const pathname = usePathname();


    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * pageRenderLoaderTexts.length);
        showLoader(pageRenderLoaderTexts[randomIndex]);
        const timer = setTimeout(() => hideLoader(), 1000); // Simulate loader delay
        return () => clearTimeout(timer); // Cleanup on unmount
    }, [pathname]);

    return null; // No visible component
}
