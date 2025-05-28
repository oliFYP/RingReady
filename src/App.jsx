import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loading from "./components/ui/Loading";
import PrivateRoute from "./components/auth/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";

// Lazy-loaded components with error handling

const Events = lazy(() =>
  import("./pages/Events").catch(() => {
    console.error("Failed to load Events component");
    return { default: () => <div>Error loading page</div> };
  })
);

const EventDetails = lazy(() =>
  import("./pages/EventDetails").catch(() => {
    console.error("Failed to load EventDetails component");
    return { default: () => <div>Error loading page</div> };
  })
);

const CreateEvent = lazy(() =>
  import("./pages/CreateEvent").catch(() => {
    console.error("Failed to load CreateEvent component");
    return { default: () => <div>Error loading page</div> };
  })
);

const Profile = lazy(() =>
  import("./pages/Profile").catch(() => {
    console.error("Failed to load Profile component");
    return { default: () => <div>Error loading page</div> };
  })
);

const Login = lazy(() =>
  import("./pages/Login").catch(() => {
    console.error("Failed to load Login component");
    return { default: () => <div>Error loading page</div> };
  })
);

const Register = lazy(() =>
  import("./pages/Register").catch(() => {
    console.error("Failed to load Register component");
    return { default: () => <div>Error loading page</div> };
  })
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard").catch(() => {
    console.error("Failed to load Dashboard component");
    return { default: () => <div>Error loading page</div> };
  })
);

const NotFound = lazy(() =>
  import("./pages/NotFound").catch(() => {
    console.error("Failed to load NotFound component");
    return { default: () => <div>Error loading page</div> };
  })
);

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/create-event"
              element={
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
