import { Background, Controls, MiniMap, ReactFlow, ReactFlowProvider } from '@xyflow/react';

export const FlowCanvas = ({ edges, nodeTypes, nodes, onConnect, onNodeClick, onNodesChange, onPaneClick, onEdgesChange }) => (
  <div className="panel-shell grid-shell h-[680px] overflow-hidden rounded-3xl" data-testid="flow-canvas-shell">
    <ReactFlowProvider>
      <ReactFlow
        className="bg-transparent"
        data-testid="flow-canvas"
        edges={edges}
        fitView
        minZoom={0.35}
        nodeTypes={nodeTypes}
        nodes={nodes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        onPaneClick={onPaneClick}
      >
        <Background color="#27272a" gap={24} size={1} />
        <Controls className="!rounded-2xl !border !border-zinc-700 !bg-zinc-950/95 !text-zinc-200" />
        <MiniMap className="!rounded-2xl !border !border-zinc-700 !bg-zinc-950/95" maskColor="rgba(24,24,27,0.65)" />
      </ReactFlow>
    </ReactFlowProvider>
  </div>
);