import {useMemo, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {
    BookOpen,
    Shuffle,
    Hash,
    Sparkles,
    ArrowRight,
    AlertCircle,
    Loader2,
    Settings2,
    ChevronDown,
    ChevronUp
} from 'lucide-react'

// Define the shape of our DB response
interface PageData {
    PK: string;
    SK: number;
    text: string;
    html: string;
}

export default function KnowledgePage() {
    const [pageNumber, setPageNumber] = useState('')
    const [activePage, setActivePage] = useState<number | null>(null)
    const [pageData, setPageData] = useState<PageData | null>(null)

    // UI States
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false)

    const location = useLocation()

    // The actual valid knowledge sheet boundaries
    const MIN_PAGE = 1
    const MAX_PAGE = 366

    const randomPage = useMemo(() => {
        return Math.floor(Math.random() * (MAX_PAGE - MIN_PAGE + 1)) + MIN_PAGE
    }, [activePage])

    // Mock API Call - Replace with your actual backend endpoint
    const fetchPageFromDB = async (targetPage: number) => {
        setIsLoading(true)
        setError(null)

        try {
            // NOTE: Replace this URL with your actual backend API route
            const response = await fetch(`/api/knowledge?page=${targetPage}`)

            if (!response.ok) {
                throw new Error("Failed to fetch page content.")
            }

            const data = await response.json()
            setPageData(data)
            setActivePage(targetPage)
            setIsMobileControlsOpen(false) // Auto-close mobile menu on success
        } catch (err) {
            setError("Could not load this page. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoadPage = () => {
        const parsed = Number(pageNumber)

        if (!parsed || parsed < MIN_PAGE || parsed > MAX_PAGE) {
            setError(`Please enter a valid page number between ${MIN_PAGE} and ${MAX_PAGE}.`)
            return
        }

        fetchPageFromDB(parsed)
    }

    const handleRandomPage = () => {
        setPageNumber(randomPage.toString())
        fetchPageFromDB(randomPage)
    }

    useEffect(() => {
        const restoreState = () => {
            const savedPage = sessionStorage.getItem(
                'knowledge-active-page'
            )

            const savedPageData = sessionStorage.getItem(
                'knowledge-page-data'
            )

            if (savedPage && savedPageData) {
                requestAnimationFrame(() => {
                    setActivePage(Number(savedPage))
                    setPageNumber(savedPage)
                    setPageData(JSON.parse(savedPageData))
                })
            }
        }

        restoreState()
    }, [])

    useEffect(() => {
        if (activePage && pageData) {
            sessionStorage.setItem(
                'knowledge-active-page',
                activePage.toString()
            )

            sessionStorage.setItem(
                'knowledge-page-data',
                JSON.stringify(pageData)
            )
        }
    }, [activePage, pageData])


    return (
        <div className="relative min-h-full overflow-hidden px-1.5 pb-28 md:pt-24 sm:px-6 lg:px-12">
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">
                {/* HERO */}
                <div className="text-center md:pt-0">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs md:text-sm font-medium text-white/80 backdrop-blur-xl">
                        <Sparkles className="h-4 w-4 text-amber-300"/>
                        Wisdom • Reflection • Random Discovery
                    </div>

                    <h1 className="mx-auto max-w-5xl text-3xl font-black tracking-tight text-neutral-800 sm:text-4xl lg:text-5xl">
                        Knowledge Sheet
                    </h1>

                    <p className="mx-auto mt-4 max-w-3xl text-sm md:text-base font-semibold leading-relaxed text-white/80 sm:text-lg">
                        Instantly open any knowledge sheet page or let Srijan randomly surface a timeless insight for you.
                    </p>
                </div>

                {/* MOBILE CONTROLS TOGGLE (Hidden on Desktop) */}
                <div className="md:hidden mx-auto w-full max-w-5xl">
                    <button
                        onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition-colors active:bg-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <Settings2 className="h-5 w-5 text-amber-400"/>
                            <span className="font-semibold text-white">Page Controls</span>
                        </div>
                        {isMobileControlsOpen ? <ChevronUp className="h-5 w-5 text-white/60"/> : <ChevronDown className="h-5 w-5 text-white/60"/>}
                    </button>
                </div>

                {/* CONTROLS (Accordion on Mobile, Grid on Desktop) */}
                <div className={`mx-auto w-full max-w-4xl grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr] ${isMobileControlsOpen ? 'grid' : 'hidden md:grid'}`}>
                    {/* PAGE PICKER */}
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                                <Hash className="h-5 w-5 md:h-6 md:w-6"/>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg md:text-xl font-bold text-white">Open Specific Page</h2>
                                <p className="mt-1 text-xs md:text-sm leading-relaxed text-white/60">
                                    Enter any page number and instantly render that knowledge sheet.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 md:mt-6 flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min={MIN_PAGE}
                                    max={MAX_PAGE}
                                    placeholder="Enter page number..."
                                    value={pageNumber}
                                    onChange={(e) => {
                                        setPageNumber(e.target.value)
                                        setError(null)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLoadPage()}
                                    className={`h-12 md:h-14 w-full rounded-2xl border bg-black/20 px-4 md:px-5 text-base md:text-lg font-semibold text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:bg-black/30 ${
                                        error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-400/50'
                                    }`}
                                />
                            </div>

                            <button
                                onClick={handleLoadPage}
                                disabled={isLoading}
                                className="group flex h-12 md:h-14 items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 font-bold text-white shadow-2xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? "Loading..." : "Open Page"}
                                {!isLoading && <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1"/>}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-400">
                                <AlertCircle className="h-4 w-4 shrink-0"/>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* RANDOM PAGE */}
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-amber-400/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                        <div className="flex h-full flex-col justify-between gap-5 md:gap-0">
                            <div>
                                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-white/10 text-violet-200">
                                    <Shuffle className="h-5 w-5 md:h-6 md:w-6"/>
                                </div>
                                <h2 className="mt-4 md:mt-5 text-lg md:text-xl font-bold text-white">Random Wisdom</h2>
                                <p className="mt-1 md:mt-2 text-xs md:text-sm leading-relaxed text-white/65">
                                    Let Srijan randomly surface a page for spontaneous reflection and discovery.
                                </p>
                            </div>
                            <button
                                onClick={handleRandomPage}
                                disabled={isLoading}
                                className="mt-2 md:mt-8 flex h-12 md:h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 font-bold text-white transition-all duration-300 hover:bg-white/20 active:scale-[0.99] disabled:opacity-50"
                            >
                                <Shuffle className="h-4 w-4 md:h-5 md:w-5"/>
                                Surprise Me
                            </button>
                        </div>
                    </div>
                </div>

                {/* DB TEXT VIEWER */}
                <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl md:rounded-[32px] border border-white/10 bg-black/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:mt-0 mt-2">
                    <div className="flex flex-col gap-2 border-b border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8 md:py-5">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-white/10 text-amber-300 shrink-0">
                                <BookOpen className="h-5 w-5 md:h-6 md:w-6"/>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white sm:text-lg md:text-xl">Knowledge Sheet Reader</h3>
                                <p className="text-xs md:text-sm text-white/55">Native text rendering</p>
                            </div>
                        </div>
                        <div className="text-xs md:text-sm font-normal text-white/50 pl-12 sm:pl-0">
                            {activePage ? `Viewing Page ${activePage}` : 'No Page Selected'}
                        </div>
                    </div>

                    {/* MOBILE-ONLY CONTROLS */}
                    <div className="md:hidden mt-3 px-3 pb-3 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min={MIN_PAGE}
                                    max={MAX_PAGE}
                                    placeholder="Page No..."
                                    value={pageNumber}
                                    onChange={(e) => {
                                        setPageNumber(e.target.value)
                                        setError(null)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLoadPage()}
                                    className={`h-11 w-full rounded-xl border bg-black/20 px-3 text-sm font-semibold text-white outline-none transition-all placeholder:text-white/35 focus:bg-black/30 ${
                                        error ? 'border-red-500/50' : 'border-white/10 focus:border-amber-400/50'
                                    }`}
                                />
                            </div>
                            <button onClick={handleLoadPage} disabled={isLoading} className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white transition-all active:scale-95 disabled:opacity-50">
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <ArrowRight className="h-5 w-5"/>}
                            </button>
                            <button onClick={handleRandomPage} disabled={isLoading} className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-amber-300 transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50">
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-white"/> : <Shuffle className="h-5 w-5"/>}
                            </button>
                        </div>
                        {error && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-red-400 pl-1 mt-1">
                                <AlertCircle className="h-3 w-3 shrink-0"/>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* TEXT BODY CONTAINER */}
                    <div className="relative w-full overflow-x-auto bg-[#F1ECE2] px-5 py-8 sm:px-12 sm:py-12 md:px-16 md:py-16 text-black/85">
                        {isLoading ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-black">
                                <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-amber-500 mb-4"/>
                                <p className="text-sm md:text-base">Fetching wisdom from the database...</p>
                            </div>
                        ) : activePage && pageData ? (
                            <div
                                /*
                                    ENTERPRISE FLUID TYPOGRAPHY:
                                    - `clamp(13px, 3.5vw, 18px)` dynamically scales the text based on screen width.
                                    - At mobile sizes, it clamps to 13px.
                                    - At desktop sizes, it clamps to 18px.
                                    - Because the DB now sends margin-left: X%, the indents scale perfectly with the screen.
                                */
                                className="mx-auto w-full max-w-4xl break-words font-serif text-left leading-relaxed tracking-wide
                                [&_p]:text-[clamp(13px,3.5vw,18px)] [&_h2]:text-[clamp(16px,4.5vw,22px)]"
                                dangerouslySetInnerHTML={{ __html: pageData.html }}
                            />
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-2xl md:rounded-[28px] border border-black/10 bg-black/5 text-amber-500 shadow-xl">
                                    <BookOpen className="h-8 w-8 md:h-12 md:w-12"/>
                                </div>
                                <h3 className="mt-5 md:mt-8 text-lg md:text-2xl font-bold text-black/80">Your Knowledge Sheet Awaits</h3>
                                <p className="mt-2 md:mt-4 max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base md:text-lg px-2">
                                    Enter a specific page number above or use the mobile menu to fetch and read formatted text.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}