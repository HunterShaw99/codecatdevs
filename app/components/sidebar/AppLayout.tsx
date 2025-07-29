'use client';

import {useState} from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({children}: AppLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [currentPageTitle, setCurrentPageTitle] = useState('Home');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSidebarExpanded = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    const handleActiveItemChange = (itemLabel: string) => {
        setCurrentPageTitle(itemLabel);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                isExpanded={sidebarExpanded}
                onToggleExpanded={toggleSidebarExpanded}
                onActiveItemChange={handleActiveItemChange}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>

                            <h1 className="text-2xl font-semibold text-gray-900">{currentPageTitle}</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-md hover:bg-gray-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 17h5l-5 5v-5z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>

                <footer
                    className="bg-white shadow-sm border-t border-gray-200 px-6 py-3 text-gray-900 flex justify-center items-center">Proudly
                    made by Code Cat Devs
                </footer>
            </div>
        </div>
    );
};

export default AppLayout;