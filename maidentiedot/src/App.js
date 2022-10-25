import { useState, useEffect } from 'react'
import axios from 'axios'

const PrintData = ({data,show}) => {
  const handleClick=(event)=>{
    event.preventDefault()
    show(data)
  }
  return(
  <div>
    {data}
    <button onClick={handleClick} >show</button>
  </div>
  )
  }


const PrintCountry = ({country}) =>{
  const flag = country.flags.png
  const capital = country.capital[0]
  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
  const [post, setPost] = useState(undefined)
  const canRead = post!==undefined
  ?post
  :'moi'

  useEffect(()=>{
    axios.get(weatherUrl).then(res =>{setPost(res.data)})
  },[])
  console.log(canRead)
  if(post !== undefined){
    console.log('jee')
    return(
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {capital}</div>
        <div>area {country.area}</div>
        <h3>languages:</h3>
        {Object.values(country.languages).map( (lang,i) => <li key={i}>{lang}</li>)}
        <p>
          <img id='flag' src={flag} alt="country flag"></img>
        </p>
        <h2>Weather in {country.capital[0]} </h2>
        <p>temperature {canRead.main.temp} Celcius</p>
        <img id='weather' src={`http://openweathermap.org/img/wn/${canRead.weather[0].icon}@2x.png`} alt="weather icon"></img>
        <p>wind {canRead.wind.speed} m/s</p>
      </div>
      )
  }
  
}

const Find = ({handleSearch}) =>{
  return(
    <form>
    find countries<input 
    onChange={handleSearch}
    />
  </form>

  )
}

const Countries = ({countries, show, weather}) =>{
  const countriesList = countries.map(country => country.name.common).length
  
  const whatToPrint = countriesList===1
  ?countries.map((country,i) => <PrintCountry key={i} country={country} weather={weather} />)
  :countries.map((country,i) => <PrintData key={i} data={country.name.common} show={show}/>)
  const printText = countriesList>10
    ? 'Too many matches, specify another filter'
    :whatToPrint
  
  console.log(countriesList)
  return(
    <div>
      {printText}
    </div>
  )
}


const App = () =>{
  const[searching, setSearching] = useState('')
  const[countries, setCountries] = useState([])
  
  const hook = () =>{
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then( response =>{
        console.log('done')
        setCountries(response.data)
      })
  }

  useEffect(hook,[])
  
  const filteredList = searching.search(/[a-z]/i) ===-1
  ?countries
  :countries.filter(country => country.name.common.toLowerCase().search(searching.toLowerCase())!==-1)

  const handleSearchChange = (event) =>{
    console.log(event.target.value)
    setSearching(event.target.value)
  }

  const showData = name =>{
    setSearching(name)
  }

  return(
    <div>
      <Find handleSearch={handleSearchChange}/>
      <Countries countries={filteredList} show={showData}  />
    </div>
  )

}

export default App;
