import { Route, Routes } from 'react-router-dom';
import { AppToaster } from './components/ui/sonner';
import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<WorkspacePage />} path="/workspace" />
      </Routes>
      <AppToaster />
    </>
  );
}
