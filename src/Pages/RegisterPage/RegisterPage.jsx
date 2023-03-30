import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import "./RegisterPage.scss";


const RegisterPage = () => {

    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    

    const onSubmit = (data) =>{
        console.log(data);
    axios.post("http://localhost:3030/user/register", data).then(res => {
        console.log("Usuario creado");
        navigate("/login");
    })

    
    }

    return(
        <div className='register flex-nw flex-c al-c'>

            <h2>Conviertete en un autentico guapisimo y disfruta de las ventajas</h2>

            <form className='register-form flex-nw flex-c al-c' onSubmit={handleSubmit(onSubmit)}>
                <label className='register__l' htmlFor="name">Nombre</label>
                    <input className='register__i' id="name" type="text" {...register("name",{required:true})}/>
                <label className='register__l' htmlFor="email">Dirección de correo electrónico</label>
                    <input className='register__i' id="email" type="email" {...register("email", {required:true})}/>
                <label className='register__l' htmlFor="password">Contraseña</label>
                    <input className='register__i' id="password" type="password" {...register("password",{required:true})}/>
                
                    <button className='button register__b'>Registrarse</button>
                    <a href="http://localhost:3000/login">Iniciar Sesion</a>
            </form>

        </div>
    )
}

export default RegisterPage;

