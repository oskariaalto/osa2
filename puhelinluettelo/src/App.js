import { useState, useEffect } from 'react'
import {getAll, create, cutOut, update} from './services/persons'


const Notification = ({message,name}) =>{
  if (message === null) {
    return null
  }

  return(
    <div className={name}>
      {message}
    </div>
  )
}


const Part = ({person,deletePerson}) => {
  const confirm = (event) =>{
    event.preventDefault()
    if (window.confirm(`Delete ${person.name} ?`)) {
      deletePerson(person.id)
    }

  }

  return(
    <div>
        {person.name} {person.number}
        <button onClick={confirm}>delete</button>
    </div>
  )
}

const Persons = ({persons,deletePerson}) => {
  return(
    <div>
      {persons.map(person => <Part key = {person.id} person = {person} deletePerson={deletePerson} /> )}
    </div>
  )
}


const Filter = ({handleFilterChange}) =>{
  return(
    <form>
      filter show with<input
      onChange = {handleFilterChange}
      />
    </form>
  )
}

const PersonForm = ({newName,handleNumberChange,handlePersonChange,newNumber,addName}) =>{
  return(
    <form onSubmit={addName}>
    <div>name:<input 
    value={newName} 
    onChange={handlePersonChange} 
    /></div>
  <div>  
    number:<input
    value={newNumber}
    onChange={handleNumberChange}
    />
  </div>  
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber]=useState('')
  const [filtering, setFiltering] = useState('')
  const [message, setMessage] = useState(null)
  const [mClassName, setMClasname]=useState('notification')


  useEffect(()=>{
      getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])
  

  const addName = (event) => {
    event.preventDefault()
    const personObject ={
        name: newName,
        number: newNumber
    }
    create(personObject)
      .then(response =>{
        setPersons(persons.concat(response))

        setMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 2000)

        setNewName('')
        setNewNumber('')
      })
   
  }

  const wantToUpdate = (event)=>{
    event.preventDefault()
    const person = persons.find(p => p.name===newName)
    const updatedPerson = {...person, number: newNumber}
    if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
      update(person.id, updatedPerson)
        .then(retPersons =>{
          setPersons(persons.map(persun => persun.id!==person.id ?persun :retPersons))
          setMessage(
            `Information of ${newName} was changed successfully`
          )
          setTimeout(() => {
            setMessage(null)
          }, 2000)
        })
        .catch(error=>{
          setMClasname('error')
          setMessage(`Information of ${person.name}  has already been deleted from the server`)
          setTimeout(() => {
            setMessage(null)
          }, 2000)
          setPersons(persons.filter(p => p.id!==person.id))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = id =>{
    cutOut(id)
      .then(() =>
        {
          setPersons(persons.filter(person => person.id!==id))
          setMessage(
            `${persons.find(p => p.id===id).name} deleted`
          )
          setTimeout(() => {
            setMessage(null)
          }, 2000)
        })
    }

  const handlePersonChange = (event)=>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event)=>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event)=>{
    console.log(event.target.value)
    setFiltering(event.target.value)
  }



  const canAddName = persons.every(person => person.name!==newName)
  ?addName
  :wantToUpdate

  const filteredList =  filtering.search(/[a-z]/i) ===-1
  ? persons
  : persons.filter(person => person.name.toLowerCase().search(filtering.toLowerCase())!==-1)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} name={mClassName}/>

      <Filter handleFilterChange={handleFilterChange}/>

      <h3>Add a new</h3>

      <PersonForm 
      handleNumberChange={handleNumberChange} 
      handlePersonChange ={handlePersonChange} 
      addName = {canAddName}
      newName = {newName}
      newNumber={newNumber}
      />

      <h2>Numbers</h2>

      <Persons persons ={filteredList} deletePerson ={deletePerson}/>
    </div>
  )
}

export default App