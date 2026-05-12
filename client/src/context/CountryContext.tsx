import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react'

export type Country =
    | 'india'
    | 'usa'
    | 'international'

interface CountryContextType {
    country: Country

    setCountry:
        (country: Country) => void
}

const CountryContext =
    createContext<
        CountryContextType | undefined
    >(undefined)

export function CountryProvider({
                                    children,
                                }: {
    children: ReactNode
}) {

    const [country, setCountryState] =
        useState<Country>(() => {

            const saved =
                localStorage.getItem(
                    'srijan-country',
                ) as Country | null

            return saved || 'india'
        })

    const setCountry = (
        value: Country,
    ) => {

        setCountryState(value)

        localStorage.setItem(
            'srijan-country',
            value,
        )
    }

    return (
        <CountryContext.Provider
            value={{
                country,
                setCountry,
            }}
        >
            {children}
        </CountryContext.Provider>
    )
}

export function useCountry() {

    const context =
        useContext(CountryContext)

    if (!context) {

        throw new Error(
            'useCountry must be used within CountryProvider',
        )
    }

    return context
}