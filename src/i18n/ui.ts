/**
 * All user-facing copy, keyed by locale. Brand names (DJ Zwackery, House of
 * Fun) and genre names (happy hardcore, UK hardcore) are kept as-is across
 * languages. Text wrapped in [[double brackets]] is rendered with the neon
 * highlight; translators can place the highlight on whichever word fits the
 * target language's word order.
 */

export const defaultLang = "en";

/**
 * Locales in the order they appear in the language switcher.
 */
export const languages = {
  en: "English",
  ja: "日本語",
  de: "Deutsch",
  nl: "Nederlands",
  fr: "Français",
  it: "Italiano",
} as const;

export type Lang = keyof typeof languages;

/**
 * Live-mode LED marquee words, kept separate from `ui` because each value is
 * an array, not a single string. The "LIVE NOW" beat isn't listed here: it's
 * built from `status.live` in Marquee.astro so the two never drift apart.
 */
export const marqueeLive: Record<Lang, readonly string[]> = {
  en: ["WE'RE LIVE ON TWITCH", "GET IN HERE", "HANDS IN THE AIR"],
  ja: ["Twitchで配信中", "集まれ", "両手を上げろ"],
  de: ["WIR SIND LIVE AUF TWITCH", "KOMM REIN", "HÄNDE IN DIE LUFT"],
  nl: ["WE ZIJN LIVE OP TWITCH", "KOM ERBIJ", "HANDEN IN DE LUCHT"],
  fr: ["ON EST EN LIVE SUR TWITCH", "REJOINS-NOUS", "MAINS EN L'AIR"],
  it: ["SIAMO LIVE SU TWITCH", "ENTRA SUBITO", "MANI IN ARIA"],
};

/**
 * BCP-47 tags for the html lang attribute and og:locale.
 */
export const localeTags: Record<Lang, string> = {
  en: "en",
  ja: "ja",
  de: "de",
  nl: "nl",
  fr: "fr",
  it: "it",
};

