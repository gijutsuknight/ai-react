import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Tool } from '../types/Tool';
import { ToolCard } from './ToolCard';

export interface ToolGridProps {
  tools: Tool[];
  onOpenTool: (tool: Tool) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onOpenTool }) => (
  <Grid container spacing={3} columns={12}>
    {tools.map((tool) => (
      <Grid
        key={tool.id}
        size={{ xs: 12, sm: 6, md: 4 }}
      >
        <ToolCard tool={tool} onOpen={onOpenTool} />
      </Grid>
    ))}
  </Grid>
);

