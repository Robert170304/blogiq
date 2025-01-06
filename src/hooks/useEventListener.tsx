import React, { useRef } from 'react';

export function useEventListener(eventName, handler, element = document) {
    const savedHandler = useRef<(event: Event) => void>()

    React.useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    React.useEffect(() => {
        const isSupported = element?.addEventListener
        if (!isSupported) return

        const eventListener = (event: Event) => savedHandler.current?.(event)

        element.addEventListener(eventName, eventListener)

        return () => {
            element.removeEventListener(eventName, eventListener)
        }
    }, [eventName, element])
}