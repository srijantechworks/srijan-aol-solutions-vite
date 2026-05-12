import {Link, useLocation, useNavigate} from 'react-router-dom'

import {
    Image as ImageIcon,
    BookOpen,
    Users,
    PanelLeftClose,
    PanelLeftOpen,
    Sparkles,
    ChevronUp,
    ChevronDown,
    Globe
} from 'lucide-react'

import {useState} from 'react'

import {
    useCountry,
} from "../context/CountryContext"

import {
    countries,
} from '../constants/countries.ts'

interface Props {
    isCollapsed: boolean
    setIsCollapsed: React.Dispatch<
        React.SetStateAction<boolean>
    >
}

export default function DesktopSidebar({
                                           isCollapsed,
                                           setIsCollapsed,
                                       }: Props) {
    const location = useLocation()
    const navigate = useNavigate()
    const [isCountryOpen, setIsCountryOpen] =
        useState(false)

    const {
        country,
        setCountry,
    } = useCountry()

    const navItems = [
        {
            name: 'Generate Posters',
            href: '#',
            icon: ImageIcon,
            comingSoon: true,
        },
        {
            name: 'Knowledge Sheet',
            href: '/knowledge',
            icon: BookOpen,
        },
        {
            name: 'Open CRM',
            href: '/crm',
            icon: Users,
        },
    ]

    const getInitials = (id: string) => {
        switch (id) {
            case 'india':
                return 'IN'
            case 'usa':
                return 'US'
            case 'international':
                return 'GL'
            default:
                return id.substring(0, 2).toUpperCase()
        }
    }

    // New Helper: Uses pure SVG code for zero loading time
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

    return (
        <aside
            className={`
                hidden md:flex flex-col overflow-visible
                border-r border-white/10
                bg-white/15 backdrop-blur-md
                shadow-2xl
                relative z-50
                transition-all duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]

                will-change-[width]

                ${
                isCollapsed
                    ? 'w-[70px]'
                    : 'w-[255px]'
            }
            `}
        >
            {/* TOP */}
            <div
                className={`
        flex items-center pb-5 mt-2
        ${isCollapsed ? 'px-1.5' : 'justify-between px-1.5'}
    `}
            >
                {/* LEFT */}
                <div className="flex items-center">
                    {/* LOGO BUTTON */}
                    <button
                        onClick={() => {
                            if (isCollapsed) {
                                setIsCollapsed(false)
                            } else {
                                navigate('/')
                            }
                        }}
                        className="
        group relative flex h-14 w-14 shrink-0 cursor-pointer
        items-center justify-center
        rounded-2xl
        transition-all duration-300
    "
                    >
                        {/* LOGO */}
                        <img
                            src="/srijan-logo.png"
                            alt="logo"
                            className={`
            absolute h-10 w-10 rounded-2xl object-cover
            transition-all duration-300

            ${
                                isCollapsed
                                    ? `
                        opacity-100
                        scale-100
                        group-hover:opacity-0
                        group-hover:scale-75
                    `
                                    : ''
                            }
        `}
                        />

                        {/* EXPAND ICON */}
                        <div
                            className={`
            absolute flex h-10 w-10 items-center justify-center
            rounded-xl
            bg-white/20

            transition-all duration-300

            ${
                                isCollapsed
                                    ? `
                        opacity-0
                        scale-75
                        group-hover:opacity-100
                        group-hover:scale-100
                    `
                                    : `
                        opacity-0 pointer-events-none
                    `
                            }
        `}
                        >
                            <PanelLeftOpen
                                size={26}
                                className="text-white"
                            />
                        </div>
                    </button>

                </div>

                {/* COLLAPSE BUTTON */}
                <button
                    onClick={() =>
                        setIsCollapsed(true)
                    }
                    className={`
                        flex h-10 w-10 shrink-0 cursor-pointer
                        items-center justify-center
                        rounded-xl

                        transition-all duration-300
                        hover:bg-white/30

                        ${
                        isCollapsed
                            ? `
                                    opacity-0 scale-75
                                    pointer-events-none
                                `
                            : `
                                    opacity-100 scale-100
                                `
                    }
                    `}
                >
                    <PanelLeftClose
                        size={26}
                        className="text-black"
                    />
                </button>
            </div>

            {/* CREATE */}
            <div className="px-3 pt-4">
                <Link
                    to="/"
                    className={`
                        flex items-center rounded-xl
                        font-bold h-10

                        transition-all duration-300 ease-out

                        ${
                        isCollapsed
                            ? `
                                    justify-center
                                    w-10 px-0 mx-auto
                                `
                            : `
                                    gap-3 px-4 w-full
                                `
                    }

                        ${
                        location.pathname === '/'
                            ? `
                                    bg-amber-500
                                    text-white shadow-xl
                                `
                            : `
                             
                                    text-neutral-900
                                    hover:bg-white/40
                                `
                    }
                    `}
                >
                    <Sparkles className="h-5 w-5 shrink-0"/>

                    <span
                        className={`
                            overflow-hidden whitespace-nowrap
                            transition-all duration-300

                            ${
                            isCollapsed
                                ? 'w-0 opacity-0'
                                : 'w-auto opacity-100'
                        }
                        `}
                    >
                        Create Message
                    </span>
                </Link>
            </div>

            {/* NAV ITEMS */}
            <div className="flex-1 space-y-2 px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`
        flex items-center rounded-xl
        font-semibold h-10

        transition-all duration-300 ease-out

        ${
                                isCollapsed
                                    ? `
                    justify-center
                    w-10 px-0 mx-auto
                `
                                    : `
                    gap-3 px-4 w-full
                `
                            }

        ${
                                location.pathname === item.href
                                    ? `
            bg-amber-500
            text-white shadow-xl
        `
                                    : `
            text-neutral-900
            hover:bg-white/40
        `
                            }

        ${
                                item.comingSoon
                                    ? `
                    pointer-events-none
                    opacity-50
                `
                                    : ''
                            }
    `}
                        >
                            <Icon className="h-5 w-5 shrink-0"/>

                            <span
                                className={`
            overflow-hidden whitespace-nowrap
            transition-all duration-300

            ${
                                    isCollapsed
                                        ? 'w-0 opacity-0'
                                        : 'w-auto opacity-100'
                                }
        `}
                            >
        {item.name}
    </span>
                        </Link>
                    )
                })}
            </div>


            {/* COUNTRY SELECTOR */}
            <div className="relative px-3 pb-4 mt-auto w-full">

                {/* SELECT BUTTON */}
                <button
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className={`
                        group flex cursor-pointer items-center
                        rounded-lg font-medium
                        border border-white/10 bg-black/20 backdrop-blur-md
                        transition-all duration-300 ease-out
                        hover:bg-black/40 hover:border-white/20 hover:shadow-md

                        ${
                        isCollapsed
                            ? 'h-9 w-12 mx-auto justify-center gap-1 px-0'
                            : 'h-9 w-full justify-between px-3'
                    }
                    `}
                >
                    {isCollapsed ? (
                        <>
                            {/* COLLAPSED STATE: Initials only */}
                            <span
                                className="text-[11px] font-extrabold text-amber-500 tracking-wider uppercase leading-none">
                                {getInitials(country)}
                            </span>

                            {/* Toggles between Up (closed) and Down (open) */}
                            {isCountryOpen ? (
                                <ChevronDown className="h-3.5 w-3.5 text-white/60 font-semibold transition-transform"/>
                            ) : (
                                <ChevronUp className="h-3.5 w-3.5 text-white/60 font-semibold transition-transform"/>
                            )}

                        </>
                    ) : (
                        <>
                            {/* EXPANDED STATE: Flag + Initials + Label */}
                            <div className="flex items-center gap-2.5">
                                <div className="flex w-5 items-center justify-center">
                                    {renderFlag(country)}
                                </div>
                                <span className="text-xs font-bold text-amber-500 tracking-wide uppercase">
                                    {getInitials(country)}
                                </span>
                                <span className="text-sm font-medium tracking-tight text-white/90">
                                    {countries.find((c) => c.id === country)?.label}
                                </span>
                            </div>

                            {/* Toggles between Up (closed) and Down (open) */}
                            {isCountryOpen ? (
                                <ChevronDown className="h-4 w-4 shrink-0 font-semibold text-white/50 transition-transform"/>
                            ) : (
                                <ChevronUp className="h-4 w-4 shrink-0 text-white/50 font-semibold transition-transform"/>
                            )}
                        </>
                    )}
                </button>

                {/* DROPDOWN MENU */}
                {isCountryOpen && (
                    <div
                        className={`
                            absolute z-[999] bottom-[calc(100%+2px)] cursor-pointer
                            overflow-hidden rounded-lg
                            border border-white/10 bg-[#1a1a1a]/95 backdrop-blur-2xl
                            shadow-[0_8px_30px_rgb(0,0,0,0.6)]
                            transition-all duration-300 origin-bottom
                            
                            ${
                            isCollapsed
                                ? 'left-1/2 -translate-x-1/2 w-[49px]' /* FIX: Centers and locks width to match button */
                                : 'left-3 right-3'
                        }
                        `}
                    >
                        <div className="p-1 flex flex-col gap-0.5">
                            {countries.map((item) => {
                                const active = country === item.id

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setCountry(item.id as never)
                                            setIsCountryOpen(false)
                                        }}
                                        className={`
                                            flex items-center rounded-lg
                                            transition-all duration-200 ease-out cursor-pointer

                                            ${
                                            isCollapsed
                                                ? 'justify-center py-2 px-0' /* FIX: Adjusted padding so initials fit nicely */
                                                : 'px-3 py-2 gap-2.5'
                                        }

                                            ${
                                            active
                                                ? 'bg-white/10 shadow-inner'
                                                : 'hover:bg-white/5'
                                        }
                                        `}
                                    >
                                        {isCollapsed ? (
                                            /* COLLAPSED DROPDOWN: Initials Only */
                                            <span
                                                className={`
                                                    text-xs font-bold tracking-wider
                                                    ${active ? 'text-amber-400' : 'text-white/70'}
                                                `}
                                            >
                                                {getInitials(item.id)}
                                            </span>
                                        ) : (
                                            /* EXPANDED DROPDOWN: Flag + Initials + Label */
                                            <>
                                                <div className="flex w-5 items-center justify-center shrink-0">
                                                    {renderFlag(item.id)}
                                                </div>
                                                <span
                                                    className={`
                                                        text-xs font-bold tracking-wide
                                                        ${active ? 'text-amber-400' : 'text-white/40'}
                                                    `}
                                                >
                                                    {getInitials(item.id)}
                                                </span>
                                                <span
                                                    className={`
                                                        text-sm font-medium tracking-tight
                                                        ${active ? 'text-white' : 'text-white/70'}
                                                    `}
                                                >
                                                    {item.label}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}