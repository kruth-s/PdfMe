import React from 'react';
import { BackIcon } from '../constants';

interface UnsupportedFeaturePageProps {
    onBack: () => void;
}

export const UnsupportedFeaturePage = ({ onBack }: UnsupportedFeaturePageProps): React.ReactElement => {
    return (
        <div className="text-center max-w-3xl mx-auto py-16">
            <svg className="mx-auto h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">Feature Coming Soon</h1>
            <p className="mt-4 text-lg text-gray-600">
                Converting complex document formats like Word, PowerPoint, or Excel to PDF requires powerful processing that isn't possible directly in the browser while remaining fully offline.
            </p>
            <p className="mt-2 text-lg text-gray-600">
                This feature is planned for a future desktop version of this application to ensure high-quality, reliable conversions.
            </p>
            <div className="mt-8">
                <button
                    onClick={onBack}
                    className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center text-lg mx-auto"
                >
                    <BackIcon />
                    Back to All Tools
                </button>
            </div>
        </div>
    );
};