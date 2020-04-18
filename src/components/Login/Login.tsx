import React, { useState, useCallback, useContext } from 'react';
import { Container, Button, Input, CircularProgress, Card, CardHeader, CardContent, FormControl, InputLabel, FormHelperText } from '@material-ui/core';

import { UserContext } from '../../Contexts/UserProvider';
import './Login.scss';

function LoginProviders({ onProviderSelect }: any) {
  return <div className="login-providers-content">
    <Button onClick={() => onProviderSelect('anonymous')}>Play Anonymously</Button>
    <Button onClick={() => onProviderSelect('google')}>Sign in with Google</Button>
  </div>
}

export default React.memo(() => {

  const { login, user, signup, authUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const handleLogin = useCallback(_handleLogin, [username, login, setIsLoading]);
  const onChange = useCallback(_onChange, [handleLogin]);

  function _onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUsername(e.target.value);
  }

  function onKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.charCode === 13) {
      handleLogin();
    }
  }

  function _handleLogin() {
    setIsLoading(true);
    login(username)
      .then(() => {
        setIsLoading(false);
      })
      .catch((msg: string) => {
        setIsLoading(false);
        setMessage(msg);
      });
  }

  function renderButton() {
    if (!isLoading) {
      return <Button variant="contained" color="primary" disabled={!username.length} onClick={handleLogin}>
        Login
      </Button>;
    }
    return <CircularProgress />;
  }

  function onProviderSelected(provider: string) {
    signup(provider);
  }

  function renderCardContent() {
    if (!user && !authUser) {
      return <LoginProviders onProviderSelect={onProviderSelected} />
    }

    if (authUser && !authUser.isAnonymous && !user) {
      return <div className="input-wrapper">
        <FormControl className="username-input" required={true} error={!!message?.length}>
          <InputLabel htmlFor="target">Username</InputLabel>
          <Input onKeyPress={onKeyPress} autoFocus={true} id="target" aria-describedby="username-helper" value={username} onChange={onChange} />
          <FormHelperText id="username-helper">Enter a unique name</FormHelperText>
        </FormControl>
        {renderButton()}
      </div>;
    }
  }

  if (user && user.isAnonymous) {
    return null;
  }

  return <>
    <Container maxWidth="md" className="login-wrapper">
      <Card className="inner-login-container" raised={true}>
        <CardHeader className="header" title="Let's Play!"></CardHeader>
        <CardContent>
          {renderCardContent()}
        </CardContent>
      </Card>
    </Container>
  </>
});
