import SideBar from './components/SideBar';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateCanvas from './components/CreateCanvas';

function App() {
  const [page, setPage] = useState("/")

  return (
    <div>
      <SideBar onChangePage={setPage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateCanvas />} />
      </Routes>
  </div>
);
}


export default App;