import * as React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { Tool } from '../types/Tool';

export interface ToolCardProps {
  tool: Tool;
  onOpen: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpen }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Typography gutterBottom variant="h6" component="div">
            {tool.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tool.description}
          </Typography>
          <Chip
            label={`Used ${tool.usageCount} time${
              tool.usageCount === 1 ? '' : 's'
            }`}
            size="small"
            sx={{ alignSelf: 'flex-start', mt: 1 }}
            color={tool.usageCount > 0 ? 'primary' : 'default'}
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onOpen(tool)}>
          Open
        </Button>
      </CardActions>
    </Card>
  );
};

