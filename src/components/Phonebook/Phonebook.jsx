import React from 'react';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import {
  StyledPhonebookContainer,
  StyledPhonebookTitle,
  StyledTitleContact,
} from 'components/Phonebook/Phonebook.styled';

import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';
import Message from './Message/Message';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

const emptyContactsList = [];

export default function Phonebook() {

  const [contacts, setContacts] = useState(() => {
    const contactList = JSON.parse(localStorage.getItem('contacts'));
    return contactList ?? emptyContactsList
  })

  const [filter, setFilter] = useState('');

  const length = contacts.length;


  useEffect(() => {
    
    return  localStorage.setItem('contacts', JSON.stringify(contacts));
    
  }, [contacts]);

  const isDuplicate = ({ name, number }) => {
    const result = contacts.find(
      item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.number.toLowerCase() === number.toLowerCase()
    );
    return result;
  };

  const addContacts = contact => {
    if (isDuplicate(contact)) {
      return alert(`${contact.name} is already in contacts`);
    }
    setContacts(prev => {
      const newContact = {
        id: nanoid(),
        ...contact,
      };
      return [...prev, newContact];
    });
  };

  const deliteContact = id => {
     setContacts(contacts.filter(item => item.id !== id))
  };
  
  const changeFilter = e => {
    setFilter({ filter: e.currentTarget.value });
  };

  const getfiltredContacts = () => {
    if (!filter) {
      return contacts;
    }

    const normalizetFilter = filter.toLowerCase();
    const filteredContact = contacts.filter(({ name }) => {
      const normalizedContact = name.toLowerCase();
      const result = normalizedContact.includes(normalizetFilter);
      return result;
    });
    return filteredContact;
  }

  const filterContacts = getfiltredContacts();
 

  return (
    <StyledPhonebookContainer>
        <StyledPhonebookTitle> Phonebook</StyledPhonebookTitle>
        <ErrorBoundary>
          <ContactForm onSubmit={addContacts} />
        </ErrorBoundary>
        <StyledTitleContact>Contacts</StyledTitleContact>
        <ErrorBoundary>
          <Filter filter={filter} changeFilter={changeFilter} />
          {length > 0 ? (
            <ContactList items={filterContacts} deliteContact={deliteContact} />
          ) : (
            <Message text="Contact list is empty" />
          )}
        </ErrorBoundary>
      </StyledPhonebookContainer>
  )
}
