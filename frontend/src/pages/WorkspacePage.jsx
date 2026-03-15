import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FlowCanvas } from '../components/editor/FlowCanvas';
import { InspectorPanel } from '../components/editor/InspectorPanel';
import { NodePalette } from '../components/editor/NodePalette';
import { RunConsole } from '../components/editor/RunConsole';
import { StatusStrip } from '../components/editor/StatusStrip';
import { Toolbar } from '../components/editor/Toolbar';
import { BaseModelNode } from '../components/nodes/BaseModelNode';
import { ClassicalModelNode } from '../components/nodes/ClassicalModelNode';
import { DatasetNode } from '../components/nodes/DatasetNode';
import { OutputNode } from '../components/nodes/OutputNode';
import { TrainingNode } from '../components/nodes/TrainingNode';
import { buildWebSocketUrl, exportCode, fetchNodeCatalog, runGraph, validateGraph } from '../lib/api';
import { buildNode, fallbackGroups, sampleGraph, serializeGraph } from '../lib/nodeCatalog';

const timestamp = () => new Date().toLocaleTimeString();

export default function WorkspacePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(sampleGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sampleGraph.edges);
  const [catalogGroups, setCatalogGroups] = useState(fallbackGroups);
  const [selectedNodeId, setSelectedNodeId] = useState(sampleGraph.nodes[1]?.id ?? null);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [runMode, setRunMode] = useState('idle');
  const [running, setRunning] = useState(false);
  const [exportedCode, setExportedCode] = useState('');
  const clientId = useMemo(() => crypto.randomUUID(), []);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
  const nodeTypes = useMemo(
    () => ({
      dataset: DatasetNode,
      model: BaseModelNode,
      training: TrainingNode,
      classical: ClassicalModelNode,
      output: OutputNode,
    }),
    [],
  );

  const appendLog = useCallback((message) => {
    setLogs((current) => [...current.slice(-29), { message, timestamp: timestamp() }]);
  }, []);

  useEffect(() => {
    fetchNodeCatalog()
      .then((payload) => {
        if (payload.groups?.length) {
          setCatalogGroups(payload.groups);
        }
      })
      .catch(() => appendLog('Backend catalog unavailable, using local node registry.'));
  }, [appendLog]);

  useEffect(() => {
    const socket = new WebSocket(buildWebSocketUrl(clientId));

    socket.onopen = () => appendLog('WebSocket connected.');
    socket.onclose = () => appendLog('WebSocket disconnected.');
    socket.onerror = () => appendLog('WebSocket error.');
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === 'log') {
          appendLog(payload.message);
        }

        if (payload.type === 'metric') {
          setMetrics((current) => {
            const next = current.filter((metric) => metric.label !== payload.label);
            return [...next, { context: payload.context, label: payload.label, value: payload.value }].slice(-6);
          });
        }

        if (payload.type === 'run_status') {
          setRunMode(payload.status);
          if (payload.status === 'completed' || payload.status === 'failed') {
            setRunning(false);
          }
        }
      } catch (error) {
        appendLog(`Socket parse error: ${error.message}`);
      }
    };

    return () => socket.close();
  }, [appendLog, clientId]);

  const graphPayload = useCallback(
    () => ({
      client_id: clientId,
      ...serializeGraph(nodes, edges),
    }),
    [clientId, edges, nodes],
  );

  const handleAddNode = useCallback(
    (templateId) => {
      const position = {
        x: 140 + (nodes.length % 4) * 280,
        y: 120 + Math.floor(nodes.length / 4) * 190,
      };
      const nextNode = buildNode(templateId, position);
      setNodes((current) => [...current, nextNode]);
      setSelectedNodeId(nextNode.id);
      toast.success(`${nextNode.data.label} added to graph.`);
    },
    [nodes.length, setNodes],
  );

  const handleParamChange = useCallback((nodeId, key, value) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                params: {
                  ...node.data.params,
                  [key]: value,
                },
              },
            }
          : node,
      ),
    );
  }, [setNodes]);

  const handleValidate = useCallback(async () => {
    try {
      const payload = await validateGraph(graphPayload());
      appendLog(`Validated ${payload.execution_order.length} steps.`);
      toast.success(`Execution order: ${payload.execution_order.map((node) => node.label).join(' → ')}`);
    } catch (error) {
      toast.error(error.message);
      appendLog(`Validation failed: ${error.message}`);
    }
  }, [appendLog, graphPayload]);

  const handleExportCode = useCallback(async () => {
    try {
      const payload = await exportCode(graphPayload());
      setExportedCode(payload.script);
      appendLog('Readable Python export generated.');
      toast.success('Python export generated.');
    } catch (error) {
      toast.error(error.message);
      appendLog(`Code export failed: ${error.message}`);
    }
  }, [appendLog, graphPayload]);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setRunMode('queued');
    setMetrics([]);
    appendLog('Submitting graph to execution engine.');

    try {
      const payload = await runGraph(graphPayload());
      setRunMode(payload.mode);
      setExportedCode(payload.script);
      toast.success(`Run started in ${payload.mode} mode.`);
      appendLog(`Run mode: ${payload.mode}.`);
    } catch (error) {
      setRunning(false);
      setRunMode('failed');
      toast.error(error.message);
      appendLog(`Run failed: ${error.message}`);
    }
  }, [appendLog, graphPayload]);

  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(graphPayload(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'policyflow-graph.json';
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Graph JSON downloaded.');
  }, [graphPayload]);

  const handleReset = useCallback(() => {
    setNodes(sampleGraph.nodes);
    setEdges(sampleGraph.edges);
    setSelectedNodeId(sampleGraph.nodes[1]?.id ?? null);
    setLogs([]);
    setMetrics([]);
    setExportedCode('');
    setRunMode('idle');
    setRunning(false);
    toast.success('Demo graph restored.');
  }, [setEdges, setNodes]);

  const handleConnect = useCallback(
    (connection) =>
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: '#60a5fa', strokeWidth: 2 },
          },
          current,
        ),
      ),
    [setEdges],
  );

  return (
    <main className="min-h-screen bg-transparent px-4 py-4 text-zinc-50 sm:px-6 lg:px-8" data-testid="workspace-page">
      <div className="mx-auto flex w-full max-w-[1860px] flex-col gap-4">
        <Toolbar
          onDownloadJson={handleDownloadJson}
          onExportCode={handleExportCode}
          onReset={handleReset}
          onRun={handleRun}
          onValidate={handleValidate}
          running={running}
        />

        <StatusStrip edgeCount={edges.length} nodeCount={nodes.length} selectedName={selectedNode?.data.label} />

        <section className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_360px]" data-testid="workspace-main-grid">
          <NodePalette groups={catalogGroups} onAddNode={handleAddNode} />

          <FlowCanvas
            edges={edges}
            nodeTypes={nodeTypes}
            nodes={nodes}
            onConnect={handleConnect}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onNodesChange={onNodesChange}
            onPaneClick={() => setSelectedNodeId(null)}
          />

          <InspectorPanel exportedCode={exportedCode} onParamChange={handleParamChange} selectedNode={selectedNode} />
        </section>

        <RunConsole logs={logs} metrics={metrics} runMode={runMode} />
      </div>
    </main>
  );
}