import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MergePage } from './pages/MergePage';

export type Page = 'home' | 'merge' | 'split' | 'compress'; // Add other tool pages here

export default function App(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'merge':
        return <MergePage onBack={() => navigateTo('home')} />;
      case 'home':
      default:
        return <HomePage onToolSelect={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderPage()}
      </main>
    </div>
  );
}
