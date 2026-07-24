/**
 * All user-facing copy, keyed by locale. Brand names (DJ Zwackery, House of
 * Fun) and genre names (happy hardcore, UK hardcore) are kept as-is across
 * languages. Text wrapped in [[double brackets]] is rendered with the neon
 * highlight; translators can place the highlight on whichever word fits the
 * target language's word order.
 */

export const defaultLang = "en";

/** Locales in the order they appear in the language switcher. */
export const languages = {
  en: "English",
  ja: "日本語",
  de: "Deutsch",
  nl: "Nederlands",
  fr: "Français",
} as const;

export type Lang = keyof typeof languages;

/** BCP-47 tags for the html lang attribute and og:locale. */
export const localeTags: Record<Lang, string> = {
  en: "en",
  ja: "ja",
  de: "de",
  nl: "nl",
  fr: "fr",
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

    "footer.tip": "☕ Tip the DJ",

    "a11y.newTab": "(opens in new tab)",
    "a11y.language": "Language",
    "a11y.skipToSets": "Skip to sets",
    "a11y.videoPlayer": "Video player",
    "a11y.closeVideo": "Close video",
    "a11y.close": "CLOSE",

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

    "footer.tip": "☕ DJに投げ銭",

    "a11y.newTab": "（新しいタブで開きます）",
    "a11y.language": "言語",
    "a11y.skipToSets": "セット一覧へスキップ",
    "a11y.videoPlayer": "動画プレーヤー",
    "a11y.closeVideo": "動画を閉じる",
    "a11y.close": "閉じる",

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

    "footer.tip": "☕ Trinkgeld für den DJ",

    "a11y.newTab": "(öffnet in neuem Tab)",
    "a11y.language": "Sprache",
    "a11y.skipToSets": "Zu den Sets springen",
    "a11y.videoPlayer": "Videoplayer",
    "a11y.closeVideo": "Video schließen",
    "a11y.close": "SCHLIESSEN",

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

    "footer.tip": "☕ Fooi voor de DJ",

    "a11y.newTab": "(opent in nieuw tabblad)",
    "a11y.language": "Taal",
    "a11y.skipToSets": "Naar sets springen",
    "a11y.videoPlayer": "Videospeler",
    "a11y.closeVideo": "Video sluiten",
    "a11y.close": "SLUITEN",

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

    "footer.tip": "☕ Offrir un café au DJ",

    "a11y.newTab": "(ouvre dans un nouvel onglet)",
    "a11y.language": "Langue",
    "a11y.skipToSets": "Passer aux sets",
    "a11y.videoPlayer": "Lecteur vidéo",
    "a11y.closeVideo": "Fermer la vidéo",
    "a11y.close": "FERMER",

    "notFound.error": "Erreur 404",
    "notFound.heading": "Perdu dans la [[rave]]",
    "notFound.blurb":
      "Cette page s'est trompée de chemin vers la machine à fumée. Retournons aux platines.",
    "notFound.back": "Retour au House of Fun",
    "notFound.stream": "Voir le live",
    "toast.notFound":
      "Cette page est introuvable. On te ramène au House of Fun.",
  },
} as const;

export type UiKey = keyof (typeof ui)["en"];
