import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Button, Input, CircularProgress, Card, CardHeader, CardContent } from '@material-ui/core';

import './Login.scss';
import Message, { MessageType } from '../Message/Message';
axios.defaults.withCredentials = true;

export interface LoginProps {
  login: (username: string) => Promise<string>;
}

export default function Login({ login }: LoginProps) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState({ text: '', type: MessageType.DEFAULT });
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = useCallback(_handleLogin, [username, login, setMessage, setIsLoading]);
  const onChange = useCallback(_onChange, [setUsername]);

  function _onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUsername(e.target.value);
  }

  function _handleLogin() {
    setIsLoading(true);
    login(username)
      .then(() => { setIsLoading(false); })
      .catch(msg => {
        setIsLoading(false);
        setMessage({ text: msg, type: MessageType.ERROR });
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

  return <Container maxWidth="sm">
    <Card className="inner-login-container" raised={true}>
      <CardHeader className="header" title="Enter a name!"></CardHeader>
      <CardContent>
        <div className="input-wrapper">
          <Input className="username-input" placeholder="Username" value={username} onChange={onChange} required={true} />
          {renderButton()}
        </div>
        <Message message={message} />
      </CardContent>
    </Card>
  </Container>
}
