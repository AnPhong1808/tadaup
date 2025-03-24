import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import các trang
import Home from './pages/Home'; 
import FundBot from './pages/FundBot';
import DauTruong from './pages/DauTruong';
import KhoTang from './pages/KhoTang';
import Earn from './pages/Earn';
import QuaThuong from './pages/QuaThuong';
import NewsDetail from './pages/NewsDetail';
import TadaTVDetail from './pages/TadaTVDetail';
import CourseDetail from './pages/CourseDetail';
import QuizDetail from './pages/QuizDetail';
import SignalDetail from './pages/SignalDetail';
import QuizStarting from './pages/QuizStarting';
import QuaThuongDetail from './pages/QuaThuongDetail';
import Setting from './pages/Setting';

const App = () => {
  const location = useLocation(); // Lấy thông tin về đường dẫn hiện tại

  return (
    <div className="App">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/fundbot" element={<FundBot />} />
            <Route path="/dautruong" element={<DauTruong />} />
            <Route path="/khotang" element={<KhoTang />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/signaldetail/:id" element={<SignalDetail />} />
            <Route path="/quathuong" element={<QuaThuong />} />
            <Route path="/Tin tức/:id" element={<NewsDetail />} />
            <Route path="/tadatv/:id" element={<TadaTVDetail />} />
            <Route path="/Courses/:id" element={<CourseDetail />} />
            <Route path="/quiz/:id" element={<QuizDetail />} />
            <Route path="/quizstarting/:id" element={<QuizStarting />} />
            <Route path="/quathuongdetail/:id" element={<QuaThuongDetail />} />
            <Route path="/setting/:id" element={<Setting />} />
          </Routes>
        </AnimatePresence>
    </div>
  );
};

export default App;
