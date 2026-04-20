import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { Profile, Social, KeyMetric } from "../../../src/types";

interface HeaderProps {
  profile: Profile;
  socials: Social[];
  showKeyMetrics: boolean;
}

const CONTACT_SOCIALS = ["LinkedIn", "GitHub"];

function MetricsLine({ metrics }: { metrics: KeyMetric[] }) {
  const primary = metrics.filter((m) => m.tier === "primary");
  if (!primary.length) return null;
  const line = primary.map((m) => `${m.value} ${m.label}`).join("  |  ");
  return <Text style={styles.metricsLine}>{line}</Text>;
}

export function Header({ profile, socials, showKeyMetrics }: HeaderProps) {
  const relevantSocials = socials.filter((s) => CONTACT_SOCIALS.includes(s.platform));

  const contactParts = [
    profile.email,
    profile.location,
    ...relevantSocials.map((s) => `${s.platform}: ${s.url}`),
  ];

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.jobTitle}>{profile.title}</Text>
      <Text style={styles.headline}>{profile.headline}</Text>
      <Text style={styles.contactLine}>{contactParts.join("  |  ")}</Text>
      {profile.tags && profile.tags.length > 0 && (
        <Text style={styles.tagsLine}>Keywords: {profile.tags.join(", ")}</Text>
      )}
      {showKeyMetrics && <MetricsLine metrics={profile.key_metrics} />}
    </View>
  );
}
