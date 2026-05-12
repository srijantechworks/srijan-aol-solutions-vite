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
} from 'lucide-react'

interface Props {
    isSidebarCollapsed: boolean
}

export default function Navbar({
                                   isSidebarCollapsed,
                               }: Props) {
    const location = useLocation()
    const navigate = useNavigate()

    const [isMenuOpen, setIsMenuOpen] =
        useState(false)
    const menuRef =
        useRef<HTMLDivElement>(null)

    const isAboutPage =
        location.pathname === '/about'

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

    useEffect(() => {

        const handleOutsideClick = (
            event: MouseEvent,
        ) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node,
                )
            ) {

                setIsMenuOpen(false)
            }
        }

        document.addEventListener(
            'mousedown',
            handleOutsideClick,
        )

        return () => {

            document.removeEventListener(
                'mousedown',
                handleOutsideClick,
            )
        }

    }, [])

    return (
        <header
            className={`
    fixed top-0 right-0 z-50
    flex w-auto items-center justify-between
    transition-all duration-300 ease-out

    left-0 px-5 py-3
    bg-black/20
    backdrop-blur-xl

    ${
                isSidebarCollapsed
                    ? 'md:left-[80px] md:px-4 md:py-3 md:bg-transparent md:backdrop-blur-none'
                    : 'md:left-[255px] md:px-6 md:py-4 md:bg-black/5 md:backdrop-blur-xl'
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

            {/* ABOUT BUTTON */}
            <div className="hidden md:block">
                <button
                    onClick={handleAboutToggle}
                    className={`
    pointer-events-auto
    flex items-center justify-center
    cursor-pointer gap-2

    rounded-full
    w-11 h-11

    shadow-lg
    backdrop-blur-xl
    transition-all
    active:scale-[0.96]

    ${
                        isAboutPage
                            ? 'bg-black/70 text-white hover:bg-black/10'
                            : 'bg-white/30 text-neutral-900 hover:bg-neutral-600 hover:text-neutral-300'
                    }

    md:w-auto
    md:h-auto
    md:px-4
    md:py-2
    md:rounded-xl
`}
                >
                    {isAboutPage ? (
                        <>
                            <X
                                size={18}
                                strokeWidth={2.5}
                            />

                            <span className="hidden sm:inline">
                            Close About
                        </span>
                        </>
                    ) : (
                        <>
                            <Info
                                size={18}
                                strokeWidth={2.5}
                            />

                            <span className="hidden sm:inline">
                            About
                        </span>
                        </>
                    )}
                </button>
            </div>


            {/* MOBILE ELLIPSIS */}
            <div ref={menuRef}
                 className="relative md:hidden translate-x-4"
            >

                <button
                    onClick={() =>
                        setIsMenuOpen((prev) => !prev)
                    }
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
                absolute right-0 top-0
                flex min-w-[220px]
                flex-col overflow-hidden
                rounded-2xl
                border border-white/20
                bg-black/90
                shadow-2xl

            "
                    >

                        {/* ABOUT */}
                        <button
                            onClick={() => {
                                handleAboutToggle()
                                setIsMenuOpen(false)
                            }}
                            className="
                    flex items-center gap-3
                    px-5 py-4
                    text-left text-white font-semibold
                    transition-all
                    hover:bg-white/10
                "
                        >
                            {isAboutPage ? (
                                <>
                                    <X size={18}/>

                                    <span>
            Close About
        </span>
                                </>
                            ) : (
                                <>
                                    <Info size={18}/>

                                    <span>
            About
        </span>
                                </>
                            )}
                        </button>

                        {/* INFINITY */}
                        <button
                            onClick={handleInfinityRedirect}
                            className="
                    flex items-center gap-3
                    px-5 py-4
                    text-left text-violet-300 font-semibold
                    transition-all
                    hover:bg-white/10
                "
                        >
                            <Infinity size={18}/>

                            <span>
                    Whispering Infinity
                </span>
                        </button>


                        {/* COUNTRY SELECT */}
                        <button
                            // onClick={handleInfinityRedirect}
                            className="
                    flex items-center gap-3
                    px-5 py-4
                    text-left text-violet-300 font-semibold
                    transition-all
                    hover:bg-white/10
                "
                        >
                            🌍 Region
                        </button>
                    </div>
                )}
            </div>

        </header>
    )
}