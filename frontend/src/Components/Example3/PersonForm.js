import React, { useState } from 'react'
import { create, update } from "./service";

function PersonForm({persons, setPersons, setMessage, setType}) {
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const handleAddName = (e) => {
        e.preventDefault();

        const existingPerson = persons.find(person => person.name === newName)

        if(existingPerson){
          if(existingPerson.number !== newPhone ){

            const updatedPhone = {
              name: existingPerson.name,
              number: newPhone
            }
            update(existingPerson.id, updatedPhone)
            .then(response => {

                //* findIndex returns position in array so we can re-use it
                const personIndex = persons.findIndex(person => person.id === existingPerson.id)
                //* spread operator takes all arguments from persons and put them in array
                //! we use slice to show all persons before updated number, 
                //! then we show updated number and after we show all other persons from updated number position
                const updatedPerson = [
                    ...persons.slice(0, personIndex),
                    response,
                    ...persons.slice(personIndex + 1)
                ]
                
                setPersons(updatedPerson)
                setNewName('')
                setNewPhone('')
                setType('success')
                setMessage(`user ${response.name} added`)
                setTimeout(() => {
                  setMessage('')
                  setType(null)
                }, 5000)
            })
            .catch(error => console.log('Error updating number:', error))

          } else {

            return alert(`${newName} is already taken`)
          
            }

        } else {

          const anotherUser = {
            name: newName,
            number: newPhone
          }
          create(anotherUser)
          .then(response => {
            setPersons(persons.concat(response))
            setNewName('')
            setNewPhone('')
            setType('success')
            setMessage(`user ${response.name} added`)
            setTimeout(() => {
              setMessage('')
              setType(null)
            }, 5000)
          })
          .catch(error => console.log('Error getting users:', error))
        }

      }

  return (
    <form onSubmit={handleAddName}>
          <div>name: <input type="text" value={newName} onChange={(e) => {setNewName(e.target.value)}} /></div>
          <div>phone: <input type="text" value={newPhone} onChange={(e) => {setNewPhone(e.target.value)}} /></div>
          <div><button type="submit">add</button></div>
    </form>
  )
}

export default PersonForm