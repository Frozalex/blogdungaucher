import { Layout, LayoutProps, Rect, Txt } from "@motion-canvas/2d";
import { theme } from "../theme";

/**
 * Lower-third style Vox : source citation au bas de l'écran.
 * Petit liseré accent gauche + texte caps tracking large.
 *
 * Usage : <Lower3rd source="Chase & Simon, 1973" detail="Cognitive Psychology 4(1)" />
 */
export interface Lower3rdProps extends LayoutProps {
  source: string;
  detail?: string;
  accent?: string;
}

export class Lower3rd extends Layout {
  public constructor(props: Lower3rdProps) {
    super({
      direction: "row",
      alignItems: "center",
      gap: 16,
      y: 460,
      ...props,
    });

    const accent = props.accent ?? theme.green;

    this.add(
      <Rect
        width={4}
        height={32}
        fill={accent}
        radius={2}
      />,
    );
    this.add(
      <Layout direction="column" gap={4} alignItems="start">
        <Txt
          text="SOURCE"
          fontFamily={theme.fontDisplay}
          fontSize={14}
          fontWeight={700}
          letterSpacing={4}
          fill={theme.textDim}
        />
        <Txt
          text={props.source}
          fontFamily={theme.fontDisplay}
          fontSize={20}
          fontWeight={600}
          fill={theme.textMain}
        />
        {props.detail && (
          <Txt
            text={props.detail}
            fontFamily={theme.fontSerif}
            fontStyle="italic"
            fontSize={18}
            fill={theme.textMuted}
          />
        )}
      </Layout>,
    );
  }
}
