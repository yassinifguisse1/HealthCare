export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-36 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p>{message}</p>
    </div>
  );
}
