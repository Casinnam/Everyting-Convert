// pricing-language.js
// Translates the pricing page body (plans, comparison table, AI pricing
// table, FAQ, billing notes) between en/ko/de/es/fr. Mirrors the
// header-language.js pattern: a bidirectional canonical-phrase map walks the
// text nodes inside main.pricing-main, and a MutationObserver re-applies the
// translation when the inline checkout script rewrites prices or statuses.
(function () {
  const translations = {
    ko: {
      'Convert more for less': '더 저렴하게 더 많이 변환',
      'Save 20%': '20% 절약',
      '10 free conversions per day with an account': '계정 생성 시 하루 무료 변환 10회',
      '5 per day as a guest, no signup needed': '비회원은 하루 5회 (가입 불필요)',
      '5/day · 10/day': '하루 5회 · 10회',
      'Standard file conversions are free — 5 a day as a guest, 10 a day with a free account. Go Pro for unlimited conversions, an ad-free workspace, and 300 AI credits every month.': '표준 파일 변환은 무료입니다 — 비회원은 하루 5회, 무료 계정은 하루 10회. Pro로 업그레이드하면 무제한 변환, 광고 없는 환경, 매달 300 AI 크레딧을 제공합니다.',
      '300 AI credits included every month': '매달 300 AI 크레딧 포함',
      'Unlimited standard conversions — no daily limits': '표준 변환 무제한 — 일일 한도 없음',
      'Edit text in PDF — free for Pro': 'PDF 글자 편집 — Pro는 무료',
      'AI Transcription — 1 credit / minute, minimum 5': 'AI 텍스트 변환 — 분당 1 크레딧, 최소 5',
      'Premium QR — 5 credits for logo, frame, SVG/PDF': '프리미엄 QR — 로고·프레임·SVG/PDF 5 크레딧',
      'Free conversions,': '무료 변환,',
      'Pro comfort': 'Pro의 편리함',
      ', and AI when you need it.': ', 그리고 필요할 때 AI까지.',
      'All standard file conversions stay free and unlimited. Upgrade to Pro for an ad-free workspace with unlimited AI PDF Summary, or use selected AI tools as one-time purchases when you need full-quality results.':
        '모든 표준 파일 변환은 무료이며 무제한입니다. Pro로 업그레이드하면 광고 없는 작업 환경과 무제한 AI PDF 요약을 사용할 수 있고, 특정 AI 도구는 필요할 때 단건 결제로 이용할 수 있습니다.',
      'Monthly': '월간',
      'Yearly': '연간',
      'Save 42%': '42% 절약',
      'Free': '무료',
      'No account needed for conversions': '변환은 계정 없이 사용 가능',
      'Create free account': '무료 계정 만들기',
      'Unlimited standard conversions': '표준 변환 무제한',
      'PDF, image, video, and data tools': 'PDF, 이미지, 비디오, 데이터 도구',
      'AI PDF Summary — 10 free per day with an account': 'AI PDF 요약 — 계정 생성 시 하루 10회 무료',
      'AI tool previews before payment': '결제 전 AI 도구 미리보기',
      'Ad-supported': '광고 포함',
      'Best value': '최고의 가치',
      '/month': '/월',
      'Cancel any time': '언제든 해지 가능',
      'Upgrade to Pro': 'Pro로 업그레이드',
      'Opening Stripe...': 'Stripe 여는 중...',
      'Everything in Free, plus:': 'Free의 모든 기능 +',
      'Unlimited AI PDF Summary': 'AI PDF 요약 무제한',
      'No ads': '광고 제거',
      'Pro conversion history (My Conversions)': '변환 기록 (My Conversions)',
      'Priority access to new features': '신기능 우선 이용',
      '/year': '/년',
      'About $4.08 per month — save 42%': '월 약 $4.08 — 42% 절약',
      'AI Credits': 'AI 크레딧',
      '+ /pack': '+ /팩',
      'No subscription · pay as you go': '구독 없이 · 쓴 만큼만',
      'Buy AI credits': 'AI 크레딧 구매',
      '10 free credits on signup': '가입 시 10 크레딧 무료',
      'Background Remover — 25 credits': '배경 제거 — 25 크레딧',
      'AI Transcription — 1 credit / minute': 'AI 텍스트 변환 — 분당 1 크레딧',
      'Credits never expire': '크레딧은 만료되지 않습니다',
      'Buy AI credits and pay your way.': '필요한 만큼 AI 크레딧을 구매하세요.',
      'Credits are an easy way to pay for AI tools without a subscription. New accounts get 10 free credits. Credits never expire.':
        '크레딧은 구독 없이 AI 도구를 사용하는 간편한 방법입니다. 신규 계정에는 10 크레딧이 무료로 제공되며, 크레딧은 만료되지 않습니다.',
      'Buy Starter': 'Starter 구매',
      'Buy Standard': 'Standard 구매',
      'Buy Power': 'Power 구매',
      'Buy Business': 'Business 구매',
      'Need team features or higher volumes?': '팀 기능이나 더 많은 사용량이 필요하신가요?',
      'Contact us': '문의하기',
      '— we are shaping a Business plan with early users.': '— 초기 사용자들과 함께 Business 플랜을 준비하고 있습니다.',
      'Compare plans': '플랜 비교',
      'Free vs Pro at a glance.': 'Free와 Pro 한눈에 비교.',
      'Feature': '기능',
      'Standard conversions': '표준 변환',
      'Unlimited': '무제한',
      'AI PDF Summary': 'AI PDF 요약',
      '3/day guests · 10/day accounts': '게스트 3회/일 · 계정 10회/일',
      'Ads': '광고',
      'Shown': '표시됨',
      'Removed': '제거됨',
      'Conversion history': '변환 기록',
      'Included': '포함',
      'One-time AI tools (transcription, images)': '단건 AI 도구 (전사, 이미지)',
      'Pay per result': '건당 결제',
      'AI tools': 'AI 도구',
      'AI tools, paid only when you need the final result.': '최종 결과물이 필요할 때만 결제하는 AI 도구.',
      'Preview first, then pay only for full transcripts, HD images, or print-ready photo files. This keeps standard conversion tools free while covering higher AI processing costs.':
        '먼저 미리보고, 전체 텍스트·HD 이미지·인쇄용 사진이 필요할 때만 결제하세요. 덕분에 표준 변환 도구는 계속 무료로 유지됩니다.',
      'AI tool': 'AI 도구',
      'Free preview': '무료 미리보기',
      'Paid result': '유료 결과물',
      'AI Transcription': 'AI 텍스트 변환',
      'Audio and video speech-to-text': '오디오·비디오 음성 텍스트 변환',
      'First 60 seconds': '처음 60초',
      '$2.99 full transcript + SRT': '$2.99 전체 텍스트 + SRT',
      'Background Remover': '배경 제거',
      'Cut out image backgrounds': '이미지 배경 잘라내기',
      'Low-res preview': '저해상도 미리보기',
      '$1.99 HD transparent PNG': '$1.99 HD 투명 PNG',
      'Document photo and print sheet': '규격 사진과 인쇄 시트',
      '$2.99 HD photo + print sheet': '$2.99 HD 사진 + 인쇄 시트',
      'Summaries for long PDF documents': '긴 PDF 문서 요약',
      'Guest/account daily limit': '게스트/계정 일일 한도',
      'Included unlimited in Pro': 'Pro에 무제한 포함',
      'Pro includes unlimited AI PDF Summary; some AI tools remain one-time purchases because they use separate high-cost processing for full-quality output.':
        'Pro에는 AI PDF 요약 무제한이 포함됩니다. 일부 AI 도구는 전체 품질 출력에 고비용 처리를 사용하므로 단건 결제로 유지됩니다.',
      'Billing clarity': '요금 안내',
      'What each price covers.': '각 가격에 포함된 내용.',
      'Are standard conversions free?': '표준 변환은 무료인가요?',
      'Yes. PDF, image, media, ebook, data, and developer conversions remain free and unlimited for normal use.':
        '네. PDF, 이미지, 미디어, 전자책, 데이터, 개발자 변환은 일반적인 사용 범위에서 무료·무제한입니다.',
      'Does Pro include every AI tool?': 'Pro에 모든 AI 도구가 포함되나요?',
      'No. Pro includes unlimited AI PDF Summary and Pro workspace benefits. Full-quality results from selected AI tools are priced separately.':
        '아니요. Pro에는 AI PDF 요약 무제한과 Pro 작업 환경 혜택이 포함됩니다. 일부 AI 도구의 전체 품질 결과물은 별도로 결제합니다.',
      'Do I pay before seeing anything?': '결과를 보기 전에 결제하나요?',
      'No. The one-time AI tools provide a preview first, then Stripe checkout unlocks the final result.':
        '아니요. 단건 AI 도구는 먼저 미리보기를 제공하고, Stripe 결제 후 최종 결과물이 열립니다.',
      'Monthly or yearly Pro — what is the difference?': '월간과 연간 Pro의 차이는 무엇인가요?',
      'Both unlock the same Pro benefits. Yearly Pro costs $49 — about $4.08 per month, saving roughly 42% compared to paying monthly.':
        '두 플랜 모두 동일한 Pro 혜택을 제공합니다. 연간 Pro는 $49로 월 약 $4.08이며, 월간 결제 대비 약 42% 저렴합니다.',
      'Secure billing with Stripe.': 'Stripe 보안 결제.',
      'Log in, choose Pro, and Stripe will handle your subscription checkout securely.':
        '로그인 후 Pro를 선택하면 Stripe가 구독 결제를 안전하게 처리합니다.',
      'Pro members can open My Conversions from their account page to review saved conversion activity. More tools will be connected to history as they are upgraded.':
        'Pro 회원은 계정 페이지에서 My Conversions를 열어 저장된 변환 활동을 확인할 수 있습니다. 더 많은 도구가 순차적으로 기록에 연결됩니다.',
      'Checkout was cancelled. You can restart Pro checkout any time.': '결제가 취소되었습니다. 언제든 다시 시작할 수 있습니다.',
      'Checking your login before opening Stripe...': 'Stripe를 열기 전에 로그인 상태를 확인하는 중...',
      'Redirecting to login before opening Stripe...': '로그인 페이지로 이동하는 중...',
      'Creating a secure Stripe checkout...': '보안 Stripe 결제를 생성하는 중...',
    },
    de: {
      'Convert more for less': 'Mehr konvertieren für weniger',
      'Save 20%': '20% sparen',
      '10 free conversions per day with an account': '10 kostenlose Konvertierungen pro Tag mit Konto',
      '5 per day as a guest, no signup needed': '5 pro Tag als Gast, ohne Anmeldung',
      '5/day · 10/day': '5/Tag · 10/Tag',
      'Standard file conversions are free — 5 a day as a guest, 10 a day with a free account. Go Pro for unlimited conversions, an ad-free workspace, and 300 AI credits every month.': 'Standard-Dateikonvertierungen sind kostenlos — 5 pro Tag als Gast, 10 pro Tag mit kostenlosem Konto. Mit Pro: unbegrenzte Konvertierungen, werbefreier Arbeitsbereich und 300 KI-Credits pro Monat.',
      '300 AI credits included every month': '300 KI-Credits jeden Monat inklusive',
      'Unlimited standard conversions — no daily limits': 'Unbegrenzte Standard-Konvertierungen — keine Tageslimits',
      'Edit text in PDF — free for Pro': 'Text im PDF bearbeiten — für Pro kostenlos',
      'AI Transcription — 1 credit / minute, minimum 5': 'KI-Transkription — 1 Credit/Minute, mindestens 5',
      'Premium QR — 5 credits for logo, frame, SVG/PDF': 'Premium-QR — 5 Credits für Logo, Rahmen, SVG/PDF',
      'Free conversions,': 'Kostenlose Konvertierungen,',
      'Pro comfort': 'Pro-Komfort',
      ', and AI when you need it.': ', und KI, wenn Sie sie brauchen.',
      'All standard file conversions stay free and unlimited. Upgrade to Pro for an ad-free workspace with unlimited AI PDF Summary, or use selected AI tools as one-time purchases when you need full-quality results.':
        'Alle Standard-Konvertierungen bleiben kostenlos und unbegrenzt. Mit Pro erhalten Sie einen werbefreien Arbeitsbereich mit unbegrenzter KI-PDF-Zusammenfassung; ausgewählte KI-Tools sind als Einmalkäufe verfügbar.',
      'Monthly': 'Monatlich',
      'Yearly': 'Jährlich',
      'Save 42%': '42% sparen',
      'Free': 'Kostenlos',
      'No account needed for conversions': 'Konvertieren ohne Konto möglich',
      'Create free account': 'Kostenloses Konto erstellen',
      'Unlimited standard conversions': 'Unbegrenzte Standard-Konvertierungen',
      'PDF, image, video, and data tools': 'PDF-, Bild-, Video- und Datentools',
      'AI PDF Summary — 10 free per day with an account': 'KI-PDF-Zusammenfassung — 10 pro Tag mit Konto',
      'AI tool previews before payment': 'KI-Vorschau vor jeder Zahlung',
      'Ad-supported': 'Werbefinanziert',
      'Best value': 'Bestes Angebot',
      '/month': '/Monat',
      'Cancel any time': 'Jederzeit kündbar',
      'Upgrade to Pro': 'Auf Pro upgraden',
      'Opening Stripe...': 'Stripe wird geöffnet...',
      'Everything in Free, plus:': 'Alles aus Free, plus:',
      'Unlimited AI PDF Summary': 'Unbegrenzte KI-PDF-Zusammenfassung',
      'No ads': 'Keine Werbung',
      'Pro conversion history (My Conversions)': 'Konvertierungsverlauf (My Conversions)',
      'Priority access to new features': 'Früher Zugang zu neuen Funktionen',
      '/year': '/Jahr',
      'About $4.08 per month — save 42%': 'Ca. $4,08 pro Monat — 42% sparen',
      'AI Credits': 'KI-Credits',
      '+ /pack': '+ /Paket',
      'No subscription · pay as you go': 'Kein Abo · zahlen nach Verbrauch',
      'Buy AI credits': 'KI-Credits kaufen',
      '10 free credits on signup': '10 Gratis-Credits bei Anmeldung',
      'Background Remover — 25 credits': 'Hintergrund entfernen — 25 Credits',
      'AI Transcription — 1 credit / minute': 'KI-Transkription — 1 Credit/Minute',
      'Credits never expire': 'Credits verfallen nie',
      'Buy AI credits and pay your way.': 'Kaufen Sie KI-Credits und zahlen Sie flexibel.',
      'Credits are an easy way to pay for AI tools without a subscription. New accounts get 10 free credits. Credits never expire.':
        'Credits sind eine einfache Art, KI-Tools ohne Abo zu bezahlen. Neue Konten erhalten 10 Gratis-Credits. Credits verfallen nie.',
      'Buy Starter': 'Starter kaufen',
      'Buy Standard': 'Standard kaufen',
      'Buy Power': 'Power kaufen',
      'Buy Business': 'Business kaufen',
      'Need team features or higher volumes?': 'Team-Funktionen oder höhere Volumen nötig?',
      'Contact us': 'Kontaktieren Sie uns',
      '— we are shaping a Business plan with early users.': '— wir entwickeln einen Business-Plan mit ersten Nutzern.',
      'Compare plans': 'Pläne vergleichen',
      'Free vs Pro at a glance.': 'Free vs. Pro auf einen Blick.',
      'Feature': 'Funktion',
      'Standard conversions': 'Standard-Konvertierungen',
      'Unlimited': 'Unbegrenzt',
      'AI PDF Summary': 'KI-PDF-Zusammenfassung',
      '3/day guests · 10/day accounts': '3/Tag Gäste · 10/Tag mit Konto',
      'Ads': 'Werbung',
      'Shown': 'Angezeigt',
      'Removed': 'Entfernt',
      'Conversion history': 'Konvertierungsverlauf',
      'Included': 'Enthalten',
      'One-time AI tools (transcription, images)': 'Einmalige KI-Tools (Transkription, Bilder)',
      'Pay per result': 'Zahlung pro Ergebnis',
      'AI tools': 'KI-Tools',
      'AI tools, paid only when you need the final result.': 'KI-Tools — bezahlt nur, wenn Sie das Endergebnis brauchen.',
      'Preview first, then pay only for full transcripts, HD images, or print-ready photo files. This keeps standard conversion tools free while covering higher AI processing costs.':
        'Erst Vorschau, dann nur für vollständige Transkripte, HD-Bilder oder druckfertige Fotos zahlen. So bleiben die Standardtools kostenlos.',
      'AI tool': 'KI-Tool',
      'Free preview': 'Kostenlose Vorschau',
      'Paid result': 'Bezahltes Ergebnis',
      'AI Transcription': 'KI-Transkription',
      'Audio and video speech-to-text': 'Audio- und Video-Spracherkennung',
      'First 60 seconds': 'Erste 60 Sekunden',
      '$2.99 full transcript + SRT': '$2,99 volles Transkript + SRT',
      'Background Remover': 'Hintergrund entfernen',
      'Cut out image backgrounds': 'Bildhintergründe ausschneiden',
      'Low-res preview': 'Vorschau in niedriger Auflösung',
      '$1.99 HD transparent PNG': '$1,99 transparentes HD-PNG',
      'Document photo and print sheet': 'Dokumentenfoto und Druckbogen',
      '$2.99 HD photo + print sheet': '$2,99 HD-Foto + Druckbogen',
      'Summaries for long PDF documents': 'Zusammenfassungen langer PDF-Dokumente',
      'Guest/account daily limit': 'Tageslimit für Gäste/Konten',
      'Included unlimited in Pro': 'In Pro unbegrenzt enthalten',
      'Pro includes unlimited AI PDF Summary; some AI tools remain one-time purchases because they use separate high-cost processing for full-quality output.':
        'Pro enthält unbegrenzte KI-PDF-Zusammenfassungen; einige KI-Tools bleiben Einmalkäufe, da sie kostenintensive Verarbeitung nutzen.',
      'Billing clarity': 'Klare Abrechnung',
      'What each price covers.': 'Was jeder Preis abdeckt.',
      'Are standard conversions free?': 'Sind Standard-Konvertierungen kostenlos?',
      'Yes. PDF, image, media, ebook, data, and developer conversions remain free and unlimited for normal use.':
        'Ja. PDF-, Bild-, Medien-, E-Book-, Daten- und Entwickler-Konvertierungen bleiben für normale Nutzung kostenlos und unbegrenzt.',
      'Does Pro include every AI tool?': 'Enthält Pro jedes KI-Tool?',
      'No. Pro includes unlimited AI PDF Summary and Pro workspace benefits. Full-quality results from selected AI tools are priced separately.':
        'Nein. Pro enthält unbegrenzte KI-PDF-Zusammenfassungen und Pro-Vorteile. Endergebnisse ausgewählter KI-Tools werden separat berechnet.',
      'Do I pay before seeing anything?': 'Zahle ich, bevor ich etwas sehe?',
      'No. The one-time AI tools provide a preview first, then Stripe checkout unlocks the final result.':
        'Nein. Die Einmal-KI-Tools zeigen zuerst eine Vorschau, dann schaltet der Stripe-Checkout das Endergebnis frei.',
      'Monthly or yearly Pro — what is the difference?': 'Monatlich oder jährlich — was ist der Unterschied?',
      'Both unlock the same Pro benefits. Yearly Pro costs $49 — about $4.08 per month, saving roughly 42% compared to paying monthly.':
        'Beide bieten dieselben Pro-Vorteile. Jährliches Pro kostet $49 — ca. $4,08 pro Monat und spart rund 42% gegenüber monatlicher Zahlung.',
      'Secure billing with Stripe.': 'Sichere Abrechnung mit Stripe.',
      'Log in, choose Pro, and Stripe will handle your subscription checkout securely.':
        'Melden Sie sich an, wählen Sie Pro, und Stripe wickelt Ihr Abo sicher ab.',
      'Pro members can open My Conversions from their account page to review saved conversion activity. More tools will be connected to history as they are upgraded.':
        'Pro-Mitglieder können My Conversions über ihre Kontoseite öffnen. Weitere Tools werden nach und nach mit dem Verlauf verbunden.',
      'Checkout was cancelled. You can restart Pro checkout any time.': 'Checkout abgebrochen. Sie können jederzeit neu starten.',
      'Checking your login before opening Stripe...': 'Login wird geprüft, bevor Stripe geöffnet wird...',
      'Redirecting to login before opening Stripe...': 'Weiterleitung zum Login...',
      'Creating a secure Stripe checkout...': 'Sicherer Stripe-Checkout wird erstellt...',
    },
    es: {
      'Convert more for less': 'Convierte más por menos',
      'Save 20%': 'Ahorra 20%',
      '10 free conversions per day with an account': '10 conversiones gratis al día con cuenta',
      '5 per day as a guest, no signup needed': '5 al día como invitado, sin registro',
      '5/day · 10/day': '5/día · 10/día',
      'Standard file conversions are free — 5 a day as a guest, 10 a day with a free account. Go Pro for unlimited conversions, an ad-free workspace, and 300 AI credits every month.': 'Las conversiones estándar son gratis — 5 al día como invitado, 10 al día con cuenta gratuita. Con Pro: conversiones ilimitadas, espacio sin anuncios y 300 créditos IA al mes.',
      '300 AI credits included every month': '300 créditos IA incluidos cada mes',
      'Unlimited standard conversions — no daily limits': 'Conversiones estándar ilimitadas — sin límites diarios',
      'Edit text in PDF — free for Pro': 'Editar texto en PDF — gratis para Pro',
      'AI Transcription — 1 credit / minute, minimum 5': 'Transcripción IA — 1 crédito/minuto, mínimo 5',
      'Premium QR — 5 credits for logo, frame, SVG/PDF': 'QR Premium — 5 créditos para logo, marco, SVG/PDF',
      'Free conversions,': 'Conversiones gratis,',
      'Pro comfort': 'comodidad Pro',
      ', and AI when you need it.': ', e IA cuando la necesites.',
      'All standard file conversions stay free and unlimited. Upgrade to Pro for an ad-free workspace with unlimited AI PDF Summary, or use selected AI tools as one-time purchases when you need full-quality results.':
        'Todas las conversiones estándar siguen siendo gratuitas e ilimitadas. Pasa a Pro para un espacio sin anuncios con Resumen PDF IA ilimitado, o usa herramientas IA seleccionadas como compras únicas.',
      'Monthly': 'Mensual',
      'Yearly': 'Anual',
      'Save 42%': 'Ahorra 42%',
      'Free': 'Gratis',
      'No account needed for conversions': 'Sin cuenta para convertir',
      'Create free account': 'Crear cuenta gratis',
      'Unlimited standard conversions': 'Conversiones estándar ilimitadas',
      'PDF, image, video, and data tools': 'Herramientas de PDF, imagen, video y datos',
      'AI PDF Summary — 10 free per day with an account': 'Resumen PDF IA — 10 gratis al día con cuenta',
      'AI tool previews before payment': 'Vista previa de IA antes de pagar',
      'Ad-supported': 'Con anuncios',
      'Best value': 'Mejor valor',
      '/month': '/mes',
      'Cancel any time': 'Cancela cuando quieras',
      'Upgrade to Pro': 'Mejorar a Pro',
      'Opening Stripe...': 'Abriendo Stripe...',
      'Everything in Free, plus:': 'Todo lo de Free, más:',
      'Unlimited AI PDF Summary': 'Resumen PDF IA ilimitado',
      'No ads': 'Sin anuncios',
      'Pro conversion history (My Conversions)': 'Historial de conversiones (My Conversions)',
      'Priority access to new features': 'Acceso prioritario a novedades',
      '/year': '/año',
      'About $4.08 per month — save 42%': 'Unos $4.08 al mes — ahorra 42%',
      'AI Credits': 'Créditos IA',
      '+ /pack': '+ /paquete',
      'No subscription · pay as you go': 'Sin suscripción · paga por uso',
      'Buy AI credits': 'Comprar créditos IA',
      '10 free credits on signup': '10 créditos gratis al registrarte',
      'Background Remover — 25 credits': 'Eliminar fondo — 25 créditos',
      'AI Transcription — 1 credit / minute': 'Transcripción IA — 1 crédito/minuto',
      'Credits never expire': 'Los créditos no caducan',
      'Buy AI credits and pay your way.': 'Compra créditos IA y paga a tu manera.',
      'Credits are an easy way to pay for AI tools without a subscription. New accounts get 10 free credits. Credits never expire.':
        'Los créditos son una forma fácil de pagar las herramientas IA sin suscripción. Las cuentas nuevas reciben 10 créditos gratis. Los créditos no caducan.',
      'Buy Starter': 'Comprar Starter',
      'Buy Standard': 'Comprar Standard',
      'Buy Power': 'Comprar Power',
      'Buy Business': 'Comprar Business',
      'Need team features or higher volumes?': '¿Necesitas funciones de equipo o más volumen?',
      'Contact us': 'Contáctanos',
      '— we are shaping a Business plan with early users.': '— estamos creando un plan Business con los primeros usuarios.',
      'Compare plans': 'Comparar planes',
      'Free vs Pro at a glance.': 'Free vs Pro de un vistazo.',
      'Feature': 'Función',
      'Standard conversions': 'Conversiones estándar',
      'Unlimited': 'Ilimitadas',
      'AI PDF Summary': 'Resumen PDF IA',
      '3/day guests · 10/day accounts': '3/día invitados · 10/día con cuenta',
      'Ads': 'Anuncios',
      'Shown': 'Mostrados',
      'Removed': 'Eliminados',
      'Conversion history': 'Historial de conversiones',
      'Included': 'Incluido',
      'One-time AI tools (transcription, images)': 'IA de pago único (transcripción, imágenes)',
      'Pay per result': 'Pago por resultado',
      'AI tools': 'Herramientas IA',
      'AI tools, paid only when you need the final result.': 'Herramientas IA: paga solo cuando necesites el resultado final.',
      'Preview first, then pay only for full transcripts, HD images, or print-ready photo files. This keeps standard conversion tools free while covering higher AI processing costs.':
        'Primero la vista previa; paga solo por transcripciones completas, imágenes HD o fotos listas para imprimir. Así las herramientas estándar siguen gratis.',
      'AI tool': 'Herramienta IA',
      'Free preview': 'Vista previa gratis',
      'Paid result': 'Resultado de pago',
      'AI Transcription': 'Transcripción IA',
      'Audio and video speech-to-text': 'Voz a texto de audio y video',
      'First 60 seconds': 'Primeros 60 segundos',
      '$2.99 full transcript + SRT': '$2.99 transcripción completa + SRT',
      'Background Remover': 'Eliminar fondo',
      'Cut out image backgrounds': 'Recorta fondos de imágenes',
      'Low-res preview': 'Vista previa en baja resolución',
      '$1.99 HD transparent PNG': '$1.99 PNG transparente HD',
      'Document photo and print sheet': 'Foto de documento y hoja de impresión',
      '$2.99 HD photo + print sheet': '$2.99 foto HD + hoja de impresión',
      'Summaries for long PDF documents': 'Resúmenes de PDFs largos',
      'Guest/account daily limit': 'Límite diario invitado/cuenta',
      'Included unlimited in Pro': 'Ilimitado incluido en Pro',
      'Pro includes unlimited AI PDF Summary; some AI tools remain one-time purchases because they use separate high-cost processing for full-quality output.':
        'Pro incluye Resumen PDF IA ilimitado; algunas herramientas IA siguen siendo compras únicas porque usan procesamiento de alto coste.',
      'Billing clarity': 'Facturación clara',
      'What each price covers.': 'Qué cubre cada precio.',
      'Are standard conversions free?': '¿Las conversiones estándar son gratis?',
      'Yes. PDF, image, media, ebook, data, and developer conversions remain free and unlimited for normal use.':
        'Sí. Las conversiones de PDF, imagen, medios, ebooks, datos y desarrollo siguen gratis e ilimitadas para uso normal.',
      'Does Pro include every AI tool?': '¿Pro incluye todas las herramientas IA?',
      'No. Pro includes unlimited AI PDF Summary and Pro workspace benefits. Full-quality results from selected AI tools are priced separately.':
        'No. Pro incluye Resumen PDF IA ilimitado y ventajas del espacio Pro. Los resultados completos de algunas herramientas IA se cobran aparte.',
      'Do I pay before seeing anything?': '¿Pago antes de ver algo?',
      'No. The one-time AI tools provide a preview first, then Stripe checkout unlocks the final result.':
        'No. Las herramientas IA de pago único muestran primero una vista previa; el pago con Stripe desbloquea el resultado final.',
      'Monthly or yearly Pro — what is the difference?': '¿Pro mensual o anual — cuál es la diferencia?',
      'Both unlock the same Pro benefits. Yearly Pro costs $49 — about $4.08 per month, saving roughly 42% compared to paying monthly.':
        'Ambos dan las mismas ventajas Pro. El Pro anual cuesta $49 — unos $4.08 al mes, ahorrando cerca del 42% frente al pago mensual.',
      'Secure billing with Stripe.': 'Facturación segura con Stripe.',
      'Log in, choose Pro, and Stripe will handle your subscription checkout securely.':
        'Inicia sesión, elige Pro y Stripe gestionará tu suscripción de forma segura.',
      'Pro members can open My Conversions from their account page to review saved conversion activity. More tools will be connected to history as they are upgraded.':
        'Los miembros Pro pueden abrir My Conversions desde su cuenta para revisar su actividad guardada. Más herramientas se conectarán al historial.',
      'Checkout was cancelled. You can restart Pro checkout any time.': 'Pago cancelado. Puedes reiniciarlo cuando quieras.',
      'Checking your login before opening Stripe...': 'Comprobando tu sesión antes de abrir Stripe...',
      'Redirecting to login before opening Stripe...': 'Redirigiendo al inicio de sesión...',
      'Creating a secure Stripe checkout...': 'Creando un pago seguro de Stripe...',
    },
    fr: {
      'Convert more for less': 'Convertissez plus pour moins',
      'Save 20%': 'Économisez 20%',
      '10 free conversions per day with an account': '10 conversions gratuites par jour avec un compte',
      '5 per day as a guest, no signup needed': '5 par jour en invité, sans inscription',
      '5/day · 10/day': '5/jour · 10/jour',
      'Standard file conversions are free — 5 a day as a guest, 10 a day with a free account. Go Pro for unlimited conversions, an ad-free workspace, and 300 AI credits every month.': 'Les conversions de fichiers standard sont gratuites — 5 par jour en invité, 10 par jour avec un compte gratuit. Passez à Pro pour des conversions illimitées, un espace sans publicité et 300 crédits IA par mois.',
      '300 AI credits included every month': '300 crédits IA inclus chaque mois',
      'Unlimited standard conversions — no daily limits': 'Conversions standard illimitées — sans limite quotidienne',
      'Edit text in PDF — free for Pro': 'Modifier le texte du PDF — gratuit pour Pro',
      'AI Transcription — 1 credit / minute, minimum 5': 'Transcription IA — 1 crédit/minute, minimum 5',
      'Premium QR — 5 credits for logo, frame, SVG/PDF': 'QR Premium — 5 crédits pour logo, cadre, SVG/PDF',
      'Free conversions,': 'Conversions gratuites,',
      'Pro comfort': 'confort Pro',
      ', and AI when you need it.': ', et l\'IA quand vous en avez besoin.',
      'All standard file conversions stay free and unlimited. Upgrade to Pro for an ad-free workspace with unlimited AI PDF Summary, or use selected AI tools as one-time purchases when you need full-quality results.':
        'Toutes les conversions standard restent gratuites et illimitées. Passez à Pro pour un espace sans publicité avec Résumé PDF IA illimité, ou utilisez certains outils IA en achat unique.',
      'Monthly': 'Mensuel',
      'Yearly': 'Annuel',
      'Save 42%': 'Économisez 42%',
      'Free': 'Gratuit',
      'No account needed for conversions': 'Aucun compte requis pour convertir',
      'Create free account': 'Créer un compte gratuit',
      'Unlimited standard conversions': 'Conversions standard illimitées',
      'PDF, image, video, and data tools': 'Outils PDF, image, vidéo et données',
      'AI PDF Summary — 10 free per day with an account': 'Résumé PDF IA — 10 gratuits par jour avec un compte',
      'AI tool previews before payment': 'Aperçu IA avant tout paiement',
      'Ad-supported': 'Financé par la publicité',
      'Best value': 'Meilleure offre',
      '/month': '/mois',
      'Cancel any time': 'Annulable à tout moment',
      'Upgrade to Pro': 'Passer à Pro',
      'Opening Stripe...': 'Ouverture de Stripe...',
      'Everything in Free, plus:': 'Tout Free, plus :',
      'Unlimited AI PDF Summary': 'Résumé PDF IA illimité',
      'No ads': 'Sans publicité',
      'Pro conversion history (My Conversions)': 'Historique des conversions (My Conversions)',
      'Priority access to new features': 'Accès prioritaire aux nouveautés',
      '/year': '/an',
      'About $4.08 per month — save 42%': 'Environ 4,08 $ par mois — économisez 42%',
      'AI Credits': 'Crédits IA',
      '+ /pack': '+ /pack',
      'No subscription · pay as you go': 'Sans abonnement · à l\'usage',
      'Buy AI credits': 'Acheter des crédits IA',
      '10 free credits on signup': '10 crédits gratuits à l\'inscription',
      'Background Remover — 25 credits': 'Suppression d\'arrière-plan — 25 crédits',
      'AI Transcription — 1 credit / minute': 'Transcription IA — 1 crédit/minute',
      'Credits never expire': 'Les crédits n\'expirent jamais',
      'Buy AI credits and pay your way.': 'Achetez des crédits IA et payez à votre rythme.',
      'Credits are an easy way to pay for AI tools without a subscription. New accounts get 10 free credits. Credits never expire.':
        'Les crédits sont un moyen simple de payer les outils IA sans abonnement. Les nouveaux comptes reçoivent 10 crédits gratuits. Les crédits n\'expirent jamais.',
      'Buy Starter': 'Acheter Starter',
      'Buy Standard': 'Acheter Standard',
      'Buy Power': 'Acheter Power',
      'Buy Business': 'Acheter Business',
      'Need team features or higher volumes?': 'Besoin de fonctions d\'équipe ou de volumes supérieurs ?',
      'Contact us': 'Contactez-nous',
      '— we are shaping a Business plan with early users.': '— nous préparons une offre Business avec les premiers utilisateurs.',
      'Compare plans': 'Comparer les offres',
      'Free vs Pro at a glance.': 'Free vs Pro en un coup d\'œil.',
      'Feature': 'Fonctionnalité',
      'Standard conversions': 'Conversions standard',
      'Unlimited': 'Illimité',
      'AI PDF Summary': 'Résumé PDF IA',
      '3/day guests · 10/day accounts': '3/jour invités · 10/jour avec compte',
      'Ads': 'Publicités',
      'Shown': 'Affichées',
      'Removed': 'Supprimées',
      'Conversion history': 'Historique des conversions',
      'Included': 'Inclus',
      'One-time AI tools (transcription, images)': 'Outils IA à l\'unité (transcription, images)',
      'Pay per result': 'Paiement au résultat',
      'AI tools': 'Outils IA',
      'AI tools, paid only when you need the final result.': 'Outils IA, payés seulement quand vous voulez le résultat final.',
      'Preview first, then pay only for full transcripts, HD images, or print-ready photo files. This keeps standard conversion tools free while covering higher AI processing costs.':
        'Aperçu d\'abord, puis payez uniquement pour les transcriptions complètes, images HD ou photos prêtes à imprimer. Les outils standard restent ainsi gratuits.',
      'AI tool': 'Outil IA',
      'Free preview': 'Aperçu gratuit',
      'Paid result': 'Résultat payant',
      'AI Transcription': 'Transcription IA',
      'Audio and video speech-to-text': 'Reconnaissance vocale audio et vidéo',
      'First 60 seconds': '60 premières secondes',
      '$2.99 full transcript + SRT': '2,99 $ transcription complète + SRT',
      'Background Remover': 'Suppression d\'arrière-plan',
      'Cut out image backgrounds': 'Détourez les arrière-plans d\'images',
      'Low-res preview': 'Aperçu en basse résolution',
      '$1.99 HD transparent PNG': '1,99 $ PNG transparent HD',
      'Document photo and print sheet': 'Photo officielle et planche d\'impression',
      '$2.99 HD photo + print sheet': '2,99 $ photo HD + planche d\'impression',
      'Summaries for long PDF documents': 'Résumés de longs documents PDF',
      'Guest/account daily limit': 'Limite quotidienne invité/compte',
      'Included unlimited in Pro': 'Illimité inclus dans Pro',
      'Pro includes unlimited AI PDF Summary; some AI tools remain one-time purchases because they use separate high-cost processing for full-quality output.':
        'Pro inclut le Résumé PDF IA illimité ; certains outils IA restent en achat unique car ils utilisent un traitement coûteux.',
      'Billing clarity': 'Facturation claire',
      'What each price covers.': 'Ce que couvre chaque prix.',
      'Are standard conversions free?': 'Les conversions standard sont-elles gratuites ?',
      'Yes. PDF, image, media, ebook, data, and developer conversions remain free and unlimited for normal use.':
        'Oui. Les conversions PDF, image, média, ebook, données et développeur restent gratuites et illimitées pour un usage normal.',
      'Does Pro include every AI tool?': 'Pro inclut-il tous les outils IA ?',
      'No. Pro includes unlimited AI PDF Summary and Pro workspace benefits. Full-quality results from selected AI tools are priced separately.':
        'Non. Pro inclut le Résumé PDF IA illimité et les avantages Pro. Les résultats complets de certains outils IA sont facturés séparément.',
      'Do I pay before seeing anything?': 'Dois-je payer avant de voir quelque chose ?',
      'No. The one-time AI tools provide a preview first, then Stripe checkout unlocks the final result.':
        'Non. Les outils IA à l\'unité montrent d\'abord un aperçu, puis le paiement Stripe débloque le résultat final.',
      'Monthly or yearly Pro — what is the difference?': 'Pro mensuel ou annuel — quelle différence ?',
      'Both unlock the same Pro benefits. Yearly Pro costs $49 — about $4.08 per month, saving roughly 42% compared to paying monthly.':
        'Les deux donnent les mêmes avantages Pro. Le Pro annuel coûte 49 $ — environ 4,08 $ par mois, soit près de 42% d\'économie.',
      'Secure billing with Stripe.': 'Facturation sécurisée avec Stripe.',
      'Log in, choose Pro, and Stripe will handle your subscription checkout securely.':
        'Connectez-vous, choisissez Pro, et Stripe gérera votre abonnement en toute sécurité.',
      'Pro members can open My Conversions from their account page to review saved conversion activity. More tools will be connected to history as they are upgraded.':
        'Les membres Pro peuvent ouvrir My Conversions depuis leur compte pour consulter leur activité. D\'autres outils seront connectés à l\'historique.',
      'Checkout was cancelled. You can restart Pro checkout any time.': 'Paiement annulé. Vous pouvez recommencer à tout moment.',
      'Checking your login before opening Stripe...': 'Vérification de votre connexion avant d\'ouvrir Stripe...',
      'Redirecting to login before opening Stripe...': 'Redirection vers la connexion...',
      'Creating a secure Stripe checkout...': 'Création d\'un paiement Stripe sécurisé...',
    },
  };

  const canonicalPhrase = {};
  Object.values(translations).forEach((languageMap) => {
    Object.entries(languageMap).forEach(([english, translated]) => {
      canonicalPhrase[english] = english;
      canonicalPhrase[translated] = english;
    });
  });

  function getLanguage() {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (translations[fromUrl] || fromUrl === 'en') return fromUrl;
      if (window.EverythingConvertLanguage && typeof window.EverythingConvertLanguage.get === 'function') {
        const current = window.EverythingConvertLanguage.get();
        if (translations[current] || current === 'en') return current;
      }
      const saved = localStorage.getItem('everything_convert_language');
      if (translations[saved] || saved === 'en') return saved;
    } catch (error) {
      return 'en';
    }
    return 'en';
  }

  function translate(value, language) {
    const english = canonicalPhrase[value] || value;
    if (language === 'en') return english;
    return (translations[language] && translations[language][english]) || english;
  }

  function applyPricingLanguage() {
    const root = document.querySelector('.pricing-main');
    if (!root) return;
    const language = getLanguage();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,[data-no-i18n]')) return NodeFilter.FILTER_REJECT;
        // language-menu.js owns nodes it has already keyed.
        if (parent.dataset && parent.dataset.i18nKey) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const trimmed = node.nodeValue.trim();
      const translated = translate(trimmed, language);
      if (translated !== trimmed) node.nodeValue = node.nodeValue.replace(trimmed, translated);
    });
  }

  let timer = null;
  function scheduleApply() {
    window.clearTimeout(timer);
    timer = window.setTimeout(applyPricingLanguage, 30);
  }

  document.addEventListener('DOMContentLoaded', () => {
    [0, 100, 500].forEach((delay) => window.setTimeout(applyPricingLanguage, delay));
    const main = document.querySelector('.pricing-main');
    if (main) {
      const observer = new MutationObserver(scheduleApply);
      observer.observe(main, { childList: true, subtree: true, characterData: true });
    }
  });

  window.addEventListener('everything-language-change', scheduleApply);
})();
