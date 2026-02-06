import * as React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import './App.css';
import { useToolUsage } from './hooks/useToolUsage';
import { ToolGrid } from './components/ToolGrid';
import { ToolPlaceholderDialog } from './components/ToolPlaceholderDialog';
import { Tool } from './types/Tool';

function App() {
  const { tools, incrementUsage } = useToolUsage();
  const [activeTool, setActiveTool] = React.useState<Tool | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleOpenTool = (tool: Tool) => {
    incrementUsage(tool.id);
    setActiveTool(tool);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Testing Tools Playground
          </Typography>
          <Typography variant="body2" component="div">
            Home · Tool Modules
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ py: 4, flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Tool Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This page lists placeholder entry points for your testing tools.
              The most frequently used tools appear at the top. Replace these
              placeholders with real tools as your needs evolve.
            </Typography>
          </Box>

          <ToolGrid tools={tools} onOpenTool={handleOpenTool} />
        </Container>
      </Box>

      <ToolPlaceholderDialog
        open={dialogOpen}
        tool={activeTool}
        onClose={handleCloseDialog}
      />
    </Box>
  );
}

export default App;
