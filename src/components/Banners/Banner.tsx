'use client';

import { SectionProps } from "@/types/type";
import Section from "../Section/Section";

export default function Banner({ children, backgroundImage, styles }: SectionProps) {
  const sectionProps = {
		backgroundImage,
		styles,
	};
	return (
		<Section {...sectionProps}>
      {children}
    </Section>
	);
}
