import { Link } from 'react-router';

interface ListRowProps {
  title: string;
  subtitle?: string;
  meta?: string;
  to: string;
}

export function ListRow({ title, subtitle, meta, to }: ListRowProps) {
  return (
    <Link to={to} className="list-row">
      <div>
        <div className="list-row-title">{title}</div>
        {subtitle ? <div className="list-row-subtitle">{subtitle}</div> : null}
      </div>
      {meta ? <div className="list-row-meta">{meta}</div> : null}
    </Link>
  );
}
