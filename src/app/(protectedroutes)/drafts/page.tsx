"use client"
import BlogListing from '@blogiq/components/BlogListing/BlogListing'
import withAuth from '@blogiq/components/withAuth/withAuth';
import React from 'react'

const Drafts = () => {
    return (
        <BlogListing />
    )
}

export default withAuth(Drafts)