'use client';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({children}: AppLayoutProps) => {
    return (
        <div className="min-h-screen bg-base">
            {/* Main content area */}
            <div className="flex flex-col min-h-screen">
                {/* Main Content */}
                <main className="flex-1 bg-base">
                    {children}
                </main>

                <footer
                    className="bg-surface0 shadow-sm border-t border-surface1 px-6 py-3 flex-col justify-center items-center"
                    style={{ color: '#cdd6f4' }}
                >
                    <div className={'flex justify-center items-center'} style={{ color: '#bac2de' }}>Proudly made by</div>
                    <div className={'flex justify-center items-center text-lg'}>⌨️ 🐱 ☕</div>
                </footer>
            </div>
        </div>
    );
};

export default AppLayout;