import {Link, useLocation, useNavigate} from 'react-router-dom'
import {
    useState,
    useEffect,
    useRef,
} from 'react'
import {
    X,
    Info,
    MoreVertical,
    Infinity,
    ChevronRight,
    ChevronLeft,
    Globe,
    Languages,
    ChevronDown
} from 'lucide-react'

import { useCountry } from "../../context/CountryContext"
import { countries } from '../../constants/countries.ts'
import { languages } from '../../constants/languages.ts'

interface Props {
    isSidebarCollapsed: boolean
}

export default function Navbar({
                                   isSidebarCollapsed,
                               }: Props) {
    const location = useLocation()
    const navigate = useNavigate()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeView, setActiveView] = useState<'main' | 'region' | 'language'>('main')

    // Desktop Language Menu State
    const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false)

    // Temporary Local State for Language
    const [language, setLanguage] = useState('en')

    const menuRef = useRef<HTMLDivElement>(null)
    const desktopLangRef = useRef<HTMLDivElement>(null)

    const isAboutPage = location.pathname === '/about'
    const { country, setCountry } = useCountry()

    const handleAboutToggle = () => {
        if (isAboutPage) {
            if (window.history.length > 1) {
                navigate(-1)
            } else {
                navigate('/')
            }
        } else {
            navigate('/about')
        }
    }

    const handleInfinityRedirect = () => {
        window.open(
            'https://play.google.com/store/search?q=whispering%20infinity&c=apps&hl=en_IN',
            '_blank',
        )
        setIsMenuOpen(false)
    }

    const renderFlag = (id: string) => {
        if (id === 'india') {
            return (
                <svg viewBox="0 0 36 24" className="w-5 rounded-[2px] shadow-sm shrink-0">
                    <rect width="36" height="24" fill="#138808"/>
                    <rect width="36" height="16" fill="#fff"/>
                    <rect width="36" height="8" fill="#f93"/>
                    <circle cx="18" cy="12" r="3.5" fill="#000080"/>
                    <circle cx="18" cy="12" r="3" fill="#fff"/>
                    <circle cx="18" cy="12" r="0.5" fill="#000080"/>
                    <path d="M18 8.5v7m-3.5-3.5h7m-6-2.5l5 5m-5 0l5-5" stroke="#000080" strokeWidth="0.5"/>
                </svg>
            )
        }
        if (id === 'usa') {
            return (
                <svg viewBox="0 0 38 20" className="w-5 rounded-[2px] shadow-sm shrink-0 bg-white">
                    <rect width="38" height="20" fill="#b22234"/>
                    <path d="M0 1.5h38v1.5H0zm0 3h38v1.5H0zm0 3h38v1.5H0zm0 3h38v1.5H0zm0 3h38v1.5H0zm0 3h38v1.5H0z" fill="#fff"/>
                    <rect width="15.2" height="10.7" fill="#3c3b6e"/>
                    <g fill="#fff">
                        <circle cx="2" cy="2" r="0.5"/><circle cx="5" cy="2" r="0.5"/><circle cx="8" cy="2" r="0.5"/><circle cx="11" cy="2" r="0.5"/><circle cx="14" cy="2" r="0.5"/>
                        <circle cx="3.5" cy="3.5" r="0.5"/><circle cx="6.5" cy="3.5" r="0.5"/><circle cx="9.5" cy="3.5" r="0.5"/><circle cx="12.5" cy="3.5" r="0.5"/>
                        <circle cx="2" cy="5" r="0.5"/><circle cx="5" cy="5" r="0.5"/><circle cx="8" cy="5" r="0.5"/><circle cx="11" cy="5" r="0.5"/><circle cx="14" cy="5" r="0.5"/>
                        <circle cx="3.5" cy="6.5" r="0.5"/><circle cx="6.5" cy="6.5" r="0.5"/><circle cx="9.5" cy="6.5" r="0.5"/><circle cx="12.5" cy="6.5" r="0.5"/>
                        <circle cx="2" cy="8" r="0.5"/><circle cx="5" cy="8" r="0.5"/><circle cx="8" cy="8" r="0.5"/><circle cx="11" cy="8" r="0.5"/><circle cx="14" cy="8" r="0.5"/>
                    </g>
                </svg>
            )
        }
        return <Globe className="w-4 h-4 text-white/70 shrink-0" />
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (menuRef.current && !menuRef.current.contains(target)) {
                setIsMenuOpen(false)
                setTimeout(() => setActiveView('main'), 200)
            }

            if (desktopLangRef.current && !desktopLangRef.current.contains(target)) {
                setIsDesktopLangOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    return (
        <header
            className={`
    fixed top-0 right-0 z-50
    flex w-auto items-center justify-between
    transition-all duration-300 ease-out

    left-0 px-5 py-3
    md:px-6 md:py-4 /* FIX: Padding is now permanently fixed for desktop */
    bg-black/20
    backdrop-blur-xl

    ${
                isSidebarCollapsed
                    ? 'md:left-[80px] md:bg-transparent md:backdrop-blur-none'
                    : 'md:left-[255px] md:bg-black/5 md:backdrop-blur-xl'
            }
`}
        >
            {/* LOGO */}
            <Link
                to="/"
                className="
        pointer-events-auto
        flex items-center gap-3
        transition-opacity hover:opacity-70
    "
            >
                <img
                    src="/srijan-logo.png"
                    alt="Srijan Logo"
                    className="
            h-10 w-10
            rounded-full
            object-cover
            shadow-md
            md:hidden
        "
                />

                <span
                    className="
            max-w-[50vw]
            truncate
            text-2xl md:text-4xl
            font-bold tracking-tight
            text-neutral-200 drop-shadow-sm
        "
                >
        Srijan
    </span>
            </Link>


            {/* ============================================== */}
            {/* DESKTOP RIGHT SECTION (Language + About) */}
            {/* ============================================== */}
            <div className="hidden md:flex items-center gap-3 md:gap-4">

                {/* 1. DESKTOP LANGUAGE SELECTOR */}
                <div className="relative" ref={desktopLangRef}>
                    <button
                        onClick={() => setIsDesktopLangOpen(!isDesktopLangOpen)}
                        className={`
                            pointer-events-auto cursor-pointer
                            flex items-center justify-center gap-2
                            h-10 px-4 rounded-xl
                            border border-white/10 backdrop-blur-md
                            transition-all active:scale-[0.96] shadow-sm
                            ${isDesktopLangOpen ? 'bg-black/40' : 'bg-black/20 hover:bg-black/40'}
                        `}
                    >
                        <Languages size={18} className="text-white/70 shrink-0" />

                        <span className="text-sm font-semibold tracking-tight text-white uppercase">
                            {language}
                        </span>

                        <ChevronDown
                            size={16}
                            className={`text-white/50 shrink-0 transition-transform duration-300 ${isDesktopLangOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* DESKTOP DROPDOWN MENU */}
                    {isDesktopLangOpen && (
                        <div
                            className="
                                absolute right-0 top-[calc(100%+8px)] z-[999]
                                flex w-[220px] flex-col overflow-hidden
                                rounded-xl text-sm cursor-pointer
                                border border-white/10 bg-[#1a1a1a]/95
                                shadow-[0_8px_30px_rgb(0,0,0,0.6)]
                                backdrop-blur-2xl
                            "
                        >
                            <div className="px-4 py-2 border-b border-white/5 bg-white/5">
                                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                    Select Language
                                </span>
                            </div>

                            <div className="flex flex-col p-1 max-h-[300px] cursor-pointer overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {languages.map((item) => {
                                    const active = language === item.id
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setLanguage(item.id)
                                                setIsDesktopLangOpen(false)
                                            }}
                                            className={`
                                                flex items-center justify-between w-full
                                                px-3 py-2.5 rounded-lg
                                                transition-all duration-200 cursor-pointer
                                                ${active ? 'bg-white/10' : 'hover:bg-white/5'}
                                            `}
                                        >
                                            <span
                                                className={`
                                                    text-sm tracking-tight flex items-center gap-2
                                                    ${active ? 'text-amber-400 font-bold' : 'text-white/80 font-medium'}
                                                `}
                                            >
                                                {item.label}
                                                <span className="opacity-50 text-xs font-normal">
                                                    ({item.native})
                                                </span>
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. DESKTOP ABOUT BUTTON */}
                <button
                    onClick={handleAboutToggle}
                    className={`
                        pointer-events-auto cursor-pointer
                        flex items-center justify-center gap-2
                        h-10 w-11 md:w-auto md:px-4 rounded-full md:rounded-xl
                        border border-white/10 backdrop-blur-md
                        transition-all active:scale-[0.96] shadow-sm
                        
                        ${
                        isAboutPage
                            ? 'bg-black/40 text-white hover:bg-black/60'
                            : 'bg-black/20 text-white hover:bg-black/40'
                    }
                    `}
                >
                    {isAboutPage ? (
                        <>
                            <X size={18} strokeWidth={2.5} className="text-white/70 shrink-0" />
                            <span className="hidden md:inline text-sm font-semibold tracking-tight">Close</span>
                        </>
                    ) : (
                        <>
                            <Info size={18} strokeWidth={2.5} className="text-white/70 shrink-0" />
                            <span className="hidden md:inline text-sm font-semibold tracking-tight">About</span>
                        </>
                    )}
                </button>
            </div>


            {/* ============================================== */}
            {/* MOBILE ELLIPSIS & MENU */}
            {/* ============================================== */}
            <div ref={menuRef} className="relative md:hidden translate-x-4">
                <button
                    onClick={() => {
                        const nextState = !isMenuOpen
                        setIsMenuOpen(nextState)
                        if (!nextState) setTimeout(() => setActiveView('main'), 200)
                    }}
                    className="
            flex h-11 w-11
            items-center justify-center
            text-white font-bold
            transition-all
            active:scale-[0.96]
        "
                >
                    <MoreVertical size={22}/>
                </button>

                {isMenuOpen && (
                    <div
                        className="
                absolute right-0 top-[calc(100%-50px)]
                flex w-[200px]
                flex-col overflow-hidden
                rounded-2xl text-sm
                border border-white/10
                bg-[#1a1a1a]/95
                shadow-[0_8px_30px_rgb(0,0,0,0.6)]
                backdrop-blur-2xl
            "
                    >
                        {/* VIEW 1: MAIN MENU */}
                        {activeView === 'main' && (
                            <div className="flex flex-col w-full animate-in slide-in-from-left-2 duration-200">
                                {/* ABOUT */}
                                <button
                                    onClick={() => {
                                        handleAboutToggle()
                                        setIsMenuOpen(false)
                                    }}
                                    className="
                                        flex items-center gap-3
                                        px-5 py-3
                                        text-left text-white font-semibold
                                        transition-all hover:bg-white/10
                                    "
                                >
                                    {isAboutPage ? (
                                        <>
                                            <X size={18} className="shrink-0" />
                                            <span>Close About</span>
                                        </>
                                    ) : (
                                        <>
                                            <Info size={18} className="shrink-0" />
                                            <span>About</span>
                                        </>
                                    )}
                                </button>

                                <div className="h-px w-full bg-white/10" />

                                {/* INFINITY */}
                                <button
                                    onClick={handleInfinityRedirect}
                                    className="
                                        flex items-center gap-3
                                        px-5 py-4
                                        text-left text-violet-300 font-semibold
                                        transition-all hover:bg-white/10
                                    "
                                >
                                    <Infinity size={18} className="shrink-0" />
                                    <span>Whispering Infinity</span>
                                </button>

                                <div className="h-px w-full bg-white/10" />

                                {/* REGION (DRILL-DOWN TRIGGER) */}
                                <button
                                    onClick={() => setActiveView('region')}
                                    className="
                                        flex items-center justify-between
                                        px-5 py-4 w-full
                                        text-left transition-all hover:bg-white/10
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex w-5 justify-center items-center">
                                            {renderFlag(country)}
                                        </div>
                                        <span className="text-white font-semibold tracking-tight">
                                            {countries.find((c) => c.id === country)?.label || 'Region'}
                                        </span>
                                    </div>
                                    <ChevronRight size={18} className="text-white/50 shrink-0"/>
                                </button>

                                {/* LANGUAGE (DRILL-DOWN TRIGGER) */}
                                <button
                                    onClick={() => setActiveView('language')}
                                    className="
                                        flex items-center justify-between
                                        px-5 py-4 w-full
                                        text-left transition-all hover:bg-white/10
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex w-5 justify-center items-center">
                                            <Languages size={18} className="text-white/70" />
                                        </div>

                                        <span className="text-white font-semibold tracking-tight uppercase">
                                            {language}
                                        </span>

                                    </div>
                                    <ChevronRight size={18} className="text-white/50 shrink-0"/>
                                </button>
                            </div>
                        )}

                        {/* VIEW 2: REGION SUBMENU */}
                        {activeView === 'region' && (
                            <div className="flex flex-col w-full animate-in slide-in-from-right-2 duration-200">

                                {/* BACK BUTTON */}
                                <button
                                    onClick={() => setActiveView('main')}
                                    className="
                                        flex items-center gap-2
                                        px-4 py-3.5
                                        text-left text-white/60 font-semibold text-sm
                                        transition-all hover:bg-white/10 hover:text-white
                                    "
                                >
                                    <ChevronLeft size={18} className="shrink-0"/>
                                    <span>Settings</span>
                                </button>

                                <div className="h-px w-full bg-white/10" />

                                {/* HEADER */}
                                <div className="px-5 py-2">
                                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                        Select Region
                                    </span>
                                </div>

                                {/* COUNTRY OPTIONS */}
                                <div className="flex flex-col pb-1">
                                    {countries.map((item) => {
                                        const active = country === item.id

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setCountry(item.id as never)
                                                    setIsMenuOpen(false)
                                                    setTimeout(() => setActiveView('main'), 200)
                                                }}
                                                className={`
                                                    flex items-center gap-3 w-full
                                                    px-5 py-3
                                                    transition-all duration-200
                                                    ${active ? 'bg-white/10' : 'hover:bg-white/5'}
                                                `}
                                            >
                                                <div className="flex w-5 justify-center items-center shrink-0">
                                                    {renderFlag(item.id)}
                                                </div>
                                                <span
                                                    className={`
                                                        text-sm tracking-tight
                                                        ${active ? 'text-amber-400 font-bold' : 'text-white/80 font-medium'}
                                                    `}
                                                >
                                                    {item.label}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* VIEW 3: LANGUAGE SUBMENU */}
                        {activeView === 'language' && (
                            <div className="flex flex-col w-full animate-in slide-in-from-right-2 duration-200">

                                {/* BACK BUTTON */}
                                <button
                                    onClick={() => setActiveView('main')}
                                    className="
                                        flex items-center gap-2
                                        px-4 py-3.5
                                        text-left text-white/60 font-semibold text-sm
                                        transition-all hover:bg-white/10 hover:text-white
                                    "
                                >
                                    <ChevronLeft size={18} className="shrink-0"/>
                                    <span>Settings</span>
                                </button>

                                <div className="h-px w-full bg-white/10" />

                                {/* HEADER */}
                                <div className="px-5 py-2">
                                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                        Select Language
                                    </span>
                                </div>

                                {/* LANGUAGE OPTIONS (WITH SCROLL) */}
                                <div className="flex flex-col pb-1 max-h-[50vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {languages.map((item) => {
                                        const active = language === item.id

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setLanguage(item.id)
                                                    setIsMenuOpen(false)
                                                    setTimeout(() => setActiveView('main'), 200)
                                                }}
                                                className={`
                                                    flex items-center justify-between w-full
                                                    px-5 py-3
                                                    transition-all duration-200
                                                    ${active ? 'bg-white/10' : 'hover:bg-white/5'}
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        text-sm tracking-tight flex items-center gap-2
                                                        ${active ? 'text-amber-400 font-bold' : 'text-white/80 font-medium'}
                                                    `}
                                                >
                                                    {item.label}
                                                    <span className="opacity-50 text-xs font-normal">
                                                        ({item.native})
                                                    </span>
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}