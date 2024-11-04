import { Container } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
    return (
        <Container
            bg="#030303"
            color="#fff"
            textStyle="body"
            height="50px"
            display="flex"
            alignItems="center"
            mt="20px"
        >
            <div>&copy; Blog Plate. All rights reserved.</div>
        </Container>

    )
}

export default Footer