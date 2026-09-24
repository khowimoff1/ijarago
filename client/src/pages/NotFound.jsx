import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-gradient-dark text-9xl font-extrabold">404</p>
        <h1 className="mt-4 text-2xl font-bold">Sahifa topilmadi</h1>
        <Link to="/" className="btn-primary mt-6">Bosh sahifaga</Link>
      </div>
    </div>
  );
}
