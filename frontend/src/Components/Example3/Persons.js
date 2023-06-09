import React from 'react'
import { remove } from "./service";

function Persons({people, filter, deletedName, setMessage, setType}) {

    const displayedPersons = filter 
    ? people.filter((person) => person.name.toLocaleLowerCase().includes(filter)) 
    : people;

    const handleDelete = (id) => {
        remove(id)
        .then(() => {
          deletedName(id)
        })
        .catch(error => {
          console.log('Error deleting user:', error)

          //* also it's good idea to fetch data again 
          //* so this error never happens or at least data are refreshed on error 
          
          if(people.some(person => person.id === id)){
            setMessage(`information about what the fuck is already deleted`)
            setType('error')
            setTimeout(() => {
              setMessage('')
              setType(null)
            }, 5000)
          }
        })
    }

    return (
    <div>
      {
        displayedPersons.map((person) => {
          return(
            <div key={person.id}>
              <p style={{display: 'inline'}}>{person.name} {person.number}</p><button onClick={() => {handleDelete(person.id)}}>delete</button>
            </div>
          )
      })
      }
    </div>
  )
}

export default Persons