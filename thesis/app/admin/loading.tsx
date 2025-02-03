import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  )
}