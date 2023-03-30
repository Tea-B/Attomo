import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Context/user';
import { RoleContext } from '../../Context/role';
import { VotesContext } from '../../Context/votes';
import { EditGameContext } from '../../Context/editGame';
import { deleteCookie } from '../../Utils/deleteCookie';
import { getCookie } from '../../Utils/getCookie';

import "./HomePage.scss"


const HomePage = () => {

  const navigate = useNavigate();

  const {login, setLogin} = useContext(UserContext);
  const {role, setRole} = useContext(RoleContext);
  const {votes, setVotes} = useContext(VotesContext);
  const {editGame, setEditGame} = useContext(EditGameContext);


  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [search, setSearch] = useState([]);
  const [filteredAZ, setFilteredAZ] = useState([]);
  const [filtered19, setFiltered19] = useState([]);
  const [toggleAZ, setToggleAZ] = useState(true);
  const [toggle19, setToggle19] = useState(true);
  const [toggleEdit, setToggleEdit] = useState(false);


  useEffect (() => {

    const getData = async () => {
        const { data } = await axios.get("http://localhost:3030/game/getall");

        console.log(data);
        setGames(data);
        setSearch([...data]);

        let mappedCategories = mapCategories(data);

        setCategories(mappedCategories);

        let filteredAZGames = filterAZGames([...data]);
        setFilteredAZ(filteredAZGames);

        let filtered19Games = filterVoteGames([...data]);
        setFiltered19(filtered19Games);

    };

    getData();

  }, []);

  const mapCategories = (games) => {

    let allCategories = [];

    games.forEach((game) => {
      let { "category": categoryPerGame } = game;
      categoryPerGame.forEach((category) => {
        allCategories.push(category.toLowerCase());
      })
    });

    let result = allCategories.filter((item, index) => {
      return allCategories.indexOf(item) === index;
    })

    const categoryFilterStatus = allCategories.reduce((category, index) => {
      category[index] = false;
      return category
    }, {})
  
    setSelectedCategories(categoryFilterStatus);

    allCategories = [];

    result.forEach((category) => {
      allCategories.push(category.charAt(0).toUpperCase() + category.slice(1));
    })

    return allCategories;
  }

  const filterAZGames = (allGames) => {

    const filtered = allGames.sort((game1, game2) => {
      if (game1.name.toLowerCase() < game2.name.toLowerCase()) {
        return -1;
      } else if (game1.name.toLowerCase() > game2.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    })

    return filtered
  }

  const filterVoteGames = (allGames) => {

    const filtered = allGames.sort((game1, game2) => {
      if (game1.votes > game2.votes) {
        return -1;
      } else if (game1.votes < game2.votes) {
        return 1;
      } else {
        return 0;
      }
    })

    return filtered
  }

  const searchGames = (value) => {
    if (value.length < 1) {
      return setSearch(games);
    }

    console.log(value);

    const filtered = games.filter((game) =>
      game.name.toLowerCase().includes(value.toLowerCase())
    );

    console.log(filtered);
    setSearch(filtered);
  };

  const logout = () => {
    console.log(deleteCookie("token"));
    deleteCookie("token");
    deleteCookie("user");
    deleteCookie("admin");
    deleteCookie("votes");
    deleteCookie("votedGames");

    setLogin(false);
  }

  const handleChange = (event) => {
    const {value} = event.target;
    searchGames(value);
  }

  const handleOnCheckbox = (event) => {
    const {value} = event.target;

    setSelectedCategories({
      ...selectedCategories,
      [value]: event.target.checked,
    })

    console.log(selectedCategories);

    if (event.target.checked) {

      let lcCategories = games.map((game) => {
        let { "category": gameCategories } = game;

        let lcGameCategories = [...gameCategories];

        console.log(lcGameCategories);
        console.log(gameCategories);

        lcGameCategories.forEach((categ, index) => {
          gameCategories.splice(index, 1, categ.toLowerCase());
        })

        return game;
      })

      console.log(lcCategories);

      let filterResult = lcCategories.filter(
        game => game.category.includes(value)
      );

      setSearch([...filterResult]);
    } else {
      let filterResult = search.filter(
        game => game.category.includes(value)
      );
      
      setSearch([...filterResult]);
    }
  }

  const filterAZ = () => {
    setToggleAZ(!toggleAZ);

    if (toggleAZ === true) {
      setSearch(filteredAZ);
    } else {
      setSearch(games);
    }
  }

  const filterVotes = () => {
    setToggle19(!toggle19);

    if (toggle19 === true) {
      setSearch(filtered19);
    } else {
      setSearch(games);
    }
  }

  const votar = (id) => {
    if (votes.VotedGames.includes(id)) {
      alert("Lo siento, no puedes votar dos veces el mismo juego");
    } else {
      search.forEach((game) => {
        if (game._id === id) {
          document.cookie = 'votes=' + JSON.stringify(votes.Votes - 1)
          document.cookie = 'votedGames=' + JSON.stringify([...votes.VotedGames, id])
          setVotes({
            Votes: JSON.parse(getCookie('votes')),
            VotedGames: JSON.parse(getCookie('votedGames'))
          })
          console.log(votes);
          let userInfo = JSON.parse(getCookie('user'));
          let { "_id": userID } = userInfo
          let dataUser = { 
            votes: votes.Votes - 1,
            votedGames: [...votes.VotedGames, id],
          };
          console.log(dataUser);

          let dataGame = {
            votes: game.votes + 1
          };

          axios.put("http://localhost:3030/user/put/" + userID, dataUser).then(res => {
            console.log("Voto con exito");
          })
          axios.put("http://localhost:3030/game/put/" + id, dataGame).then(res => {
            console.log("Voto con exito");
          })
        }
      })
      navigate("/")
    }
  }

  const editGameClicked = (game) => {
    setEditGame(game);
    navigate("/edit")
  }

  const deleteGame = (id, index) => {
    search.splice(index, 1);
    setSearch(search);
    axios.delete("http://localhost:3030/game/delete/" + id).then(res => {
      console.log("Juego Eliminado");
      navigate("/");
    })
  }

  console.log(votes);
  console.log(role);
  console.log(login);


  return (
    <>
      <div className='home flex-w flex-c'>
        <header className='home-header flex-nw flex-r jc-b al-c'>
          <h1 className='home-header__title'>V de Vegetta</h1>
          {!login && <button className='button home-header__b' onClick={() => navigate('/login')}>Iniciar sesion</button>}
          {login && <button className='button home-header__b' onClick={() => logout()}>LogOut</button>}
        </header>

        <div className='home-p flex-nw'>
          <div className='home-p-sort flex-nw flex-c al-c'>
            <h2>Filtros:</h2>
            <div className='home-p-sort-bb'>
              <button className='button home-p-sort-bb__b' onClick={() => filterAZ()}>AZ</button>
              <button className='button home-p-sort-bb__b' onClick={() => filterVotes()}>Votos</button>
            </div>
            <div>
              {
                categories.map((category) => {
                  return (
                    <div className='home-p-sort-cb'>
                      <input type="checkbox" id={category.toLowerCase()} value={category.toLowerCase()} onChange={handleOnCheckbox}></input>
                      <label htmlFor={category.toLowerCase()}>{category}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div className='home-p-g flex-nw flex-c'>
            <div className='home-p-g-nav flex-nw jc-b al-c'>
              <input className='home-p-g-nav__i' placeholder="Busca tu juego favorito!" type="text" onChange={handleChange}></input>

              <div>
                {login && role && <button className='button home-p-g-nav__b' onClick={() => {setToggleEdit(!toggleEdit)}}>Editar Juegos</button>}
                {login && role && <button className='button home-p-g-nav__b' onClick={() => {navigate("/edit");}}>Añadir Juego</button>}
              </div>
            </div>

            <div className='home-p-g-main flex-w jc-s'>
              {
                search.map((game, index) => {
                  return (
                    <figure className='home-p-g-main-i'>
                      <img className='home-p-g-main-i__img' src={game.image} alt=''></img>
                      <figcaption className='home-p-g-main-i__name'>{game.name}</figcaption>
                      <figcaption className='home-p-g-main-i__categ'>{game.category}</figcaption>
                      <figcaption className='home-p-g-main-i__votes'>{game.votes} Votos</figcaption>

                      <div className='flex-nw jc-c'>
                        {login ? <button className='button home-p-g-main-i__vb' onClick={() => votar(game._id)}>Votar!</button> : <h3>Para votar, tienes que iniciar sesion</h3>}
                      </div>

                      <div className='flex-nw jc-c'>
                        {login && role && toggleEdit && <button className='button home-p-g-main-i__eb' onClick={() => {editGameClicked(game)}}>Editar</button>}
                        {login && role && toggleEdit && <button className='button home-p-g-main-i__db' onClick={() => {deleteGame(game._id, index)}}>Eliminar</button>}
                      </div>
                    </figure>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage;
