import { useEffect, useState } from 'react'

const STORAGE_KEY =
    'srijan_sidebar_state'

const TTL =
    24 * 60 * 60 * 1000 // 24 hours

const channel =
    new BroadcastChannel(
        'srijan_sidebar_channel'
    )

interface StoredState {
    value: boolean
    timestamp: number
}

function getStoredSidebarState() {
    try {
        const raw =
            localStorage.getItem(
                STORAGE_KEY
            )

        if (!raw) {
            return false
        }

        const parsed: StoredState =
            JSON.parse(raw)

        const isExpired =
            Date.now() -
            parsed.timestamp >
            TTL

        if (isExpired) {
            localStorage.removeItem(
                STORAGE_KEY
            )

            return false
        }

        return parsed.value
    } catch {
        return false
    }
}

export function useSidebarState() {
    const [isCollapsed, setIsCollapsed] =
        useState(() =>
            getStoredSidebarState()
        )

    // SAVE + TAB SYNC
    useEffect(() => {
        const payload: StoredState = {
            value: isCollapsed,
            timestamp: Date.now(),
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(payload)
        )

        channel.postMessage(
            isCollapsed
        )
    }, [isCollapsed])

    // RECEIVE TAB UPDATES
    useEffect(() => {
        const handler = (
            event: MessageEvent
        ) => {
            setIsCollapsed(event.data)
        }

        channel.addEventListener(
            'message',
            handler
        )

        return () => {
            channel.removeEventListener(
                'message',
                handler
            )
        }
    }, [])

    return {
        isCollapsed,
        setIsCollapsed,
    }
}