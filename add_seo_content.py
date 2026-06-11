# -*- coding: utf-8 -*-
"""
add_seo_content.py — inject unique, static (server-rendered) SEO/AdSense content
into each tool page: a how-to + why grid, an SEO guide with a page-specific FAQ,
and JSON-LD (SoftwareApplication + BreadcrumbList + FAQPage).

Each translatable element also carries a `data-ko` attribute; `static-i18n.js`
swaps EN<->KO when the visitor switches language. Static sections are marked
`data-static` so tool-page-redesign.js preserves them.

Idempotent: a page already containing `data-static` is skipped.
Run:  python add_seo_content.py
"""
import json
import os

BASE = "https://www.everythingconvert.com"

KO_BEST = "최상의 결과를 위해"
KO_FIXES = "자주 겪는 문제 해결"
KO_PRIV = "설계부터 프라이버시 우선"
KO_FAQ = "자주 묻는 질문"


def dk(ko):
    """Build a data-ko attribute (innerHTML form; escape only & and ")."""
    if not ko:
        return ""
    esc = ko.replace("&", "&amp;").replace('"', "&quot;")
    return ' data-ko="%s"' % esc


def jsonld(name, url, sw_desc, crumbs, faqs):
    graph = [
        {
            "@type": "SoftwareApplication",
            "name": name,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": url,
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "description": sw_desc,
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                ({"@type": "ListItem", "position": i + 1, "name": n, "item": u}
                 if u else {"@type": "ListItem", "position": i + 1, "name": n})
                for i, (n, u) in enumerate(crumbs)
            ],
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": q,
                 "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in faqs
            ],
        },
    ]
    obj = {"@context": "https://schema.org", "@graph": graph}
    return ('    <script type="application/ld+json">\n    '
            + json.dumps(obj, indent=2, ensure_ascii=False).replace("\n", "\n    ")
            + "\n    </script>")


def faq_html(faqs, faqs_ko):
    rows = []
    for i, (q, a) in enumerate(faqs):
        qk, ak = (faqs_ko[i] if i < len(faqs_ko) else ("", "")) if faqs_ko else ("", "")
        rows.append(
            f"      <details><summary{dk(qk)}>{q}</summary><p{dk(ak)}>{a}</p></details>"
        )
    body = "\n".join(rows)
    return (f'    <div class="ec-faq-list">\n'
            f'      <h2{dk(KO_FAQ)}>Frequently asked questions</h2>\n'
            f"{body}\n"
            "    </div>")


def full_block(p):
    ko = p.get("ko", {})
    ks = ko.get("steps", [])
    kw = ko.get("why", [])
    kb = ko.get("best", [])
    kf = ko.get("fixes", [])
    steps = []
    for i, (t, d) in enumerate(p["steps"]):
        tk, dkv = (ks[i] if i < len(ks) else ("", ""))
        steps.append(
            f"        <li><b>{i+1}</b><div><strong{dk(tk)}>{t}</strong>"
            f"<span{dk(dkv)}>{d}</span></div></li>"
        )
    steps = "\n".join(steps)
    why = "\n".join(
        f'        <li><i class="fa-solid fa-check"></i><span{dk(kw[i] if i < len(kw) else "")}>{w}</span></li>'
        for i, w in enumerate(p["why"])
    )
    best = "\n".join(
        f"          <li{dk(kb[i] if i < len(kb) else '')}>{b}</li>"
        for i, b in enumerate(p["best"])
    )
    fixes = "\n".join(
        f"          <li{dk(kf[i] if i < len(kf) else '')}>{b}</li>"
        for i, b in enumerate(p["fixes"])
    )
    return f"""
  <section class="ec-info-grid" data-static>
    <article class="ec-info-panel">
      <h2{dk(ko.get('how_title'))}>{p['how_title']}</h2>
      <ol class="ec-step-list">
{steps}
      </ol>
    </article>
    <article class="ec-info-panel">
      <h2{dk(ko.get('why_title'))}>{p['why_title']}</h2>
      <ul class="ec-check-list">
{why}
      </ul>
    </article>
  </section>

  <section class="ec-seo-guide" data-static>
    <div class="ec-guide-copy">
      <p class="ec-guide-kicker"{dk(ko.get('kicker'))}>{p['kicker']}</p>
      <h2{dk(ko.get('intro_title'))}>{p['intro_title']}</h2>
      <p{dk(ko.get('intro'))}>{p['intro']}</p>
    </div>
    <div class="ec-guide-grid">
      <article>
        <i class="fa-solid fa-file-circle-check"></i>
        <h3{dk(KO_BEST)}>Best results</h3>
        <ul>
{best}
        </ul>
      </article>
      <article>
        <i class="fa-solid fa-screwdriver-wrench"></i>
        <h3{dk(KO_FIXES)}>Common fixes</h3>
        <ul>
{fixes}
        </ul>
      </article>
      <article>
        <i class="fa-solid fa-user-shield"></i>
        <h3{dk(KO_PRIV)}>Private by design</h3>
        <p{dk(ko.get('privacy'))}>{p['privacy']}</p>
      </article>
    </div>
{faq_html(p['faqs'], ko.get('faqs'))}
  </section>
"""


def faq_only_block(p):
    ko = p.get("ko", {})
    return f"""
  <section class="ec-seo-guide" data-static>
    <div class="ec-guide-copy">
      <p class="ec-guide-kicker"{dk(ko.get('kicker'))}>{p['kicker']}</p>
      <h2{dk(ko.get('intro_title'))}>{p['intro_title']}</h2>
      <p{dk(ko.get('intro'))}>{p['intro']}</p>
    </div>
{faq_html(p['faqs'], ko.get('faqs'))}
  </section>
"""


