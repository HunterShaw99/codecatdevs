'use client';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({children}: AppLayoutProps) => {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--color-dark-gray-1)' }}>
            {/* Animated Slanted Strips Background using Tailwind v4 syntax */}
            <div className="animated-strips-background"></div>

            {/* Main content area */}
            <div className="flex flex-col min-h-screen relative z-10">
                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                <footer
                    className="shadow-sm border-t px-6 py-3 flex-col justify-center items-center"
                    style={{
                        backgroundColor: 'var(--color-dark-gray-2)',
                        borderColor: 'var(--color-dark-gray-4)',
                        color: 'var(--color-foreground)'
                    }}
                >
                    <div className={'flex justify-center items-center'} style={{ color: 'var(--color-muted-foreground)' }}>Proudly made by</div>
                    <div className={'flex justify-center items-center text-lg'}>⌨️ 🐱 ☕</div>
                </footer>
            </div>
        </div>
    );
};

export default AppLayout;