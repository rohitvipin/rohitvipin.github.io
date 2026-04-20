import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { Profile, Social, KeyMetric } from "../../../src/types";

interface HeaderProps {
  profile: Profile;
  socials: Social[];
  showKeyMetrics: boolean;
}

function MetricsBar({ metrics }: { metrics: KeyMetric[] }) {
  const primary = metrics.filter((m) => m.tier === "primary");
  if (!primary.length) return null;
  return (
    <View style={styles.metricsRow}>
      {primary.map((m) => (
        <View key={m.label} style={styles.metricBox}>
          <Text style={styles.metricValue}>{m.value}</Text>
          <Text style={styles.metricLabel}>{m.label}</Text>
          <Text style={styles.metricDetail}>{m.detail}</Text>
        </View>
      ))}
    </View>
  );
}

const CONTACT_SOCIALS = ["LinkedIn", "GitHub"];

export function Header({ profile, socials, showKeyMetrics }: HeaderProps) {
  const relevantSocials = socials.filter((s) => CONTACT_SOCIALS.includes(s.platform));

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.title}>{profile.title}</Text>
        <Text style={styles.headline}>{profile.headline}</Text>

        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email: </Text>
            {profile.email}
          </Text>
          <Text style={styles.contactItem}>
            <Text style={styles.contactLabel}>Location: </Text>
            {profile.location}
          </Text>
          {relevantSocials.map((s) => (
            <Text key={s.platform} style={styles.contactItem}>
              <Text style={styles.contactLabel}>{s.platform}: </Text>
              {s.url}
            </Text>
          ))}
        </View>

        {profile.tags && profile.tags.length > 0 && (
          <View style={styles.tagRow}>
            {profile.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        )}
      </View>

      {showKeyMetrics && <MetricsBar metrics={profile.key_metrics} />}
    </>
  );
}
