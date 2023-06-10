import React, { useEffect, useState } from "react";
import { getAll } from "./service";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Notification from "./Notification";

function ExampleThree() {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState('');
  const [type, setType] = useState(null);

  useEffect(() => {
    getAll()
    .then(response => setPersons(response))
    .catch(error => console.log('Error getting users:', error))
  }, []);

  const handleFilterChange = (filter) => {
    setFilter(filter.toLowerCase());
  };

  const handleDeletedName = (id) => {
    const updatedPersons = persons.filter(person => person.id !== id);
    setPersons(updatedPersons)
  }

  return (
    <div>
		<h2>Songbook</h2>
		<Filter filter={filter} setFilter={handleFilterChange} />
		<h2>Add Names</h2>
		<PersonForm persons={persons} setPersons={setPersons} setMessage={setMessage} setType={setType} />
    <Notification type={type} message={message} />
		<h2>Names</h2>
		<Persons people={persons} filter={filter} deletedName={handleDeletedName} setMessage={setMessage} setType={setType} />
    </div>
  );
}

export default ExampleThree;
