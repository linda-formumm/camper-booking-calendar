import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import StartPage from "./pages/StartPage";
import CalendarPage from "./pages/CalendarPage";
import BookingDetailPage from "./pages/BookingDetailPage";

// Get basename for GitHub Pages deployment
const getBasename = () => {
  if (
    import.meta.env.PROD &&
    window.location.hostname === "linda-formumm.github.io"
  ) {
    return "/camper-booking-calendar";
  }
  return "/";
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: (
        <div className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            Please try refreshing the page or go back to the{" "}
            <a href="/" className="text-blue-600 hover:underline">
              homepage
            </a>
            .
          </p>
        </div>
      ),
      children: [
        {
          index: true,
          element: <StartPage />,
        },
        {
          path: "/calendar",
          element: <CalendarPage />,
        },
        {
          path: "/booking/:stationId/:bookingId",
          element: <BookingDetailPage />,
        },
      ],
    },
  ],
  {
    basename: getBasename(),
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
