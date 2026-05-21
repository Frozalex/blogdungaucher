import { Layout, LayoutProps, Rect, Txt } from "@motion-canvas/2d";
import { theme } from "../theme";

/**
 * Repère "chapitre" style Vox : numéro 01/02/03 + label tout en haut de l'écran.
 *
 * Usage : <ChapterMark number="01" label="Le paradoxe" />
 */
export interface ChapterMarkProps extends LayoutProps {
  number: string;
  label: string;
  accent?: string;
}

export class ChapterMark extends Layout {
  public constructor(props: ChapterMarkProps) {
    super({
      direction: "row",
      alignItems: "center",
      gap: 24,
      y: -470,
      ...props,
    });

    const accent = props.accent ?? theme.green;

    this.add(
      <Txt
        text={props.number}
        fontFamily={theme.fontSerif}
        fontStyle="italic"
        fontSize={56}
        fontWeight={500}
        fill={accent}
      />,
    );
    this.add(
      <Rect width={1} height={36} fill={theme.textDim} />,
    );
    this.add(
      <Txt
        text={props.label.toUpperCase()}
        fontFamily={theme.fontDisplay}
        fontSize={22}
        fontWeight={700}
        letterSpacing={6}
        fill={theme.textMain}
      />,
    );
  }
}
