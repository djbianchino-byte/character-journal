import { useLocalSearchParams, useRouter } from 'expo-router';

import { EntityEditForm, type EntityFormValues } from '../../components/EntityEditForm';
import { PaperScreen } from '../../components/PaperScreen';
import { PaperCard } from '../../components/PaperCard';
import { campaign } from '../../data/campaign';
import { addEntity, characterDirectory, entityKindLabels, useDm, type EntityKind } from '../../data/dmStore';

function resolveKind(value: string | undefined): EntityKind {
  return value === 'character' || value === 'event' ? value : 'location';
}

export default function NewJournalEntryScreen() {
  const router = useRouter();
  const { kind: kindParam } = useLocalSearchParams<{ kind?: string }>();
  const kind = resolveKind(kindParam);
  const dm = useDm(campaign.id);
  const label = entityKindLabels[kind].toLowerCase();

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/journal' as never);
  }

  function save(values: EntityFormValues) {
    addEntity(
      campaign.id,
      {
        kind,
        title: values.title,
        subtitle: values.subtitle,
        body: values.body,
        author: 'player',
        linked: values.linked,
      },
      false,
    );
    leave();
  }

  return (
    <PaperScreen kicker="Your journal" title={`Add a ${label}`} onBack={leave}>
      <PaperCard>
        <EntityEditForm
          kind={kind}
          characters={characterDirectory(dm.entities)}
          initial={{ title: '', subtitle: '', body: '', linked: [] }}
          saveLabel={`Save ${label}`}
          onSave={save}
          onCancel={leave}
        />
      </PaperCard>
    </PaperScreen>
  );
}
