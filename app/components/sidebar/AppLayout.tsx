'use client';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({children}: AppLayoutProps) => {
    return (
        <div className="min-h-screen bg-base relative overflow-hidden">
            {/* Animated Slanted Strips Background using Tailwind v4 syntax */}
            <div className="animated-strips-background"></div>

            {/* Main content area */}
            <div className="flex flex-col min-h-screen relative z-10">
                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                <footer
                    className="bg-surface0 shadow-sm border-t border-surface1 px-6 py-3 flex-col justify-center items-center"
                    style={{ color: '#cdd6f4' }}
                >
                    <div className={'flex justify-center items-center'} style={{ color: '#bac2de' }}>Proudly made by</div>
                    <div className={'flex justify-center items-center text-lg'}>⌨️ 🐱 ☕</div>
                    <a className={'flex justify-center items-center opacity-33'} href="https://www.flaticon.com/free-icons/cute" title="cute icons">Cute icons created by Whitevector - Flaticon</a>
                </footer>
            </div>
        </div>
    );
};

export default AppLayout;