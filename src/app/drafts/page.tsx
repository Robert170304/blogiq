import BlogListing from '@blogiq/components/BlogListing/BlogListing'
import { loginIsRequiredServer } from '@blogiq/lib/auth';
import React from 'react'

const index = async () => {
    await loginIsRequiredServer();
    return (
        <BlogListing />
    )
}

export default index