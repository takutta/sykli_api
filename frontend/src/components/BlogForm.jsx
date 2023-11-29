import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      author: blogAuthor,
      title: blogTitle,
      url: blogUrl,
    })

    // nollaus
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          onChange={({ target }) => setBlogTitle(target.value)}
          value={blogTitle}
        />
        <br />
        <label htmlFor="author">Author:</label>
        <input
          id="author"
          onChange={({ target }) => setBlogAuthor(target.value)}
          value={blogAuthor}
        />
        <br />
        <label htmlFor="url">Url:</label>
        <input
          id="url"
          onChange={({ target }) => setBlogUrl(target.value)}
          value={blogUrl}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
