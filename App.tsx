import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MergePage } from './pages/MergePage';
import { SplitPage } from './pages/SplitPage';
import { RotatePage } from './pages/RotatePage';
import { CompressPage } from './pages/CompressPage';
import { JpgToPdfPage } from './pages/JpgToPdfPage';
import { UnsupportedFeaturePage } from './pages/UnsupportedFeaturePage';


export type Page = 'home' | 'merge' | 'split' | 'compress' | 'rotate' | 'jpg-to-pdf' | 'word-to-pdf' | 'ppt-to-pdf' | 'excel-to-pdf'; // Add other tool pages here

export default function App(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'merge':
        return <MergePage onBack={() => navigateTo('home')} />;
      case 'split':
        return <SplitPage onBack={() => navigateTo('home')} />;
      case 'rotate':
        return <RotatePage onBack={() => navigateTo('home')} />;
      case 'compress':
        return <CompressPage onBack={() => navigateTo('home')} />;
      case 'jpg-to-pdf':
        return <JpgToPdfPage onBack={() => navigateTo('home')} />;
      case 'word-to-pdf':
      case 'ppt-to-pdf':
      case 'excel-to-pdf':
        return <UnsupportedFeaturePage onBack={() => navigateTo('home')} />;
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