'use client';

import { useEventListener } from '@blogiq/hooks/useEventListener';
import React, { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

const CustomCursor = ({ color = '220, 90, 90',
    outerAlpha = 0.4,
    innerSize = 18,
    outerSize = 18,
    outerScale = 5,
    innerScale = 0.7 }) => {
    const cursorOuterRef = useRef<HTMLDivElement>(null)
    const cursorInnerRef = useRef<HTMLDivElement>(null)
    const requestRef = useRef<number | null>(null)
    const previousTimeRef = useRef<number | null>(null)
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(true)
    const [isActive, setIsActive] = useState(false)
    const [isActiveClickable, setIsActiveClickable] = useState(false)
    const endX = useRef(0)
    const endY = useRef(0)

    const onMouseMove = useCallback(({ clientX, clientY }) => {
        setCoords({ x: clientX, y: clientY })
        if (cursorInnerRef.current) {
            cursorInnerRef.current.style.top = clientY + 'px'
            cursorInnerRef.current.style.left = clientX + 'px'
        }
        endX.current = clientX
        endY.current = clientY
    }, [])

    const animateOuterCursor = useCallback(
        (time) => {
            if (previousTimeRef.current !== undefined) {
                coords.x += (endX.current - coords.x) / 8
                coords.y += (endY.current - coords.y) / 8
                if (cursorOuterRef.current) {
                    cursorOuterRef.current.style.top = coords.y + 'px'
                    cursorOuterRef.current.style.left = coords.x + 'px'
                }
            }
            previousTimeRef.current = time
            requestRef.current = requestAnimationFrame(animateOuterCursor)
        },
        [requestRef] // eslint-disable-line
    )

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateOuterCursor);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [animateOuterCursor]);

    const onMouseDown = useCallback(() => setIsActive(true), [])
    const onMouseUp = useCallback(() => setIsActive(false), [])
    const onMouseEnter = useCallback(() => setIsVisible(true), [])
    const onMouseLeave = useCallback(() => setIsVisible(false), [])

    useEventListener('mousemove', onMouseMove, document)
    useEventListener('mousedown', onMouseDown, document)
    useEventListener('mouseup', onMouseUp, document)
    useEventListener('mouseenter', onMouseEnter, document)
    useEventListener('mouseleave', onMouseLeave, document)

    useEffect(() => {
        if (isActive) {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.transform = `scale(${innerScale})`
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.transform = `scale(${outerScale})`
            }
        } else {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.transform = 'scale(1)'
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.transform = 'scale(1)'
            }
        }
    }, [innerScale, outerScale, isActive])

    useEffect(() => {
        if (isActiveClickable) {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.transform = `scale(${innerScale * 1.3})`
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.transform = `scale(${outerScale * 1.4})`
            }
        }
    }, [innerScale, outerScale, isActiveClickable])

    useEffect(() => {
        if (isVisible) {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.opacity = '1'
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.opacity = '1'
            }
        } else {
            if (cursorInnerRef.current) {
                cursorInnerRef.current.style.opacity = '0';
            }
            if (cursorOuterRef.current) {
                cursorOuterRef.current.style.opacity = '0';
            }
        }
    }, [isVisible])

    useEffect(() => {
        const clickables = document.querySelectorAll(
            'a, input[type="submit"], input[type="image"], label[for], select, button, .link'
        )
        clickables.forEach((el) => {
            (el as HTMLElement).style.cursor = 'none'

            el.addEventListener('mouseover', () => {
                setIsActive(true)
            })
            el.addEventListener('click', () => {
                setIsActive(true)
                setIsActiveClickable(false)
            })
            el.addEventListener('mousedown', () => {
                setIsActiveClickable(true)
            })
            el.addEventListener('mouseup', () => {
                setIsActive(true)
            })
            el.addEventListener('mouseout', () => {
                setIsActive(false)
                setIsActiveClickable(false)
            })
        })

        return () => {
            clickables.forEach((el) => {
                el.removeEventListener('mouseover', () => {
                    setIsActive(true)
                })
                el.removeEventListener('click', () => {
                    setIsActive(true)
                    setIsActiveClickable(false)
                })
                el.removeEventListener('mousedown', () => {
                    setIsActiveClickable(true)
                })
                el.removeEventListener('mouseup', () => {
                    setIsActive(true)
                })
                el.removeEventListener('mouseout', () => {
                    setIsActive(false)
                    setIsActiveClickable(false)
                })
            })
        }
    }, [isActive])

    const styles = {
        cursor: {
            zIndex: 11111,
            position: 'fixed',
            opacity: 1,
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out'
        },
        cursorInner: {
            position: 'fixed',
            borderRadius: '50%',
            width: innerSize,
            height: innerSize,
            pointerEvents: 'none',
            backgroundColor: `rgba(${color}, 1)`,
            transition: 'opacity 0.15s ease-in-out, transform 0.25s ease-in-out'
        },
        cursorOuter: {
            position: 'fixed',
            borderRadius: '50%',
            pointerEvents: 'none',
            width: outerSize,
            height: outerSize,
            backgroundColor: `rgba(${color}, ${outerAlpha})`,
            transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out'
        }
    }

    return (
        <Fragment>
            <div ref={cursorOuterRef} style={styles.cursorOuter as CSSProperties} />
            <div ref={cursorInnerRef} style={styles.cursorInner as CSSProperties} />
        </Fragment>
    )
};

export default CustomCursor;
