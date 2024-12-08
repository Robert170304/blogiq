import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use Next.js App Router hooks
import { useSelector } from "react-redux";
import type { RootState } from "@blogiq/store/store";
import { isEmpty } from "lodash";

const withAuth = (Component: React.ComponentType) => {
    const AuthenticatedComponent: React.FC = (props) => {
        const user = useSelector((state: RootState) => state.app.userData);
        const router = useRouter();

        useEffect(() => {
            if (isEmpty(user)) {
                router.push("/");
            }
        }, [user, router]);

        // Render nothing while redirecting
        if (!user) return null;

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
