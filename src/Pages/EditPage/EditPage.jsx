import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { EditGameContext } from '../../Context/editGame';
import "./EditPage.scss";


const EditPage = () => {

  const navigate = useNavigate();

  const {editGame, setEditGame} = useContext(EditGameContext);

  const {register, handleSubmit} = useForm();
    

    const onSubmit = (data) =>{
        console.log(data);
        if (Object.keys(editGame).length === 0) {
          axios.post("http://localhost:3030/game/post", data).then(res => {
            console.log("Juego creado");
            navigate("/");})
        } else {
          axios.put("http://localhost:3030/game/put/" + editGame._id, data).then(res => {
            console.log("Juego Modificado");
            navigate("/");})
        }
  }

  return (
    <div className='edit flex-nw flex-c al-c'>
      <form className='edit-form flex-nw flex-c al-c' onSubmit={handleSubmit(onSubmit)}>
            <label className='edit__l' htmlFor="name">Nombre del juego</label>
                <input className='edit__i' id="name" type="text" placeholder={editGame.name} {...register("name", {required:true})}/>
            <label className='edit__l' htmlFor="category">Categoria</label>
                <input className='edit__i' id="category" type="text" placeholder={editGame.category} {...register("category",{required:true})}/>
            <label className='edit__l' htmlFor="image">Imagen</label>
                <input className='edit__i' id="image" type="text" placeholder={editGame.image} {...register("image",{required:true})}/>
      
                <button className='button edit__b'>Guardar Cambios</button>
        </form>
    </div>
  )
}

export default EditPage;
