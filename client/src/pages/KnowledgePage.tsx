import {useMemo, useState} from 'react'

// @ts-ignore
import {useKnowledgeStore} from '@/store/useKnowledgeStore'
import {
    BookOpen,
    Shuffle,
    Sparkles,
    ArrowRight,
    AlertCircle,
    Loader2,
    ChevronLeft
} from 'lucide-react'

export default function KnowledgePage() {
    const {
        pageNumber,
        setPageNumber,
        activePage,
        setActivePage,
        pageData,
        setPageData,
    } = useKnowledgeStore()

    // UI States
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Mobile-specific routing states
    const [mobileTab, setMobileTab] = useState<'specific' | 'random'>('specific')
    const [isMobileReaderOpen, setIsMobileReaderOpen] = useState(false)

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

            // "Route" to the reader view on mobile upon success
            setIsMobileReaderOpen(true)
        } catch (err) {
            setError("Could not load this page. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoadPage = () => {
        if (!pageNumber) return

        let parsed = Number(pageNumber)

        // Final safety net, though typing already restricts this
        if (parsed < MIN_PAGE) {
            parsed = MIN_PAGE
            setPageNumber(MIN_PAGE.toString())
        } else if (parsed > MAX_PAGE) {
            parsed = MAX_PAGE
            setPageNumber(MAX_PAGE.toString())
        }

        // Avoid re-fetching if we already have the exact same page loaded
        if (parsed === activePage && pageData) {
            setIsMobileReaderOpen(true)
            return
        }

        fetchPageFromDB(parsed)
    }

    const handleRandomPage = () => {
        setPageNumber(randomPage.toString())
        fetchPageFromDB(randomPage)
    }

    // Strictly enforce number limits, block 0, and remove leading zeros
    const handleInputChange = (val: string) => {
        setError(null)

        if (val === '') {
            setPageNumber('')
            return
        }

        // Prevent non-digits
        if (!/^\d+$/.test(val)) return

        const num = Number(val)

        // Prevent 0 as a valid input
        if (num === 0) {
            setPageNumber('')
            return
        }

        // Cap at 366 immediately
        if (num > MAX_PAGE) {
            setPageNumber(MAX_PAGE.toString())
        } else {
            // Convert back to string (this auto-removes leading zeros e.g. "05" -> "5")
            setPageNumber(num.toString())
        }
    }

    // Shared keydown handler to block decimals, negatives, and trigger Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['.', '-', 'e', 'E', '+'].includes(e.key)) {
            e.preventDefault()
        }
        if (e.key === 'Enter' && pageNumber) {
            handleLoadPage()
        }
    }

    return (
        <div className="relative min-h-full overflow-hidden px-2 pb-28 md:pt-24 sm:px-6 lg:px-12">
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">

                {/* HERO: Hidden on mobile when Reader is open to save screen space */}
                <div className={`text-center md:pt-0 ${isMobileReaderOpen ? 'hidden md:block' : 'block md:mt-0'}`}>
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

                {/* MOBILE "PSEUDO-ROUTE" TABS MENU (Hidden on Desktop, Hidden if Mobile Reader is Open) */}
                <div className={`md:hidden mx-auto w-full max-w-md flex-col gap-4 mt-2 ${isMobileReaderOpen ? 'hidden' : 'flex'}`}>

                    {/* Tab Switcher */}
                    <div className="flex rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/5">
                        <button
                            onClick={() => { setMobileTab('specific'); setError(null); }}
                            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-300 ${mobileTab === 'specific' ? 'bg-white/15 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                        >
                            Open Specific
                        </button>
                        <button
                            onClick={() => { setMobileTab('random'); setError(null); }}
                            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-300 ${mobileTab === 'random' ? 'bg-white/15 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                        >
                            Surprise Me
                        </button>
                    </div>

                    {/* Tab Content: Specific Page */}
                    {mobileTab === 'specific' && (
                        <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-white">Specific Page</h2>
                                <p className="mt-1 text-xs text-white/60">Enter a page number to begin reading.</p>
                            </div>

                            <div className="relative flex flex-col items-center">
                                <input
                                    type="number"
                                    min={MIN_PAGE}
                                    max={MAX_PAGE}
                                    placeholder="Page #"
                                    value={pageNumber}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={`h-14 w-full rounded-2xl border bg-black/20 px-5 text-center text-lg font-bold text-white outline-none transition-all placeholder:text-white/35 focus:bg-black/40 ${
                                        error ? 'border-red-500/50' : 'border-white/10 focus:border-amber-400/50'
                                    }`}
                                />
                                <span className="absolute -bottom-5 text-[11px] font-medium text-white/50">
                                    Valid Range: {MIN_PAGE} to {MAX_PAGE}
                                </span>
                            </div>

                            <button
                                onClick={handleLoadPage}
                                disabled={isLoading || !pageNumber}
                                className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 text-base font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : (
                                    <>Open Page <ArrowRight className="h-5 w-5"/></>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Tab Content: Random Wisdom */}
                    {mobileTab === 'random' && (
                        <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-amber-400/5 p-6 backdrop-blur-xl shadow-2xl">
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-white">Random Discovery</h2>
                                <p className="mt-1 text-xs text-white/60">Let Srijan find a timeless insight for you.</p>
                            </div>

                            <div className="flex justify-center py-4 text-violet-300">
                                <Shuffle className="h-12 w-12 opacity-80" />
                            </div>

                            <button
                                onClick={handleRandomPage}
                                disabled={isLoading}
                                className="mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 text-base font-bold text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : (
                                    <>Surprise Me <Shuffle className="h-4 w-4"/></>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Mobile Error Message */}
                    {error && (
                        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-red-400 mt-2">
                            <AlertCircle className="h-4 w-4 shrink-0"/>
                            <span>{error}</span>
                        </div>
                    )}
                </div>


                {/* DB TEXT VIEWER / MAIN CONTAINER
                    (Hidden on mobile if reading route is not active, always visible on desktop) */}
                <div className={`mx-auto w-full max-w-4xl overflow-hidden rounded-xl md:rounded-[24px] border border-white/10 bg-black/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl mt-2 md:mt-0 ${isMobileReaderOpen ? 'block' : 'hidden md:block'}`}>

                    {/* MOBILE BACK BUTTON (Visible only on mobile inside the reader) */}
                    <div className="md:hidden flex items-center border-b border-white/10 bg-black/20 p-2">
                        <button
                            onClick={() => setIsMobileReaderOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white active:bg-white/10"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            Back to Menu
                        </button>
                    </div>

                    {/* HEADER & DESKTOP CONTROLS */}
                    <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 sm:px-6 md:px-8 md:py-5">
                        <div className="flex items-center justify-between">
                            {/* Left: Title Area */}
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-white/10 text-amber-300 shrink-0">
                                    <BookOpen className="h-5 w-5 md:h-6 md:w-6"/>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white sm:text-lg md:text-xl">Knowledge Sheet Reader</h3>
                                    <p className="text-xs md:text-sm text-white/55">
                                        {activePage ? `Viewing Page ${activePage}` : 'Native text rendering'}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Desktop Controls (Hidden on Mobile) */}
                            <div className="hidden md:flex items-center gap-3">
                                <div className="relative flex flex-col justify-center">
                                    <input
                                        type="number"
                                        min={MIN_PAGE}
                                        max={MAX_PAGE}
                                        placeholder="Page #..."
                                        value={pageNumber}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className={`h-11 w-32 rounded-xl border bg-black/20 px-4 text-sm font-semibold text-white outline-none transition-all placeholder:text-white/35 focus:bg-black/30 ${
                                            error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-400/50'
                                        }`}
                                    />
                                    <span className="absolute -bottom-4 left-2 text-[10px] font-medium text-white/50">
                                        Range: {MIN_PAGE} - {MAX_PAGE}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLoadPage}
                                    disabled={isLoading || !pageNumber}
                                    className="flex h-11 items-center cursor-pointer justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-white transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Open"}
                                </button>
                                <button
                                    onClick={handleRandomPage}
                                    disabled={isLoading}
                                    className="flex h-11 items-center justify-center cursor-pointer gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
                                >
                                    <Shuffle className="h-4 w-4 text-amber-300"/>
                                    Surprise Me
                                </button>
                            </div>
                        </div>

                        {/* Desktop Error Message */}
                        {error && (
                            <div className="hidden md:flex justify-end text-sm font-medium text-red-400 mt-1">
                                <div className="flex items-center gap-1.5 mr-[208px]">
                                    <AlertCircle className="h-4 w-4 shrink-0"/>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TEXT BODY CONTAINER */}
                    <div className="relative w-full overflow-x-auto bg-[#F1ECE2] px-5 py-8 sm:px-12 sm:py-12 md:px-16 md:py-16 text-black/85">
                        {isLoading ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-black">
                                <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-amber-500 mb-4"/>
                                <p className="text-sm md:text-base font-medium">Fetching wisdom from the database...</p>
                            </div>
                        ) : activePage && pageData ? (
                            <div
                                className="mx-auto w-full max-w-4xl break-words font-serif text-left leading-relaxed tracking-wide [&_p]:text-[clamp(13px,3.5vw,18px)] [&_h2]:text-[clamp(16px,4.5vw,22px)]"
                                dangerouslySetInnerHTML={{ __html: pageData.html }}
                            />
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-2xl md:rounded-[28px] border border-black/10 bg-black/5 text-amber-500 shadow-xl">
                                    <BookOpen className="h-8 w-8 md:h-12 md:w-12"/>
                                </div>
                                <h3 className="mt-5 md:mt-8 text-lg md:text-2xl font-bold text-black/80">Your Knowledge Sheet Awaits</h3>
                                <p className="mt-2 md:mt-4 max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base md:text-lg px-2">
                                    Enter a specific page number above to fetch and read formatted text.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}