
import { QuizQuestion } from '../types/quiz';

// Quiz questions data
export const quizQuestions: QuizQuestion[] = [
  // Level 1 - Easy
  {
    id: 1,
    question: "What is the capital of India?",
    options: {
      a: "Mumbai",
      b: "New Delhi",
      c: "Kolkata",
      d: "Chennai"
    },
    correctAnswer: "b",
    level: 1
  },
  {
    id: 2,
    question: "How many days are there in a week?",
    options: {
      a: "5",
      b: "6",
      c: "7",
      d: "8"
    },
    correctAnswer: "c",
    level: 1
  },
  {
    id: 3,
    question: "Which planet is known as the Red Planet?",
    options: {
      a: "Earth",
      b: "Jupiter",
      c: "Mars",
      d: "Venus"
    },
    correctAnswer: "c",
    level: 1
  },
  {
    id: 4,
    question: "Who wrote the national anthem of India?",
    options: {
      a: "Rabindranath Tagore",
      b: "Mahatma Gandhi",
      c: "Jawaharlal Nehru",
      d: "Subhas Chandra Bose"
    },
    correctAnswer: "a",
    level: 1
  },
  {
    id: 5,
    question: "What is the boiling point of water?",
    options: {
      a: "80°C",
      b: "100°C",
      c: "90°C",
      d: "60°C"
    },
    correctAnswer: "b",
    level: 1
  },
  {
    id: 6,
    question: "What color is the sky on a clear day?",
    options: {
      a: "Green",
      b: "Red",
      c: "Blue",
      d: "Orange"
    },
    correctAnswer: "c",
    level: 1
  },
  {
    id: 7,
    question: "What is 5 + 7?",
    options: {
      a: "10",
      b: "11",
      c: "12",
      d: "13"
    },
    correctAnswer: "c",
    level: 1
  },
  {
    id: 8,
    question: "What is the national animal of India?",
    options: {
      a: "Lion",
      b: "Elephant",
      c: "Tiger",
      d: "Peacock"
    },
    correctAnswer: "c",
    level: 1
  },
  {
    id: 9,
    question: "What is the full form of 'CPU'?",
    options: {
      a: "Central Process Utility",
      b: "Central Processing Unit",
      c: "Computer Power Unit",
      d: "Control Process Unit"
    },
    correctAnswer: "b",
    level: 1
  },
  {
    id: 10,
    question: "What do bees produce?",
    options: {
      a: "Sugar",
      b: "Nectar",
      c: "Honey",
      d: "Butter"
    },
    correctAnswer: "c",
    level: 1
  },
  
  // Level 2 - Medium
  {
    id: 11,
    question: "Who invented the lightbulb?",
    options: {
      a: "Alexander Graham Bell",
      b: "Thomas Edison",
      c: "Nikola Tesla",
      d: "Isaac Newton"
    },
    correctAnswer: "b",
    level: 2
  },
  {
    id: 12,
    question: "Which is the largest ocean in the world?",
    options: {
      a: "Atlantic Ocean",
      b: "Pacific Ocean",
      c: "Indian Ocean",
      d: "Arctic Ocean"
    },
    correctAnswer: "b",
    level: 2
  },
  {
    id: 13,
    question: "What is the capital of Australia?",
    options: {
      a: "Sydney",
      b: "Melbourne",
      c: "Brisbane",
      d: "Canberra"
    },
    correctAnswer: "d",
    level: 2
  },
  {
    id: 14,
    question: "Who is known as the Father of the Nation in India?",
    options: {
      a: "Mahatma Gandhi",
      b: "B. R. Ambedkar",
      c: "Jawaharlal Nehru",
      d: "Subhas Chandra Bose"
    },
    correctAnswer: "a",
    level: 2
  },
  {
    id: 15,
    question: "What is the main gas found in the air we breathe?",
    options: {
      a: "Hydrogen",
      b: "Carbon dioxide",
      c: "Nitrogen",
      d: "Oxygen"
    },
    correctAnswer: "c",
    level: 2
  },
  {
    id: 16,
    question: "Which country is known as the Land of the Rising Sun?",
    options: {
      a: "China",
      b: "Japan",
      c: "Thailand",
      d: "Indonesia"
    },
    correctAnswer: "b",
    level: 2
  },
  {
    id: 17,
    question: "What does 'www' stand for in a website browser?",
    options: {
      a: "World Wired Web",
      b: "World Wide Web",
      c: "Web World Way",
      d: "Wide Web Window"
    },
    correctAnswer: "b",
    level: 2
  },
  {
    id: 18,
    question: "What is the freezing point of water?",
    options: {
      a: "10°C",
      b: "50°C",
      c: "0°C",
      d: "32°C"
    },
    correctAnswer: "c",
    level: 2
  },
  {
    id: 19,
    question: "Who painted the Mona Lisa?",
    options: {
      a: "Vincent van Gogh",
      b: "Pablo Picasso",
      c: "Leonardo da Vinci",
      d: "Michelangelo"
    },
    correctAnswer: "c",
    level: 2
  },
  {
    id: 20,
    question: "What is the hardest natural substance?",
    options: {
      a: "Steel",
      b: "Iron",
      c: "Diamond",
      d: "Quartz"
    },
    correctAnswer: "c",
    level: 2
  },
  
  // Level 3 - Hard
  {
    id: 21,
    question: "What is the smallest country in the world?",
    options: {
      a: "Monaco",
      b: "San Marino",
      c: "Vatican City",
      d: "Liechtenstein"
    },
    correctAnswer: "c",
    level: 3
  },
  {
    id: 22,
    question: "Which organ in the human body is responsible for detoxification?",
    options: {
      a: "Kidney",
      b: "Heart",
      c: "Liver",
      d: "Lung"
    },
    correctAnswer: "c",
    level: 3
  },
  {
    id: 23,
    question: "Who discovered penicillin?",
    options: {
      a: "Alexander Fleming",
      b: "Marie Curie",
      c: "Louis Pasteur",
      d: "Isaac Newton"
    },
    correctAnswer: "a",
    level: 3
  },
  {
    id: 24,
    question: "What is the currency of Japan?",
    options: {
      a: "Yuan",
      b: "Won",
      c: "Yen",
      d: "Peso"
    },
    correctAnswer: "c",
    level: 3
  },
  {
    id: 25,
    question: "In which year did India gain independence?",
    options: {
      a: "1946",
      b: "1947",
      c: "1950",
      d: "1948"
    },
    correctAnswer: "b",
    level: 3
  },
  {
    id: 26,
    question: "What is the speed of light?",
    options: {
      a: "200,000 km/s",
      b: "299,792 km/s",
      c: "150,000 km/s",
      d: "1,000,000 km/s"
    },
    correctAnswer: "b",
    level: 3
  },
  {
    id: 27,
    question: "What does DNA stand for?",
    options: {
      a: "Deoxyribonuclear Acid",
      b: "Deoxyribonucleic Acid",
      c: "Dioxyribonucleic Acid",
      d: "Deoxyribogenetic Acid"
    },
    correctAnswer: "b",
    level: 3
  },
  {
    id: 28,
    question: "Who was the first female Prime Minister of India?",
    options: {
      a: "Sarojini Naidu",
      b: "Indira Gandhi",
      c: "Pratibha Patil",
      d: "Sonia Gandhi"
    },
    correctAnswer: "b",
    level: 3
  },
  {
    id: 29,
    question: "What is the chemical symbol for gold?",
    options: {
      a: "Gd",
      b: "Go",
      c: "Au",
      d: "Ag"
    },
    correctAnswer: "c",
    level: 3
  },
  {
    id: 30,
    question: "How many bones are in the adult human body?",
    options: {
      a: "205",
      b: "206",
      c: "208",
      d: "210"
    },
    correctAnswer: "b",
    level: 3
  }
];

// Function to get questions by level
export const getQuestionsByLevel = (level: number): QuizQuestion[] => {
  return quizQuestions.filter(q => q.level === level);
};
