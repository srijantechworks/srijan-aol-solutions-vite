import { useMemo, useState } from 'react'
import {
    BookOpen,
    Shuffle,
    Hash,
    Sparkles,
    ArrowRight,
    AlertCircle,
    Loader2
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
        } catch (err) {
            setError("Could not load this page. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoadPage = () => {
        const parsed = Number(pageNumber)

        // FRONTEND GUARDRAIL: Prevent unnecessary DB calls
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

    return (
        <div className="relative min-h-full overflow-hidden px-4 pt-20 pb-28 md:pt-24 sm:px-6 lg:px-12">
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4">
                {/* HERO */}
                <div className="text-center">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs md:text-sm font-medium text-white/80 backdrop-blur-xl">
                        <Sparkles className="h-4 w-4 text-amber-300"/>
                        Wisdom • Reflection • Random Discovery
                    </div>

                    <h1 className="mx-auto max-w-5xl text-4xl font-black tracking-tight text-white sm:text-3xl lg:text-5xl">
                        Knowledge Sheet
                    </h1>

                    <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-relaxed text-white sm:text-lg">
                        Instantly open any knowledge sheet page or let Srijan randomly surface a timeless insight for you.
                    </p>
                </div>

                {/* CONTROLS */}
                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* PAGE PICKER */}
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                                <Hash className="h-6 w-6"/>
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white">Open Specific Page</h2>
                                <p className="mt-1 text-sm leading-relaxed text-white/60">
                                    Enter any page number and instantly render that knowledge sheet.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min={MIN_PAGE}
                                    max={MAX_PAGE}
                                    placeholder="Enter page number..."
                                    value={pageNumber}
                                    onChange={(e) => {
                                        setPageNumber(e.target.value)
                                        setError(null) // Clear error on new input
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLoadPage()}
                                    className={`h-14 w-full rounded-2xl border bg-black/20 px-5 text-lg font-semibold text-white outline-none transition-all duration-300 placeholder:text-white/35 focus:bg-black/30 ${
                                        error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-400/50'
                                    }`}
                                />
                            </div>

                            <button
                                onClick={handleLoadPage}
                                disabled={isLoading}
                                className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 font-bold text-white shadow-2xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? "Loading..." : "Open Page"}
                                {!isLoading && <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"/>}
                            </button>
                        </div>

                        {/* Error Guardrail Message */}
                        {error ? (
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-400">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        ) : (
                            <div className="mt-4 text-xs text-white/40">
                                Available pages: {MIN_PAGE} - {MAX_PAGE}
                            </div>
                        )}
                    </div>

                    {/* RANDOM PAGE */}
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-amber-400/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                        <div className="flex h-full flex-col justify-between">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-violet-200">
                                    <Shuffle className="h-6 w-6"/>
                                </div>
                                <h2 className="mt-5 text-xl font-bold text-white">Random Wisdom</h2>
                                <p className="mt-2 text-sm leading-relaxed text-white/65">
                                    Let Srijan randomly surface a page for spontaneous reflection and discovery.
                                </p>
                            </div>

                            <button
                                onClick={handleRandomPage}
                                disabled={isLoading}
                                className="mt-8 flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 font-bold text-white transition-all duration-300 hover:bg-white/20 active:scale-[0.99] disabled:opacity-50"
                            >
                                <Shuffle className="h-5 w-5"/>
                                Surprise Me
                            </button>
                        </div>
                    </div>
                </div>

                {/* DB TEXT VIEWER */}
                <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-black/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                    <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                                <BookOpen className="h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white sm:text-xl">Knowledge Sheet Reader</h3>
                                <p className="text-sm text-white/55">Native text rendering</p>
                            </div>
                        </div>
                        <div className="text-sm font-normal text-white/50">
                            {activePage ? `Currently Viewing Page ${activePage}` : 'No Page Selected'}
                        </div>
                    </div>

                    {/* TEXT BODY */}
                    <div className="relative w-full overflow-x-hidden bg-white px-4 py-8 sm:px-16 sm:py-10 text-black">
                        {isLoading ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-black/50">
                                <Loader2 className="h-12 w-12 animate-spin text-amber-500 mb-4" />
                                <p>Fetching wisdom from the database...</p>
                            </div>
                        ) : activePage && pageData ? (
                            // FIXED: Added a regex replacement to dynamically strip trailing <br>, empty spaces, and &nbsp; from the end of the HTML string before injecting it.
                            <div
                                className="mx-auto w-full max-w-3xl break-words font-serif text-sm leading-relaxed sm:text-base md:text-lg [&_*]:max-w-full max-sm:[&_*]:!text-sm max-sm:[&_*]:!leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: pageData.html.replace(/(<br\s*\/?>|&nbsp;|\s)+$/gi, '')
                                }}
                            />
                        ) : (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-black/10 bg-black/5 text-amber-500 shadow-xl">
                                    <BookOpen className="h-12 w-12"/>
                                </div>
                                <h3 className="mt-8 text-2xl font-bold text-black/80">Your Knowledge Sheet Awaits</h3>
                                <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60 sm:text-lg">
                                    Enter a specific page number above to fetch and read the exact formatted text from the database.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}