import {createBrowserRouter, Outlet} from 'react-router-dom'

import AppShell from './layout/AppShell'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import KnowledgePage from './pages/KnowledgePage'

function RootLayout() {
    return (
        <AppShell>
            <Outlet/>
        </AppShell>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: 'about',
                element: <AboutPage/>,
            },
            {
                path: 'knowledge',
                element: <KnowledgePage/>

            },
        ],
    },
])