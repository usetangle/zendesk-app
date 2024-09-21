/// <reference types="vite-plugin-svgr/client" />
import React, { useState, FormEvent, useEffect } from 'react'
import { Field, MediaInput } from '@zendeskgarden/react-forms'
import SearchIcon from '@zendeskgarden/svg-icons/src/12/search-stroke.svg?react'

interface SearchProps {
  initialSearch: string
  onSubmit: (searchTerm: string) => void
  style?: React.CSSProperties
}

const Search: React.FC<SearchProps> = ({ initialSearch, onSubmit, style }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch)

  useEffect(() => {
    setSearchTerm(initialSearch)
  }, [initialSearch])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(searchTerm)
  }
  return (
    <form onSubmit={handleSubmit} style={style}>
      <Field>
        <MediaInput
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          start={<SearchIcon />}
          focusInset
        />
      </Field>
    </form>
  )
}

export default Search
