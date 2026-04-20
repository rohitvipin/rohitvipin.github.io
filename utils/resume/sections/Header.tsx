import React from "react";
import { View, Text, Link } from "@react-pdf/renderer";
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

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.jobTitle}>{profile.title}</Text>
      <Text style={styles.headline}>{profile.headline}</Text>
      {showKeyMetrics && <MetricsLine metrics={profile.key_metrics} />}
      <Text style={styles.contactLine}>
        <Link src={`mailto:${profile.email}`} style={styles.linkText}>
          {profile.email}
        </Link>
        {"  |  "}
        {relevantSocials.map((s, i) => (
          <React.Fragment key={s.platform}>
            {i > 0 && "  |  "}
            <Link src={s.url} style={styles.linkText}>
              {s.url}
            </Link>
          </React.Fragment>
        ))}
      </Text>
    </View>
  );
}
