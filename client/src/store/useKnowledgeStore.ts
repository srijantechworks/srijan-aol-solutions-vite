import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface PageData {
    PK: string
    SK: number
    text: string
    html: string
}

interface KnowledgeStore {
    pageNumber: string
    activePage: number | null
    pageData: PageData | null

    setPageNumber: (value: string) => void
    setActivePage: (value: number | null) => void
    setPageData: (value: PageData | null) => void
}

export const useKnowledgeStore =
    create<KnowledgeStore>()(
        persist(
            (set) => ({
                pageNumber: '',
                activePage: null,
                pageData: null,

                setPageNumber: (value) =>
                    set({pageNumber: value}),

                setActivePage: (value) =>
                    set({activePage: value}),

                setPageData: (value) =>
                    set({pageData: value}),
            }),
            {
                name: 'knowledge-store',
            }
        )
    )