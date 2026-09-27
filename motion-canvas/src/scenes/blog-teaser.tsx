import { Img, Layout, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  easeInCubic,
  easeInOutCubic,
  easeInOutQuart,
  easeOutCubic,
  easeOutExpo,
  easeOutQuart,
  interpolate,
  linear,
  waitFor,
} from "@motion-canvas/core";

/**
 * Teaser cinématique du blog — 18 secondes.
 *
 * Storyboard (4 images Midjourney constructivistes) :
 *   0s  → Image 2 : œil du cavalier en gros plan, dézoom dramatique
 *   4s  → Image 3 : plan épique échiquier industriel, dolly in
 *   9s  → Image 4 : roi contre-plongée, cut sec + push in
 *   13s → Image 1 : roi aux rayons, révélation + titre blog
 *   17s → Fondu noir
 *
 * Noms des fichiers attendus dans motion-canvas/public/images/ :
 *   teaser-01-roi-rayons.jpg   (image 1 — hero shot final)
 *   teaser-02-cavalier-oeil.jpg (image 2 — ouverture)
 *   teaser-03-echiquier.jpg    (image 3 — plan épique)
 *   teaser-04-roi-board.jpg    (image 4 — contre-plongée)
 */

const FPS = 30;

// Durées en secondes → frames
const T = {
  eyeIn: 0,
  eyeHold: 1.5,
  epicIn: 4,
  epicHold: 5.5,
  kingIn: 9,
  kingHold: 10.5,
  heroIn: 13,
  titleIn: 14.5,
  ctaIn: 15.8,
  end: 18,
} as const;

const s = (seconds: number) => seconds * FPS;

export default makeScene2D(function* (view) {
  view.fill("#0a0000");

  yield* beatEye(view);
  yield* beatEpic(view);
  yield* beatKing(view);
  yield* beatHero(view);
});

// ══════════════════════════════════════════════════════════════
// BEAT 1 — L'ŒIL DU CAVALIER (0→4s)
// Gros plan choc, puis dézoom pour révéler la pièce
// ══════════════════════════════════════════════════════════════
function* beatEye(view: ReturnType<typeof makeScene2D>) {
  const imgRef = createRef<Img>();
  const overlayRef = createRef<Rect>();

  view.add(
    <Rect ref={overlayRef} width={1920} height={1080} fill="#000000" opacity={1} zIndex={10} />,
  );
  view.add(
    <Img
      ref={imgRef}
      src="/images/teaser-02-cavalier-oeil.jpg"
      width={1920}
      height={1080}
      objectFit="cover"
      // Démarrage : zoomé 2× sur le centre de l'œil
      scale={2.2}
      x={80}   // léger offset pour centrer l'œil dans le cadre
      y={-20}
    />,
  );

  // Fade in depuis le noir
  yield* overlayRef().opacity(0, 0.6, easeOutCubic);

  // Dézoom lent et inexorable (effet révélation anxiogène)
  yield* imgRef().scale(1.0, s(3.2), easeInOutQuart);

  // Flash blanc court avant la transition
  const flashRef = createRef<Rect>();
  view.add(
    <Rect ref={flashRef} width={1920} height={1080} fill="#ffffff" opacity={0} zIndex={10} />,
  );
  yield* flashRef().opacity(0.85, 0.08, linear);
  yield* flashRef().opacity(0, 0.25, easeOutCubic);

  overlayRef().remove();
  flashRef().remove();
  imgRef().remove();
}

// ══════════════════════════════════════════════════════════════
// BEAT 2 — L'ÉCHIQUIER ÉPIQUE (4→9s)
// Plan large industriel, dolly in lent vers le point de fuite
// ══════════════════════════════════════════════════════════════
function* beatEpic(view: ReturnType<typeof makeScene2D>) {
  const imgRef = createRef<Img>();
  const vignetteRef = createRef<Rect>();
  const captionRef = createRef<Txt>();

  view.add(
    <Img
      ref={imgRef}
      src="/images/teaser-03-echiquier.jpg"
      width={1920}
      height={1080}
      objectFit="cover"
      scale={1.0}
      opacity={0}
    />,
  );

  // Vignette permanente pour le dramatisme
  view.add(
    <Rect
      ref={vignetteRef}
      width={1920}
      height={1080}
      fill="radial-gradient(ellipse 60% 55% at 50% 50%, transparent 0%, rgba(0,0,0,0.75) 100%)"
      opacity={0}
      zIndex={2}
    />,
  );

  view.add(
    <Txt
      ref={captionRef}
      text="Chaque partie est une guerre."
      fontFamily='"Fraunces", Georgia, serif'
      fontStyle="italic"
      fontSize={52}
      fontWeight={500}
      fill="#f5e6c8"
      y={320}
      opacity={0}
      zIndex={3}
    />,
  );

  // Fade in + dolly in (zoom progressif vers point de fuite)
  yield* all(
    imgRef().opacity(1, 0.5, easeOutCubic),
    vignetteRef().opacity(1, 0.8, easeOutCubic),
  );
  yield* all(
    imgRef().scale(1.18, s(4.8), easeInOutCubic),
    captionRef().opacity(1, 0.6, easeOutExpo),
  );
  yield* waitFor(s(1.5));

  // Transition : fondu noir
  const cutRef = createRef<Rect>();
  view.add(<Rect ref={cutRef} width={1920} height={1080} fill="#000000" opacity={0} zIndex={10} />);
  yield* cutRef().opacity(1, 0.3, easeInCubic);

  imgRef().remove();
  vignetteRef().remove();
  captionRef().remove();
  cutRef().remove();
}

