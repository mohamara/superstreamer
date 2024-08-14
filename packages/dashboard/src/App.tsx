import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { JobsPage } from "./components/JobsPage";
import { JobPage } from "./components/JobPage";
import { ApiPage } from "./components/ApiPage";
import { ApiEmbedPage } from "./components/ApiEmbedPage";
import { Suspense } from "react";
import { RootLayout } from "./components/RootLayout";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/jobs" />,
      },
      {
        path: "/jobs",
        element: <JobsPage />,
      },
      {
        path: "/jobs/:id",
        element: <JobPage />,
      },
      {
        path: "/api",
        element: <ApiPage />,
      },
    ],
  },
  {
    path: "/embed/api",
    element: <ApiEmbedPage />,
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
