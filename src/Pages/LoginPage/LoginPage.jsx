import axios from 'axios';
import React, { useContext } from 'react'
import { set, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/user';
import { RoleContext } from '../../Context/role';
import { VotesContext } from '../../Context/votes';

import "./LoginPage.scss";

const LoginPage = () => {
  
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();
  
  const {login, setLogin} = useContext(UserContext);
  const {role, setRole} = useContext(RoleContext);
  const {votes, setVotes} = useContext(VotesContext);
  


    const onSubmit = (data) => {
      console.log(data)
      axios.post("http://localhost:3030/user/login", data).then(
        res => {document.cookie = 'token=' + res.data.token;
        document.cookie = 'user=' +  JSON.stringify(res.data.user);
        document.cookie = 'votes=' +  JSON.stringify(res.data.user.votes);
        document.cookie = 'votedGames=' +  JSON.stringify(res.data.user.votedGames);
        console.log(res.data.token);
        console.log(res.data.user);
        setLogin(true);
        setVotes({
          Votes: res.data.user.votes,
          VotedGames: res.data.user.votedGames
        })
        let {"admin": UserRole} = res.data.user;
        if (UserRole === true) {
          setRole(true);
          document.cookie = 'admin=' +  JSON.stringify(res.data.user.admin);
          console.log("Admin = true");
        } else {
          setRole(false);
          console.log("Admin = false");
        }
        navigate("/");
        }
      )
    }


  return (
    <div className='login flex-nw flex-c al-c'>
      <h1>Iniciar sesión ahora</h1>
      <form className='login-form flex-nw flex-c al-c' onSubmit={handleSubmit(onSubmit)}>
        <label className='login__l'>Dirección de correo electrónico</label>
          <input className='login__i' type="email" id='email' {...register("email", {required:true})}/>
        <label className='login__l'>Contraseña</label>
          <input className='login__i' type="password" id='password' {...register("password", {required:true})}/>
        <button className='button login__b'>Inicia sesión</button>
      </form>
      <p>No tienes cuenta? <a href="http://localhost:3000/register"> Registrate Aquí</a></p>
    </div>
  )
}

export default LoginPage;
