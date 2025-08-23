import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import CalendarPage from "./pages/CalendarPage";
import BookingDetailPage from "./pages/BookingDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CalendarPage />,
      },
      {
        path: "/booking/:id",
        element: <BookingDetailPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
