import {useState, useEffect} from 'react'
import {
    LinkIcon,
    Sparkles,
    SlidersHorizontal,
    Info,
    X,
    Loader2,
    RefreshCw,
    Heart,
    Share2,
    Copy,
    Check,
} from 'lucide-react'

// @ts-ignore
import {DROPDOWN_OPTIONS} from '@/lib/constants'
import CustomSelect from '@/components/ui/CustomSelect'

export default function GeneratorForm() {
    const [url, setUrl] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [toastMsg, setToastMsg] = useState<string | null>(null)
    const [likedMessageId, setLikedMessageId] = useState<string | null>(null)
    const [shareModalMsg, setShareModalMsg] = useState<any>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [apiResult, setApiResult] = useState<any>(null)
    const [pendingResult, setPendingResult] = useState<any>(null)

    const [selections, setSelections] = useState({
        audience: 'none',
        tone: 'none',
        length: 'none',
        benefit: 'none',
        emoji: 'none',
    })

    const looksLikeUrl = (
        value: string,
    ) => {

        if (!value.trim()) {
            return false
        }

        try {

            let normalized =
                value.trim()

            if (
                !normalized.startsWith('http://') &&
                !normalized.startsWith('https://')
            ) {

                normalized =
                    `https://${normalized}`
            }

            const parsed =
                new URL(normalized)

            const hostname =
                parsed.hostname.toLowerCase()

            // Must contain a real domain extension
            const hasValidTld =
                /\.[a-z]{2,}$/i.test(hostname)

            // Reject localhost / random words
            const hasDomainParts =
                hostname.includes('.')

            return (
                hasValidTld &&
                hasDomainParts
            )

        } catch {

            return false
        }
    }

    const isInvalid =
        url.trim() === '' ||
        !looksLikeUrl(url) ||
        errorMsg !== ''

    const hasSelectedOptions =
        Object.values(selections).some((val) => val !== 'none')

    const isActionDisabled =
        !looksLikeUrl(url);

    const handleToggleOptions = () => {

        if (isLoading) return

        if (url.trim() === '') {

            setErrorMsg(
                'Please enter a link/url to access options',
            )

            return
        }

        if (!looksLikeUrl(url)) {

            setErrorMsg(
                'Please enter a valid URL/link'
            )

            return
        }

        setErrorMsg('')

        setShowAdvanced(
            (prev) => !prev,
        )
    }

    const handleSelectChange = (
        key: string,
        value: string,
    ) => {
        setSelections((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleGenerate = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault()

        if (isLoading) return

        if (url.trim() === '') {

            setErrorMsg(
                'Please enter a link/url to create messages',
            )

            return
        }

        if (!looksLikeUrl(url)) {

            setErrorMsg(
                'Please enter a valid URL/link',
            )

            return
        }

        setIsLoading(true)
        setErrorMsg('')
        setApiResult(null)

        try {
            const response = await fetch(
                'http://localhost:3000/api/generate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url,
                        ...(hasSelectedOptions
                            ? selections
                            : {}),
                    }),
                },
            )

            const data = await response.json()

            if (!response.ok) {

                setErrorMsg(
                    data.error ||
                    'Please enter a valid Art of Living course link',
                )

                setUrl('')

                setShowAdvanced(false)

                setApiResult(null)

                return
            } else {
                const result = {
                    eventId: data.event_id_val,
                    messages: data.messages,
                    ...data.courseContext,
                }

                if (
                    !hasSelectedOptions &&
                    !showAdvanced
                ) {
                    setPendingResult(result)
                    setShowModal(true)
                } else {
                    setApiResult(result)
                    setShowAdvanced(false)
                }
            }
        } catch (error) {
            console.error(error)

            setErrorMsg(
                'Network error. Please try again.',
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmModal = () => {
        if (pendingResult) {
            setApiResult(pendingResult)
            setPendingResult(null)
            setShowModal(false)
            setShowAdvanced(false)
        }
    }

    const handleReset = () => {
        setUrl('')
        setErrorMsg('')
        setApiResult(null)
        setPendingResult(null)
        setShowAdvanced(false)

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        const handleKeyDown = (
            e: KeyboardEvent,
        ) => {
            if (showModal && e.key === 'Enter') {
                handleConfirmModal()
            }

            if (showModal && e.key === 'Escape') {
                setShowModal(false)
            }
        }

        window.addEventListener(
            'keydown',
            handleKeyDown,
        )

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [showModal, pendingResult])

    return (
        <>
            <form
                onSubmit={handleGenerate}
                className="w-full max-w-6xl mx-auto flex flex-col items-center px-4 sm:px-6 pb-10 space-y-6"
            >
                {/* INPUT + ACTIONS */}
                <div className="w-full flex flex-col xl:flex-row gap-4 items-stretch xl:items-start">
                    {/* INPUT */}
                    <div className="flex flex-col flex-1 gap-3">
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-4 text-neutral-400 pointer-events-none">
                                <LinkIcon className="h-5 w-5"/>
                            </div>

                            <input
                                type="text"
                                value={url}

                                onChange={(e) => {
                                    setUrl(e.target.value)

                                    if (errorMsg)
                                        setErrorMsg('')

                                    if (apiResult)
                                        setApiResult(null)
                                }}
                                placeholder="paste any aolt.in or artofliving.online course link..."
                                className="w-full rounded-2xl border border-white/30 bg-white/90 text-neutral-900 text-base md:text-lg py-4 pl-12 pr-5 shadow-lg outline-none transition-all focus:ring-2 focus:ring-amber-300"
                            />
                        </div>

                        {errorMsg && (
                            <div
                                className="rounded-2xl border border-red-400/40 bg-red-800 px-4 py-2 flex items-center gap-3">
                                <Info className="h-5 w-5 text-red-200 shrink-0"/>

                                <span className="text-red-50 font-medium">
            {errorMsg}
            </span>
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleToggleOptions}

                            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold transition-all

${
                                isActionDisabled
                                    ? 'cursor-not-allowed opacity-60 text-neutral-600'
                                    : 'cursor-pointer'
                            }

${
                                showAdvanced
                                    ? 'bg-indigo-500 text-white shadow-lg hover:bg-indigo-700'
                                    : 'border border-white/30 bg-white/80 text-neutral-800 hover:bg-white'
                            }
`}
                        >
                            {/*<SlidersHorizontal className="h-5 w-5"/>*/}

                            {showAdvanced
                                ?
                                <>
                                    <X className="h-5 w-5"/>
                                    Close Options
                                </>
                                :
                                <>
                                    <SlidersHorizontal className="h-5 w-5"/>
                                    Options
                                </>
                            }
                        </button>

                        {!showAdvanced && (
                            <button
                                type="submit"
                                // disabled={isLoading}
                                className={`w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-semibold shadow-xl transition-all cursor-pointer

${
                                    isActionDisabled
                                        ? 'cursor-not-allowed bg-neutral-300 text-neutral-600 opacity-60'
                                        : 'cursor-pointer bg-amber-500 text-white hover:bg-amber-600'
                                }
`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin"/>
                                        Fetching...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5"/>
                                        Create Message
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* ADVANCED OPTIONS */}
                {showAdvanced && (
                    <div
                        className="w-full rounded-3xl border border-white/20 bg-white/30 backdrop-blur-md p-5 md:p-8 shadow-2xl">
                        <div className="mb-8 text-left">
                            <h2 className="text-2xl font-bold text-neutral-900">
                                Tailor Your Message
                            </h2>

                            <p className="mt-2 text-neutral-800">
                                Fine tune AI personalization
                            </p>
                        </div>

                        <div
                            className="relative z-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 overflow-visible">
                            <CustomSelect
                                label="Target Audience"
                                options={
                                    DROPDOWN_OPTIONS.audiences
                                }
                                value={selections.audience}
                                onChange={(val) =>
                                    handleSelectChange(
                                        'audience',
                                        val,
                                    )
                                }
                            />

                            <CustomSelect
                                label="Message Tone"
                                options={DROPDOWN_OPTIONS.tones}
                                value={selections.tone}
                                onChange={(val) =>
                                    handleSelectChange(
                                        'tone',
                                        val,
                                    )
                                }
                            />

                            <CustomSelect
                                label="Message Length"
                                options={DROPDOWN_OPTIONS.lengths}
                                value={selections.length}
                                onChange={(val) =>
                                    handleSelectChange(
                                        'length',
                                        val,
                                    )
                                }
                            />

                            <CustomSelect
                                label="Core Benefit Focus"
                                options={
                                    DROPDOWN_OPTIONS.benefits
                                }
                                value={selections.benefit}
                                onChange={(val) =>
                                    handleSelectChange(
                                        'benefit',
                                        val,
                                    )
                                }
                            />

                            <CustomSelect
                                label="Emoji Level"
                                options={DROPDOWN_OPTIONS.emojis}
                                value={selections.emoji}
                                onChange={(val) =>
                                    handleSelectChange(
                                        'emoji',
                                        val,
                                    )
                                }
                            />
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button
                                type="submit"
                                className="w-full cursor-pointer sm:w-auto min-w-[260px] flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-10 py-4 font-semibold text-white shadow-xl transition-all hover:bg-amber-600"
                            >
                                <Sparkles className="h-5 w-5"/>
                                Create Message
                            </button>
                        </div>
                    </div>
                )}
            </form>

            {/* RESULTS */}
            {apiResult?.messages && (
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-32">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-amber-500"/>

                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                                Your Generated Messages
                            </h2>
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/80 px-5 py-3 font-semibold text-neutral-700 shadow-md transition-all hover:bg-white"
                        >
                            <RefreshCw className="h-4 w-4"/>
                            Start Over
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {apiResult.messages.map(
                            (msg: any, idx: number) => (
                                <div
                                    key={msg.message_id}
                                    className="relative flex flex-col rounded-3xl border border-white/20 bg-white/30 backdrop-blur-md p-6 md:p-8 shadow-2xl"
                                >
                                    <div
                                        className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white/40 bg-amber-500 font-bold text-white">
                                        {idx + 1}
                                    </div>

                                    <p className="mb-8 flex-grow whitespace-pre-wrap break-words text-lg leading-relaxed text-neutral-900">
                                        {msg.message_text}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            className="flex items-center justify-center gap-2 rounded-xl bg-white/70 py-3 font-semibold text-neutral-900 transition-all hover:bg-white">
                                            <Copy className="h-4 w-4"/>
                                            Copy
                                        </button>

                                        <button
                                            className="flex items-center justify-center gap-2 rounded-xl bg-white/70 py-3 font-semibold text-red-600 transition-all hover:bg-white">
                                            <Heart className="h-4 w-4"/>
                                            Like
                                        </button>

                                        <button
                                            className="flex items-center justify-center gap-2 rounded-xl bg-white/70 py-3 font-semibold text-blue-700 transition-all hover:bg-white">
                                            <Share2 className="h-4 w-4"/>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            )}

            {/* DEFAULT MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-neutral-900">
                            Use Default Settings?
                        </h3>

                        <p className="mt-4 text-neutral-700 leading-relaxed">
                            You haven’t selected additional
                            personalization options.
                        </p>

                        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setShowAdvanced(true)
                                }}
                                className="rounded-xl bg-neutral-200 px-6 py-3 font-medium text-neutral-800 transition-all hover:bg-neutral-300"
                            >
                                Review Options
                            </button>

                            <button
                                onClick={handleConfirmModal}
                                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition-all hover:bg-amber-600"
                            >
                                <Sparkles className="h-4 w-4"/>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toastMsg && (
                <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2">
                    <div
                        className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 shadow-2xl backdrop-blur-md">
                        <Check className="h-5 w-5 text-green-500"/>

                        <span className="font-medium text-neutral-900">
            {toastMsg}
            </span>
                    </div>
                </div>
            )}
        </>
    )
}