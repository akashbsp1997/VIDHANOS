import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { opponentsRepo } from '@/db/repositories/opponentsRepo';

export function OpponentListScreen() {
  const opponents = useLiveQuery(() => opponentsRepo.list());

  return (
    <Screen>
      <div className="screen-header">
        <Link to="/opponents/new">
          <Button label="Add Opponent" />
        </Link>
      </div>
      {opponents?.length === 0 ? (
        <EmptyState title="No opponents yet" message="Add an opponent/respondent to link them to cases." />
      ) : (
        opponents?.map((opponent) => (
          <ListRow
            key={opponent.id}
            title={opponent.name}
            subtitle={opponent.phone ?? opponent.email}
            to={`/opponents/${opponent.id}/edit`}
          />
        ))
      )}
    </Screen>
  );
}
