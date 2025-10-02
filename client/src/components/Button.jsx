import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Buttons({text, onClick, className, disabled}) {
  return (
      <Button variant="contained" onClick={onClick} className={className} disabled={disabled}>{text}</Button>
  );
}