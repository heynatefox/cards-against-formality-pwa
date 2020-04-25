import React, { useState, useCallback, useContext } from 'react';
import { Container, Button, Input, CircularProgress, Card, CardHeader, CardContent, FormControl, InputLabel, FormHelperText, Typography } from '@material-ui/core';
import { debounce } from 'lodash';

import { UserContext } from '../../Contexts/UserProvider';
import googleLogo from './Google__G__Logo.svg';
import './Login.scss';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';

function LoginProviders({ onProviderSelect }: any) {
  return <div className="login-providers-content">
    <Button className="button" onClick={() => onProviderSelect('anonymous')} variant="contained" color="secondary">Play Anonymously</Button>
    <Typography>
      Or Sign in to choose a username!
    </Typography>
    <Button className="button bottom" onClick={() => onProviderSelect('google')} variant="contained" color="primary">
      <img className="google-icon-svg" src={googleLogo} alt="google" />
      <div>Sign in with Google</div>
    </Button>
  </div>
}

export default React.memo(() => {

  const { login, user, signup, authUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [, , , check] = useFetchData<any>(`/api/check/username`, FetchType.POST);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const handleLogin = useCallback(_handleLogin, [username, login]);
  const checkUsername = useCallback(
    debounce((username: string) => {
      if (!username?.length) {
        return;
      }
      check({ username })
        .then(() => setMessage(''))
        .catch(err => setMessage(err.response.data.message))
    }, 100),
    []);

  const onKeyPress = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode === 13 && !message?.length) {
      handleLogin();
    }
  }, [message, handleLogin]);

  const onChange = useCallback((e: any) => {
    setUsername(e.target.value);
    checkUsername(e.target.value);
  }, [checkUsername]);

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
      return <Button
        variant="contained"
        color="primary"
        disabled={!username.length || !!message?.length}
        onClick={handleLogin}
      >
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
          <FormHelperText id="username-helper">{!!message?.length ? message : 'Enter a unique name'}</FormHelperText>
        </FormControl>
        {renderButton()}
      </div>;
    }
  }

  if (user && user.isAnonymous) {
    return null;
  }

  return <Container maxWidth="lg" className="login-wrapper">
    <Card className="inner-login-container" raised={true}>
      <CardHeader className="header" title="Let's Play!"></CardHeader>
      <CardContent>
        {renderCardContent()}
      </CardContent>
    </Card>
  </Container>;
});
