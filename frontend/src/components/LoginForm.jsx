import PropTypes from 'prop-types'

const LoginForm = ({
  handlePasswordChange,
  handleSubmit,
  handleUsernameChange,
  password,
  username,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            onChange={handleUsernameChange}
            value={username}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            onChange={handlePasswordChange}
            type="password"
            value={password}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handlePasswordChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

export default LoginForm
