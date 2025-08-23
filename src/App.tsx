import "./styles/tailwind.css";
import QueryProvider from "./providers/QueryProvider";
import AppRouter from "./AppRouter";

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
// Test comment
