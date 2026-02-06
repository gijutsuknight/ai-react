import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Tool } from '../types/Tool';

export interface ToolPlaceholderDialogProps {
  open: boolean;
  tool: Tool | null;
  onClose: () => void;
}

export const ToolPlaceholderDialog: React.FC<ToolPlaceholderDialogProps> = ({
  open,
  tool,
  onClose,
}) => {
  if (!tool) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tool.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This is a placeholder entry point for <strong>{tool.name}</strong>.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2 }}>
          Replace this dialog content with the real tool UI when you are ready
          to implement it. For now, this component simply marks where the
          feature will live in your testing playground.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