PAGES = {
 "pdf to word/pdf-to-word.html": {
  "url": f"{BASE}/pdf%20to%20word/pdf-to-word.html", "name": "PDF to Word Converter",
  "sw_desc": "Convert PDF files into editable Microsoft Word (.docx) documents online. Free, fast, and private.",
  "kicker": "PDF &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("PDF &amp; Documents", f"{BASE}/#tools"), ("PDF to Word", None)],
  "intro_title": "Turn any PDF into an editable Word document",
  "intro": "PDF is perfect for sharing a finished document, but it is awkward to edit. Converting a PDF to Microsoft Word gives you back a fully editable file, so you can fix a typo, update a figure, reuse a paragraph, or rework an old report without retyping it. Our converter extracts the text layer from your PDF and rebuilds it as a clean <code>.docx</code> that opens in Word, Google Docs, and LibreOffice, while the conversion happens privately on your own device.",
  "how_title": "How to convert PDF to Word",
  "steps": [("Upload your PDF", "Drag a PDF into the box above or click to choose a file. The document is read directly in your browser."),
            ("Pick your pages and options", "Convert every page or set a custom range, and choose whether to add page markers to the Word file."),
            ("Download the Word file", "Press convert and save a ready-to-edit <code>.docx</code> document you can open in Word, Google Docs, or LibreOffice.")],
  "why_title": "Why convert PDF to Word here",
  "why": ["Editable <code>.docx</code> output you can revise, copy, and reformat",
          "Runs in your browser &mdash; your PDF is never uploaded to a server",
          "No watermarks and no software to install",
          "Works on Windows, macOS, Linux, Android, and iOS"],
  "best": ["Use PDFs that contain real, selectable text", "Keep the original export quality high", "Convert text-heavy documents like reports and contracts"],
  "fixes": ["Scanned pages? Run OCR first so the text is selectable", "Complex columns may need minor cleanup in Word", "Convert one section at a time for very large files"],
  "privacy": "Conversion runs entirely in your browser using client-side JavaScript. Your PDF is never uploaded, stored, or shared, so confidential documents stay on your device.",
  "faqs": [("Is the PDF to Word converter free?", "Yes. You can convert PDF files to editable Word documents for free. A free account or guest session covers everyday use, and Pro removes daily limits."),
           ("Will my formatting and layout be preserved?", "Text, paragraphs, and basic structure carry over cleanly. Very complex layouts, multi-column designs, and embedded graphics may need light cleanup in Word after conversion."),
           ("Can it convert scanned PDFs?", "Scanned PDFs are images of text, so they need OCR to become editable. This tool extracts real text layers; for scanned documents, run OCR first for the best result."),
           ("Are my files uploaded to a server?", "No. Standard PDF to Word conversion runs in your browser, so your file never leaves your device during conversion."),
           ("Does it work on mobile?", "Yes. The converter works in any modern browser on phones, tablets, and computers, though large files are easier to handle on a desktop.")],
  "ko": {
   "kicker": "PDF 및 문서",
   "intro_title": "어떤 PDF든 편집 가능한 워드 문서로",
   "intro": "PDF는 완성된 문서를 공유하기에는 좋지만 편집은 번거롭습니다. PDF를 Microsoft Word로 변환하면 완전히 편집 가능한 파일을 되찾아, 오타 수정·도표 갱신·문단 재사용·오래된 보고서 수정을 다시 타이핑하지 않고 할 수 있습니다. 본 변환기는 PDF의 텍스트 레이어를 추출해 Word, Google Docs, LibreOffice에서 열리는 깔끔한 <code>.docx</code>로 재구성하며, 변환은 사용자의 기기에서 비공개로 처리됩니다.",
   "how_title": "PDF를 워드로 변환하는 방법",
   "steps": [("PDF 업로드", "위 영역에 PDF를 끌어다 놓거나 클릭해 파일을 선택하세요. 문서는 브라우저에서 바로 읽힙니다."),
             ("페이지와 옵션 선택", "전체 페이지 또는 원하는 범위를 변환하고, 워드 파일에 페이지 표시를 넣을지 선택하세요."),
             ("워드 파일 다운로드", "변환을 누르면 Word, Google Docs, LibreOffice에서 바로 편집 가능한 <code>.docx</code> 문서를 저장합니다.")],
   "why_title": "여기서 PDF를 워드로 변환하는 이유",
   "why": ["수정·복사·재편집이 가능한 편집 가능한 <code>.docx</code> 출력",
           "브라우저에서 처리 &mdash; PDF가 서버로 전송되지 않음",
           "워터마크 없음, 설치 프로그램 없음",
           "Windows, macOS, Linux, Android, iOS 모두 지원"],
   "best": ["실제로 선택 가능한 텍스트가 들어 있는 PDF 사용", "원본 내보내기 품질을 높게 유지", "보고서·계약서 등 텍스트 위주 문서 변환"],
   "fixes": ["스캔 문서인가요? 텍스트가 선택되도록 먼저 OCR을 실행하세요", "복잡한 단(컬럼) 구성은 워드에서 약간의 정리가 필요할 수 있습니다", "매우 큰 파일은 구간별로 나눠 변환하세요"],
   "privacy": "변환은 클라이언트 측 자바스크립트로 브라우저에서 전부 실행됩니다. PDF는 업로드·저장·공유되지 않으므로 기밀 문서도 기기에 그대로 남습니다.",
   "faqs": [("PDF to Word 변환기는 무료인가요?", "네. PDF를 편집 가능한 워드 문서로 무료 변환할 수 있습니다. 무료 계정이나 게스트 세션으로 일상적인 사용이 가능하며, Pro는 일일 한도를 없앱니다."),
            ("서식과 레이아웃이 유지되나요?", "텍스트·문단·기본 구조는 깔끔하게 옮겨집니다. 매우 복잡한 레이아웃, 다단 구성, 삽입 그래픽은 변환 후 워드에서 약간의 정리가 필요할 수 있습니다."),
            ("스캔한 PDF도 변환되나요?", "스캔 PDF는 텍스트 이미지라 편집하려면 OCR이 필요합니다. 이 도구는 실제 텍스트 레이어를 추출하므로, 스캔 문서는 먼저 OCR을 적용하면 가장 좋습니다."),
            ("내 파일이 서버로 올라가나요?", "아니요. 일반 PDF to Word 변환은 브라우저에서 실행되어 파일이 기기를 떠나지 않습니다."),
            ("모바일에서도 되나요?", "네. 최신 브라우저가 있는 휴대폰·태블릿·컴퓨터에서 작동하지만, 큰 파일은 데스크톱이 더 편합니다.")],
  },
 },
 "pdf to jpg/pdf-to-jpg.html": {
  "url": f"{BASE}/pdf%20to%20jpg/pdf-to-jpg.html", "name": "PDF to JPG Converter",
  "sw_desc": "Convert PDF pages into high-quality JPG images online, free and in your browser.",
  "kicker": "PDF &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("PDF &amp; Documents", f"{BASE}/#tools"), ("PDF to JPG", None)],
  "intro_title": "Convert PDF pages into high-quality JPG images",
  "intro": "Sometimes you need a picture of a page rather than the whole document, so you can post it online, drop it into a slide, or share it where PDFs are not supported. This converter renders every page of your PDF as a crisp JPG at the quality you choose, then lets you download the images individually or as a single ZIP. Everything runs in your browser, so your document is never uploaded.",
  "how_title": "How to convert PDF to JPG",
  "steps": [("Upload your PDF", "Drag a PDF in or click to choose a file; each page is rendered in your browser."),
            ("Choose image quality", "Pick the resolution and JPG quality that fits printing or web use."),
            ("Download your images", "Save each JPG separately or download them all in one ZIP file.")],
  "why_title": "Why convert PDF to JPG here",
  "why": ["High-resolution JPG output for screen or print", "Convert every page or only the ones you need",
          "Download as separate files or a single ZIP", "Runs in your browser, with no upload"],
  "best": ["Use PDFs with sharp, vector text", "Pick a higher quality for printing", "Convert page-by-page for very large files"],
  "fixes": ["Blurry output? Increase the resolution", "Huge ZIP? Convert fewer pages at a time", "Need transparency? Export to PNG instead"],
  "privacy": "Rendering runs locally in your browser. Your PDF and the resulting images stay on your device and are never sent to our servers.",
  "faqs": [("Can I convert every page at once?", "Yes. Each page becomes its own JPG, and you can download them individually or as a single ZIP file."),
           ("What image quality can I expect?", "You choose the resolution; higher settings produce sharper images that are better for printing or zooming."),
           ("Is JPG better than PNG here?", "JPG keeps file sizes small and is ideal for photos and full pages. If you need transparency or perfectly sharp lines, use PNG."),
           ("Are my files uploaded?", "No. Rendering runs in your browser, so the PDF never leaves your device."),
           ("Is it free?", "Yes, free for everyday use, with Pro removing daily limits.")],
  "ko": {
   "kicker": "PDF 및 문서",
   "intro_title": "PDF 페이지를 고품질 JPG 이미지로",
   "intro": "문서 전체가 아니라 페이지 한 장의 이미지가 필요할 때가 있습니다. 온라인에 올리거나, 슬라이드에 넣거나, PDF를 지원하지 않는 곳에 공유할 때죠. 이 변환기는 PDF의 모든 페이지를 원하는 품질의 선명한 JPG로 렌더링하고, 이미지를 개별 또는 ZIP 하나로 내려받게 합니다. 모든 처리는 브라우저에서 이뤄지므로 문서가 업로드되지 않습니다.",
   "how_title": "PDF를 JPG로 변환하는 방법",
   "steps": [("PDF 업로드", "PDF를 끌어다 놓거나 클릭해 파일을 선택하세요. 각 페이지가 브라우저에서 렌더링됩니다."),
             ("이미지 품질 선택", "인쇄용 또는 웹용에 맞는 해상도와 JPG 품질을 고르세요."),
             ("이미지 다운로드", "각 JPG를 개별로 저장하거나 ZIP 하나로 모두 내려받으세요.")],
   "why_title": "여기서 PDF를 JPG로 변환하는 이유",
   "why": ["화면·인쇄용 고해상도 JPG 출력", "전체 페이지 또는 필요한 페이지만 변환",
           "개별 파일 또는 ZIP 하나로 다운로드", "브라우저에서 처리, 업로드 없음"],
   "best": ["선명한 벡터 텍스트가 있는 PDF 사용", "인쇄용은 더 높은 품질 선택", "매우 큰 파일은 페이지별로 변환"],
   "fixes": ["결과가 흐린가요? 해상도를 높이세요", "ZIP이 너무 큰가요? 한 번에 더 적은 페이지를 변환하세요", "투명도가 필요하면 PNG로 내보내세요"],
   "privacy": "렌더링은 브라우저에서 로컬로 실행됩니다. PDF와 생성된 이미지는 기기에 남고 서버로 전송되지 않습니다.",
   "faqs": [("모든 페이지를 한 번에 변환할 수 있나요?", "네. 각 페이지가 개별 JPG가 되며, 개별로 또는 ZIP 하나로 내려받을 수 있습니다."),
            ("이미지 품질은 어느 정도인가요?", "해상도를 직접 선택합니다. 높은 설정일수록 인쇄나 확대에 더 좋은 선명한 이미지가 만들어집니다."),
            ("여기서는 JPG가 PNG보다 나은가요?", "JPG는 용량이 작아 사진과 전체 페이지에 적합합니다. 투명도나 완벽하게 선명한 선이 필요하면 PNG를 사용하세요."),
            ("내 파일이 업로드되나요?", "아니요. 렌더링은 브라우저에서 실행되어 PDF가 기기를 떠나지 않습니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료이며 Pro는 일일 한도를 없앱니다.")],
  },
 },
 "pdf to excel/pdf-to-excel.html": {
  "url": f"{BASE}/pdf%20to%20excel/pdf-to-excel.html", "name": "PDF to Excel Converter",
  "sw_desc": "Extract tables and data from PDF files into editable Excel (XLSX) workbooks online.",
  "kicker": "PDF &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("PDF &amp; Documents", f"{BASE}/#tools"), ("PDF to Excel", None)],
  "intro_title": "Extract tables and data from PDF into Excel",
  "intro": "Copying numbers out of a PDF by hand is slow and error-prone. This tool pulls text and table-like data out of your PDF and arranges it into an Excel workbook you can sort, filter, and calculate with. It works best on PDFs that contain real, selectable text and clearly structured tables.",
  "how_title": "How to convert PDF to Excel",
  "steps": [("Upload your PDF", "Drag a PDF in or choose a file; it is read directly in your browser."),
            ("Select extraction mode", "Choose plain text or table-aware extraction depending on your document."),
            ("Download your Excel file", "Save a ready-to-edit .xlsx workbook for Excel, Sheets, or Calc.")],
  "why_title": "Why convert PDF to Excel here",
  "why": ["Editable .xlsx output you can sort and calculate", "Keeps rows and columns where the source is well structured",
          "Runs in your browser, with no upload", "No watermark on your file"],
  "best": ["Use PDFs with selectable text and clear gridlines", "Keep tables simple and consistent", "Check alignment after export"],
  "fixes": ["Merged cells may need manual tidy-up", "Scanned tables need OCR first", "Pro adds enhanced table detection"],
  "privacy": "Extraction runs locally in your browser, so your PDF is never uploaded, stored, or shared.",
  "faqs": [("Does it detect tables automatically?", "It extracts text and table-like structures. Clean, gridded tables convert most reliably; complex layouts may need a quick review."),
           ("Can it read scanned PDFs?", "Scanned pages are images, so they need OCR first to become selectable text."),
           ("What format do I get?", "A standard .xlsx workbook that opens in Excel, Google Sheets, and LibreOffice Calc."),
           ("Is enhanced detection available?", "Yes. Pro members get enhanced table detection for trickier documents."),
           ("Are my files private?", "Yes, conversion runs locally in your browser.")],
  "ko": {
   "kicker": "PDF 및 문서",
   "intro_title": "PDF의 표와 데이터를 엑셀로 추출",
   "intro": "PDF에서 숫자를 손으로 옮기는 일은 느리고 실수가 잦습니다. 이 도구는 PDF에서 텍스트와 표 형태의 데이터를 뽑아 정렬·필터·계산이 가능한 엑셀 통합 문서로 정리합니다. 실제로 선택 가능한 텍스트와 명확한 표 구조를 가진 PDF에서 가장 잘 작동합니다.",
   "how_title": "PDF를 엑셀로 변환하는 방법",
   "steps": [("PDF 업로드", "PDF를 끌어다 놓거나 파일을 선택하세요. 브라우저에서 바로 읽힙니다."),
             ("추출 모드 선택", "문서에 맞게 일반 텍스트 또는 표 인식 추출을 고르세요."),
             ("엑셀 파일 다운로드", "Excel, Sheets, Calc에서 바로 편집 가능한 .xlsx 파일을 저장하세요.")],
   "why_title": "여기서 PDF를 엑셀로 변환하는 이유",
   "why": ["정렬·계산이 가능한 편집 가능한 .xlsx 출력", "원본이 잘 구조화된 경우 행과 열을 유지",
           "브라우저에서 처리, 업로드 없음", "파일에 워터마크 없음"],
   "best": ["선택 가능한 텍스트와 명확한 표 선이 있는 PDF 사용", "표를 단순하고 일관되게 유지", "내보내기 후 정렬 상태 확인"],
   "fixes": ["병합된 셀은 수동 정리가 필요할 수 있음", "스캔된 표는 먼저 OCR 필요", "Pro는 향상된 표 인식 제공"],
   "privacy": "추출은 브라우저에서 로컬로 실행되므로 PDF는 업로드·저장·공유되지 않습니다.",
   "faqs": [("표를 자동으로 인식하나요?", "텍스트와 표 형태 구조를 추출합니다. 깔끔한 격자 표가 가장 안정적으로 변환되며, 복잡한 레이아웃은 간단한 확인이 필요할 수 있습니다."),
            ("스캔한 PDF도 읽을 수 있나요?", "스캔 페이지는 이미지라서 선택 가능한 텍스트가 되려면 먼저 OCR이 필요합니다."),
            ("어떤 형식으로 받나요?", "Excel, Google Sheets, LibreOffice Calc에서 열리는 표준 .xlsx 통합 문서입니다."),
            ("향상된 인식도 되나요?", "네. Pro 회원은 까다로운 문서를 위한 향상된 표 인식을 사용할 수 있습니다."),
            ("내 파일은 비공개인가요?", "네, 변환은 브라우저에서 로컬로 실행됩니다.")],
  },
 },
 "excel to pdf/excel-to-pdf.html": {
  "url": f"{BASE}/excel%20to%20pdf/excel-to-pdf.html", "name": "Excel to PDF Converter",
  "sw_desc": "Convert Excel and CSV spreadsheets into clean, shareable PDF documents online.",
  "kicker": "Office &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Office &amp; Documents", f"{BASE}/#tools"), ("Excel to PDF", None)],
  "intro_title": "Turn spreadsheets into clean, shareable PDFs",
  "intro": "A PDF is the safest way to share a spreadsheet when you want it to look the same everywhere and stay read-only. This converter takes your Excel or CSV file and lays it out as a tidy PDF, so columns, rows, and numbers appear exactly as intended, with no broken formulas and no accidental edits.",
  "how_title": "How to convert Excel to PDF",
  "steps": [("Upload your spreadsheet", "Add an XLSX, XLS, or CSV file; it is processed in your browser."),
            ("Choose sheet and layout", "Select which sheet to export and pick portrait or landscape."),
            ("Download your PDF", "Save a clean, read-only PDF ready to print or send.")],
  "why_title": "Why convert Excel to PDF here",
  "why": ["Locks formatting for sharing and printing", "Supports XLSX, XLS, and CSV files",
          "Browser-based, with no upload", "No watermark on your file"],
  "best": ["Set print areas before exporting", "Choose landscape for wide tables", "Keep column widths reasonable"],
  "fixes": ["Columns cut off? Switch to landscape or fit-to-width", "Multiple sheets? Pick the one you need", "Large books? Export sheet by sheet"],
  "privacy": "Your spreadsheet is converted in your browser and is never uploaded to our servers.",
  "faqs": [("Which file types are supported?", "XLSX, XLS, and CSV files."),
           ("Can I choose which sheet to convert?", "Yes. Pick the sheet and layout before exporting."),
           ("Will my formulas be preserved?", "The PDF captures the calculated values as they appear; it is a fixed, read-only snapshot, not a live spreadsheet."),
           ("Is wide data handled?", "Choose landscape or fit-to-width so wide tables are not cut off."),
           ("Is it private and free?", "Yes. Conversion runs in your browser, and it is free for everyday use.")],
  "ko": {
   "kicker": "오피스 및 문서",
   "intro_title": "스프레드시트를 깔끔한 공유용 PDF로",
   "intro": "어디서나 동일하게 보이고 읽기 전용으로 유지하고 싶을 때, PDF는 스프레드시트를 공유하는 가장 안전한 방법입니다. 이 변환기는 엑셀 또는 CSV 파일을 정돈된 PDF로 배치해, 열·행·숫자가 의도한 대로 표시되며 수식이 깨지거나 실수로 편집되는 일이 없습니다.",
   "how_title": "엑셀을 PDF로 변환하는 방법",
   "steps": [("스프레드시트 업로드", "XLSX, XLS, CSV 파일을 추가하세요. 브라우저에서 처리됩니다."),
             ("시트와 레이아웃 선택", "내보낼 시트를 고르고 세로 또는 가로 방향을 선택하세요."),
             ("PDF 다운로드", "인쇄나 전송에 바로 쓸 수 있는 깔끔한 읽기 전용 PDF를 저장하세요.")],
   "why_title": "여기서 엑셀을 PDF로 변환하는 이유",
   "why": ["공유·인쇄를 위해 서식을 고정", "XLSX, XLS, CSV 파일 지원",
           "브라우저 기반, 업로드 없음", "파일에 워터마크 없음"],
   "best": ["내보내기 전에 인쇄 영역 설정", "넓은 표는 가로 방향 선택", "열 너비를 적당하게 유지"],
   "fixes": ["열이 잘리나요? 가로 방향 또는 너비 맞춤으로 전환하세요", "시트가 여러 개인가요? 필요한 시트를 고르세요", "큰 통합 문서는 시트별로 내보내세요"],
   "privacy": "스프레드시트는 브라우저에서 변환되며 서버로 업로드되지 않습니다.",
   "faqs": [("어떤 파일 형식을 지원하나요?", "XLSX, XLS, CSV 파일입니다."),
            ("변환할 시트를 고를 수 있나요?", "네. 내보내기 전에 시트와 레이아웃을 선택하세요."),
            ("수식이 유지되나요?", "PDF는 보이는 그대로의 계산 값을 담습니다. 살아 있는 스프레드시트가 아니라 고정된 읽기 전용 스냅숏입니다."),
            ("넓은 데이터도 처리되나요?", "넓은 표가 잘리지 않도록 가로 방향이나 너비 맞춤을 선택하세요."),
            ("비공개이고 무료인가요?", "네. 변환은 브라우저에서 실행되며 일상적인 사용은 무료입니다.")],
  },
 },
 "docx to pdf/docx-to-pdf.html": {
  "url": f"{BASE}/docx%20to%20pdf/docx-to-pdf.html", "name": "DOCX to PDF Converter",
  "sw_desc": "Convert Word (DOCX) documents into PDF files online, free and in your browser.",
  "kicker": "Office &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Office &amp; Documents", f"{BASE}/#tools"), ("DOCX to PDF", None)],
  "intro_title": "Convert Word documents to PDF",
  "intro": "Sending a Word file risks layout shifts, font swaps, and accidental edits on the recipient's computer. Converting your DOCX to PDF freezes the document exactly as you designed it, so it looks identical for everyone and cannot be changed by mistake. It is ideal for resumes, contracts, letters, and reports.",
  "how_title": "How to convert DOCX to PDF",
  "steps": [("Upload your DOCX file", "Drag in or choose a Word document; it is read in your browser."),
            ("Convert to PDF", "Your document is laid out as a fixed, read-only PDF."),
            ("Download your PDF", "Save a professional PDF ready to share or print.")],
  "why_title": "Why convert DOCX to PDF here",
  "why": ["Preserves your layout and fonts", "Read-only, professional output",
          "Browser-based and private", "No watermark on your file"],
  "best": ["Use standard fonts for consistent results", "Keep to text-focused documents", "Review the preview before sharing"],
  "fixes": ["Unusual fonts may substitute, so use common fonts", "Complex layouts may shift slightly", "Large images increase file size"],
  "privacy": "Your document is converted locally in your browser and is never uploaded.",
  "faqs": [("Will my formatting stay the same?", "Yes. Text-focused documents convert cleanly. Very complex layouts may shift slightly."),
           ("Do I need Microsoft Word installed?", "No. Conversion happens in your browser with no extra software."),
           ("Is there a watermark?", "No watermark is added to your PDF."),
           ("Are my files uploaded?", "No. Your DOCX stays on your device."),
           ("Is it free?", "Yes, free for everyday use with Pro removing daily limits.")],
  "ko": {
   "kicker": "오피스 및 문서",
   "intro_title": "워드 문서를 PDF로 변환",
   "intro": "워드 파일을 보내면 받는 사람의 컴퓨터에서 레이아웃이 틀어지거나 글꼴이 바뀌고 실수로 편집될 위험이 있습니다. DOCX를 PDF로 변환하면 문서가 디자인 그대로 고정되어 누구에게나 동일하게 보이고 실수로 바뀌지 않습니다. 이력서, 계약서, 편지, 보고서에 이상적입니다.",
   "how_title": "DOCX를 PDF로 변환하는 방법",
   "steps": [("DOCX 파일 업로드", "워드 문서를 끌어다 놓거나 선택하세요. 브라우저에서 읽힙니다."),
             ("PDF로 변환", "문서가 고정된 읽기 전용 PDF로 배치됩니다."),
             ("PDF 다운로드", "공유·인쇄에 바로 쓸 수 있는 전문적인 PDF를 저장하세요.")],
   "why_title": "여기서 DOCX를 PDF로 변환하는 이유",
   "why": ["레이아웃과 글꼴 유지", "읽기 전용의 전문적인 출력",
           "브라우저 기반이며 비공개", "파일에 워터마크 없음"],
   "best": ["일관된 결과를 위해 표준 글꼴 사용", "텍스트 위주 문서에 적합", "공유 전에 미리보기 확인"],
   "fixes": ["특이한 글꼴은 대체될 수 있으니 일반 글꼴 사용", "복잡한 레이아웃은 약간 틀어질 수 있음", "큰 이미지는 파일 용량을 키움"],
   "privacy": "문서는 브라우저에서 로컬로 변환되며 업로드되지 않습니다.",
   "faqs": [("서식이 그대로 유지되나요?", "네. 텍스트 위주 문서는 깔끔하게 변환됩니다. 매우 복잡한 레이아웃은 약간 틀어질 수 있습니다."),
            ("Microsoft Word가 설치돼 있어야 하나요?", "아니요. 추가 소프트웨어 없이 브라우저에서 변환됩니다."),
            ("워터마크가 있나요?", "PDF에 워터마크가 추가되지 않습니다."),
            ("내 파일이 업로드되나요?", "아니요. DOCX는 기기에 그대로 남습니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료이며 Pro는 일일 한도를 없앱니다.")],
  },
 },
 "pdf to epub/pdf-to-epub.html": {
  "url": f"{BASE}/pdf%20to%20epub/pdf-to-epub.html", "name": "PDF to EPUB Converter",
  "sw_desc": "Convert PDF text into reflowable EPUB ebooks for e-readers and reading apps.",
  "kicker": "PDF &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("PDF &amp; Documents", f"{BASE}/#tools"), ("PDF to EPUB", None)],
  "intro_title": "Convert PDF text into EPUB ebooks",
  "intro": "PDFs have fixed pages that do not reflow, which makes them tiring to read on a phone or e-reader. EPUB is a flexible ebook format that adapts text to any screen size and lets readers change the font. This tool extracts the readable text from your PDF and packages it as an EPUB for apps like Apple Books, Google Play Books, and most e-readers.",
  "how_title": "How to convert PDF to EPUB",
  "steps": [("Upload your PDF", "Add a text-based PDF; it is read in your browser."),
            ("Extract readable text", "The text is pulled out and rebuilt as reflowable ebook content."),
            ("Download your EPUB", "Save an EPUB ready for your e-reader or reading app.")],
  "why_title": "Why convert PDF to EPUB here",
  "why": ["Reflowable text for comfortable reading", "Works with popular e-readers and apps",
          "Browser-based and private", "No watermark on your file"],
  "best": ["Use text-based PDFs, not scans", "Simple, single-column books convert best", "Check chapter breaks after export"],
  "fixes": ["Scanned PDFs need OCR first", "Complex layouts lose fixed positioning by design", "Images may need manual placement"],
  "privacy": "Text extraction runs in your browser, so your PDF is never uploaded.",
  "faqs": [("What is EPUB good for?", "EPUB reflows text to fit any screen and lets readers adjust the font, which is ideal for phones and e-readers."),
           ("Does it keep the original layout?", "EPUB is reflowable by design, so fixed page layouts are converted into flowing text."),
           ("Can it convert scanned books?", "Scanned pages need OCR first, since they are images rather than text."),
           ("Which apps open EPUB?", "Apple Books, Google Play Books, Calibre, and most e-readers."),
           ("Is it private?", "Yes. Conversion runs locally in your browser.")],
  "ko": {
   "kicker": "PDF 및 문서",
   "intro_title": "PDF 텍스트를 EPUB 전자책으로",
   "intro": "PDF는 페이지가 고정되어 글이 재배치되지 않아 휴대폰이나 전자책 단말기에서 읽기에 피곤합니다. EPUB은 화면 크기에 맞춰 글을 조정하고 글꼴을 바꿀 수 있는 유연한 전자책 형식입니다. 이 도구는 PDF에서 읽을 수 있는 텍스트를 추출해 Apple Books, Google Play Books, 대부분의 전자책 단말기용 EPUB으로 만듭니다.",
   "how_title": "PDF를 EPUB으로 변환하는 방법",
   "steps": [("PDF 업로드", "텍스트 기반 PDF를 추가하세요. 브라우저에서 읽힙니다."),
             ("읽을 수 있는 텍스트 추출", "텍스트를 추출해 재배치 가능한 전자책 콘텐츠로 재구성합니다."),
             ("EPUB 다운로드", "전자책 단말기나 읽기 앱에 바로 쓸 EPUB을 저장하세요.")],
   "why_title": "여기서 PDF를 EPUB으로 변환하는 이유",
   "why": ["편안한 독서를 위한 재배치 가능한 텍스트", "인기 전자책 단말기·앱과 호환",
           "브라우저 기반이며 비공개", "파일에 워터마크 없음"],
   "best": ["스캔본이 아닌 텍스트 기반 PDF 사용", "단순한 단단(1단) 책이 가장 잘 변환됨", "내보내기 후 챕터 구분 확인"],
   "fixes": ["스캔 PDF는 먼저 OCR 필요", "복잡한 레이아웃은 특성상 고정 위치가 사라짐", "이미지는 수동 배치가 필요할 수 있음"],
   "privacy": "텍스트 추출은 브라우저에서 실행되므로 PDF가 업로드되지 않습니다.",
   "faqs": [("EPUB은 어디에 좋은가요?", "EPUB은 어떤 화면에도 맞게 글을 재배치하고 글꼴을 조정할 수 있어 휴대폰과 전자책 단말기에 이상적입니다."),
            ("원본 레이아웃이 유지되나요?", "EPUB은 특성상 재배치되므로 고정 페이지 레이아웃이 흐르는 텍스트로 변환됩니다."),
            ("스캔한 책도 변환되나요?", "스캔 페이지는 텍스트가 아니라 이미지라서 먼저 OCR이 필요합니다."),
            ("어떤 앱에서 EPUB을 여나요?", "Apple Books, Google Play Books, Calibre, 그리고 대부분의 전자책 단말기입니다."),
            ("비공개인가요?", "네. 변환은 브라우저에서 로컬로 실행됩니다.")],
  },
 },
 "ebook converter/ebook-converter.html": {
  "url": f"{BASE}/ebook%20converter/ebook-converter.html", "name": "Ebook Converter",
  "sw_desc": "Convert document text into ebook-friendly formats for e-readers and reading apps.",
  "kicker": "Office &amp; Documents", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Office &amp; Documents", f"{BASE}/#tools"), ("Ebook Converter", None)],
  "intro_title": "Convert documents into ebook-friendly formats",
  "intro": "Reading long documents is far more comfortable in a proper ebook format that reflows to your screen. The ebook converter turns supported document text into ebook-friendly output you can load onto an e-reader or reading app, so your notes, drafts, and documents travel with you.",
  "how_title": "How to convert to an ebook",
  "steps": [("Upload your file", "Add a supported text-based document; it is read in your browser."),
            ("Choose your ebook output", "Select an ebook-friendly format for your reader."),
            ("Download your ebook", "Save the converted file and open it in your reading app.")],
  "why_title": "Why use the ebook converter",
  "why": ["Ebook output for comfortable reading", "Browser-based conversion",
          "No software to install", "No watermark on your file"],
  "best": ["Use clean, text-based source files", "Keep formatting simple", "Review the result in your reader"],
  "fixes": ["Complex layouts simplify into flowing text", "Images may need manual placement", "Scanned files need OCR first"],
  "privacy": "Conversion runs in your browser and your file is never uploaded.",
  "faqs": [("What can I convert?", "Supported text-based document formats into ebook-friendly output."),
           ("Will it work on my e-reader?", "EPUB-style output works with most readers and reading apps."),
           ("Is the layout preserved?", "Ebook formats reflow text, so fixed layouts become flowing content."),
           ("Are files uploaded?", "No. Everything runs in your browser."),
           ("Is it free?", "Yes, free for everyday use.")],
  "ko": {
   "kicker": "오피스 및 문서",
   "intro_title": "문서를 전자책 친화적 형식으로",
   "intro": "긴 문서는 화면에 맞춰 재배치되는 제대로 된 전자책 형식으로 읽으면 훨씬 편합니다. 전자책 변환기는 지원되는 문서 텍스트를 전자책 단말기나 읽기 앱에 올릴 수 있는 형식으로 바꿔, 메모·초안·문서를 어디서나 들고 다닐 수 있게 합니다.",
   "how_title": "전자책으로 변환하는 방법",
   "steps": [("파일 업로드", "지원되는 텍스트 기반 문서를 추가하세요. 브라우저에서 읽힙니다."),
             ("전자책 출력 형식 선택", "단말기에 맞는 전자책 친화적 형식을 고르세요."),
             ("전자책 다운로드", "변환된 파일을 저장해 읽기 앱에서 여세요.")],
   "why_title": "전자책 변환기를 쓰는 이유",
   "why": ["편안한 독서를 위한 전자책 출력", "브라우저 기반 변환",
           "설치 프로그램 없음", "파일에 워터마크 없음"],
   "best": ["깔끔한 텍스트 기반 원본 파일 사용", "서식을 단순하게 유지", "단말기에서 결과 확인"],
   "fixes": ["복잡한 레이아웃은 흐르는 텍스트로 단순화됨", "이미지는 수동 배치가 필요할 수 있음", "스캔 파일은 먼저 OCR 필요"],
   "privacy": "변환은 브라우저에서 실행되며 파일이 업로드되지 않습니다.",
   "faqs": [("무엇을 변환할 수 있나요?", "지원되는 텍스트 기반 문서 형식을 전자책 친화적 출력으로 변환합니다."),
            ("내 전자책 단말기에서 되나요?", "EPUB 형식의 출력은 대부분의 단말기·읽기 앱과 호환됩니다."),
            ("레이아웃이 유지되나요?", "전자책 형식은 텍스트를 재배치하므로 고정 레이아웃이 흐르는 콘텐츠가 됩니다."),
            ("파일이 업로드되나요?", "아니요. 모든 처리가 브라우저에서 이뤄집니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료입니다.")],
  },
 },
 "image to pdf/image-to-pdf.html": {
  "url": f"{BASE}/image%20to%20pdf/image-to-pdf.html", "name": "Image to PDF Converter",
  "sw_desc": "Combine JPG, PNG, and WEBP images into a single multi-page PDF online.",
  "kicker": "Image", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Image", f"{BASE}/#tools"), ("Image to PDF", None)],
  "intro_title": "Combine images into a single PDF",
  "intro": "When you need to send several photos or scans as one neat file, a PDF beats a pile of loose images. This tool lets you drop in JPG, PNG, WEBP, and other images, arrange them in the right order, and save them as a single multi-page PDF, which is perfect for receipts, ID scans, portfolios, and homework.",
  "how_title": "How to convert images to PDF",
  "steps": [("Upload one or more images", "Drag in JPG, PNG, WEBP, or other images at once."),
            ("Arrange the order and layout", "Reorder the images and choose how each page is laid out."),
            ("Download your PDF", "Save a single multi-page PDF containing all your images.")],
  "why_title": "Why convert images to PDF here",
  "why": ["Merge many images into one PDF", "Supports JPG, PNG, WEBP and more",
          "Reorder pages before saving", "Browser-based and private"],
  "best": ["Upload images in order, or drag to reorder", "Use consistent orientation", "Higher-resolution images print better"],
  "fixes": ["Wrong order? Drag to rearrange before exporting", "Mixed sizes? Choose a fit-to-page layout", "Huge files? Compress images first"],
  "privacy": "Your images are combined in your browser and are never uploaded to our servers.",
  "faqs": [("Can I add multiple images?", "Yes. Add as many as you like and arrange them into pages."),
           ("Which image formats are supported?", "JPG, PNG, WEBP, and other common formats."),
           ("Can I reorder the pages?", "Yes, arrange images before saving the PDF."),
           ("Are my images uploaded?", "No. The PDF is built in your browser."),
           ("Is it free?", "Yes, free for everyday use with Pro removing daily limits.")],
  "ko": {
   "kicker": "이미지",
   "intro_title": "여러 이미지를 하나의 PDF로",
   "intro": "사진이나 스캔본 여러 장을 깔끔한 한 파일로 보내야 할 때, 흩어진 이미지 더미보다 PDF가 낫습니다. 이 도구는 JPG, PNG, WEBP 등 이미지를 넣고 순서를 정리해 여러 페이지짜리 PDF 하나로 저장합니다. 영수증, 신분증 스캔, 포트폴리오, 과제에 안성맞춤입니다.",
   "how_title": "이미지를 PDF로 변환하는 방법",
   "steps": [("이미지 한 장 이상 업로드", "JPG, PNG, WEBP 등 이미지를 한 번에 끌어다 놓으세요."),
             ("순서와 레이아웃 정리", "이미지 순서를 바꾸고 각 페이지 배치 방식을 고르세요."),
             ("PDF 다운로드", "모든 이미지가 담긴 여러 페이지 PDF 하나를 저장하세요.")],
   "why_title": "여기서 이미지를 PDF로 변환하는 이유",
   "why": ["여러 이미지를 하나의 PDF로 병합", "JPG, PNG, WEBP 등 지원",
           "저장 전에 페이지 순서 변경", "브라우저 기반이며 비공개"],
   "best": ["원하는 순서로 업로드하거나 끌어서 정렬", "방향을 일관되게 유지", "고해상도 이미지가 인쇄에 더 좋음"],
   "fixes": ["순서가 틀렸나요? 내보내기 전에 끌어서 재배치하세요", "크기가 제각각인가요? 페이지 맞춤 레이아웃을 고르세요", "파일이 너무 큰가요? 이미지를 먼저 압축하세요"],
   "privacy": "이미지는 브라우저에서 합쳐지며 서버로 업로드되지 않습니다.",
   "faqs": [("여러 이미지를 추가할 수 있나요?", "네. 원하는 만큼 추가해 페이지로 정리할 수 있습니다."),
            ("어떤 이미지 형식을 지원하나요?", "JPG, PNG, WEBP 등 일반적인 형식입니다."),
            ("페이지 순서를 바꿀 수 있나요?", "네, PDF로 저장하기 전에 이미지를 정렬하세요."),
            ("내 이미지가 업로드되나요?", "아니요. PDF는 브라우저에서 만들어집니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료이며 Pro는 일일 한도를 없앱니다.")],
  },
 },
 "image converter/image-converter.html": {
  "url": f"{BASE}/image%20converter/image-converter.html", "name": "Image Converter",
  "sw_desc": "Convert images between JPG, PNG, WEBP, and SVG formats online and in your browser.",
  "kicker": "Image", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Image", f"{BASE}/#tools"), ("Image Converter", None)],
  "intro_title": "Convert images between formats",
  "intro": "Different tasks need different image formats: PNG for transparency, JPG for small photos, WEBP for fast websites, and SVG for crisp logos. This converter switches your image between popular formats in seconds, right in your browser, so you always have the right file for the job without installing an editor.",
  "how_title": "How to convert an image",
  "steps": [("Upload your image", "Add a JPG, PNG, WEBP, HEIC, or other image file."),
            ("Choose the output format", "Pick the target format that fits your use case."),
            ("Download the converted image", "Save the new file instantly, with no watermark.")],
  "why_title": "Why use this image converter",
  "why": ["Convert between JPG, PNG, WEBP, SVG and more", "Fast, browser-based processing",
          "No quality-destroying re-uploads", "No watermark on your file"],
  "best": ["Use PNG for transparency and sharp edges", "Use JPG or WEBP for smaller photos", "Start from the highest-quality source"],
  "fixes": ["Need transparency? Convert to PNG or WEBP", "File too big? Try WEBP or JPG", "Logos blurry? Use SVG where possible"],
  "privacy": "Images are converted locally in your browser and are never uploaded.",
  "faqs": [("Which formats can I convert between?", "Common formats including JPG, PNG, WEBP, and SVG."),
           ("Will converting reduce quality?", "Converting to a lossless format like PNG preserves quality; JPG and WEBP trade some quality for smaller size."),
           ("Can I convert WEBP to PNG or HEIC to JPG?", "Yes. Those common conversions are supported."),
           ("Are my images uploaded?", "No, conversion runs in your browser."),
           ("Is it free?", "Yes, free for everyday use.")],
  "ko": {
   "kicker": "이미지",
   "intro_title": "이미지를 형식 간에 변환",
   "intro": "작업마다 필요한 이미지 형식이 다릅니다. 투명도는 PNG, 작은 사진은 JPG, 빠른 웹사이트는 WEBP, 선명한 로고는 SVG가 좋습니다. 이 변환기는 브라우저에서 바로 이미지를 인기 형식 간에 몇 초 만에 바꿔, 편집기를 설치하지 않고도 항상 알맞은 파일을 갖출 수 있게 합니다.",
   "how_title": "이미지를 변환하는 방법",
   "steps": [("이미지 업로드", "JPG, PNG, WEBP, HEIC 등 이미지 파일을 추가하세요."),
             ("출력 형식 선택", "용도에 맞는 대상 형식을 고르세요."),
             ("변환된 이미지 다운로드", "워터마크 없이 새 파일을 즉시 저장하세요.")],
   "why_title": "이 이미지 변환기를 쓰는 이유",
   "why": ["JPG, PNG, WEBP, SVG 등 상호 변환", "빠른 브라우저 기반 처리",
           "품질을 떨어뜨리는 재업로드 없음", "파일에 워터마크 없음"],
   "best": ["투명도와 선명한 가장자리에는 PNG 사용", "작은 사진에는 JPG 또는 WEBP 사용", "가장 높은 품질의 원본에서 시작"],
   "fixes": ["투명도가 필요한가요? PNG나 WEBP로 변환하세요", "파일이 너무 큰가요? WEBP나 JPG를 시도하세요", "로고가 흐린가요? 가능하면 SVG를 사용하세요"],
   "privacy": "이미지는 브라우저에서 로컬로 변환되며 업로드되지 않습니다.",
   "faqs": [("어떤 형식 간에 변환할 수 있나요?", "JPG, PNG, WEBP, SVG 등 일반적인 형식입니다."),
            ("변환하면 품질이 떨어지나요?", "PNG 같은 무손실 형식으로 변환하면 품질이 유지됩니다. JPG와 WEBP는 더 작은 용량을 위해 약간의 품질을 절충합니다."),
            ("WEBP를 PNG로, HEIC를 JPG로 변환할 수 있나요?", "네. 그런 일반적인 변환을 지원합니다."),
            ("내 이미지가 업로드되나요?", "아니요, 변환은 브라우저에서 실행됩니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료입니다.")],
  },
 },
 "media converter/media-converter.html": {
  "url": f"{BASE}/media%20converter/media-converter.html", "name": "Video and Audio Converter",
  "sw_desc": "Convert video and audio files between formats in your browser with FFmpeg.",
  "kicker": "Video &amp; Audio", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Video &amp; Audio", f"{BASE}/#tools"), ("Media Converter", None)],
  "intro_title": "Convert video and audio files in your browser",
  "intro": "Extract the audio from a video, switch a clip to a more compatible format, or shrink a file so it plays anywhere, all without uploading your media to a stranger's server. This converter uses in-browser FFmpeg to transcode video and audio locally, so even large personal files stay completely private.",
  "how_title": "How to convert media files",
  "steps": [("Upload your video or audio", "Add an MP4, MOV, MP3, WAV, or other media file."),
            ("Choose the output format", "Select the target format, such as MP4 or MP3."),
            ("Download the converted file", "Save the result once the in-browser conversion finishes.")],
  "why_title": "Why convert media here",
  "why": ["Convert between MP4, MP3, MOV, WAV and more", "Extract audio from video",
          "Runs locally with in-browser FFmpeg", "Your media is never uploaded"],
  "best": ["Shorter clips convert fastest", "Use a desktop for large files", "Pick a widely supported format like MP4 or MP3"],
  "fixes": ["Slow on big files? Try a desktop browser", "Playback issues? Convert to MP4 or MP3", "Out of memory? Convert in smaller pieces"],
  "privacy": "Transcoding runs entirely in your browser with FFmpeg, so your files never leave your device.",
  "faqs": [("What formats are supported?", "Popular video and audio formats such as MP4, MP3, MOV, and WAV."),
           ("Can I extract audio from a video?", "Yes. Convert a video like MP4 straight to MP3 or another audio format."),
           ("Are my files uploaded?", "No. Conversion runs locally in your browser using FFmpeg."),
           ("Why is a large file slow?", "In-browser conversion uses your device's resources, so big files take longer; a desktop helps."),
           ("Is it free?", "Yes, free for everyday use with Pro removing daily limits.")],
  "ko": {
   "kicker": "비디오 및 오디오",
   "intro_title": "브라우저에서 비디오·오디오 변환",
   "intro": "영상에서 오디오만 추출하거나, 클립을 더 호환성 좋은 형식으로 바꾸거나, 어디서나 재생되도록 파일을 줄이는 일을 낯선 서버에 미디어를 올리지 않고 할 수 있습니다. 이 변환기는 브라우저 내 FFmpeg로 비디오·오디오를 로컬에서 변환하므로, 큰 개인 파일도 완전히 비공개로 유지됩니다.",
   "how_title": "미디어 파일을 변환하는 방법",
   "steps": [("비디오 또는 오디오 업로드", "MP4, MOV, MP3, WAV 등 미디어 파일을 추가하세요."),
             ("출력 형식 선택", "MP4나 MP3 같은 대상 형식을 고르세요."),
             ("변환된 파일 다운로드", "브라우저 내 변환이 끝나면 결과를 저장하세요.")],
   "why_title": "여기서 미디어를 변환하는 이유",
   "why": ["MP4, MP3, MOV, WAV 등 상호 변환", "영상에서 오디오 추출",
           "브라우저 내 FFmpeg로 로컬 실행", "미디어가 업로드되지 않음"],
   "best": ["짧은 클립이 가장 빠르게 변환됨", "큰 파일은 데스크톱 사용", "MP4·MP3처럼 널리 지원되는 형식 선택"],
   "fixes": ["큰 파일에서 느린가요? 데스크톱 브라우저를 사용하세요", "재생 문제가 있나요? MP4나 MP3로 변환하세요", "메모리가 부족한가요? 더 작은 단위로 변환하세요"],
   "privacy": "변환은 브라우저에서 FFmpeg로 전부 실행되므로 파일이 기기를 떠나지 않습니다.",
   "faqs": [("어떤 형식을 지원하나요?", "MP4, MP3, MOV, WAV 등 인기 비디오·오디오 형식입니다."),
            ("영상에서 오디오를 추출할 수 있나요?", "네. MP4 같은 영상을 바로 MP3나 다른 오디오 형식으로 변환하세요."),
            ("내 파일이 업로드되나요?", "아니요. 변환은 FFmpeg로 브라우저에서 로컬로 실행됩니다."),
            ("큰 파일은 왜 느린가요?", "브라우저 내 변환은 기기 자원을 사용하므로 큰 파일은 더 오래 걸립니다. 데스크톱이 도움이 됩니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료이며 Pro는 일일 한도를 없앱니다.")],
  },
 },
 "gif converter/gif-converter.html": {
  "url": f"{BASE}/gif%20converter/gif-converter.html", "name": "GIF Converter",
  "sw_desc": "Create GIFs from videos and images, or convert GIFs to MP4, in your browser.",
  "kicker": "GIF", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("GIF", f"{BASE}/#tools"), ("GIF Converter", None)],
  "intro_title": "Make GIFs from videos and images",
  "intro": "GIFs are the quickest way to share a short, looping moment, whether it is a reaction, a demo, or a highlight. This converter turns video clips, animated formats, and image sequences into smooth GIFs, and can turn GIFs back into MP4, with control over size and frame rate so your loop stays sharp without becoming huge.",
  "how_title": "How to convert to GIF",
  "steps": [("Upload your source file", "Add a video, an animated file, or a set of images."),
            ("Choose your GIF settings", "Set the size and frame rate to balance quality and file size."),
            ("Download the converted file", "Save your GIF, ready to share anywhere.")],
  "why_title": "Why use this GIF converter",
  "why": ["Convert MP4, WEBM, and images to GIF", "Turn GIFs back into MP4",
          "Control size and frame rate", "Browser-based and private"],
  "best": ["Keep clips short for smaller GIFs", "Lower the frame rate to shrink file size", "Trim to the key moment"],
  "fixes": ["GIF too large? Reduce dimensions or frame rate", "Choppy? Raise the frame rate slightly", "Need sound? Use MP4 instead"],
  "privacy": "GIFs are created in your browser, so your source files are never uploaded.",
  "faqs": [("What can I turn into a GIF?", "Videos such as MP4 and WEBM, animated formats, and image sequences."),
           ("Can I convert a GIF to MP4?", "Yes. GIF to MP4 is supported and produces a much smaller file."),
           ("How do I keep the file size down?", "Use short clips, smaller dimensions, and a lower frame rate."),
           ("Are my files uploaded?", "No. Conversion runs in your browser."),
           ("Is it free?", "Yes, free for everyday use.")],
  "ko": {
   "kicker": "GIF",
   "intro_title": "비디오와 이미지로 GIF 만들기",
   "intro": "GIF는 반응, 데모, 하이라이트 등 짧게 반복되는 순간을 공유하는 가장 빠른 방법입니다. 이 변환기는 영상 클립, 애니메이션 형식, 이미지 시퀀스를 부드러운 GIF로 만들고, GIF를 다시 MP4로도 바꿉니다. 크기와 프레임 속도를 조절해 너무 커지지 않으면서도 선명한 루프를 유지할 수 있습니다.",
   "how_title": "GIF로 변환하는 방법",
   "steps": [("원본 파일 업로드", "영상, 애니메이션 파일, 또는 이미지 묶음을 추가하세요."),
             ("GIF 설정 선택", "품질과 용량의 균형을 위해 크기와 프레임 속도를 설정하세요."),
             ("변환된 파일 다운로드", "어디든 공유할 수 있는 GIF를 저장하세요.")],
   "why_title": "이 GIF 변환기를 쓰는 이유",
   "why": ["MP4, WEBM, 이미지를 GIF로 변환", "GIF를 다시 MP4로 변환",
           "크기와 프레임 속도 조절", "브라우저 기반이며 비공개"],
   "best": ["작은 GIF를 위해 클립을 짧게 유지", "용량을 줄이려면 프레임 속도 낮추기", "핵심 순간만 잘라내기"],
   "fixes": ["GIF가 너무 큰가요? 크기나 프레임 속도를 줄이세요", "끊기나요? 프레임 속도를 약간 높이세요", "소리가 필요한가요? MP4를 사용하세요"],
   "privacy": "GIF는 브라우저에서 만들어지므로 원본 파일이 업로드되지 않습니다.",
   "faqs": [("무엇을 GIF로 만들 수 있나요?", "MP4·WEBM 같은 영상, 애니메이션 형식, 이미지 시퀀스입니다."),
            ("GIF를 MP4로 변환할 수 있나요?", "네. GIF to MP4를 지원하며 훨씬 작은 파일을 만듭니다."),
            ("용량을 어떻게 줄이나요?", "짧은 클립, 더 작은 크기, 더 낮은 프레임 속도를 사용하세요."),
            ("내 파일이 업로드되나요?", "아니요. 변환은 브라우저에서 실행됩니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료입니다.")],
  },
 },
 "csv converter/csv-converter.html": {
  "url": f"{BASE}/csv%20converter/csv-converter.html", "name": "CSV Converter",
  "sw_desc": "Convert CSV to JSON, Excel, or XML, and convert Excel to CSV, online and in your browser.",
  "kicker": "Developer Tools", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Developer Tools", f"{BASE}/#tools"), ("CSV Converter", None)],
  "intro_title": "Convert CSV to JSON, Excel, and XML",
  "intro": "CSV is everywhere, but you often need it in another shape: JSON for an API, XLSX for a colleague, or XML for an import. This converter transforms CSV and Excel files between formats in your browser, so you can reshape data quickly without writing a script or pasting it into an online box you do not trust.",
  "how_title": "How to convert a CSV file",
  "steps": [("Upload your CSV or Excel file", "Add a CSV, TSV, XLSX, or XLS file."),
            ("Choose the output format", "Pick JSON, Excel, XML, or CSV as your target."),
            ("Download the converted file", "Save the result, ready for your app or spreadsheet.")],
  "why_title": "Why use this CSV converter",
  "why": ["Convert CSV to JSON, Excel, or XML", "Convert Excel back to CSV",
          "Runs in your browser", "Handles common delimiters"],
  "best": ["Use a header row for clean field names", "Keep consistent columns", "A UTF-8 source avoids encoding issues"],
  "fixes": ["Garbled characters? Save the source as UTF-8", "Wrong split? Check the delimiter", "Big files? Convert in batches"],
  "privacy": "Your data is converted in your browser and is never uploaded to our servers.",
  "faqs": [("What can I convert CSV into?", "JSON, Excel (XLSX), and XML."),
           ("Can I convert Excel to CSV?", "Yes. Upload an XLSX or XLS file and export CSV."),
           ("Does it handle different delimiters?", "Yes. Common delimiters like commas, tabs, and semicolons are supported."),
           ("Is my data uploaded?", "No, conversion runs locally in your browser."),
           ("Is it free?", "Yes, free for everyday use.")],
  "ko": {
   "kicker": "개발자 도구",
   "intro_title": "CSV를 JSON, 엑셀, XML로 변환",
   "intro": "CSV는 어디에나 있지만, 종종 다른 형태가 필요합니다. API에는 JSON, 동료에게는 XLSX, 가져오기에는 XML이 필요하죠. 이 변환기는 CSV와 엑셀 파일을 브라우저에서 형식 간에 변환해, 스크립트를 작성하거나 믿을 수 없는 온라인 입력창에 붙여넣지 않고도 데이터를 빠르게 재구성할 수 있습니다.",
   "how_title": "CSV 파일을 변환하는 방법",
   "steps": [("CSV 또는 엑셀 파일 업로드", "CSV, TSV, XLSX, XLS 파일을 추가하세요."),
             ("출력 형식 선택", "JSON, 엑셀, XML, CSV 중 대상을 고르세요."),
             ("변환된 파일 다운로드", "앱이나 스프레드시트에 바로 쓸 결과를 저장하세요.")],
   "why_title": "이 CSV 변환기를 쓰는 이유",
   "why": ["CSV를 JSON, 엑셀, XML로 변환", "엑셀을 다시 CSV로 변환",
           "브라우저에서 실행", "일반적인 구분자 처리"],
   "best": ["깔끔한 필드 이름을 위해 헤더 행 사용", "열을 일관되게 유지", "UTF-8 원본은 인코딩 문제를 방지"],
   "fixes": ["글자가 깨지나요? 원본을 UTF-8로 저장하세요", "잘못 나뉘나요? 구분자를 확인하세요", "큰 파일인가요? 나눠서 변환하세요"],
   "privacy": "데이터는 브라우저에서 변환되며 서버로 업로드되지 않습니다.",
   "faqs": [("CSV를 무엇으로 변환할 수 있나요?", "JSON, 엑셀(XLSX), XML입니다."),
            ("엑셀을 CSV로 변환할 수 있나요?", "네. XLSX 또는 XLS 파일을 올려 CSV로 내보내세요."),
            ("다양한 구분자를 처리하나요?", "네. 쉼표, 탭, 세미콜론 같은 일반적인 구분자를 지원합니다."),
            ("내 데이터가 업로드되나요?", "아니요, 변환은 브라우저에서 로컬로 실행됩니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료입니다.")],
  },
 },
 "json to csv/json-to-csv.html": {
  "url": f"{BASE}/json%20to%20csv/json-to-csv.html", "name": "JSON to CSV Converter",
  "sw_desc": "Convert JSON arrays into CSV spreadsheets you can open in Excel or Google Sheets.",
  "kicker": "Developer Tools", "kind": "full",
  "crumbs": [("Home", f"{BASE}/"), ("Developer Tools", f"{BASE}/#tools"), ("JSON to CSV", None)],
  "intro_title": "Convert JSON to CSV",
  "intro": "JSON is great for APIs but hard to read in a spreadsheet. This tool flattens your JSON array of objects into clean CSV rows and columns you can open directly in Excel, Google Sheets, or any data tool, which is perfect for turning an API response into a report.",
  "how_title": "How to convert JSON to CSV",
  "steps": [("Add your JSON", "Upload or paste a JSON array of objects."),
            ("Convert to CSV", "The data is flattened into rows and columns in your browser."),
            ("Download the CSV file", "Save a CSV ready for Excel, Sheets, or Numbers.")],
  "why_title": "Why convert JSON to CSV here",
  "why": ["Flattens JSON arrays into rows and columns", "Opens in Excel and Google Sheets",
          "Browser-based and private", "No sign-up needed for everyday use"],
  "best": ["Use an array of objects with consistent keys", "Flatten nested data where possible", "Keep field names simple"],
  "fixes": ["Nested objects? Flatten them first", "Missing columns? Ensure consistent keys", "Encoding issues? Use UTF-8"],
  "privacy": "Conversion runs in your browser, so your JSON never leaves your device.",
  "faqs": [("What JSON structure works best?", "An array of objects with consistent keys maps cleanly to CSV rows and columns."),
           ("Can it handle nested JSON?", "Deeply nested data converts best when flattened first."),
           ("Where can I open the CSV?", "Excel, Google Sheets, Numbers, and any data tool."),
           ("Is my data uploaded?", "No. Conversion runs locally in your browser."),
           ("Is it free?", "Yes, free for everyday use.")],
  "ko": {
   "kicker": "개발자 도구",
   "intro_title": "JSON을 CSV로 변환",
   "intro": "JSON은 API에는 훌륭하지만 스프레드시트에서 읽기는 어렵습니다. 이 도구는 객체 배열 형태의 JSON을 깔끔한 CSV 행과 열로 펼쳐, Excel·Google Sheets·여러 데이터 도구에서 바로 열 수 있게 합니다. API 응답을 보고서로 만들 때 안성맞춤입니다.",
   "how_title": "JSON을 CSV로 변환하는 방법",
   "steps": [("JSON 추가", "객체 배열 형태의 JSON을 올리거나 붙여넣으세요."),
             ("CSV로 변환", "데이터가 브라우저에서 행과 열로 펼쳐집니다."),
             ("CSV 파일 다운로드", "Excel, Sheets, Numbers에 바로 쓸 CSV를 저장하세요.")],
   "why_title": "여기서 JSON을 CSV로 변환하는 이유",
   "why": ["JSON 배열을 행과 열로 펼침", "Excel·Google Sheets에서 열림",
           "브라우저 기반이며 비공개", "일상적 사용에 가입 불필요"],
   "best": ["키가 일관된 객체 배열 사용", "가능하면 중첩 데이터를 펼치기", "필드 이름을 단순하게 유지"],
   "fixes": ["중첩 객체인가요? 먼저 펼치세요", "열이 빠지나요? 키를 일관되게 맞추세요", "인코딩 문제인가요? UTF-8을 사용하세요"],
   "privacy": "변환은 브라우저에서 실행되므로 JSON이 기기를 떠나지 않습니다.",
   "faqs": [("어떤 JSON 구조가 가장 좋나요?", "키가 일관된 객체 배열은 CSV 행과 열로 깔끔하게 매핑됩니다."),
            ("중첩된 JSON도 처리하나요?", "깊게 중첩된 데이터는 먼저 펼치면 가장 잘 변환됩니다."),
            ("CSV를 어디서 열 수 있나요?", "Excel, Google Sheets, Numbers, 그리고 모든 데이터 도구입니다."),
            ("내 데이터가 업로드되나요?", "아니요. 변환은 브라우저에서 로컬로 실행됩니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료입니다.")],
  },
 },
 "qr code generator/qr-code-generator.html": {
  "url": f"{BASE}/qr%20code%20generator/qr-code-generator.html", "name": "QR Code Generator",
  "sw_desc": "Create free, high-resolution QR codes for links, text, and more in your browser.",
  "kicker": "Tools", "kind": "faq",
  "crumbs": [("Home", f"{BASE}/"), ("Tools", f"{BASE}/#tools"), ("QR Code Generator", None)],
  "intro_title": "Create custom QR codes for free",
  "intro": "A QR code turns a link, message, or contact into a square that anyone can scan with a phone camera. Use them on posters, packaging, business cards, menus, and slides to send people straight to a website, Wi-Fi network, or phone number. This generator builds high-resolution QR codes in your browser and lets you download them instantly, with no watermark.",
  "faqs": [("What can a QR code contain?", "Links, plain text, and other short data that phones can scan."),
           ("Do the codes expire?", "No. A standard QR code encodes the data directly and works as long as the destination exists."),
           ("Can I use them commercially?", "Yes. The codes you generate are free to use, with no watermark."),
           ("What size should I use for print?", "Download a large, high-contrast image and test the scan before printing."),
           ("Is it free?", "Yes, completely free to generate and download.")],
  "ko": {
   "kicker": "도구",
   "intro_title": "무료로 맞춤 QR 코드 만들기",
   "intro": "QR 코드는 링크, 메시지, 연락처를 누구나 휴대폰 카메라로 스캔할 수 있는 사각형으로 바꿉니다. 포스터, 포장, 명함, 메뉴, 슬라이드에 넣어 사람들을 웹사이트, Wi-Fi 네트워크, 전화번호로 바로 안내하세요. 이 생성기는 브라우저에서 고해상도 QR 코드를 만들고 워터마크 없이 즉시 내려받게 합니다.",
   "faqs": [("QR 코드에는 무엇을 담을 수 있나요?", "링크, 일반 텍스트, 그리고 휴대폰이 스캔할 수 있는 짧은 데이터입니다."),
            ("코드가 만료되나요?", "아니요. 표준 QR 코드는 데이터를 직접 인코딩하므로 대상이 존재하는 한 계속 작동합니다."),
            ("상업적으로 사용할 수 있나요?", "네. 생성한 코드는 워터마크 없이 자유롭게 사용할 수 있습니다."),
            ("인쇄용은 어떤 크기가 좋나요?", "크고 대비가 높은 이미지를 내려받아 인쇄 전에 스캔을 테스트하세요."),
            ("무료인가요?", "네, 생성과 다운로드 모두 완전히 무료입니다.")],
  },
 },
 "pdf tools/pdf-tools.html": {
  "url": f"{BASE}/pdf%20tools/pdf-tools.html", "name": "PDF Tools",
  "sw_desc": "Merge, split, compress, rotate, extract, and organize PDF pages in your browser.",
  "kicker": "PDF &amp; Documents", "kind": "faq",
  "crumbs": [("Home", f"{BASE}/"), ("PDF &amp; Documents", f"{BASE}/#tools"), ("PDF Tools", None)],
  "intro_title": "All-in-one PDF tools",
  "intro": "Everything you need to manage PDFs in one place: merge several files into one, split a big document, compress, rotate, extract, and organize pages, all in your browser. There is no need to install desktop software or upload sensitive documents to a server; the tools work locally so your files stay private.",
  "faqs": [("What can I do with these PDF tools?", "Common tasks like merging, splitting, compressing, rotating, extracting, and organizing PDF pages."),
           ("Are my PDFs uploaded?", "No. The tools run in your browser and your files stay on your device."),
           ("Is there a watermark?", "No watermark is added to your files."),
           ("Do I need to install anything?", "No software is needed; everything works in a modern browser."),
           ("Is it free?", "Yes, free for everyday use with Pro removing daily limits.")],
  "ko": {
   "kicker": "PDF 및 문서",
   "intro_title": "올인원 PDF 도구",
   "intro": "PDF 관리를 위한 모든 기능을 한곳에서: 여러 파일을 하나로 병합, 큰 문서 분할, 압축, 회전, 추출, 페이지 정리까지 전부 브라우저에서 가능합니다. 데스크톱 소프트웨어를 설치하거나 민감한 문서를 서버에 올릴 필요가 없습니다. 도구가 로컬에서 작동하므로 파일이 비공개로 유지됩니다.",
   "faqs": [("이 PDF 도구로 무엇을 할 수 있나요?", "병합, 분할, 압축, 회전, 추출, 페이지 정리 같은 일반적인 작업입니다."),
            ("내 PDF가 업로드되나요?", "아니요. 도구는 브라우저에서 실행되며 파일이 기기에 그대로 남습니다."),
            ("워터마크가 있나요?", "파일에 워터마크가 추가되지 않습니다."),
            ("무언가 설치해야 하나요?", "소프트웨어가 필요 없습니다. 모든 기능이 최신 브라우저에서 작동합니다."),
            ("무료인가요?", "네, 일상적인 사용은 무료이며 Pro는 일일 한도를 없앱니다.")],
  },
 },
}


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    done, skipped = [], []
    for rel, p in PAGES.items():
        path = os.path.join(here, *rel.split("/"))
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()
        if "data-static" in html:
            skipped.append(rel)
            continue
        ld = jsonld(p["name"], p["url"], p["sw_desc"], p["crumbs"], p["faqs"])
        block = faq_only_block(p) if p["kind"] == "faq" else full_block(p)
        html = html.replace("<!-- SEO:END -->", "<!-- SEO:END -->\n" + ld, 1)
        html = html.replace("</main>", block + "</main>", 1)
        if "static-i18n.js" not in html:
            html = html.replace("</body>", '<script src="../static-i18n.js"></script>\n</body>', 1)
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(html)
        done.append(rel)
    print("Updated %d pages:" % len(done))
    for d in done:
        print("  +", d)
    if skipped:
        print("Skipped %d (already had data-static):" % len(skipped))
        for s in skipped:
            print("  -", s)


if __name__ == "__main__":
    main()
