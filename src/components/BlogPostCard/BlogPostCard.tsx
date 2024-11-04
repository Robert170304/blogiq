"use client"
import { Box, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image';
import React from 'react'
import { MdArrowOutward } from 'react-icons/md';
import { startCase } from "lodash"
import moment from 'moment';
import BlogPostCardWrapper from './Card.Style';

export const BlogCard: React.FC<BlogPost> = ({ image, title, subtitle, date_published, author, category }) => (
    <BlogPostCardWrapper>
        <Box
            width="100%"
            overflow="hidden"
            bg="white"
            position="relative"
            margin="20px 0"
            textStyle="body"
            className="postContainer"
        >
            <div className="imageContainer" >
                <div className="section">
                    <div className="paper fold-corner">
                    </div>
                </div>
                <Image src={image} alt={title} width={300} height={200} blurDataURL='https://via.placeholder.com/300x200' className="cardImage" />
                <div className="glassOverlay">
                    <div className="cardInfo">
                        <Text fontSize="lg" fontWeight="bold" >{author}</Text>
                        <Text fontSize="sm" color="#f4efef" fontWeight={500} >{moment(date_published).format("DD MMM YYYY")}</Text>
                    </div>
                    <div className="cardInfo">
                        <Text fontSize="lg" fontWeight="bold" >{startCase(category)}</Text>
                    </div>
                </div>
            </div>
            <VStack align="start">
                <Text className="title" fontSize="lg" fontWeight="extrabold" >{title}</Text> {/* Make sure className is used here */}
                <Text fontSize="md" fontWeight="bold" color="#85878c" >{subtitle}</Text>
                <Text fontWeight="bold" fontSize="sm" display="flex" gap="2" mt="10px" alignItems="center" >Read Post <MdArrowOutward /></Text>
            </VStack>
        </Box>
    </BlogPostCardWrapper>
);

// Define a type for the blog post props    
interface BlogPost {
    id: number;
    image: string;
    subtitle?: string;
    title: string;
    content: string;
    date_published: string;
    author: string;
    category: string;
}