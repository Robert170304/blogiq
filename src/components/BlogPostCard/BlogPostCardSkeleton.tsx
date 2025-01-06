"use client"
import { Card, Flex, } from '@chakra-ui/react'
import React from 'react'
import BlogPostCardWrapper from './Card.Style';
import { SkeletonText } from '../ui/skeleton';

export const BlogCardSkeleton: React.FC = () => {
    return (
        <BlogPostCardWrapper>
            <Card.Root width="100%">
                <Card.Body gap="2">
                    <SkeletonText noOfLines={2} />
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Flex as="div" alignItems="center" justifyContent="space-between" width="100%">
                        <SkeletonText />
                    </Flex>
                </Card.Footer>
            </Card.Root>
        </BlogPostCardWrapper>
    )
};