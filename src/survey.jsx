import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Tailwind CSS import
import 'tailwindcss/tailwind.css';

const questions = [
  { id: 1, text: "How satisfied are you with our products?", type: "rating", max: 5 },
  { id: 2, text: "How fair are the prices compared to similar retailers?", type: "rating", max: 5 },
  { id: 3, text: "How satisfied are you with the value for money of your purchase?", type: "rating", max: 5 },
  { id: 4, text: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", max: 10 },
  { id: 5, text: "What could we do to improve our service?", type: "text" }
];

const CustomerSurvey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('sessionId') || uuidv4();
    setSessionId(id);
    localStorage.setItem('sessionId', id);
    
    const savedAnswers = JSON.parse(localStorage.getItem(`surveyAnswers_${id}`)) || {};
    setAnswers(savedAnswers);
    
    const isCompleted = localStorage.getItem(`surveyCompleted_${id}`);
    if (isCompleted === 'true') {
      setShowWelcome(true);
    }
  }, []);

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: answer };
    setAnswers(newAnswers);
    localStorage.setItem(`surveyAnswers_${sessionId}`, JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleConfirmSubmit = () => {
    localStorage.setItem(`surveyCompleted_${sessionId}`, 'true');
    setShowConfirmation(false);
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setShowWelcome(true);
    }, 5000);
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (question.type === "rating") {
      return (
        <div className="flex justify-center mb-8">
          {[...Array(question.max)].map((_, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-full mx-2 border border-black ${
                answers[question.id] === i + 1 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white hover:bg-gray-200'
              }`}
              onClick={() => handleAnswer(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      );
    } else if (question.type === "text") {
      return (
        <textarea
          className="w-full p-2 mb-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(e.target.value)}
          rows="3"
        />
      );
    }
  };

  if (showWelcome) {
    return (
      <div className="bg-blue-300 p-8 rounded-3xl w-[400px] h-96 text-center border-2 border-black shadow-lg">
        <h1 className="text-2xl font-bold mb-4 mt-20 text-blue-800">Welcome to our Survey</h1>
        <p className="mb-4 text-black-700">We value your feedback!</p>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          onClick={handleStart}
        >
          Start Survey
        </button>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="bg-blue-300 p-8 rounded-3xl w-[400px] h-96 text-center border-2 border-black shadow-lg">
        <h1 className="text-2xl font-bold mb-4 mt-20 text-blue-800">Thank You!</h1>
        <p className="mb-4 text-black-700">We appreciate your time and feedback.</p>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="bg-blue-300 p-8 rounded-3xl w-[400px] h-96 text-center border-2 border-black shadow-lg">
        <h1 className="text-2xl font-bold mb-4 mt-20 text-blue-800">Submit Survey?</h1>
        <p className="mb-4 text-black-700">Are you sure you want to submit your responses?</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            onClick={handleConfirmSubmit}
          >
            Yes, Submit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            onClick={handleCancelSubmit}
          >
            No, Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-300 p-8 rounded-3xl w-[400px] h-96 text-center border-2 border-black shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-black-800">Customer Survey</h1>
      <div className="text-right mb-4 text-black-700">{currentQuestionIndex + 1}/{questions.length}</div>
      <div className="text-left mb-4 text-black-800">
        <span className="font-semibold">{currentQuestionIndex + 1}.</span> {questions[currentQuestionIndex].text}
      </div>
      {renderQuestion()}
      <div className="flex justify-between py-8">
        <button
          className={`bg-[#0000FF] text-white text-lg px-6 py-2 rounded ${
            currentQuestionIndex === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-900 transition duration-300'
          }`}
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
        >
          Prev
        </button>
        <button
          className="bg-yellow-500 text-white text-lg px-6 py-2 rounded hover:bg-yellow-600 transition duration-300"
          onClick={handleSkip}
        >
          Skip
        </button>
        <button
          className={`bg-[#ff00ff] text-white text-lg px-6 py-2 rounded ${
            currentQuestionIndex === questions.length - 1 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'hover:bg-[#ff00ff]'
          } transition duration-300`}
          onClick={handleNext}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CustomerSurvey;