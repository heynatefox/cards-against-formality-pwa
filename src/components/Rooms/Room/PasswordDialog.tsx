import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core";

export default React.memo(({ isDialogOpen, onClose, onSubmit }: any) => {
  const [password, setPassword] = useState('');

  function onKeyPress(e: any) {
    if (e.charCode === 13) {
      onSubmit(password);
    }
  }

  return <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="form-dialog-title" onKeyPress={onKeyPress}>
    <DialogTitle id="form-dialog-title">Private Room</DialogTitle>
    <DialogContent>
      <DialogContentText>
        The host has protected this game with a super secret password
        </DialogContentText>
      <TextField
        color="secondary"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoFocus
        margin="dense"
        id="password"
        label="Password"
        type="password"
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={onClose}>
        Cancel
        </Button>
      <Button onClick={() => onSubmit(password)} color="secondary" disabled={!password?.length}>
        Submit
        </Button>
    </DialogActions>
  </Dialog>
});
