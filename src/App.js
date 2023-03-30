import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router, NavLink, Link } from "react-router-dom";
import { UserContext } from './Context/user';
import { RoleContext } from './Context/role';
import { EditGameContext } from './Context/editGame';
import { VotesContext } from './Context/votes';
import { getCookie } from './Utils/getCookie';
import HomePage from './Pages/HomePage/HomePage';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import EditPage from './Pages/EditPage/EditPage';

function App() {

  const[login, setLogin] = useState(!!getCookie('token'));
  const[role, setRole] = useState(!!getCookie('admin'));
  const[votes, setVotes] = useState({
    Votes: getCookie('votes'),
    VotedGames: getCookie('votedGames')
  });
  const[editGame, setEditGame] = useState({});

  return (
    <UserContext.Provider value={{login, setLogin}}>
      <RoleContext.Provider value={{role, setRole}}>
        <VotesContext.Provider value={{votes, setVotes}}>
          <EditGameContext.Provider value={{editGame, setEditGame}}>
            <Router>
              <Routes>
                  <Route exact path="/" element={<HomePage></HomePage>} />
                  <Route path="/edit" element={<EditPage></EditPage>} />
                  <Route path="/login" element={<LoginPage></LoginPage>} />
                  <Route path="/register" element={<RegisterPage></RegisterPage>} />
              </Routes>
            </Router>
          </EditGameContext.Provider>
        </VotesContext.Provider>
      </RoleContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
