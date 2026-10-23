/* MN-Bot — a small rule-based assistant. No server, no AI API: it matches keywords
   against what's on this site, so every answer stays accurate. EN / DE, plus Persian
   for the most common questions. */
(function () {
  const PAGE_LANG = document.documentElement.lang === "de" ? "de" : "en";
  const ROOT = new URL("..", document.currentScript.src).href;
  const HOME = ROOT + (PAGE_LANG === "de" ? "de/index.html" : "index.html");
  const BLOG = ROOT + (PAGE_LANG === "de" ? "de/blog.html" : "blog.html");
  const LINKEDIN = "https://www.linkedin.com/in/mohammadreza-nobahari-54370526a";
  const GITHUB = "https://github.com/mmdrz-n";
  const EMAIL = "mreza.nobahari@gmail.com";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const link = (href, text) => `<a href="${href}"${/^https?:/.test(href) && !href.startsWith(ROOT) ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  const postsList = (lang) =>
    (window.POSTS || [])
      .slice(0, 4)
      .map((p) => `• ${link(`${ROOT}posts/${p.slug}.html`, esc(lang === "de" ? p.title_de : p.title))}`)
      .join("<br>");

  const UI = {
    en: { open: "Chat with MN-Bot", title: "MN-Bot", sub: "Ask me about Mohammadreza", placeholder: "Ask something…", send: "Send", close: "Close chat",
      chips: ["What do you do?", "Certifications", "Are you available?", "Latest articles", "subnet 10.0.0.0/22", "Tell me a joke"] },
    de: { open: "Mit MN-Bot chatten", title: "MN-Bot", sub: "Fragen Sie mich zu Mohammadreza", placeholder: "Frage eingeben …", send: "Senden", close: "Chat schließen",
      chips: ["Was machst du?", "Zertifikate", "Verfügbar?", "Neueste Artikel", "subnet 10.0.0.0/22", "Erzähl einen Witz"] },
  }[PAGE_LANG];

  // Each intent: keyword patterns + answers per language (fa optional, falls back to en).
  const INTENTS = [
    {
      id: "greet",
      re: /^(hi|hey|hello|hallo|moin|servus|guten (tag|morgen|abend)|salam|سلام|درود)\b/i,
      en: () => "Hi! 👋 I'm MN-Bot. I can tell you about Mohammadreza's skills, projects, certifications and availability, show his latest articles or even calculate a subnet. What would you like to know?",
      de: () => "Hallo! 👋 Ich bin MN-Bot. Ich erzähle Ihnen gern etwas über Mohammadrezas Skills, Projekte, Zertifikate und Verfügbarkeit, zeige die neuesten Artikel oder berechne ein Subnetz. Was möchten Sie wissen?",
      fa: () => "سلام! 👋 من MN-Bot هستم. می‌تونم درباره‌ی مهارت‌ها، پروژه‌ها، مدارک و آمادگی همکاری محمدرضا بگم، آخرین مقاله‌ها رو نشون بدم یا حتی یک ساب‌نت حساب کنم. چی دوست داری بدونی؟",
    },
    {
      id: "certs",
      re: /(cert|nse|zertifi|qualifi|مدرک|گواهی)/i,
      en: () => "Certifications: <b>Fortinet NSE 4</b> (FortiGate), plus NSE 1, 2 and 3.",
      de: () => "Zertifikate: <b>Fortinet NSE 4</b> (FortiGate) sowie NSE 1, 2 und 3.",
      fa: () => "مدارک: <b>Fortinet NSE 4</b> (فورتی‌گیت) و همچنین NSE 1، 2 و 3.",
    },
    {
      id: "education",
      re: /(educat|degree|bachelor|studi|ausbildung|abschluss|university|uni\b|تحصیل|دانشگاه|لیسانس)/i,
      en: () => "Education: <b>Bachelor's degree in IT Engineering</b> (completed) and vocational training as <b>IT Specialist for System Integration</b> (Fachinformatiker für Systemintegration), in progress.",
      de: () => "Ausbildung: <b>Bachelor in IT-Ingenieurwesen</b> (abgeschlossen) und die Ausbildung zum <b>Fachinformatiker für Systemintegration</b> (laufend).",
      fa: () => "تحصیلات: <b>کارشناسی مهندسی IT</b> (تمام‌شده) و دوره‌ی آوسبیلدونگ <b>Fachinformatiker für Systemintegration</b> در آلمان (در حال انجام).",
    },
    {
      id: "fortinet",
      re: /(forti|firewall|sophos|\bwaf\b|\bips\b|فایروال)/i,
      en: () => "Security is his core: <b>FortiGate</b> (policies, UTM, HA), <b>FortiWeb</b> WAF, <b>FortiAnalyzer</b> and <b>Sophos XG</b>, plus IPS tuning and Zero Trust concepts. Want a deep dive? Try " + link(`${ROOT}posts/fortigate-debug-flow-cheatsheet.html`, "the FortiGate debug flow cheat sheet") + ".",
      de: () => "Security ist sein Kern: <b>FortiGate</b> (Policies, UTM, HA), <b>FortiWeb</b>-WAF, <b>FortiAnalyzer</b> und <b>Sophos XG</b>, dazu IPS-Tuning und Zero Trust. Zum Vertiefen: " + link(`${ROOT}posts/fortigate-debug-flow-cheatsheet.html`, "FortiGate-Debug-Flow-Spickzettel") + " (Englisch).",
    },
    {
      id: "skills",
      re: /(skill|stack|tech|python|c\+\+|vlan|ospf|bgp|können|kenntnisse|fähigkeit|مهارت|بلدی)/i,
      en: () => `<b>Network:</b> switching, VLANs, OSPF/BGP, Wi-Fi, UniFi, Wireshark, IPsec VPN, Hyper-V<br><b>Security:</b> FortiGate, FortiWeb, FortiAnalyzer, Sophos XG, IPS, Zero Trust<br><b>Dev:</b> Python, C++, JavaScript, REST APIs, PowerShell, Git<br>${link(HOME + "#skills", "See all skills →")}`,
      de: () => `<b>Netzwerk:</b> Switching, VLANs, OSPF/BGP, WLAN, UniFi, Wireshark, IPsec-VPN, Hyper-V<br><b>Security:</b> FortiGate, FortiWeb, FortiAnalyzer, Sophos XG, IPS, Zero Trust<br><b>Entwicklung:</b> Python, C++, JavaScript, REST-APIs, PowerShell, Git<br>${link(HOME + "#skills", "Alle Skills →")}`,
      fa: () => `<b>شبکه:</b> سوئیچینگ، VLAN، OSPF/BGP، وای‌فای، UniFi، Wireshark، IPsec VPN<br><b>امنیت:</b> FortiGate، FortiWeb، FortiAnalyzer، Sophos XG<br><b>برنامه‌نویسی:</b> Python، C++، JavaScript، REST API، PowerShell<br>${link(HOME + "#skills", "همه‌ی مهارت‌ها ←")}`,
    },
    {
      id: "projects",
      re: /(project|portfolio|built|projekt|پروژه)/i,
      en: () => `Highlights: a <b>FortiGate Policy Engine</b> (Python + REST API), a custom <b>FortiWeb WAF ruleset</b>, a <b>multi-floor VLAN architecture</b>, a <b>threat intelligence dashboard</b>, a C++ <b>network inventory scanner</b> and a <b>Sophos XG rollout</b> across 50+ endpoints. ${link(HOME + "#projects", "View projects →")}`,
      de: () => `Highlights: eine <b>FortiGate Policy Engine</b> (Python + REST-API), ein eigenes <b>FortiWeb-WAF-Regelwerk</b>, eine <b>VLAN-Architektur über mehrere Etagen</b>, ein <b>Threat-Intelligence-Dashboard</b>, ein C++-<b>Inventarscanner</b> und ein <b>Sophos-XG-Rollout</b> auf über 50 Endpoints. ${link(HOME + "#projects", "Projekte ansehen →")}`,
      fa: () => `نمونه‌ها: <b>موتور پالیسی فورتی‌گیت</b> با پایتون، <b>قوانین WAF روی FortiWeb</b>، <b>طراحی VLAN چند طبقه</b>، <b>داشبورد تهدیدات</b> و <b>اسکنر شبکه با C++</b>. ${link(HOME + "#projects", "دیدن پروژه‌ها ←")}`,
    },
    {
      id: "hire",
      re: /(hire|available|availab|job offer|freelance|remote|work with|verfügbar|einstellen|anstellung|zusammenarbeit|stelle|kooperation|استخدام|همکاری|دورکاری|ریموت|کار)/i,
      en: () => `Yes, he's <b>available for work</b>: software or network engineering roles, security consulting, mentoring and freelance projects. Based in Germany and open to remote work, including for Iran. Best next step: ${link(LINKEDIN, "LinkedIn")} or ${link("mailto:" + EMAIL, EMAIL)}.`,
      de: () => `Ja, er ist <b>verfügbar</b>: für Rollen in Software- oder Netzwerk-Engineering, Security-Beratung, Mentoring und Freelance-Projekte. In Deutschland ansässig und offen für Remote-Arbeit. Am besten direkt über ${link(LINKEDIN, "LinkedIn")} oder ${link("mailto:" + EMAIL, EMAIL)}.`,
      fa: () => `بله، <b>آماده‌ی همکاری</b> هست: نقش‌های مهندسی نرم‌افزار و شبکه، مشاوره‌ی امنیت، منتورینگ و پروژه‌ی فریلنس. ساکن آلمان و برای کار ریموت، از جمله برای ایران، آماده است. از طریق ${link(LINKEDIN, "لینکدین")} یا ${link("mailto:" + EMAIL, "ایمیل")} در تماس باشید.`,
    },
    {
      id: "contact",
      re: /(contact|email|e-mail|mail|reach|linkedin|github|kontakt|erreichen|تماس|ایمیل|ارتباط)/i,
      en: () => `<b>Email:</b> ${link("mailto:" + EMAIL, EMAIL)}<br><b>LinkedIn:</b> ${link(LINKEDIN, "Mohammadreza Nobahari")}<br><b>GitHub:</b> ${link(GITHUB, "mmdrz-n")}`,
      de: () => `<b>E-Mail:</b> ${link("mailto:" + EMAIL, EMAIL)}<br><b>LinkedIn:</b> ${link(LINKEDIN, "Mohammadreza Nobahari")}<br><b>GitHub:</b> ${link(GITHUB, "mmdrz-n")}`,
      fa: () => `<b>ایمیل:</b> ${link("mailto:" + EMAIL, EMAIL)}<br><b>لینکدین:</b> ${link(LINKEDIN, "Mohammadreza Nobahari")}<br><b>گیت‌هاب:</b> ${link(GITHUB, "mmdrz-n")}`,
    },
    {
      id: "location",
      re: /(where|location|based|country|wo (bist|wohnst|lebst)|standort|کجا)/i,
      en: () => "He's based in <b>Germany</b> and open to remote work worldwide.",
      de: () => "Er lebt in <b>Deutschland</b> und ist offen für Remote-Arbeit weltweit.",
      fa: () => "ساکن <b>آلمان</b> هست و برای کار ریموت در هر جای دنیا آماده است.",
    },
    {
      id: "blog",
      re: /(blog|article|post|read|writ|artikel|beitr|lesen|مقاله|بلاگ|وبلاگ)/i,
      en: () => `Latest articles:<br>${postsList("en")}<br>${link(BLOG, "All articles →")}`,
      de: () => `Neueste Artikel (auf Englisch):<br>${postsList("de")}<br>${link(BLOG, "Alle Artikel →")}`,
      fa: () => `آخرین مقاله‌ها (انگلیسی):<br>${postsList("en")}<br>${link(BLOG, "همه‌ی مقاله‌ها ←")}`,
    },
    {
      id: "teach",
      re: /(teach|mentor|learn|unterricht|lehr|lernen|آموزش|یاد)/i,
      en: () => `Teaching is central for him: "Understand deeply. Build securely. Teach clearly." He mentors junior engineers and reviews lab setups. Try the ${link(HOME + "#lab", "Knowledge Lab")} or read ${link(`${ROOT}posts/learn-like-a-gamer.html`, "Learn Like a Gamer")}.`,
      de: () => `Wissensvermittlung ist ihm wichtig: „Tief verstehen. Sicher bauen. Klar vermitteln.“ Er betreut Junior-Engineers und prüft Lab-Setups. Probieren Sie das ${link(HOME + "#lab", "Wissenslabor")}.`,
    },
    {
      id: "game",
      re: /(game|play|fun|spiel|arcade|بازی|سرگرمی)/i,
      en: () => `Try <b>Subnet Sprint</b>: 60 seconds of subnetting and port questions, with a high score. ${link(HOME + "#arcade", "Play now →")} Or press <kbd>\`</kbd> anywhere to open the hacker terminal. 😎`,
      de: () => `Probieren Sie <b>Subnet Sprint</b>: 60 Sekunden Subnetting- und Port-Fragen, mit Highscore. ${link(HOME + "#arcade", "Jetzt spielen →")} Oder drücken Sie <kbd>^</kbd> (links neben der 1), um das Hacker-Terminal zu öffnen. 😎`,
      fa: () => `بازی <b>Subnet Sprint</b> رو امتحان کن: ۶۰ ثانیه سؤال ساب‌نتینگ و پورت با رکورد. ${link(HOME + "#arcade", "بزن بریم ←")} یا هر جای سایت کلید <kbd>\`</kbd> رو بزن تا ترمینال باز بشه. 😎`,
    },
    {
      id: "joke",
      re: /(joke|witz|funny|lustig|جوک|لطیفه)/i,
      en: () => pickOne([
        "Why did the network engineer break up with the router? Too many hops in the relationship. 💔",
        "I'd tell you a UDP joke, but you might not get it.",
        "It's not DNS. There's no way it's DNS. …It was DNS.",
        "A packet walks into a bar. The bartender says: “Sorry, we don't serve your type.” The packet says: “Fine, I'll just get NAT-ed.”",
      ]),
      de: () => pickOne([
        "Ich würde Ihnen einen UDP-Witz erzählen, aber vielleicht kommt er nicht an.",
        "Es ist nicht DNS. Es kann nicht DNS sein. … Es war DNS.",
        "Warum verirren sich Netzwerker nie? Sie folgen immer der Default-Route.",
      ]),
    },
    // broad words ("about", "who") last, so "tell me about your certifications" hits certs
    {
      id: "about",
      re: /(who|what do you do|about|beruf|wer bist|was machst|was macht|\brole\b|rolle|کی هستی|چیکار|چه کار|معرفی)/i,
      en: () => `Mohammadreza is a <b>Network &amp; Security Engineer</b> based in Germany, working at the intersection of networking, security and Python automation, and he loves teaching how systems work. More: ${link(HOME + "#about", "About section")}.`,
      de: () => `Mohammadreza ist <b>Network &amp; Security Engineer</b> in Deutschland. Er verbindet Netzwerk, Security und Python-Automatisierung und vermittelt gern, wie Systeme funktionieren. Mehr: ${link(HOME + "#about", "Über mich")}.`,
      fa: () => `محمدرضا یک <b>مهندس شبکه و امنیت</b> ساکن آلمانه که روی شبکه، امنیت و اتوماسیون با پایتون کار می‌کنه و عاشق آموزش دادنه. بیشتر: ${link(HOME + "#about", "درباره من")}.`,
    },
    {
      id: "thanks",
      re: /(thank|thx|danke|merci|ممنون|مرسی|سپاس)/i,
      en: () => "You're welcome! 😊 Anything else?",
      de: () => "Gern geschehen! 😊 Noch etwas?",
      fa: () => "خواهش می‌کنم! 😊 سؤال دیگه‌ای داری؟",
    },
    {
      id: "bot",
      re: /(are you (a bot|ai|human)|bist du (ein bot|ki)|chatgpt|claude|ربات)/i,
      en: () => "I'm a small rule-based bot running entirely in your browser: no tracking, no AI API, no data sent anywhere. I only know what's on this site, so I won't make things up. 🤖",
      de: () => "Ich bin ein kleiner regelbasierter Bot, der komplett in Ihrem Browser läuft: kein Tracking, keine KI-API, keine Datenübertragung. Ich weiß nur, was auf dieser Website steht. 🤖",
      fa: () => "من یک ربات ساده‌ام که کاملاً داخل مرورگر خودت اجرا می‌شه: بدون ردیابی و بدون ارسال داده. فقط چیزهایی رو می‌دونم که روی همین سایته. 🤖",
    },
  ];

  const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

  const FALLBACK = {
    en: "Hmm, I'm not sure about that one. 🤔 I can answer questions about <b>skills</b>, <b>projects</b>, <b>certifications</b>, <b>education</b>, <b>availability</b>, <b>contact</b> and <b>articles</b>, or calculate a subnet (try <code>subnet 192.168.10.0/26</code>). For anything else: " + link("mailto:" + EMAIL, "send Mohammadreza an email") + ".",
    de: "Hmm, da bin ich mir nicht sicher. 🤔 Ich kann Fragen zu <b>Skills</b>, <b>Projekten</b>, <b>Zertifikaten</b>, <b>Ausbildung</b>, <b>Verfügbarkeit</b>, <b>Kontakt</b> und <b>Artikeln</b> beantworten oder ein Subnetz berechnen (z. B. <code>subnet 192.168.10.0/26</code>). Für alles andere: " + link("mailto:" + EMAIL, "schreiben Sie Mohammadreza eine E-Mail") + ".",
    fa: "مطمئن نیستم 🤔 می‌تونم درباره‌ی <b>مهارت‌ها</b>، <b>پروژه‌ها</b>، <b>مدارک</b>، <b>تحصیلات</b>، <b>همکاری</b> و <b>تماس</b> جواب بدم یا یک ساب‌نت حساب کنم (مثلاً <code>subnet 192.168.10.0/26</code>). برای بقیه‌ی سؤال‌ها: " + link("mailto:" + EMAIL, "ایمیل بزن") + ".",
  };

  function detectLang(text) {
    if (/[؀-ۿ]/.test(text)) return "fa";
    return PAGE_LANG;
  }

  function reply(text) {
    const lang = detectLang(text);
    const cidr = text.match(/(\d{1,3}(?:\.\d{1,3}){3}\/\d{1,2})/);
    if (cidr && window.NetMath) {
      const r = window.NetMath.subnet(cidr[1]);
      if (r) {
        const L = { en: ["Network", "Mask", "Broadcast", "Usable hosts"], de: ["Netz", "Maske", "Broadcast", "Nutzbare Hosts"], fa: ["شبکه", "ماسک", "برادکست", "تعداد هاست"] }[lang];
        return `<code>${r.network}/${r.prefix}</code><br>${L[0]}: <code>${r.network}</code><br>${L[1]}: <code>${r.mask}</code><br>${L[2]}: <code>${r.broadcast}</code><br>${L[3]}: <b>${r.hosts.toLocaleString(lang === "de" ? "de-DE" : "en-US")}</b>`;
      }
    }
    // greetings only win when nothing more specific matched ("hi, are you available?")
    const intent = INTENTS.find((i) => i.id !== "greet" && i.re.test(text)) || INTENTS.find((i) => i.id === "greet" && i.re.test(text));
    if (!intent) return FALLBACK[lang];
    return (intent[lang] || intent.en)();
  }

  // ── UI ──
  const root = document.createElement("div");
  root.className = "bot";
  root.innerHTML = `
    <button class="bot-launch" type="button" aria-expanded="false" aria-controls="bot-panel" aria-label="${UI.open}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span class="bot-ping" aria-hidden="true"></span>
    </button>
    <div class="bot-panel" id="bot-panel" role="dialog" aria-label="${UI.title}" hidden>
      <div class="bot-head">
        <span class="logo-mark" aria-hidden="true">MN</span>
        <div><strong>${UI.title}</strong><small><span class="status-dot" aria-hidden="true"></span>${UI.sub}</small></div>
        <button class="bot-close" type="button" aria-label="${UI.close}">×</button>
      </div>
      <div class="bot-log" role="log" aria-live="polite"></div>
      <div class="bot-chips">${UI.chips.map((c) => `<button type="button" class="chip">${esc(c)}</button>`).join("")}</div>
      <form class="bot-form">
        <input type="text" name="q" placeholder="${UI.placeholder}" aria-label="${UI.placeholder}" autocomplete="off" maxlength="200">
        <button type="submit" aria-label="${UI.send}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg></button>
      </form>
    </div>`; // plain divs: the site styles bare section/header/footer elements globally
  document.body.appendChild(root);

  const launch = root.querySelector(".bot-launch");
  const panel = root.querySelector(".bot-panel");
  const log = root.querySelector(".bot-log");
  const form = root.querySelector(".bot-form");
  const input = form.querySelector("input");
  let greeted = false;

  function add(html, who) {
    const msg = document.createElement("div");
    msg.className = `bot-msg from-${who}`; // not plain "bot": that's the fixed-position widget root
    msg.innerHTML = html;
    if (who === "me" || /[؀-ۿ]/.test(msg.textContent)) msg.dir = "auto";
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }

  function ask(text) {
    const q = text.trim();
    if (!q) return;
    add(esc(q), "me");
    const typing = add('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      typing.innerHTML = reply(q);
      if (/[؀-ۿ]/.test(typing.textContent)) typing.dir = "rtl";
      log.scrollTop = log.scrollHeight;
    }, 450 + Math.min(700, q.length * 12));
  }

  function setOpen(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    root.classList.toggle("open", open);
    if (open) {
      root.classList.add("seen");
      if (!greeted) {
        greeted = true;
        add(INTENTS.find((i) => i.id === "greet")[PAGE_LANG](), "bot");
      }
      input.focus();
    }
  }

  launch.addEventListener("click", () => setOpen(panel.hidden));
  root.querySelector(".bot-close").addEventListener("click", () => {
    setOpen(false);
    launch.focus();
  });
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      launch.focus();
    }
    e.stopPropagation(); // don't trigger the ` terminal shortcut while chatting
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });
  root.querySelectorAll(".bot-chips .chip").forEach((c) => c.addEventListener("click", () => ask(c.textContent)));
  document.querySelectorAll("[data-open-bot]").forEach((b) => b.addEventListener("click", () => setOpen(true)));
})();
