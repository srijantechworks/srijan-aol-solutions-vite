import {Sparkles} from 'lucide-react'

import GeneratorForm from '../components/features/GeneratorForm'

export default function HomePage() {
    return (
        <div className="flex min-h-full flex-col items-center justify-start px-4 pb-28 text-center md:pt-24">
            {/* TOP BADGE */}
            <div
                className="
                    mb-2 inline-flex items-center gap-2
                    rounded-full
                    border border-white/10 bg-white/10
                    px-4 py-1
                    text-xs md:text-sm font-medium
                    text-white/80
                    backdrop-blur-xl
                "
            >
                <Sparkles className="h-4 w-4 text-amber-300"/>

                <span>
                    For Art of Living teachers & volunteers
                </span>
            </div>

            {/* HERO */}
            <h1
                className="
                    max-w-5xl
                    text-4xl font-black tracking-tight
                    text-neutral-800
                    sm:text-3xl
                    lg:text-5xl
                "
            >
                Share your course with

                <span
                    className="
        block
        bg-gradient-to-r
        from-amber-400
        via-orange-500
        to-amber-600
        bg-clip-text
        text-transparent
    "
                >
    warmth & ease
</span>
            </h1>

            {/* SUBTEXT */}
            <p
                className="
                    mt-6 mb-10
                    max-w-4xl
                    text-base leading-relaxed
                    text-neutral-50 font-semibold
                    sm:text-xl
                "
            >
                Paste your Art of Living course link and we’ll craft beautiful, WhatsApp-ready messages you can share in seconds.
            </p>

            {/* FORM */}
            <GeneratorForm/>

        </div>
    )
}