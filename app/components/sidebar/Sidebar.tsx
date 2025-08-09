
'use client';

import {ReactNode, useState} from 'react';
import Link from 'next/link';

interface MenuItem {
    id: string;
    label: string;
    href: string;
    icon: ReactNode;
}

interface SidebarProps {
    isOpen?: boolean;
    onToggle?: () => void;
    isExpanded?: boolean;
    onToggleExpanded?: () => void;
    onActiveItemChange?: (itemLabel: string) => void;
}

const Sidebar = ({isOpen = true, onToggle, isExpanded = true, onToggleExpanded, onActiveItemChange}: SidebarProps) => {
    const [activeItem, setActiveItem] = useState('Home');

    const menuItems: MenuItem[] = [{
        id: 'home',
        label: 'Home',
        href: '/',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
    }, {
        id: 'solutions',
        label: 'Solutions',
        href: '/solutions',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
    }, {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
    }, {
        id: 'about',
        label: 'About Us',
        href: '/about',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
    },];

    const handleItemClick = (item: MenuItem) => {
        setActiveItem(item.id);
        onActiveItemChange?.(item.label);
    };

    return (<>
        {/* Overlay for mobile */}
        <div
            className={`
          fixed inset-0 bg-crust z-40 lg:hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'bg-opacity-80 visible' : 'bg-opacity-0 invisible'}
        `}
            onClick={onToggle}
        />

        {/* Sidebar */}
        <div className={`
            fixed top-0 left-0 h-full bg-mantle shadow-xl z-50 transition-all duration-300 ease-in-out border-r border-surface0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isExpanded ? 'w-64' : 'w-16'}
            lg:translate-x-0 lg:static lg:z-auto
      `}>
            {/* Header */}
            <div className={`
              flex items-center border-b border-surface0 transition-all duration-300 ease-in-out
              ${isExpanded ? 'justify-between p-6' : 'justify-center p-4'}
            `}>
                <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'opacity-100 max-w-none' : 'opacity-0 max-w-0'}
                `}>
                    <h2 className="text-xl font-semibold text-text whitespace-nowrap">Code Cat Devs</h2>
                </div>

                <div className={`
                    flex items-center space-x-2 transition-all duration-300 ease-in-out
                    ${isExpanded ? 'opacity-100' : 'opacity-100'}
                `}>
                    <button onClick={onToggleExpanded} className={`
                        p-1 rounded-md hover:bg-surface0 transition-all duration-200 ease-in-out text-subtext0 hover:text-text
                        ${isExpanded ? 'hidden lg:block' : 'block'}
                        `}
                            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isExpanded ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"}
                            />
                        </svg>
                    </button>

                    <button onClick={onToggle} className={`
                            lg:hidden p-1 rounded-md hover:bg-surface0 transition-all duration-200 ease-in-out text-subtext0 hover:text-text
                            ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                        `}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`transition-all duration-300 ease-in-out ${isExpanded ? 'p-4' : 'p-2'}`}>
                <ul className="space-y-2">
                    {menuItems.map((item) => (<li key={item.id}>
                        <Link
                            href={item.href}
                            onClick={() => handleItemClick(item)}
                            className={`
                    flex items-center rounded-lg transition-all duration-300 ease-in-out group relative
                    ${isExpanded ? 'px-4 py-3' : 'px-3 py-3 justify-center'}
                    ${activeItem === item.id 
                        ? 'bg-blue/20 text-blue border-l-4 border-blue' + (isExpanded ? ' shadow-md' : '') 
                        : 'text-subtext1 hover:bg-surface0 hover:text-text'}
                  `}
                            title={!isExpanded ? item.label : undefined}
                        >
                  <span className={`
                    text-xl transition-all duration-300 ease-in-out
                    ${isExpanded ? '' : ''}
                  `}>
                    {item.icon}
                  </span>

                            <span className={`
                    font-medium transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
                    ${isExpanded ? 'ml-3 opacity-100 max-w-none' : 'opacity-0 max-w-0 ml-0'}
                  `}>
                    {item.label}
                  </span>

                            {/* Tooltip for collapsed state */}
                            <div className={`
                    absolute left-full ml-2 px-3 py-2 bg-surface2 text-text text-sm rounded-md 
                    whitespace-nowrap z-50 transition-all duration-200 ease-in-out shadow-lg border border-surface1
                    ${isExpanded ? 'opacity-0 invisible pointer-events-none' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}
                  `}>
                                {item.label}
                                <div
                                    className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-surface2 rotate-45 border-l border-b border-surface1"></div>
                            </div>
                        </Link>
                    </li>))}
                </ul>
            </nav>
        </div>
    </>);
};

export default Sidebar;