// ══════════════════════════════════════════════════════════════
// BEAT 3 — ROI CONTRE-PLONGÉE (9→13s)
// Cut sec, push in lent, texte kinétique
// ══════════════════════════════════════════════════════════════
function* beatKing(view: ReturnType<typeof makeScene2D>) {
  const imgRef = createRef<Img>();
  const line1Ref = createRef<Txt>();
  const line2Ref = createRef<Txt>();

  view.add(
    <Img
      ref={imgRef}
      src="/images/teaser-04-roi-board.jpg"
      width={1920}
      height={1080}
      objectFit="cover"
      scale={1.08}
      opacity={0}
    />,
  );

  view.add(
    <Layout direction="column" gap={12} alignItems="center" y={-260} zIndex={3}>
      <Txt
        ref={line1Ref}
        text="LE BLOG"
        fontFamily='"Space Grotesk", system-ui, sans-serif'
        fontSize={22}
        fontWeight={700}
        letterSpacing={12}
        fill="rgba(255,220,100,0.85)"
        opacity={0}
      />
      <Txt
        ref={line2Ref}
        text="qui pense les échecs autrement"
        fontFamily='"Fraunces", Georgia, serif'
        fontStyle="italic"
        fontSize={44}
        fontWeight={500}
        fill="#ffffff"
        opacity={0}
      />
    </Layout>,
  );

  yield* imgRef().opacity(1, 0.15, linear);
  yield* all(
    imgRef().scale(1.0, s(3.8), easeInOutCubic),
    line1Ref().opacity(1, 0.5, easeOutExpo),
  );
  yield* line2Ref().opacity(1, 0.6, easeOutCubic);
  yield* waitFor(s(0.8));

  // Transition douce
  const fadeRef = createRef<Rect>();
  view.add(<Rect ref={fadeRef} width={1920} height={1080} fill="#000000" opacity={0} zIndex={10} />);
  yield* fadeRef().opacity(1, 0.5, easeInOutCubic);

  imgRef().remove();
  line1Ref().remove();
  line2Ref().remove();
  fadeRef().remove();
}

// ══════════════════════════════════════════════════════════════
// BEAT 4 — LE ROI AUX RAYONS — LOGO REVEAL (13→18s)
// L'image signature, les rayons s'ouvrent, titre apparaît
// ══════════════════════════════════════════════════════════════
function* beatHero(view: ReturnType<typeof makeScene2D>) {
  const imgRef = createRef<Img>();
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();
  const urlRef = createRef<Txt>();
  const finalFadeRef = createRef<Rect>();

  view.add(
    <Img
      ref={imgRef}
      src="/images/teaser-01-roi-rayons.jpg"
      width={1920}
      height={1080}
      objectFit="cover"
      scale={1.12}
      opacity={0}
    />,
  );

  // Titre centré en bas — style propagande / affiche
  view.add(
    <Layout direction="column" gap={16} alignItems="center" y={370} zIndex={5}>
      <Txt
        ref={titleRef}
        text="BLOG D'UN GAUCHER"
        fontFamily='"Space Grotesk", system-ui, sans-serif'
        fontSize={68}
        fontWeight={700}
        letterSpacing={8}
        fill="#ffffff"
        opacity={0}
      />
      <Txt
        ref={subtitleRef}
        text="Stratégie · Psychologie · Contre-intuition"
        fontFamily='"Fraunces", Georgia, serif'
        fontStyle="italic"
        fontSize={30}
        fontWeight={400}
        fill="rgba(245,220,130,0.9)"
        opacity={0}
      />
    </Layout>,
  );

  view.add(
    <Txt
      ref={urlRef}
      text="blogdungaucher.com"
      fontFamily='"Space Grotesk", system-ui, sans-serif'
      fontSize={22}
      fontWeight={500}
      letterSpacing={3}
      fill="rgba(255,255,255,0.55)"
      y={470}
      zIndex={5}
      opacity={0}
    />,
  );

  view.add(
    <Rect ref={finalFadeRef} width={1920} height={1080} fill="#000000" opacity={0} zIndex={10} />,
  );

  // Révélation : image zoom arrière + titre monte
  yield* all(
    imgRef().opacity(1, 0.8, easeOutCubic),
    imgRef().scale(1.0, s(4.5), easeInOutQuart),
  );

  yield* titleRef().opacity(1, 0.7, easeOutExpo);
  yield* subtitleRef().opacity(1, 0.5, easeOutCubic);
  yield* waitFor(s(0.4));
  yield* urlRef().opacity(1, 0.5, easeOutCubic);

  yield* waitFor(s(1.8));

  // Fondu final vers le noir
  yield* finalFadeRef().opacity(1, 0.8, easeInOutCubic);
}
