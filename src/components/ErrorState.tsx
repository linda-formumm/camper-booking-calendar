
interface ErrorStateProps {
  title?: string;
  message?: string;
}

export function ErrorState({ title = "Booking not found", message = "The booking you're looking for doesn't exist or has been removed." }: ErrorStateProps) {
  return (
      <section className="rounded-xl border border-red-200 bg-red-50/70 backdrop-blur-md p-12 text-center dark:border-red-800 dark:bg-red-900/20">
        <h2 className="text-lg text-red-600 dark:text-red-400">
          {title}
        </h2>
        <p className="mt-2 text-sm text-red-500 dark:text-red-500">
          {message}
        </p>
      </section>
  );
}
