import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  onClick: () => void;
  disabled?: boolean;
}

export const ToolCard = ({ title, description, icon, onClick, disabled = false }: ToolCardProps): React.ReactElement => {
  const cardClasses = `
    group bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-start h-full
    transition-all duration-300
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:shadow-lg hover:border-red-300 hover:-translate-y-1 cursor-pointer'
    }
  `;

  return (
    <div onClick={!disabled ? onClick : undefined} className={cardClasses}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-500 transition-colors">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
