"use client"

import { Box, Button, Grid, GridItem, Spinner, Tabs, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { startCase } from "lodash"
import { BlogCard } from '../BlogPostCard/BlogPostCard';
import BlogListWrapper from './bloglisting.style';
import { FaArrowDown } from 'react-icons/fa6';

const BlogListing: React.FC = () => {
    const defaultTab = { categoryKey: "view-all", categoryName: "View all", }
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [displayBlogPosts, setDisplayBlogPosts] = useState<BlogPost[]>([])
    const [visiblePostsCount, setVisiblePostsCount] = useState<number>(10);
    const [isFetchingBlogs, setIsFetchingBlogs] = useState<boolean>(false);
    const [isLoadMorePosts, setIsLoadMorePosts] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string | null>(defaultTab.categoryKey)
    const [blogCategories, setBlogCategories] = useState<{ categoryKey: string, categoryName: string }[]>([defaultTab])
    console.log("🚀 ~ blogPosts:", blogPosts)

    useEffect(() => {
        // Fetch blog posts initially
        const fetchBlogPosts = async () => {
            await getBlogPosts();
        };

        fetchBlogPosts();
    }, []);

    useEffect(() => {
        // Generate categories whenever blogPosts updates
        if (blogPosts.length > 0) {
            const categories = [
                ...new Set(blogPosts.map(post => post.category)),
            ].map(category => ({
                categoryKey: category.toLowerCase().replace(/\s+/g, '-'),
                categoryName: category
            }));
            setBlogCategories((category) => (
                [...category, ...categories]
            ));
        }
    }, [blogPosts]); // Only re-run this when blogPosts changes

    function onTabChange(value: string) {
        setIsFetchingBlogs(true)
        setTimeout(() => {
            setVisiblePostsCount(10);
            setDisplayBlogPosts(value === "view-all" ? blogPosts : blogPosts.filter(post => post.categoryKey === value))
            setIsFetchingBlogs(false)
        }, 100)
    }

    function loadMorePosts() {
        setIsLoadMorePosts(true)
        setTimeout(() => {
            setVisiblePostsCount((prevVisible) => prevVisible + 10);
            setIsLoadMorePosts(false)
        }, 100)
    }



    // async function getRandomImage() {
    //     try {
    //         const res = await axios.get('https://api.unsplash.com/photos/random', {
    //             headers: {
    //                 Authorization: `Client-ID FsaYkRrgCbYtWICwgYTIyO2ehUe-T_CChjmwveqZW8E` // Add your Unsplash API key here
    //             }
    //         });
    //         return res.data.urls.small; // Returns the URL of the small image
    //     } catch (error) {
    //         console.error("Error fetching random image:", error);
    //         return "https://via.placeholder.com/300x200"; // Default placeholder in case of error
    //     }
    // }


    async function getBlogPosts() {
        setIsFetchingBlogs(true)
        try {
            const res = await axios.get('/data/blogPosts.json');
            console.log("🚀 ~ Response:", res); // Logs the full response object
            const data = res.data; // The data should be here
            // Fetch a random image for each blog post
            const postsWithImages = await Promise.all(
                data.map(async (dt: BlogPost) => ({
                    ...dt,
                    image: "https://random-image-pepebigotes.vercel.app/api/random-image",
                    subtitle: dt.content.split(".")[0] + ". " + dt.content.split(".")[1],
                    categoryKey: dt.category.toLowerCase().replace(/\s+/g, '-'),
                }))
            );

            setBlogPosts(postsWithImages);
            setDisplayBlogPosts(postsWithImages);
            setIsFetchingBlogs(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsFetchingBlogs(false)
        }
    }

    console.log("🚀 ~ blogPosts:", blogPosts, blogCategories, displayBlogPosts); // Logs the blogPosts state
    return (
        <BlogListWrapper>
            <Tabs.Root
                defaultValue={defaultTab.categoryKey}
                fontFamily="body"
                value={selectedTab}
                onValueChange={(e) => {
                    setSelectedTab(e.value)
                    onTabChange(e.value)
                }}
            >
                <Tabs.List
                    style={{
                        borderBottom: "2px solid #e5e7eb",
                        display: "flex",
                        gap: "20px"
                    }}
                >
                    {blogCategories.map((category) => (
                        <Tabs.Trigger
                            value={category.categoryKey}
                            key={category.categoryKey}
                        >
                            {startCase(category.categoryName)}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                <Tabs.ContentGroup>
                    {blogCategories.map((category) => (
                        <Tabs.Content value={category.categoryKey} key={category.categoryKey}>
                            {isFetchingBlogs ? <VStack colorPalette="teal">
                                <Spinner
                                    color='red'
                                    size="xl" />
                                <Text color="colorPalette.600">Loading...</Text>
                            </VStack> : <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(2, 1fr)" }}
                                gap="6"
                                p="20px 0"
                            >
                                {displayBlogPosts.slice(0, visiblePostsCount).map((blog) => (
                                    <GridItem key={blog.id}>
                                        <BlogCard {...blog} />
                                    </GridItem>
                                ))}
                                {isLoadMorePosts && <GridItem colSpan={{ base: 1, md: 2, lg: 2 }} display="flex" justifyContent="center">
                                    <VStack colorPalette="teal">
                                        <Spinner color="colorPalette.600" />
                                        <Text color="colorPalette.600">Loading...</Text>
                                    </VStack>
                                </GridItem>}
                            </Grid>}
                        </Tabs.Content>
                    ))}
                </Tabs.ContentGroup>
            </Tabs.Root>
            {!isLoadMorePosts && !isFetchingBlogs && visiblePostsCount < displayBlogPosts.length &&
                (<Box display="flex" width="100%" justifyContent="center" m="10px">
                    <Button
                        onClick={loadMorePosts}
                        textStyle="body"
                        bg="#030303"
                        color="white"
                        pr={7}
                        pl={7}
                        borderRadius={120}
                        colorScheme="black"
                        size="sm"
                        fontWeight="bold"
                    >
                        <FaArrowDown />
                        Load More
                    </Button>
                </Box>)}
        </BlogListWrapper>
    )
}

export default BlogListing

// Define a type for the blog post props
interface BlogPost {
    id: number;
    image: string;
    subtitle?: string;
    categoryKey: string;
    categoryName: string;
    title: string;
    content: string;
    date_published: string;
    author: string;
    category: string;
}
