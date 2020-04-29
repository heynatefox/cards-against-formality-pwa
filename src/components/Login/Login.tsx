import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Link, Container, Button, Input, CircularProgress, Card, CardHeader, CardContent, FormControl, InputLabel, FormHelperText, Typography } from '@material-ui/core';
import { debounce } from 'lodash';
import FacebookIcon from '@material-ui/icons/Facebook';
import { UserContext } from '../../Contexts/UserProvider';
import googleLogo from './Google__G__Logo.svg';
import './Login.scss';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import { RouterContext } from '../../Contexts/RouteProvider';

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
    <Button className="button" onClick={() => onProviderSelect('facebook')} variant="contained" color="primary">
      <FacebookIcon className="google-icon-svg" />
      <div>Continue with Facebook</div>
    </Button>
    <FormHelperText >By Proceeding, you are agreeing to our terms of service and that you have read our privacy policy found <Link color="secondary" onClick={() => window.open('https://htmlpreview.github.io/?https://github.com/JordanPawlett/cards-against-formality-pwa/blob/master/public/privacy_policy.html')}>here</Link>.</FormHelperText>
  </div>
}

export default React.memo(() => {

  const { history } = useContext(RouterContext);
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


  useEffect(() => {
    // user that is logged in, is trying to go to the login page.
    if (user && authUser) {
      history.push('/rooms');
    }
  }, [user, authUser, history])

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
