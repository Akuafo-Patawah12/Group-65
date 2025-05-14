// SessionExpiredDialog.tsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

type Props = {
  open: boolean;
  onReload: () => void;
};

const SessionExpiredDialog: React.FC<Props> = ({ open, onReload }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>Your session has expired. Please log in again.</DialogContent>
      <DialogActions>
        <Button onClick={onReload} color="primary" variant="contained">
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
