import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PaperCard } from '../../../../components/PaperCard';
import { PaperScreen } from '../../../../components/PaperScreen';
import { PinToggle } from '../../../../components/PinToggle';
import {
  entityFieldLabels,
  entityKindLabels,
  togglePin,
  updateEntity,
  useDm,
  type DmEntity,
} from '../../../../data/dmStore';
import { colors, fonts, radius } from '../../../../theme';

export default function DmEntityScreen() {
  const router = useRouter();
  const { id, eid } = useLocalSearchParams<{ id: string; eid: string }>();
  const dm = useDm(id);
  const entity = dm.entities.find(item => item.id === eid);

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  if (!entity) {
    return (
      <PaperScreen kicker="Dungeon master" title="Not found" onBack={leave}>
        <PaperCard>
          <Text style={styles.body}>This entry is no longer in the campaign.</Text>
        </PaperCard>
      </PaperScreen>
    );
  }

  return (
    <EntityDetail
      key={entity.id}
      campaignId={id}
      entity={entity}
      onTogglePin={() => togglePin(id, entity.id)}
      onBack={leave}
    />
  );
}

type DetailProps = {
  campaignId: string;
  entity: DmEntity;
  onTogglePin: () => void;
  onBack: () => void;
};

function EntityDetail({ campaignId, entity, onTogglePin, onBack }: DetailProps) {
  const labels = entityFieldLabels[entity.kind];
  const kindLabel = entityKindLabels[entity.kind];
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(entity.title);
  const [subtitle, setSubtitle] = useState(entity.subtitle);
  const [body, setBody] = useState(entity.body);
  const [facts, setFacts] = useState(entity.facts.join('\n'));

  function startEditing() {
    setTitle(entity.title);
    setSubtitle(entity.subtitle);
    setBody(entity.body);
    setFacts(entity.facts.join('\n'));
    setEditing(true);
  }

  function save() {
    if (title.trim().length === 0) {
      return;
    }
    updateEntity(campaignId, entity.id, {
      title,
      subtitle,
      body,
      facts: facts
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0),
    });
    setEditing(false);
  }

  return (
    <PaperScreen
      kicker={entity.subtitle ? `${kindLabel} · ${entity.subtitle}` : kindLabel}
      title={entity.title}
      onBack={onBack}
    >
      <View style={styles.pinRow}>
        <PinToggle pinned={entity.pinned} onToggle={onTogglePin} title={entity.title} />
      </View>

      <PaperCard
        label={kindLabel}
        title={entity.title}
        onAction={editing ? () => setEditing(false) : startEditing}
        actionLabel={editing ? `Cancel editing ${entity.title}` : `Edit ${entity.title}`}
      >
        {editing ? (
          <View style={styles.form}>
            <Text style={styles.label}>{labels.title}</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              maxLength={60}
              accessibilityLabel={labels.title}
              style={styles.input}
            />

            <Text style={styles.label}>{labels.subtitle}</Text>
            <TextInput
              value={subtitle}
              onChangeText={setSubtitle}
              maxLength={60}
              accessibilityLabel={labels.subtitle}
              style={styles.input}
            />

            <Text style={styles.label}>{labels.body}</Text>
            <TextInput
              value={body}
              onChangeText={setBody}
              multiline
              maxLength={1200}
              textAlignVertical="top"
              accessibilityLabel={labels.body}
              style={[styles.input, styles.multiline]}
            />

            <Text style={styles.label}>Additional notes · one per line</Text>
            <TextInput
              value={facts}
              onChangeText={setFacts}
              multiline
              maxLength={1200}
              textAlignVertical="top"
              accessibilityLabel="Additional notes"
              style={[styles.input, styles.multiline]}
            />

            <View style={styles.formActions}>
              <Pressable
                onPress={() => setEditing(false)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={save}
                accessibilityRole="button"
                accessibilityLabel="Save changes"
                style={({ pressed }) => [styles.save, pressed && styles.pressed]}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            {entity.body
              ? entity.body.split('\n\n').map((paragraph, index) => (
                  <Text key={index} style={[styles.body, index > 0 && styles.paragraphGap]}>
                    {paragraph}
                  </Text>
                ))
              : <Text style={styles.empty}>No details written yet. Tap the quill to add some.</Text>}
          </View>
        )}
      </PaperCard>

      {!editing && entity.facts.length > 0 ? (
        <PaperCard label="Additional notes" style={styles.gap}>
          {entity.facts.map((fact, index) => (
            <View key={fact} style={[styles.factRow, index === entity.facts.length - 1 && styles.factRowLast]}>
              <Text style={styles.bullet}>◆</Text>
              <Text style={styles.fact}>{fact}</Text>
            </View>
          ))}
        </PaperCard>
      ) : null}
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  pinRow: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  paragraphGap: {
    marginTop: 8,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
  gap: {
    marginTop: 11,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  factRowLast: {
    borderBottomWidth: 0,
  },
  bullet: {
    fontSize: 6,
    color: colors.goldDark,
    marginTop: 6,
  },
  fact: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  form: {
    gap: 4,
  },
  label: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.ink,
    backgroundColor: 'rgba(255, 252, 246, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 3,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  multiline: {
    minHeight: 100,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  cancel: {
    paddingVertical: 6,
  },
  cancelText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.muted,
  },
  save: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.green,
  },
  saveText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.goldLight,
  },
  pressed: {
    opacity: 0.7,
  },
});
