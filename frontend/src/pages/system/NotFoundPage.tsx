import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function NotFoundPage() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold text-brand-700">404</p>
        <h1 className="mt-2 text-4xl font-extrabold">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page may have moved, or the link points to a workspace you no longer need.</p>
        <Link to="/">
          <Button className="mt-6">Return to HireLink</Button>
        </Link>
      </div>
    </main>
  );
}
