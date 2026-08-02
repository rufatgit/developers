import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectWorkspacePage from "./pages/ProjectWorkspacePage";
import ApplicationsTab from "./pages/project-workspace/ApplicationsTab";
import TasksTab from "./pages/project-workspace/TasksTab";
import ReviewsTab from "./pages/project-workspace/ReviewsTab";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectWorkspacePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="applications" replace />} />
            <Route path="applications" element={<ApplicationsTab />} />
            <Route path="tasks" element={<TasksTab />} />
            <Route path="reviews" element={<ReviewsTab />} />
          </Route>

          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
