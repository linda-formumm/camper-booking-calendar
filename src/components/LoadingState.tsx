interface LoadingStateProps {}

export function LoadingState({}: LoadingStateProps) {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm dark:bg-gray-800/70 dark:border-gray-600/40 p-12" role="status" aria-label="Loading booking details">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Loading booking details
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please wait while we fetch your booking information...
        </p>
    </section>
  );
}
