import React from 'react';
import Container from '@material-ui/core/Container';
import './Message.scss';

export enum MessageType {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
  WARN = 'warn'
}

export interface MessageProps {
  message: { text: string, type: MessageType }
}

export default function Message({ message: { text, type } }: MessageProps) {
  if (!text) {
    return null;
  }

  return <Container className={type}>
    <p>{text}</p>
  </Container>
}