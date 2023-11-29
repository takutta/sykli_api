import { useEffect, useRef, useState } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    user &&
      blogService.getAll().then((blogs) => {
        setBlogs(blogs.sort((b, a) => a.likes - b.likes))
      })
  }, [user, blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        password,
        username,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage(['wrong credentials', 'error'])
      setTimeout(() => {
        setMessage([])
      }, 5000)
    }
  }

  const handleLogout = async () => {
    try {
      await loginService.logout()
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    } catch (exception) {
      setMessage(['logging out error', 'error'])
      setTimeout(() => {
        setMessage([])
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))

      setMessage([
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        'info',
      ])
      setTimeout(() => {
        setMessage([])
      }, 5000)
    } catch (error) {
      setMessage(['Error creating the blog', 'error'])
      setTimeout(() => {
        setMessage([])
      }, 5000)
    }
  }

  const modifyBlog = async (id, blogObject) => {
    try {
      blogService.update(id, blogObject)
      setBlogs((prevBlogs) => {
        return prevBlogs.map((blogi) =>
          blogi.id === id ? { ...blogi, ...blogObject } : blogi,
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id, blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      try {
        blogService.deleteItem(id)
        setBlogs((prevBlogs) => {
          return prevBlogs.filter((blogi) => (blogi.id === id ? '' : blogi))
        })
        setMessage(['blog deleted', 'info'])
        setTimeout(() => {
          setMessage([])
        }, 5000)
      } catch (error) {
        setMessage(['Error deleting the blog', 'error'])
        setTimeout(() => {
          setMessage([])
        }, 5000)
      }
    }
  }

  const blogList = () => {
    return (
      <>
        {blogs.map((blog) => (
          <Blog
            addLike={(blogObject) => modifyBlog(blog.id, blogObject)}
            blog={blog}
            deleteBlog={(blogObject) => deleteBlog(blog.id, blogObject)}
            key={blog.id}
            userName={user.name}
          />
        ))}
      </>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message[0]} type={message[1]} />
      {!user && <LoginForm
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        password={password}
        username={username}
      />
      }
      {user && (
        <div>
          <p>{user.name} logged in</p>

          <button
            onClick={() => {
              handleLogout(user)
            }}
          >
            logout
          </button>
          <h3>New blog</h3>
          {blogForm()}
          {blogs.length > 0 ? (
            <div>
              <h3>List of blogs</h3>
              {blogList()}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default App