export const ui = {
  en: {
    "meta.role": "Hardcore DJ",
    "meta.description":
      "DJ Zwackery is a hardcore DJ from Melbourne, Australia. Watch the latest House of Fun sets, catch the Twitch stream live, and follow along.",

    "hero.kicker": "House of Fun · Hardcore",
    "hero.tagline":
      "Hardcore DJ from Melbourne. New House of Fun sets every week, live on Twitch.",
    "hero.followTwitch": "Follow on Twitch",
    "hero.subscribeYoutube": "Subscribe on YouTube",
    "hero.watchSets": "Watch the latest sets",
    "hero.photo1Alt": "DJ Zwackery with hands in the air above the crowd",
    "hero.photo2Alt": "DJ Zwackery on the decks bathed in hot magenta light",
    "hero.photo3Alt":
      "DJ Zwackery mixing in front of the giant ZWACKERY LED wall",
    "hero.photo4Alt": "DJ Zwackery mixing in front of a wall of flames",
    "hero.fanAriaLabel": "Photos of DJ Zwackery playing live",

    "vote.kicker": "Australian Hardstyle Awards",
    "vote.heading": "Nominated for [[Best Rising Talent]] in Happy Hardcore.",
    "vote.cta": "Vote now",

    "status.offline": "Offline",
    "status.live": "Live now",

    "live.heading": "We're [[LIVE]] — get in here!",
    "live.streamAriaLabel": "Live Twitch stream",

    "about.heading": "Who's [[Zwackery]]?",
    "about.bio1":
      "DJ Zwackery is a hardcore DJ out of Melbourne, Australia, bringing the House of Fun to dancefloors and living rooms alike: 150-plus BPM of euphoric, hands-in-the-air rave.",
    "about.bio2":
      "New sets land on YouTube every week, and the party spills onto Twitch whenever he goes live. Pro DJ, pro lad.",
    "about.location": "Melbourne, AU",
    "about.twitchPartner": "Twitch Partner",
    "about.verifiedPartner": "Verified Partner",

    "gigs.heading": "Catch him in the [[flesh]]",
    "gigs.details": "Details",
    "gigs.onSale": "On sale soon",

    "videos.heading": "Latest from the [[House of Fun]]",
    "videos.empty":
      "No sets loaded yet. The feed refreshes soon, so catch him live on Twitch in the meantime.",
    "videos.play": "Play",
    "videos.views": "{count} views",
    "videos.new": "New",

    "contact.kicker": "Get in touch",
    "contact.heading": "Drop Zwackery [[a line]]",
    "contact.blurb":
      "Bookings, collabs, guestlist, or just to say a set went off. Whatever it is, it lands straight in the inbox and gets a reply.",
    "contact.orEmail": "Or email",
    "contact.name": "Your name",
    "contact.namePlaceholder": "Who's this?",
    "contact.email": "Email",
    "contact.reasonLabel": "What's it about?",
    "contact.reason1": "Booking / gig",
    "contact.reason2": "Collab or remix",
    "contact.reason3": "Guestlist",
    "contact.reason4": "Just saying hi",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Say what you need to say.",
    "contact.send": "Send message",
    "contact.sending": "Sending…",
    "contact.sent": "Sent! Zwackery will be in touch. 🙌",
    "contact.failed": "Couldn't send. Email {email} instead.",
    "contact.note":
      "Heads up: add your Web3Forms access key in src/config.ts to receive these.",

    "footer.tip": "Tip the DJ",
    "footer.disclaimer":
      "Our CDN logs your IP for security. Contact form and embedded YouTube/Twitch content share data with their providers — nothing's sold or ad-tracked.",
    "footer.siteBy": "Site by {name}",
    "footer.press": "Press kit",

    "press.meta.title": "Press kit",
    "press.meta.description":
      "Logos, photos, brand colours and emotes for anyone booking, writing up, or putting DJ Zwackery on a flyer. Take what you need.",
    "press.kicker": "For promoters & press",
    "press.heading": "Everything for the [[flyer]]",
    "press.intro":
      "Logos, photos, colours and emotes, all in one place. Grab what you need for a poster, a lineup, or a write-up.",
    "press.logos.heading": "Logo",
    "press.logos.intro":
      "Two versions of the wordmark: one for dark backgrounds, one for light. Flip the switch to preview both.",
    "press.logos.toggleDark": "Blackout",
    "press.logos.toggleLight": "Houselights",
    "press.logos.onDarkLabel": "For dark backgrounds",
    "press.logos.onDarkHint":
      "White on club-black. The default everywhere on this site.",
    "press.logos.onLightLabel": "For light backgrounds",
    "press.logos.onLightHint":
      "Black and magenta. The inverse, built for white or light stock.",
    "press.logos.wideLabel": "Wide lockup",
    "press.logos.wideHint":
      "For wide-format layouts only: banners, letterheads, wide flyers. Use the logo above for everything else.",
    "press.logos.downloadSvg": "SVG",
    "press.logos.downloadPng": "PNG",
    "press.colours.heading": "Brand colours",
    "press.colours.intro":
      "Straight off the site. Click a swatch to copy its hex code.",
    "press.colours.copy": "Copy",
    "press.colours.copied": "Copied",
    "press.photos.heading": "Photos",
    "press.photos.intro":
      "High-res shots, ready for a write-up, a lineup graphic, or a story post.",
    "press.photos.photo5Alt":
      "DJ Zwackery throwing horns in front of the huge ZWACKERY LED wall",
    "press.photos.download": "Download",
    "press.mascot.heading": "Mascot",
    "press.mascot.intro":
      "The Zwackery mascot, front and back. Good for stickers, overlays, or a lineup card.",
    "press.mascot.front": "Facing forward",
    "press.mascot.back": "Facing away",
    "press.mascot.frontAlt": "DJ Zwackery mascot, facing forward",
    "press.mascot.backAlt": "DJ Zwackery mascot, facing away",
    "press.emotes.heading": "Emotes",
    "press.emotes.intro":
      "The channel's Twitch emotes, self-hosted and ready to drop into Discord, a chat overlay, or a sticker sheet.",
    "press.emotes.empty":
      "No emotes cached yet. Check back after the next deploy.",
    "press.bio.heading": "The one-liner",
    "press.bio.short":
      "DJ Zwackery is a hardcore DJ from Melbourne, streaming House of Fun live on Twitch every week.",
    "press.bio.long":
      "DJ Zwackery is a hardcore DJ from Melbourne, Australia, running House of Fun: weekly happy hardcore and UK hardcore sets streamed live on Twitch, with a fresh set uploaded to YouTube every week.",

    "a11y.newTab": "(opens in new tab)",
    "a11y.language": "Language",
    "a11y.skipToSets": "Skip to sets",
    "a11y.videoPlayer": "Video player",
    "a11y.closeVideo": "Close video",
    "a11y.close": "CLOSE",
    "a11y.pressToggleGroup": "Logo preview background",
    "a11y.copyHex": "Copy hex code {hex}",
    "a11y.backHome": "Back to home",

    "notFound.error": "Error 404",
    "notFound.heading": "Lost in [[the rave]]",
    "notFound.blurb":
      "This page took a wrong turn on the way to the smoke machine. Let's get you back to the decks.",
    "notFound.back": "Back to the House of Fun",
    "notFound.stream": "Catch the stream",
    "toast.notFound":
      "That page cannot be found. Let's take you back to the House of Fun.",
  },

  ja: {
    "meta.role": "ハードコアDJ",
    "meta.description":
      "DJ Zwackeryはオーストラリア・メルボルン出身のハードコアDJ。最新のHouse of Funセットを視聴し、Twitchのライブ配信をチェックしてフォローしよう。",

    "hero.kicker": "House of Fun · Hardcore",
    "hero.tagline":
      "メルボルン発のハードコアDJ。House of Funの新セットを毎週、Twitchでライブ配信。",
    "hero.followTwitch": "Twitchでフォロー",
    "hero.subscribeYoutube": "YouTubeでチャンネル登録",
    "hero.watchSets": "最新のセットを観る",
    "hero.photo1Alt": "群衆の上で両手を挙げるDJ Zwackery",
    "hero.photo2Alt": "鮮やかなマゼンタの光に包まれてデッキに立つDJ Zwackery",
    "hero.photo3Alt": "巨大なZWACKERY LEDウォールの前でプレイするDJ Zwackery",
    "hero.photo4Alt": "炎の壁の前でプレイするDJ Zwackery",
    "hero.fanAriaLabel": "ライブ中のDJ Zwackeryの写真",

    "vote.kicker": "Australian Hardstyle Awards",
    "vote.heading":
      "Happy Hardcore部門で [[Best Rising Talent]] にノミネート。",
    "vote.cta": "今すぐ投票",

    "status.offline": "オフライン",
    "status.live": "配信中",

    "live.heading": "ただいま [[LIVE]] 配信中 — 集まれ！",
    "live.streamAriaLabel": "Twitchライブ配信",

    "about.heading": "[[Zwackery]] ってどんな人？",
    "about.bio1":
      "DJ Zwackeryはオーストラリア・メルボルン出身のハードコアDJ。クラブのフロアからお茶の間まで、House of Funをお届け。150BPM超の多幸感あふれる、両手を上げて楽しむレイブサウンド。",
    "about.bio2":
      "新しいセットは毎週YouTubeで公開。ライブのときはTwitchでパーティーがそのまま生中継。Pro DJ, pro相棒。",
    "about.location": "メルボルン（AU）",
    "about.twitchPartner": "Twitchパートナー",
    "about.verifiedPartner": "認証済みパートナー",

    "gigs.heading": "生で [[会おう]]",
    "gigs.details": "詳細",
    "gigs.onSale": "近日発売",

    "videos.heading": "[[House of Fun]] の最新セット",
    "videos.empty":
      "まだセットが読み込まれていません。フィードは間もなく更新されます。それまではTwitchのライブをチェック。",
    "videos.play": "再生",
    "videos.views": "{count} 回視聴",
    "videos.new": "新着",

    "contact.kicker": "お問い合わせ",
    "contact.heading": "Zwackery に [[メッセージ]] を送ろう",
    "contact.blurb":
      "ブッキング、コラボ、ゲストリスト、あるいは「あのセット最高だった」の一言でも。どんな内容でも直接受信箱に届き、必ず返信します。",
    "contact.orEmail": "またはメール：",
    "contact.name": "お名前",
    "contact.namePlaceholder": "お名前は？",
    "contact.email": "メールアドレス",
    "contact.reasonLabel": "どんな話？",
    "contact.reason1": "ブッキング／ギグ",
    "contact.reason2": "コラボ／リミックス",
    "contact.reason3": "ゲストリスト",
    "contact.reason4": "あいさつだけ",
    "contact.message": "メッセージ",
    "contact.messagePlaceholder": "言いたいこと、書いてね。",
    "contact.send": "送信",
    "contact.sending": "送信中…",
    "contact.sent": "送信しました！Zwackeryから連絡します。🙌",
    "contact.failed": "送信できませんでした。{email} までメールしてください。",
    "contact.note":
      "メモ：受信するには src/config.ts に Web3Forms のアクセスキーを設定してください。",

    "footer.tip": "DJに投げ銭",
    "footer.disclaimer":
      "本サイトのCDNはセキュリティのためIPアドレスを記録します。お問い合わせフォームや埋め込みYouTube・Twitchはそれぞれの提供元とデータを共有しますが、販売や広告トラッキングは行いません。",
    "footer.siteBy": "{name} 制作",
    "footer.press": "プレスキット",

    "press.meta.title": "プレスキット",
    "press.meta.description":
      "DJ Zwackeryのブッキング、記事執筆、フライヤー制作に使えるロゴ、写真、ブランドカラー、エモートをまとめました。必要なものを自由にお使いください。",
    "press.kicker": "プロモーター・メディア向け",
    "press.heading": "[[フライヤー]] に必要なものすべて",
    "press.intro":
      "ロゴ、写真、カラー、エモートをひとまとめに。ポスターやラインナップ、記事づくりに必要なものをここから。",
    "press.logos.heading": "ロゴ",
    "press.logos.intro":
      "ワードマークは2種類：ダーク背景用とライト背景用。スイッチを切り替えて両方プレビューできます。",
    "press.logos.toggleDark": "ブラックアウト",
    "press.logos.toggleLight": "ハウスライト",
    "press.logos.onDarkLabel": "ダーク背景用",
    "press.logos.onDarkHint": "クラブブラックに白。このサイトのデフォルト。",
    "press.logos.onLightLabel": "ライト背景用",
    "press.logos.onLightHint": "黒地にマゼンタ。白や明るい紙向けの反転版。",
    "press.logos.wideLabel": "ワイドロゴ",
    "press.logos.wideHint":
      "横長フライヤーやバナー、レターヘッド専用。それ以外の場面では上のロゴを使ってください。",
    "press.logos.downloadSvg": "SVG",
    "press.logos.downloadPng": "PNG",
    "press.colours.heading": "ブランドカラー",
    "press.colours.intro":
      "サイトそのままのカラー。スウォッチをクリックでHEXコードをコピー。",
    "press.colours.copy": "コピー",
    "press.colours.copied": "コピーしました",
    "press.photos.heading": "写真",
    "press.photos.intro":
      "記事やラインナップ画像、ストーリー投稿に使える高解像度の写真。",
    "press.photos.photo5Alt":
      "巨大なZWACKERY LEDウォールの前でホーンサインを掲げるDJ Zwackery",
    "press.photos.download": "ダウンロード",
    "press.mascot.heading": "マスコット",
    "press.mascot.intro":
      "Zwackeryのマスコットを前面・背面の両方で。ステッカーやオーバーレイ、ラインナップカードに。",
    "press.mascot.front": "正面",
    "press.mascot.back": "背面",
    "press.mascot.frontAlt": "DJ Zwackeryのマスコット（正面）",
    "press.mascot.backAlt": "DJ Zwackeryのマスコット（背面）",
    "press.emotes.heading": "エモート",
    "press.emotes.intro":
      "チャンネルのTwitchエモートを自前でホスティング。Discordやチャットオーバーレイ、ステッカーシートにそのまま使えます。",
    "press.emotes.empty":
      "現在キャッシュされているエモートはありません。次回のデプロイ後にご確認ください。",
    "press.bio.heading": "ひとこと紹介",
    "press.bio.short":
      "DJ Zwackeryはメルボルン発のハードコアDJ。House of Funを毎週Twitchでライブ配信中。",
    "press.bio.long":
      "DJ Zwackeryはオーストラリア・メルボルン出身のハードコアDJで、House of Funを主宰。ハッピーハードコアとUKハードコアのセットを毎週Twitchでライブ配信し、新しいセットを毎週YouTubeに公開している。",

    "a11y.newTab": "（新しいタブで開きます）",
    "a11y.language": "言語",
    "a11y.skipToSets": "セット一覧へスキップ",
    "a11y.videoPlayer": "動画プレーヤー",
    "a11y.closeVideo": "動画を閉じる",
    "a11y.close": "閉じる",
    "a11y.pressToggleGroup": "ロゴプレビューの背景",
    "a11y.copyHex": "HEXコード {hex} をコピー",
    "a11y.backHome": "ホームに戻る",

    "notFound.error": "エラー 404",
    "notFound.heading": "レイブで [[迷子]]",
    "notFound.blurb":
      "このページはスモークマシンへ向かう途中で道に迷いました。デッキに戻ろう。",
    "notFound.back": "House of Funに戻る",
    "notFound.stream": "配信を観る",
    "toast.notFound": "そのページは見つかりません。House of Funに戻ろう。",
  },

  de: {
    "meta.role": "Hardcore-DJ",
    "meta.description":
      "DJ Zwackery ist ein Hardcore-DJ aus Melbourne, Australien. Sieh dir die neuesten House-of-Fun-Sets an, verfolge den Twitch-Livestream und bleib dran.",

    "hero.kicker": "House of Fun · Hardcore",
    "hero.tagline":
      "Hardcore-DJ aus Melbourne. Jede Woche neue House-of-Fun-Sets, live auf Twitch.",
    "hero.followTwitch": "Auf Twitch folgen",
    "hero.subscribeYoutube": "Auf YouTube abonnieren",
    "hero.watchSets": "Neueste Sets ansehen",
    "hero.photo1Alt": "DJ Zwackery mit erhobenen Händen über der Menge",
    "hero.photo2Alt":
      "DJ Zwackery an den Decks, getaucht in intensives Magentalicht",
    "hero.photo3Alt":
      "DJ Zwackery beim Mixen vor der riesigen ZWACKERY-LED-Wand",
    "hero.photo4Alt": "DJ Zwackery beim Mixen vor einer Feuerwand",
    "hero.fanAriaLabel": "Fotos von DJ Zwackery bei einem Live-Auftritt",

    "vote.kicker": "Australian Hardstyle Awards",
    "vote.heading": "Für [[Best Rising Talent]] in Happy Hardcore nominiert.",
    "vote.cta": "Jetzt abstimmen",

    "status.offline": "Offline",
    "status.live": "Jetzt live",

    "live.heading": "Wir sind [[LIVE]] — komm rein!",
    "live.streamAriaLabel": "Twitch-Livestream",

    "about.heading": "Wer ist [[Zwackery]]?",
    "about.bio1":
      "DJ Zwackery ist ein Hardcore-DJ aus Melbourne, Australien, und bringt das House of Fun auf Tanzflächen und ins Wohnzimmer gleichermaßen: über 150 BPM euphorischer Rave mit erhobenen Händen.",
    "about.bio2":
      "Jede Woche gibt es neue Sets auf YouTube, und sobald er live geht, schwappt die Party auf Twitch über. Pro DJ, pro Kumpel.",
    "about.location": "Melbourne, AU",
    "about.twitchPartner": "Twitch-Partner",
    "about.verifiedPartner": "Verifizierter Partner",

    "gigs.heading": "Erlebe ihn [[hautnah]]",
    "gigs.details": "Details",
    "gigs.onSale": "Bald erhältlich",

    "videos.heading": "Neues aus dem [[House of Fun]]",
    "videos.empty":
      "Noch keine Sets geladen. Der Feed wird bald aktualisiert – schau ihm solange live auf Twitch zu.",
    "videos.play": "Abspielen",
    "videos.views": "{count} Aufrufe",
    "videos.new": "Neu",

    "contact.kicker": "Kontakt",
    "contact.heading": "Schreib Zwackery [[eine Nachricht]]",
    "contact.blurb":
      "Buchungen, Collabs, Gästeliste oder einfach nur, um zu sagen, dass ein Set richtig abging. Was auch immer es ist – es landet direkt im Postfach und bekommt eine Antwort.",
    "contact.orEmail": "Oder per E-Mail",
    "contact.name": "Dein Name",
    "contact.namePlaceholder": "Wer bist du?",
    "contact.email": "E-Mail",
    "contact.reasonLabel": "Worum geht's?",
    "contact.reason1": "Booking / Gig",
    "contact.reason2": "Collab oder Remix",
    "contact.reason3": "Gästeliste",
    "contact.reason4": "Einfach Hallo sagen",
    "contact.message": "Nachricht",
    "contact.messagePlaceholder": "Sag, was du sagen willst.",
    "contact.send": "Nachricht senden",
    "contact.sending": "Wird gesendet…",
    "contact.sent": "Gesendet! Zwackery meldet sich. 🙌",
    "contact.failed":
      "Konnte nicht gesendet werden. Schreib stattdessen an {email}.",
    "contact.note":
      "Hinweis: Trage deinen Web3Forms-Zugangsschlüssel in src/config.ts ein, um diese zu erhalten.",

    "footer.tip": "Trinkgeld für den DJ",
    "footer.disclaimer":
      "Unser CDN protokolliert deine IP-Adresse aus Sicherheitsgründen. Kontaktformular und eingebettete YouTube-/Twitch-Inhalte teilen Daten mit ihren Anbietern — nichts wird verkauft oder für Werbung getrackt.",
    "footer.siteBy": "Website von {name}",
    "footer.press": "Presse-Kit",

    "press.meta.title": "Presse-Kit",
    "press.meta.description":
      "Logos, Fotos, Markenfarben und Emotes für alle, die DJ Zwackery buchen, über ihn schreiben oder ihn aufs Flyer setzen. Nimm dir, was du brauchst.",
    "press.kicker": "Für Veranstalter & Presse",
    "press.heading": "Alles für den [[Flyer]]",
    "press.intro":
      "Logos, Fotos, Farben und Emotes an einem Ort. Hol dir, was du für ein Poster, ein Lineup oder einen Artikel brauchst.",
    "press.logos.heading": "Logo",
    "press.logos.intro":
      "Zwei Versionen des Schriftzugs: eine für dunkle, eine für helle Hintergründe. Kipp den Schalter, um beide zu sehen.",
    "press.logos.toggleDark": "Blackout",
    "press.logos.toggleLight": "Houselight",
    "press.logos.onDarkLabel": "Für dunkle Hintergründe",
    "press.logos.onDarkHint":
      "Weiß auf Club-Schwarz. Der Standard auf dieser Seite.",
    "press.logos.onLightLabel": "Für helle Hintergründe",
    "press.logos.onLightHint":
      "Schwarz und Magenta. Die Umkehrung, gemacht für weißes oder helles Papier.",
    "press.logos.wideLabel": "Breite Version",
    "press.logos.wideHint":
      "Nur für breite Formate: Banner, Briefköpfe, breite Flyer. Für alles andere das Logo oben verwenden.",
    "press.logos.downloadSvg": "SVG",
    "press.logos.downloadPng": "PNG",
    "press.colours.heading": "Markenfarben",
    "press.colours.intro":
      "Direkt von der Website. Klick auf eine Farbe, um den Hex-Code zu kopieren.",
    "press.colours.copy": "Kopieren",
    "press.colours.copied": "Kopiert",
    "press.photos.heading": "Fotos",
    "press.photos.intro":
      "Fotos in hoher Auflösung, bereit für Artikel, Lineup-Grafiken oder Story-Posts.",
    "press.photos.photo5Alt":
      "DJ Zwackery mit Metal-Horns-Geste vor der riesigen ZWACKERY-LED-Wand",
    "press.photos.download": "Herunterladen",
    "press.mascot.heading": "Maskottchen",
    "press.mascot.intro":
      "Das Zwackery-Maskottchen, von vorne und von hinten. Perfekt für Sticker, Overlays oder eine Lineup-Karte.",
    "press.mascot.front": "Vorderansicht",
    "press.mascot.back": "Rückansicht",
    "press.mascot.frontAlt": "DJ-Zwackery-Maskottchen, Vorderansicht",
    "press.mascot.backAlt": "DJ-Zwackery-Maskottchen, Rückansicht",
    "press.emotes.heading": "Emotes",
    "press.emotes.intro":
      "Die Twitch-Emotes des Kanals, selbst gehostet und bereit für Discord, ein Chat-Overlay oder einen Stickerbogen.",
    "press.emotes.empty":
      "Aktuell sind keine Emotes im Cache. Schau nach dem nächsten Deploy noch mal vorbei.",
    "press.bio.heading": "Der Einzeiler",
    "press.bio.short":
      "DJ Zwackery ist ein Hardcore-DJ aus Melbourne und streamt House of Fun jede Woche live auf Twitch.",
    "press.bio.long":
      "DJ Zwackery ist ein Hardcore-DJ aus Melbourne, Australien, und betreibt House of Fun: wöchentliche Happy-Hardcore- und UK-Hardcore-Sets live auf Twitch, dazu jede Woche ein frisches Set auf YouTube.",

    "a11y.newTab": "(öffnet in neuem Tab)",
    "a11y.language": "Sprache",
    "a11y.skipToSets": "Zu den Sets springen",
    "a11y.videoPlayer": "Videoplayer",
    "a11y.closeVideo": "Video schließen",
    "a11y.close": "SCHLIESSEN",
    "a11y.pressToggleGroup": "Hintergrund der Logo-Vorschau",
    "a11y.copyHex": "Hex-Code {hex} kopieren",
    "a11y.backHome": "Zurück zur Startseite",

    "notFound.error": "Fehler 404",
    "notFound.heading": "Verloren im [[Rave]]",
    "notFound.blurb":
      "Diese Seite hat auf dem Weg zur Nebelmaschine falsch abgebogen. Zurück an die Decks.",
    "notFound.back": "Zurück ins House of Fun",
    "notFound.stream": "Zum Stream",
    "toast.notFound":
      "Diese Seite wurde nicht gefunden. Zurück ins House of Fun.",
  },

  nl: {
    "meta.role": "Hardcore-dj",
    "meta.description":
      "DJ Zwackery is een hardcore-dj uit Melbourne, Australië. Bekijk de nieuwste House of Fun-sets, volg de Twitch-livestream en blijf op de hoogte.",

    "hero.kicker": "House of Fun · Hardcore",
    "hero.tagline":
      "Hardcore-dj uit Melbourne. Elke week nieuwe House of Fun-sets, live op Twitch.",
    "hero.followTwitch": "Volgen op Twitch",
    "hero.subscribeYoutube": "Abonneren op YouTube",
    "hero.watchSets": "Bekijk de nieuwste sets",
    "hero.photo1Alt": "DJ Zwackery met de handen in de lucht boven de menigte",
    "hero.photo2Alt":
      "DJ Zwackery achter de decks, gehuld in fel magenta licht",
    "hero.photo3Alt": "DJ Zwackery mixt voor de gigantische ZWACKERY LED-muur",
    "hero.photo4Alt": "DJ Zwackery mixt voor een muur van vlammen",
    "hero.fanAriaLabel": "Foto's van DJ Zwackery tijdens een liveoptreden",

    "vote.kicker": "Australian Hardstyle Awards",
    "vote.heading":
      "Genomineerd voor [[Best Rising Talent]] in Happy Hardcore.",
    "vote.cta": "Nu stemmen",

    "status.offline": "Offline",
    "status.live": "Nu live",

    "live.heading": "We zijn [[LIVE]] — kom erbij",
    "live.streamAriaLabel": "Live Twitch-stream",

    "about.heading": "Wie is [[Zwackery]]?",
    "about.bio1":
      "DJ Zwackery is een hardcore-dj uit Melbourne, Australië, die het House of Fun naar zowel de dansvloer als de huiskamer brengt: 150-plus BPM aan euforische, handen-in-de-lucht rave.",
    "about.bio2":
      "Elke week verschijnen er nieuwe sets op YouTube, en zodra hij live gaat stroomt het feest door op Twitch. Pro DJ, pro maat.",
    "about.location": "Melbourne, AU",
    "about.twitchPartner": "Twitch-partner",
    "about.verifiedPartner": "Geverifieerde partner",

    "gigs.heading": "Zie hem in het [[echt]]",
    "gigs.details": "Details",
    "gigs.onSale": "Binnenkort te koop",

    "videos.heading": "Nieuwste uit het [[House of Fun]]",
    "videos.empty":
      "Nog geen sets geladen. De feed wordt binnenkort ververst; bekijk hem ondertussen live op Twitch.",
    "videos.play": "Afspelen",
    "videos.views": "{count} weergaven",
    "videos.new": "Nieuw",

    "contact.kicker": "Contact",
    "contact.heading": "Stuur Zwackery [[een bericht]]",
    "contact.blurb":
      "Boekingen, collabs, gastenlijst, of gewoon om te zeggen dat een set knalde. Wat het ook is, het komt rechtstreeks in de inbox en krijgt antwoord.",
    "contact.orEmail": "Of e-mail",
    "contact.name": "Je naam",
    "contact.namePlaceholder": "Wie ben je?",
    "contact.email": "E-mail",
    "contact.reasonLabel": "Waar gaat het over?",
    "contact.reason1": "Boeking / gig",
    "contact.reason2": "Collab of remix",
    "contact.reason3": "Gastenlijst",
    "contact.reason4": "Even hallo zeggen",
    "contact.message": "Bericht",
    "contact.messagePlaceholder": "Zeg wat je kwijt wilt.",
    "contact.send": "Bericht verzenden",
    "contact.sending": "Verzenden…",
    "contact.sent": "Verzonden! Zwackery neemt contact op. 🙌",
    "contact.failed": "Verzenden mislukt. Mail in plaats daarvan naar {email}.",
    "contact.note":
      "Let op: voeg je Web3Forms-toegangssleutel toe in src/config.ts om deze te ontvangen.",

    "footer.tip": "Fooi voor de DJ",
    "footer.disclaimer":
      "Onze CDN legt je IP-adres vast voor beveiliging. Contactformulier en ingesloten YouTube-/Twitch-content delen gegevens met hun providers — niets wordt verkocht of voor advertenties getrackt.",
    "footer.siteBy": "Site door {name}",
    "footer.press": "Perskit",

    "press.meta.title": "Perskit",
    "press.meta.description":
      "Logo's, foto's, merkkleuren en emotes voor iedereen die DJ Zwackery boekt, erover schrijft of op een flyer zet. Neem wat je nodig hebt.",
    "press.kicker": "Voor promotors & pers",
    "press.heading": "Alles voor de [[flyer]]",
    "press.intro":
      "Logo's, foto's, kleuren en emotes, allemaal op één plek. Pak wat je nodig hebt voor een poster, een line-up of een artikel.",
    "press.logos.heading": "Logo",
    "press.logos.intro":
      "Twee versies van het wordmark: één voor donkere achtergronden, één voor lichte. Zet de schakelaar om en bekijk ze allebei.",
    "press.logos.toggleDark": "Blackout",
    "press.logos.toggleLight": "Zaallicht",
    "press.logos.onDarkLabel": "Voor donkere achtergronden",
    "press.logos.onDarkHint": "Wit op club-zwart. De standaard op deze site.",
    "press.logos.onLightLabel": "Voor lichte achtergronden",
    "press.logos.onLightHint":
      "Zwart en magenta. De inverse versie, gemaakt voor wit of licht papier.",
    "press.logos.wideLabel": "Brede versie",
    "press.logos.wideHint":
      "Alleen voor brede formaten: banners, briefhoofden, brede flyers. Gebruik voor al het andere het logo hierboven.",
    "press.logos.downloadSvg": "SVG",
    "press.logos.downloadPng": "PNG",
    "press.colours.heading": "Merkkleuren",
    "press.colours.intro":
      "Rechtstreeks van de site. Klik op een kleur om de hexcode te kopiëren.",
    "press.colours.copy": "Kopiëren",
    "press.colours.copied": "Gekopieerd",
    "press.photos.heading": "Foto's",
    "press.photos.intro":
      "Foto's in hoge resolutie, klaar voor een artikel, een line-upafbeelding of een storypost.",
    "press.photos.photo5Alt":
      "DJ Zwackery met het 'horns'-handgebaar voor de gigantische ZWACKERY LED-muur",
    "press.photos.download": "Downloaden",
    "press.mascot.heading": "Mascotte",
    "press.mascot.intro":
      "De Zwackery-mascotte, van voren en van achteren. Ideaal voor stickers, overlays of een line-upkaart.",
    "press.mascot.front": "Vooraanzicht",
    "press.mascot.back": "Achteraanzicht",
    "press.mascot.frontAlt": "DJ Zwackery-mascotte, vooraanzicht",
    "press.mascot.backAlt": "DJ Zwackery-mascotte, achteraanzicht",
    "press.emotes.heading": "Emotes",
    "press.emotes.intro":
      "De Twitch-emotes van het kanaal, zelf gehost en klaar om te gebruiken in Discord, een chatoverlay of een stickervel.",
    "press.emotes.empty":
      "Er zijn nog geen emotes gecachet. Kom terug na de volgende deploy.",
    "press.bio.heading": "De one-liner",
    "press.bio.short":
      "DJ Zwackery is een hardcore-dj uit Melbourne en streamt House of Fun elke week live op Twitch.",
    "press.bio.long":
      "DJ Zwackery is een hardcore-dj uit Melbourne, Australië, en runt House of Fun: wekelijkse happy hardcore- en UK hardcore-sets live op Twitch, met elke week een nieuwe set op YouTube.",

    "a11y.newTab": "(opent in nieuw tabblad)",
    "a11y.language": "Taal",
    "a11y.skipToSets": "Naar sets springen",
    "a11y.videoPlayer": "Videospeler",
    "a11y.closeVideo": "Video sluiten",
    "a11y.close": "SLUITEN",
    "a11y.pressToggleGroup": "Achtergrond van de logopreview",
    "a11y.copyHex": "Hexcode {hex} kopiëren",
    "a11y.backHome": "Terug naar home",

    "notFound.error": "Fout 404",
    "notFound.heading": "Verdwaald in de [[rave]]",
    "notFound.blurb":
      "Deze pagina sloeg verkeerd af op weg naar de rookmachine. Terug naar de decks.",
    "notFound.back": "Terug naar het House of Fun",
    "notFound.stream": "Bekijk de stream",
    "toast.notFound":
      "Die pagina bestaat niet. We brengen je terug naar het House of Fun.",
  },

  fr: {
    "meta.role": "DJ Hardcore",
    "meta.description":
      "DJ Zwackery est un DJ hardcore de Melbourne, en Australie. Regarde les derniers sets House of Fun, suis le live Twitch et reste connecté.",

    "hero.kicker": "House of Fun · Hardcore",
    "hero.tagline":
      "DJ hardcore de Melbourne. De nouveaux sets House of Fun chaque semaine, en live sur Twitch.",
    "hero.followTwitch": "Suivre sur Twitch",
    "hero.subscribeYoutube": "S'abonner sur YouTube",
    "hero.watchSets": "Voir les derniers sets",
    "hero.photo1Alt": "DJ Zwackery les mains en l'air au-dessus de la foule",
    "hero.photo2Alt":
      "DJ Zwackery aux platines, baigné d'une lumière magenta intense",
    "hero.photo3Alt":
      "DJ Zwackery en train de mixer devant l'immense mur LED ZWACKERY",
    "hero.photo4Alt": "DJ Zwackery en train de mixer devant un mur de flammes",
    "hero.fanAriaLabel": "Photos de DJ Zwackery en live",

    "vote.kicker": "Australian Hardstyle Awards",
    "vote.heading": "Nommé pour [[Best Rising Talent]] en Happy Hardcore.",
    "vote.cta": "Votez maintenant",

    "status.offline": "Hors ligne",
    "status.live": "En direct",

    "live.heading": "On est en [[LIVE]] — rejoins-nous",
    "live.streamAriaLabel": "Stream Twitch en direct",

    "about.heading": "C'est qui, [[Zwackery]] ?",
    "about.bio1":
      "DJ Zwackery est un DJ hardcore originaire de Melbourne, en Australie, qui apporte le House of Fun aussi bien sur les dancefloors que dans les salons : plus de 150 BPM de rave euphorique, les mains en l'air.",
    "about.bio2":
      "De nouveaux sets arrivent chaque semaine sur YouTube, et la fête déborde sur Twitch dès qu'il passe en live. Pro DJ, pro pote.",
    "about.location": "Melbourne, AU",
    "about.twitchPartner": "Partenaire Twitch",
    "about.verifiedPartner": "Partenaire vérifié",

    "gigs.heading": "Retrouve-le en [[vrai]]",
    "gigs.details": "Détails",
    "gigs.onSale": "Bientôt en vente",

    "videos.heading": "Les nouveautés du [[House of Fun]]",
    "videos.empty":
      "Aucun set chargé pour l'instant. Le flux se met à jour bientôt ; en attendant, retrouve-le en live sur Twitch.",
    "videos.play": "Lire",
    "videos.views": "{count} vues",
    "videos.new": "Nouveau",

    "contact.kicker": "Contact",
    "contact.heading": "Écris [[un mot]] à Zwackery",
    "contact.blurb":
      "Booking, collabs, guestlist, ou juste pour dire qu'un set était énorme. Quoi qu'il en soit, ça arrive directement dans la boîte mail, et tu auras une réponse.",
    "contact.orEmail": "Ou par e-mail",
    "contact.name": "Ton nom",
    "contact.namePlaceholder": "C'est qui ?",
    "contact.email": "E-mail",
    "contact.reasonLabel": "C'est à quel sujet ?",
    "contact.reason1": "Booking / gig",
    "contact.reason2": "Collab ou remix",
    "contact.reason3": "Guestlist",
    "contact.reason4": "Juste dire bonjour",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Dis ce que tu as à dire.",
    "contact.send": "Envoyer",
    "contact.sending": "Envoi…",
    "contact.sent": "Envoyé ! Zwackery te recontactera. 🙌",
    "contact.failed": "Échec de l'envoi. Écris plutôt à {email}.",
    "contact.note":
      "Note : ajoute ta clé d'accès Web3Forms dans src/config.ts pour les recevoir.",

    "footer.tip": "Offrir un café au DJ",
    "footer.disclaimer":
      "Notre CDN enregistre ton adresse IP pour la sécurité. Le formulaire de contact et les contenus YouTube/Twitch intégrés partagent des données avec leurs fournisseurs — rien n'est vendu ni pisté à des fins publicitaires.",
    "footer.siteBy": "Site par {name}",
    "footer.press": "Kit presse",

    "press.meta.title": "Kit presse",
    "press.meta.description":
      "Logos, photos, couleurs de marque et emotes pour quiconque booke DJ Zwackery, écrit sur lui ou le met sur un flyer. Prends ce dont tu as besoin.",
    "press.kicker": "Pour les organisateurs & la presse",
    "press.heading": "Tout pour le [[flyer]]",
    "press.intro":
      "Logos, photos, couleurs et emotes, réunis au même endroit. Prends ce qu'il te faut pour une affiche, un line-up ou un article.",
    "press.logos.heading": "Logo",
    "press.logos.intro":
      "Deux versions du logotype : une pour fond sombre, une pour fond clair. Bascule l'interrupteur pour prévisualiser les deux.",
    "press.logos.toggleDark": "Blackout",
    "press.logos.toggleLight": "Houselights",
    "press.logos.onDarkLabel": "Pour fond sombre",
    "press.logos.onDarkHint":
      "Blanc sur noir club. La version par défaut sur ce site.",
    "press.logos.onLightLabel": "Pour fond clair",
    "press.logos.onLightHint":
      "Noir et magenta. La version inversée, pensée pour un support blanc ou clair.",
    "press.logos.wideLabel": "Version large",
    "press.logos.wideHint":
      "Uniquement pour les formats larges : bannières, papiers à en-tête, flyers larges. Utilise le logo ci-dessus pour tout le reste.",
    "press.logos.downloadSvg": "SVG",
    "press.logos.downloadPng": "PNG",
    "press.colours.heading": "Couleurs de marque",
    "press.colours.intro":
      "Directement issues du site. Clique sur une couleur pour copier son code hex.",
    "press.colours.copy": "Copier",
    "press.colours.copied": "Copié",
    "press.photos.heading": "Photos",
    "press.photos.intro":
      "Photos en haute résolution, prêtes pour un article, un visuel de line-up ou une story.",
    "press.photos.photo5Alt":
      "DJ Zwackery faisant le signe des cornes devant l'immense mur LED ZWACKERY",
    "press.photos.download": "Télécharger",
    "press.mascot.heading": "Mascotte",
    "press.mascot.intro":
      "La mascotte de Zwackery, de face et de dos. Parfaite pour des stickers, des overlays ou une carte de line-up.",
    "press.mascot.front": "De face",
    "press.mascot.back": "De dos",
    "press.mascot.frontAlt": "Mascotte de DJ Zwackery, de face",
    "press.mascot.backAlt": "Mascotte de DJ Zwackery, de dos",
    "press.emotes.heading": "Emotes",
    "press.emotes.intro":
      "Les emotes Twitch de la chaîne, hébergées en interne et prêtes à être utilisées sur Discord, en overlay de chat ou sur une planche de stickers.",
    "press.emotes.empty":
      "Aucune emote en cache pour le moment. Reviens après le prochain déploiement.",
    "press.bio.heading": "La phrase d'accroche",
    "press.bio.short":
      "DJ Zwackery est un DJ hardcore de Melbourne qui diffuse House of Fun en live sur Twitch chaque semaine.",
    "press.bio.long":
      "DJ Zwackery est un DJ hardcore originaire de Melbourne, en Australie, à la tête de House of Fun : des sets hebdomadaires happy hardcore et UK hardcore en live sur Twitch, avec un nouveau set posté chaque semaine sur YouTube.",

    "a11y.newTab": "(ouvre dans un nouvel onglet)",
    "a11y.language": "Langue",
    "a11y.skipToSets": "Passer aux sets",
    "a11y.videoPlayer": "Lecteur vidéo",
    "a11y.closeVideo": "Fermer la vidéo",
    "a11y.close": "FERMER",
    "a11y.pressToggleGroup": "Fond de l'aperçu du logo",
    "a11y.copyHex": "Copier le code hex {hex}",
    "a11y.backHome": "Retour à l'accueil",

    "notFound.error": "Erreur 404",
    "notFound.heading": "Perdu dans la [[rave]]",
    "notFound.blurb":
      "Cette page s'est trompée de chemin vers la machine à fumée. Retournons aux platines.",
    "notFound.back": "Retour au House of Fun",
    "notFound.stream": "Voir le live",
    "toast.notFound":
      "Cette page est introuvable. On te ramène au House of Fun.",
  },

  it: {
    "meta.role": "DJ Hardcore",
    "meta.description":
      "DJ Zwackery è un DJ hardcore di Melbourne, in Australia. Guarda gli ultimi set di House of Fun, segui lo stream su Twitch in diretta e resta aggiornato.",

    "hero.kicker": "House of Fun · Hardcore",
    "hero.tagline":
      "DJ hardcore di Melbourne. Nuovi set di House of Fun ogni settimana, live su Twitch.",
    "hero.followTwitch": "Segui su Twitch",
    "hero.subscribeYoutube": "Iscriviti su YouTube",
    "hero.watchSets": "Guarda gli ultimi set",
    "hero.photo1Alt": "DJ Zwackery con le mani in aria sopra la folla",
    "hero.photo2Alt":
      "DJ Zwackery in consolle avvolto da una luce magenta intensa",
    "hero.photo3Alt":
      "DJ Zwackery mentre mixa davanti all'enorme parete LED ZWACKERY",
    "hero.photo4Alt": "DJ Zwackery mentre mixa davanti a un muro di fiamme",
    "hero.fanAriaLabel": "Foto di DJ Zwackery dal vivo",

    "vote.kicker": "Australian Hardstyle Awards",
    "vote.heading": "Candidato a [[Best Rising Talent]] in Happy Hardcore.",
    "vote.cta": "Vota ora",

    "status.offline": "Offline",
    "status.live": "In diretta",

    "live.heading": "Siamo [[LIVE]] — entra subito!",
    "live.streamAriaLabel": "Diretta Twitch",

    "about.heading": "Chi è [[Zwackery]]?",
    "about.bio1":
      "DJ Zwackery è un DJ hardcore di Melbourne, in Australia, che porta la House of Fun sia in pista che in salotto: oltre 150 BPM di rave euforico, mani al cielo.",
    "about.bio2":
      "Nuovi set escono su YouTube ogni settimana, e la festa si riversa su Twitch ogni volta che va in diretta. Pro DJ, pro fra.",
    "about.location": "Melbourne, AU",
    "about.twitchPartner": "Partner di Twitch",
    "about.verifiedPartner": "Partner verificato",

    "gigs.heading": "Vedilo [[in carne e ossa]]",
    "gigs.details": "Dettagli",
    "gigs.onSale": "In vendita a breve",

    "videos.heading": "Le novità della [[House of Fun]]",
    "videos.empty":
      "Ancora nessun set caricato. Il feed si aggiorna a breve, nel frattempo seguilo live su Twitch.",
    "videos.play": "Riproduci",
    "videos.views": "{count} visualizzazioni",
    "videos.new": "Nuovo",

    "contact.kicker": "Mettiti in contatto",
    "contact.heading": "Scrivi [[due righe]] a Zwackery",
    "contact.blurb":
      "Booking, collab, guest list, o anche solo per dire che un set ha spaccato. Qualunque cosa sia, arriva dritta nella casella di posta e riceve una risposta.",
    "contact.orEmail": "Oppure via email",
    "contact.name": "Il tuo nome",
    "contact.namePlaceholder": "Chi sei?",
    "contact.email": "Email",
    "contact.reasonLabel": "Di cosa si tratta?",
    "contact.reason1": "Booking / gig",
    "contact.reason2": "Collab o remix",
    "contact.reason3": "Guest list",
    "contact.reason4": "Solo per salutare",
    "contact.message": "Messaggio",
    "contact.messagePlaceholder": "Scrivi quello che hai da dire.",
    "contact.send": "Invia messaggio",
    "contact.sending": "Invio…",
    "contact.sent": "Inviato! Zwackery ti risponderà presto. 🙌",
    "contact.failed": "Invio non riuscito. Scrivi invece a {email}.",
    "contact.note":
      "Occhio: aggiungi la tua chiave di accesso Web3Forms in src/config.ts per riceverli.",

    "footer.tip": "Offri un caffè al DJ",
    "footer.disclaimer":
      "La nostra CDN registra il tuo indirizzo IP per motivi di sicurezza. Il modulo di contatto e i contenuti YouTube/Twitch incorporati condividono dati con i loro fornitori — nulla viene venduto o tracciato a scopo pubblicitario.",
    "footer.siteBy": "Sito di {name}",
    "footer.press": "Press kit",

    "press.meta.title": "Press kit",
    "press.meta.description":
      "Loghi, foto, colori del brand ed emote per chi deve prenotare DJ Zwackery, scrivere di lui o metterlo su un volantino. Prendi quello che ti serve.",
    "press.kicker": "Per promoter e stampa",
    "press.heading": "Tutto per il [[volantino]]",
    "press.intro":
      "Loghi, foto, colori ed emote, tutti in un unico posto. Prendi quello che ti serve per un poster, una line-up o un articolo.",
    "press.logos.heading": "Logo",
    "press.logos.intro":
      "Due versioni del logotipo: una per sfondi scuri, una per sfondi chiari. Sposta l'interruttore per vedere entrambe.",
    "press.logos.toggleDark": "Blackout",
    "press.logos.toggleLight": "Houselights",
    "press.logos.onDarkLabel": "Per sfondi scuri",
    "press.logos.onDarkHint":
      "Bianco su nero club. La versione predefinita su questo sito.",
    "press.logos.onLightLabel": "Per sfondi chiari",
    "press.logos.onLightHint":
      "Nero e magenta. La versione invertita, pensata per carta bianca o chiara.",
    "press.logos.wideLabel": "Versione larga",
    "press.logos.wideHint":
      "Solo per formati larghi: banner, carta intestata, volantini larghi. Per tutto il resto, usa il logo qui sopra.",
    "press.logos.downloadSvg": "SVG",
    "press.logos.downloadPng": "PNG",
    "press.colours.heading": "Colori del brand",
    "press.colours.intro":
      "Direttamente dal sito. Clicca su un colore per copiarne il codice hex.",
    "press.colours.copy": "Copia",
    "press.colours.copied": "Copiato",
    "press.photos.heading": "Foto",
    "press.photos.intro":
      "Scatti ad alta risoluzione, pronti per un articolo, una grafica di line-up o una storia.",
    "press.photos.photo5Alt":
      "DJ Zwackery con il segno delle corna davanti all'enorme parete LED ZWACKERY",
    "press.photos.download": "Scarica",
    "press.mascot.heading": "Mascotte",
    "press.mascot.intro":
      "La mascotte di Zwackery, davanti e dietro. Perfetta per sticker, overlay o una card della line-up.",
    "press.mascot.front": "Di fronte",
    "press.mascot.back": "Di spalle",
    "press.mascot.frontAlt": "Mascotte di DJ Zwackery, di fronte",
    "press.mascot.backAlt": "Mascotte di DJ Zwackery, di spalle",
    "press.emotes.heading": "Emote",
    "press.emotes.intro":
      "Le emote Twitch del canale, ospitate direttamente e pronte da usare su Discord, in un overlay della chat o su un foglio di sticker.",
    "press.emotes.empty":
      "Nessuna emote in cache al momento. Ricontrolla dopo il prossimo deploy.",
    "press.bio.heading": "La riga di presentazione",
    "press.bio.short":
      "DJ Zwackery è un DJ hardcore di Melbourne che trasmette House of Fun in diretta su Twitch ogni settimana.",
    "press.bio.long":
      "DJ Zwackery è un DJ hardcore di Melbourne, in Australia, alla guida di House of Fun: set settimanali happy hardcore e UK hardcore in diretta su Twitch, con un nuovo set caricato ogni settimana su YouTube.",

    "a11y.newTab": "(si apre in una nuova scheda)",
    "a11y.language": "Lingua",
    "a11y.skipToSets": "Salta ai set",
    "a11y.videoPlayer": "Lettore video",
    "a11y.closeVideo": "Chiudi video",
    "a11y.close": "CHIUDI",
    "a11y.pressToggleGroup": "Sfondo dell'anteprima del logo",
    "a11y.copyHex": "Copia il codice hex {hex}",
    "a11y.backHome": "Torna alla home",

    "notFound.error": "Errore 404",
    "notFound.heading": "Perso nel [[rave]]",
    "notFound.blurb":
      "Questa pagina ha sbagliato strada sulla via della macchina del fumo. Torniamo alla consolle.",
    "notFound.back": "Torna alla House of Fun",
    "notFound.stream": "Guarda lo stream",
    "toast.notFound":
      "Questa pagina non esiste. Ti riportiamo alla House of Fun.",
  },
} as const;

export type UiKey = keyof (typeof ui)["en"];
