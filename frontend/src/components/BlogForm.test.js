import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  userEvent.setup()
  const createBlog = jest.fn()

  beforeEach(() => {
    container = render(<BlogForm createBlog={createBlog} />).container
  })

  test('blah', async () => {
    const user = userEvent.setup()
    const title = container.querySelector('#title')
    const author = container.querySelector('#author')
    const url = container.querySelector('#url')
    const sendButton = screen.getByText('save')
    const blog = {
      author: 'Kalle Helmi',
      title: 'Piirakkakirja',
      url: 'nettisivu',
    }
    await user.type(title, blog.title)
    await user.type(author, blog.author)
    await user.type(url, blog.url)
    await userEvent.click(sendButton)

    expect(createBlog).toHaveBeenCalledWith(blog)
  })
})