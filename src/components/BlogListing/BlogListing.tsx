"use client"

import { Box, Flex, Grid, GridItem, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { BlogCard } from '../BlogPostCard/BlogPostCard';
import BlogListWrapper from './bloglisting.style';
import { FaArrowDown } from 'react-icons/fa6';
import { isEmpty } from 'lodash';
import EmptyDraftsScreen from '../EmptyDraftsScreen/EmptyDraftsScreen';
import { apiHelper } from '@blogiq/helpers/apiHelper';
import { notify } from '@blogiq/app/utils/commonFunctions';
import { BlogCardSkeleton } from '../BlogPostCard/BlogPostCardSkeleton';
import { LiaSyncAltSolid } from 'react-icons/lia';
import { Button } from '../ui/button';

const BlogListing: React.FC = () => {
    const [visiblePostsCount, setVisiblePostsCount] = useState<number>(10);
    const [isLoadMorePosts, setIsLoadMorePosts] = useState<boolean>(false);
    const [isFetchingDrafts, setIsFetchingDrafts] = useState<boolean>(false);
    const [allDrafts, setAllDrafts] = useState<SavedDraft[]>([]);
    const [displayedDrafts, setDisplayedDrafts] = useState<SavedDraft[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const isGetSavedDraftsFetched = useRef(false);

    function loadMorePosts() {
        setIsLoadMorePosts(true)
        setTimeout(() => {
            setVisiblePostsCount((prevVisible) => prevVisible + 10);
            setIsLoadMorePosts(false)
        }, 100)
    }

    const getSavedDrafts = async () => {
        setIsFetchingDrafts(true);
        try {
            const res = await apiHelper('/api/getSavedDrafts', 'GET', {}, true) as GetSavedDraftsResponse;
            console.log("🚀 ~ getSavedDrafts ~ res:", res)
            if (res.drafts) {
                setAllDrafts(res.drafts);
                setDisplayedDrafts(res.drafts);
            }
            setIsFetchingDrafts(false);

        } catch (error) {
            console.log("🚀 ~ getSavedDrafts ~ error:", error)
            setIsFetchingDrafts(false);
            notify("Failed to display drafts", { type: "error" });
        }
    }

    useEffect(() => {
        if (!isGetSavedDraftsFetched.current) {
            isGetSavedDraftsFetched.current = true;
            getSavedDrafts();
        }
    }, [])

    const handleSearch = (searchVal: string) => {
        console.log("🚀 ~ handleSearch ~ searchVal:", searchVal)
        setSearchTerm(searchVal);
        if (!searchVal) {
            getSavedDrafts();
        } else {
            const filteredDrafts = allDrafts.filter(draft =>
                draft.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                draft.subtitle.toLowerCase().includes(searchVal.toLowerCase()) ||
                draft.content.toLowerCase().includes(searchVal.toLowerCase())
            );
            console.log("🚀 ~ handleSearch ~ filteredDrafts:", filteredDrafts)
            setDisplayedDrafts(filteredDrafts);
        }
    };

    const renderSearchNoResults = () => (
        <Flex>
            <Text textStyle="body" color="colorPalette.600" p="20px 0">
                No drafts found for the search term
            </Text>
        </Flex>
    );

    const renderDraftsGrid = () => (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap="6" p="20px 0">
            {displayedDrafts.slice(0, visiblePostsCount).map(draft => (
                <GridItem colSpan={{ base: 1, md: 2, lg: 1 }} key={draft.id}>
                    <BlogCard {...draft} />
                </GridItem>
            ))}
            {isLoadMorePosts && renderLoadMoreSpinner()}
        </Grid>
    );

    const renderLoadMoreSpinner = () => (
        <GridItem colSpan={{ base: 1, md: 2, lg: 2 }} display="flex" justifyContent="center">
            <VStack colorPalette="teal">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">Loading...</Text>
            </VStack>
        </GridItem>
    );

    const renderDraftSkeletons = () => (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap="6" p="20px 0">
            {[0, 1, 2].map(key => (
                <GridItem colSpan={{ base: 1, md: 2, lg: 1 }} key={key}>
                    <BlogCardSkeleton />
                </GridItem>
            ))}
        </Grid>
    );

    const renderLoadMoreButton = () => (
        <Box display="flex" width="100%" justifyContent="center" m="10px">
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
                className='hover-color-primary'
            >
                <FaArrowDown />
                Load More
            </Button>
        </Box>
    );


    return (
        <BlogListWrapper>
            <Flex
                justifyContent="space-between"
                // alignItems="center"
                p="20px 0"
                w="100%"
                borderBottom={`1px solid #E2E8F0`}
                alignItems={{ base: "flex-start", sm: "center" }}
                flexDirection={{ base: "column", sm: "row" }}
                gap="10px"
            >
                <Text textStyle="heading" fontSize="2xl" color="#181818" fontWeight="bold" >Drafts</Text>
                {!isEmpty(allDrafts) && <Box display="flex" alignItems="center" w={{ base: "100%", sm: "auto" }}>
                    <Input
                        placeholder="Search drafts..."
                        variant="outline"
                        borderRadius="120px"
                        border="1px solid"
                        borderColor="#E2E8F0"
                        padding="8px 12px"
                        onChange={(e) => handleSearch(e.target.value)}
                        readOnly={isFetchingDrafts}
                    />
                    <Button
                        onClick={getSavedDrafts}
                        textStyle="body"
                        bg="#111111"
                        color="white"
                        pr={7}
                        pl={7}
                        borderRadius={120}
                        size="md"
                        fontWeight="bold"
                        ml={4}
                        disabled={isFetchingDrafts}
                        title='Refresh drafts'
                        className='hover-color-primary'
                    >
                        <LiaSyncAltSolid style={{
                            animation: isFetchingDrafts ? "spin 1s linear infinite" : "none",
                        }}
                        />
                    </Button>
                </Box>}
            </Flex>
            {isEmpty(displayedDrafts) && searchTerm && renderSearchNoResults()}
            {isEmpty(allDrafts) && !isFetchingDrafts && <EmptyDraftsScreen />}
            {!isEmpty(displayedDrafts) && !isFetchingDrafts && renderDraftsGrid()}
            {isFetchingDrafts && renderDraftSkeletons()}
            {!isLoadMorePosts && visiblePostsCount < displayedDrafts.length && renderLoadMoreButton()}
        </BlogListWrapper>
    )
}

export default BlogListing
