'use client';

import {ReactNode, useState} from 'react';
import CodeCatLine from "@/app/components/icons/CodeCatLine";

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
    const [activeItem, setActiveItem] = useState('about');

    const menuItems: MenuItem[] = [{
        id: 'about',
        label: 'About Us',
        href: '#about',
        icon: <CodeCatLine
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={10}
        />
    },{
        id: 'solutions',
        label: 'Solutions',
        href: '#solutions',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
    },{
        id: 'mission-vision',
        label: 'Mission & Vision',
        href: '#mission-vision',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
    },{
        id: 'values',
        label: 'Values',
        href: '#values',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
    },{
        id: 'contact',
        label: 'Contact',
        href: '#contact',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
    }];

    const handleItemClick = (item: MenuItem) => {
        setActiveItem(item.id);
        onActiveItemChange?.(item.label);

        // Smooth scroll to section
        const element = document.querySelector(item.href);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            onToggle?.();
        }
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
                        <button
                            onClick={() => handleItemClick(item)}
                            className={`
                    w-full flex items-center rounded-lg transition-all duration-300 ease-in-out group relative text-left
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
                        </button>
                    </li>))}
                </ul>
            </nav>
        </div>
    </>);
};

export default Sidebar;