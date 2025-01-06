// utils/authHelper.ts
import { apiHelper } from '@blogiq/helpers/apiHelper';
import { useRouter } from 'next/navigation'; // For navigation
import { notify } from '../app/utils/commonFunctions';
import appActions from '@blogiq/store/app/actions';
import { useDispatch } from 'react-redux';
import { useScreenLoader } from '@blogiq/context/ScreenLoaderContext';

const { setUserData } = appActions;

// Define the logout function
export function useAuthHelper() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { showLoader, hideLoader } = useScreenLoader();

    // Define the logout function
    const handleLogout = async (extraParams?: { successMsg?: string, errorMsg?: string, type?: string }) => {
        try {
            // Show a loader or handle loading state externally
            showLoader('Signing out...');

            // Call the API
            const response = await apiHelper('/api/signout', 'POST', {}, true) as SignOutResponse;

            if (response.error) {
                notify(extraParams?.errorMsg ?? (response.error || 'Failed to sign out'), { type: 'error' });
            } else {
                // Clear session
                localStorage.removeItem('sessionToken');
                dispatch(setUserData({}));

                // Notify success
                notify(extraParams?.successMsg ?? 'Signed out successfully', { type: extraParams?.type ?? 'success' });

                // Redirect to sign-in page
                router.replace('/signin');
            }
        } catch (error) {
            console.error('Logout error:', error);
            notify('Failed to sign out', { type: 'error' });
        } finally {
            // Hide the loader or handle loading state externally
            console.log('Logout process completed.');
            hideLoader();
        }
    };
    return { handleLogout };
}
