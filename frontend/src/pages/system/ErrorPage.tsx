import { Button } from '../../components/ui/Button';

export function ErrorPage() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold text-brand-700">500</p>
        <h1 className="mt-2 text-4xl font-extrabold">The workspace needs a refresh.</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">Something unexpected happened while rendering this page.</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    </main>
  );
}
