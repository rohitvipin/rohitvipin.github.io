import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { Project } from "../../../src/types";

interface ProjectsProps {
  projects: Project[];
  maxItems?: number;
}

export function Projects({ projects, maxItems }: ProjectsProps) {
  const list = maxItems ? projects.slice(0, maxItems) : projects;
  if (!list.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notable Projects</Text>
      {list.map((p, i) => (
        <View key={i} style={styles.entry} wrap={false}>
          <View style={styles.entryTitleRow}>
            <Text style={styles.entryTitle}>{p.name}</Text>
            <Text style={styles.entryDuration}>{p.duration}</Text>
          </View>
          <Text style={styles.entrySubtitle}>
            {p.domain} - {p.client} - {p.role}
          </Text>
          <Text style={styles.entryDescription}>{p.description}</Text>
          {p.highlights.map((h, j) => (
            <View key={j} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>-</Text>
              <Text style={styles.bulletText}>{h}</Text>
            </View>
          ))}
          {p.tech.length > 0 && <Text style={styles.techLine}>Tech: {p.tech.join(", ")}</Text>}
        </View>
      ))}
    </View>
  );
}
