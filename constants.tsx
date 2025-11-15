import React from 'react';

// Generic Icon Wrapper
const IconWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {children}
    </svg>
);

// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const MergeIcon = () => (
    <IconWrapper className="text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Z" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const SplitIcon = () => (
    <IconWrapper className="text-orange-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12.75h7.5M8.25 18.75h7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h.75M20.25 12h.75" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const CompressIcon = () => (
    <IconWrapper className="text-green-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const PptToPdfIcon = () => (
    <IconWrapper className="text-orange-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25 1.313M12 12.75V15m0 6.75v-2.25M15 21.75l-3-1.732-3 1.732M15 21.75V19.5M15 21.75l-3 1.732M9 21.75l3 1.732M9 21.75l3-1.732M9 21.75V19.5m-6-12l3-1.732 3 1.732M9 3.75V6M9 3.75l-3 1.732m-3-1.732l3 1.732" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const WordToPdfIcon = () => (
    <IconWrapper className="text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5-8.25h16.5m-16.5 12h16.5" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const ExcelToPdfIcon = () => (
    <IconWrapper className="text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const EditIcon = () => (
    <IconWrapper className="text-purple-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const JpgToPdfIcon = () => (
    <IconWrapper className="text-yellow-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const SignIcon = () => (
    <IconWrapper className="text-indigo-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const WatermarkIcon = () => (
    <IconWrapper className="text-cyan-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.75A.75.75 0 0 1 3 4.5h.75m12.75 0v.75a.75.75 0 0 0 .75.75h.75m0 0v-.75a.75.75 0 0 0-.75-.75h-.75M3 13.5v.75a.75.75 0 0 1-.75.75h-.75m0 0v-.75a.75.75 0 0 1 .75-.75h.75m12.75 0v.75a.75.75 0 0 0 .75.75h.75m0 0v-.75a.75.75 0 0 0-.75-.75h-.75M12 2.25v.01M12 7.5v.01M12 12.75v.01M12 18v.01" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const RotateIcon = () => (
    <IconWrapper className="text-teal-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 0 0-2.25-2.25h-4.5a2.25 2.25 0 0 0-2.25 2.25v4.5A2.25 2.25 0 0 0 6.75 12h4.5a2.25 2.25 0 0 0 2.25-2.25Z" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const UnlockIcon = () => (
    <IconWrapper className="text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const ProtectIcon = () => (
    <IconWrapper className="text-red-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </IconWrapper>
);
// Fix: Reformatted to multi-line JSX to avoid potential parser issues with children.
export const PageNumbersIcon = () => (
    <IconWrapper className="text-blue-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M15 15l-1.076 1.076a.75.75 0 0 1-1.06 0L12 15.25m3 0V12.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v2.5" />
    </IconWrapper>
);

export const PdfIcon = (): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const CloseIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PlusIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const BackIcon = (): React.ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
