import '@testing-library/jest-dom'
import {
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const mockHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      author: 'Kalle Helmi',
      likes: '20',
      title: 'Piirakkakirja',
      url: 'nettisivu',
      user: {
        name: 'Pekka',
      },
    }

    container = render(
      <Blog
        addLike={mockHandler}
        blog={blog}
        deleteBlog={() =>
          console.log('juu')
        }
        userName={'Pekka'}
      ></Blog>,
    ).container
  })

  test('renders title but not info', () => {
    const title =
      container.querySelector(
        '.blog-title',
      )
    expect(title).toHaveTextContent(
      'Piirakkakirja',
    )

    const info =
      container.querySelector(
        '.blog-info',
      )
    expect(info).toHaveStyle(
      'display: none',
    )
  })

  test('after clicking the button, blog info is displayed', async () => {
    const user = userEvent.setup()
    const button =
      screen.getByText('show')
    await user.click(button)
    const info =
      container.querySelector(
        '.blog-info',
      )
    expect(info).not.toHaveStyle(
      'display: none',
    )

    const url = container.querySelector(
      '.blog-url',
    )
    expect(url).toHaveTextContent(
      'nettisivu',
    )
    const likes =
      container.querySelector(
        '.blog-likes',
      )
    expect(likes).toHaveTextContent(
      '20',
    )
    const username =
      container.querySelector(
        '.blog-user',
      )
    expect(username).toHaveTextContent(
      'Pekka',
    )
  })

  test('after clicking like button twice, handler is called twice', async () => {
    // const user = userEvent.setup()
    // const button = screen.getByText('show')
    // await user.click(button)

    const likeUser = userEvent.setup()
    const likeButton =
      screen.getByText('add like')
    await likeUser.click(likeButton)
    await likeUser.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
