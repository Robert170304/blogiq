"use client"
import { Button, Card, Flex, Text, } from '@chakra-ui/react'
import React, { useState } from 'react'
import BlogPostCardWrapper from './Card.Style';
import { DraftReadModal } from '../DraftRead/DraftRead';
import moment from 'moment';

export const BlogCard: React.FC<SavedDraft> = (draftData) => {
    const { title, subtitle, createdAt } = draftData
    const [openReadDraftModal, setOpenReadDraftModal] = useState(false);
    return (
        <BlogPostCardWrapper>
            <Card.Root width="100%">
                <Card.Body gap="2">
                    <Card.Title className="title" mt="2" fontSize="lg" fontWeight="extrabold">
                        {title}
                    </Card.Title>
                    <Card.Description fontSize="md" color="#f4efef">
                        {subtitle}
                    </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Flex as="div" alignItems="center" justifyContent="space-between" width="100%">
                        <Text fontSize="sm" color="#85878c" fontWeight={500} >{moment(createdAt).format("DD MMM YYYY")}</Text>
                        <Button
                            padding="0 20px"
                            color="#fff"
                            border="1px solid #27272a"
                            variant="outline"
                            className='hover-color-primary'
                            onClick={() => setOpenReadDraftModal(true)} >View</Button>
                    </Flex>
                </Card.Footer>
            </Card.Root>
            <DraftReadModal draftData={draftData} isOpen={openReadDraftModal} closeModal={() => setOpenReadDraftModal(false)} />
        </BlogPostCardWrapper>
    )
};