import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ addLike, blog, deleteBlog, userName }) => {
  const [show, setShow] = useState(false)

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    padding: '10px',
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <span className="blog-title">{blog.title}</span> by <span className="blog-author">{blog.author}</span>
        <button
          id="show"
          onClick={() => setShow(prev => !prev)} style={{ marginLeft: '10px' }}>
          {show ? 'hide' : 'show'}
        </button>
        <div className="blog-info" style={{ display: show ? 'block' : 'none' }}>
          <span className="blog-likes">{blog.likes}</span>{' '}
          <button
            id="add-like"
            onClick={() => addLike({ ...blog, likes: blog.likes + 1 })
            }
            style={{ marginLeft: '10px' }}
          >

            add like
          </button>
          <br />
          <span className="blog-url">{blog.url}</span>
          <br />
          <span className="blog-user">{blog.user ? blog.user.name : ''}</span>
          {userName === blog.user.name ?
            <button
              id="delete"
              onClick={() => deleteBlog(blog)}
            >
              delete
            </button> : null}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  addLike: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
}
// blog, addLike, deleteBlog, userName
export default Blog
