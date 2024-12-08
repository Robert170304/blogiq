"use client"

import { Box, Button, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BlogCard } from '../BlogPostCard/BlogPostCard';
import BlogListWrapper from './bloglisting.style';
import { FaArrowDown } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import type { RootState } from '@blogiq/store/store';
import { isEmpty } from 'lodash';
import EmptyDraftsScreen from '../EmptyDraftsScreen/EmptyDraftsScreen';

const BlogListing: React.FC = () => {
    const [visiblePostsCount, setVisiblePostsCount] = useState<number>(10);
    const [isLoadMorePosts, setIsLoadMorePosts] = useState<boolean>(false);
    const savedDrafts = useSelector((state: RootState) => state.app.savedDrafts);

    function loadMorePosts() {
        setIsLoadMorePosts(true)
        setTimeout(() => {
            setVisiblePostsCount((prevVisible) => prevVisible + 10);
            setIsLoadMorePosts(false)
        }, 100)
    }


    return (
        <BlogListWrapper>
            {isEmpty(savedDrafts) ? <EmptyDraftsScreen /> : <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }}
                gap="6"
                p="20px 0"
            >
                {savedDrafts.slice(0, visiblePostsCount).map((draft) => (
                    <GridItem colSpan={{ base: 1, md: 2, lg: 1 }} key={draft.id}>
                        <BlogCard {...draft} />
                    </GridItem>
                ))}
                {isLoadMorePosts && <GridItem colSpan={{ base: 1, md: 2, lg: 2 }} display="flex" justifyContent="center">
                    <VStack colorPalette="teal">
                        <Spinner color="colorPalette.600" />
                        <Text color="colorPalette.600">Loading...</Text>
                    </VStack>
                </GridItem>}
            </Grid>}

            {!isLoadMorePosts && visiblePostsCount < savedDrafts.length &&
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
