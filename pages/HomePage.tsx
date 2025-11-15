import React from 'react';
import type { Page } from '../App';
import { ToolCard } from '../components/ToolCard';
import {
    MergeIcon, SplitIcon, CompressIcon, JpgToPdfIcon, WordToPdfIcon,
    PptToPdfIcon, ExcelToPdfIcon, EditIcon, PdfIcon, SignIcon,
    WatermarkIcon, RotateIcon, PageNumbersIcon, UnlockIcon, ProtectIcon
} from '../constants';

interface HomePageProps {
  onToolSelect: (page: Page) => void;
}

const tools = [
    { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDFs into one single document.', icon: <MergeIcon />, category: 'Organize' },
    { id: 'split', title: 'Split PDF', description: 'Extract pages from a PDF or save each page as a separate PDF.', icon: <SplitIcon />, category: 'Organize', disabled: true },
    { id: 'compress', title: 'Compress PDF', description: 'Reduce the file size of your PDF while optimizing for quality.', icon: <CompressIcon />, category: 'Optimize', disabled: true },
    { id: 'rotate', title: 'Rotate PDF', description: 'Rotate one or all pages in your PDF file as you need.', icon: <RotateIcon />, category: 'Organize', disabled: true },
    { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert JPG, PNG, BMP, TIFF images to a PDF file.', icon: <JpgToPdfIcon />, category: 'Convert', disabled: true },
    { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert Microsoft Word documents to PDF format.', icon: <WordToPdfIcon />, category: 'Convert', disabled: true },
    { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', description: 'Convert Microsoft PowerPoint presentations to PDF.', icon: <PptToPdfIcon />, category: 'Convert', disabled: true },
    { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Convert Microsoft Excel spreadsheets to PDF.', icon: <ExcelToPdfIcon />, category: 'Convert', disabled: true },
    { id: 'edit', title: 'Edit PDF', description: 'Add text, images, shapes or freehand annotations.', icon: <EditIcon />, category: 'Edit', disabled: true },
    { id: 'page-numbers', title: 'Page Numbers', description: 'Insert page numbers in your PDF files with ease.', icon: <PageNumbersIcon />, category: 'Edit', disabled: true },
    { id: 'watermark', title: 'Watermark', description: 'Stamp an image or text over your PDFs in seconds.', icon: <WatermarkIcon />, category: 'Edit', disabled: true },
    { id: 'sign', title: 'Sign PDF', description: 'Sign your documents with a digital signature.', icon: <SignIcon />, category: 'Security', disabled: true },
    { id: 'unlock', title: 'Unlock PDF', description: 'Remove password, encryption, and permissions from PDF.', icon: <UnlockIcon />, category: 'Security', disabled: true },
    { id: 'protect', title: 'Protect PDF', description: 'Add a password and encrypt your PDF file.', icon: <ProtectIcon />, category: 'Security', disabled: true },
];

const categories = ['Organize', 'Optimize', 'Convert', 'Edit', 'Security'];

export const HomePage = ({ onToolSelect }: HomePageProps): React.ReactElement => {
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Every PDF tool you need</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    A powerful, reliable, and easy-to-use suite of offline tools to manage your PDF files.
                    Completely private and secure—your files never leave your computer.
                </p>
            </div>

            {categories.map(category => (
                <div key={category}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{category} PDF</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Fix: Wrapped ToolCard in React.Fragment to handle the 'key' prop issue. */}
                        {tools.filter(tool => tool.category === category).map(tool => (
                            <React.Fragment key={tool.id}>
                                <ToolCard
                                    title={tool.title}
                                    description={tool.description}
                                    icon={tool.icon}
                                    disabled={tool.disabled}
                                    onClick={() => !tool.disabled && onToolSelect(tool.id as Page)}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
