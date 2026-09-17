import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function ForbiddenPage() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold text-brand-700">403</p>
        <h1 className="mt-2 text-4xl font-extrabold">This workspace is not available for your role.</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">CareerLink keeps candidate and recruiter workflows separate so each experience stays focused.</p>
        <Link to="/">
          <Button className="mt-6">Go home</Button>
        </Link>
      </div>
    </main>
  );
}
