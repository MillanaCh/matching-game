import { useState, useEffect } from "react"
import axios from "axios"
import { nanoid } from 'nanoid'
import './App.css';

const URL = "https://api.unsplash.com/photos/?client_id="
const KEY = "NOYQOOlALtaZBz9-rsFGN3HELTPDnSWQzrXp4G9i_Cg"
function App() {
  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState(null)//nothing have been selected
  const [reset, setReset] = useState(false)
  const fetchingFromServer = async () => {
    try {
      const [page1, page2] = await axios.all([axios.get(URL + KEY + "&page=2"), axios.get(URL + KEY + "&page=3")])
      let data = [
        ...page1.data,
        ...page1.data,
        ...page2.data.slice(0, 2),
        ...page2.data.slice(0, 2)
      ]

      data = data.map((image) => {
        return ({ ...image, unique: nanoid() })
      })

      //random here
      const randomPhoto = (array) => {
        for (let i = 0; i < array.length; i++) {
          let randomIndex = Math.floor(Math.random() * array.length)//0-23 for ex: 15
          //with ES6
          // [array[randomIndex], array[i]] = [array[i], array[randomIndex]]
          //ususal way
          let temp = array[randomIndex]
          array[randomIndex] = array[i]
          array[i] = temp
        }
        return array
      }
      data = randomPhoto(data)
      setPhotos(data)

    } catch (err) {
      console.log(err)
    }
  }
  const handleCLick = (index) => {
    //where is was my click 2 different options
    //by unique with HOF findIndex()
    // const foundIndex = photos.findIndex((photo) => photo.unique === unique)
    // console.log(photos[foundIndex])
    //with map index
    //console.log(photos[index])//by index parameter
    //clone to start photos, because i do not want toucb original 
    let newPhotos = [...photos]
    //console.log(typeof newPhotos[index].thisthisPhotoWasClicked) //will be undefined it means false
    //console.log(newPhotos) is js object
    newPhotos[index].thisPhotoWasClicked = true//we add new keys with .notation
    //console.log(typeof newPhotos[index].thisthisPhotoWasClicked) //will be boolean
    setPhotos(newPhotos)
    if (selected === null) {
      setSelected(index)
      //return fot dtop function
      return
    } else {
      //* newPhotos[index] ----is the photo that was clicked now
      //* newPhotos[selected] ----is the photo that was clicked before
      //if the player clicked the same image
      if (newPhotos[index].unique === newPhotos[selected].unique) {
        //console.log("the same photo clicked")
        return
        //else if was another cliked
      } else {
        //console.log("another photo was clicked")
        //options 1 - the photo have different id - we have to change thisPhtotWasClicked to false
        if (newPhotos[index].id !== newPhotos[selected].id) {
          //console.log("they are different")
          setTimeout(() => {
            newPhotos[index].thisPhotoWasClicked = false
            newPhotos[selected].thisPhotoWasClicked = false
            setSelected(null)
            setPhotos(newPhotos)
          }, 500)
        } else {
          // console.log("they are the same")
          setSelected(null)
        }
        //options 2 - the photos have same id

      }
    }
  }
  
  useEffect(() => {
    fetchingFromServer()
  }, [reset])


  return (
    <>
      <h1 className="title">Match game</h1>
      <div className="App">
        {photos.map((photo, index) => {
          return (<div className="card" key={photo.unique} onClick={() => handleCLick(index)}>
            <img src={photo.urls.thumb} alt={photo.alt_description} className={photo.thisPhotoWasClicked ? "" : "notshow"} />
          </div>)
        })}
      </div>
      <button className="btn" onClick={() => setReset(!reset)}>Reset</button>
    </>
  );
}

export default App;
