import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core";

export default React.memo(({ isDialogOpen, onClose, onSubmit }: any) => {
  const [password, setPassword] = useState('');

  return <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Password Required</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Enter the correct password for entry.
        </DialogContentText>
      <TextField
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
      <Button color="primary" onClick={onClose}>
        Cancel
        </Button>
      <Button onClick={() => onSubmit(password)} color="primary">
        Submit
        </Button>
    </DialogActions>
  </Dialog>
});
