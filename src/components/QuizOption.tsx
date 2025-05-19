
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { QuizAnswer } from '../types/quiz';

interface QuizOptionProps {
  label: string;
  value: QuizAnswer;
  content: string;
  selected: boolean;
  isReviewing?: boolean;
  isCorrect?: boolean;
  onClick: () => void;
}

const QuizOption: React.FC<QuizOptionProps> = ({
  label,
  value,
  content,
  selected,
  isReviewing = false,
  isCorrect,
  onClick,
}) => {
  const getOptionClass = () => {
    if (!isReviewing) {
      return selected ? 'quiz-option-selected' : '';
    }
    
    if (isCorrect) {
      return 'quiz-option-correct';
    }
    
    if (selected) {
      return 'quiz-option-incorrect';
    }
    
    return '';
  };

  return (
    <div
      className={cn('quiz-option', getOptionClass())}
      onClick={!isReviewing ? onClick : undefined}
    >
      <div className="flex items-center w-full">
        <div className={cn(
          'flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-3 border-2',
          selected ? 'bg-quiz-primary text-white border-quiz-primary' : 'border-gray-300 text-gray-500'
        )}>
          <span className="text-sm font-medium">{label.toUpperCase()}</span>
        </div>
        
        <div className="flex-grow">
          <p className="text-gray-800">{content}</p>
        </div>
        
        {selected && (
          <div className="flex-shrink-0 ml-2">
            <Check size={20} className={isReviewing && !isCorrect ? 'text-quiz-incorrect' : 'text-quiz-primary'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOption;
