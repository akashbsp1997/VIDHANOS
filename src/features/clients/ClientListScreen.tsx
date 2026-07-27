import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { clientsRepo } from '@/db/repositories/clientsRepo';

export function ClientListScreen() {
  const clients = useLiveQuery(() => clientsRepo.list());

  return (
    <Screen>
      <div className="screen-header">
        <Link to="/clients/new">
          <Button label="Add Client" />
        </Link>
      </div>
      {clients?.length === 0 ? (
        <EmptyState title="No clients yet" message="Add your first client to get started." />
      ) : (
        clients?.map((client) => (
          <ListRow
            key={client.id}
            title={client.name}
            subtitle={client.phone ?? client.email}
            to={`/clients/${client.id}/edit`}
          />
        ))
      )}
    </Screen>
  );
}
