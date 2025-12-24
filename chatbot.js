(function () {
  const WEBSITE_KB = {
    services: [
      { title: "Backup & Recovery", desc: "Secure data protection strategies ensuring business continuity." },
      { title: "Data Insights & AI", desc: "Transform raw data into actionable intelligence." },
      { title: "Cloud Solutions", desc: "Scalable hybrid and multi-cloud architectures." },
      { title: "Cyber Security", desc: "Zero-trust architecture and proactive threat hunting." },
      { title: "Managed IT", desc: "Comprehensive IT management and monitoring." },
      { title: "Digital Transformation", desc: "Guiding digital evolution with strategic consulting." },
      { title: "VoIP Solutions", desc: "Reliable voice communications for workflows." },
      { title: "End User Support", desc: "Dedicated 24/7 support for your workforce." }
    ],

    contact: {
      message: "Please use the Contact Us page to reach us. We’ll respond as soon as possible."
    },

    clients: {
      message:
        "We work with businesses across multiple industries. Due to confidentiality, client names are not publicly listed. We’re happy to share relevant case studies upon request."
    }
  };

  function buildServicesReply() {
    return (
      "Here are the services we offer:\n" +
      WEBSITE_KB.services.map(s => `• ${s.title} — ${s.desc}`).join("\n")
    );
  }

  function bestMatchReply(userText) {
    const msg = (userText || "").toLowerCase().trim();

    // Clients intent (keep this near top so it matches well)
    if (
      msg.includes("client") ||
      msg.includes("clients") ||
      msg.includes("customer") ||
      msg.includes("customers") ||
      msg.includes("who do you work with") ||
      msg.includes("who are your clients") ||
      msg.includes("what clients do you have") ||
      msg.includes("do you have clients")
    ) {
      return WEBSITE_KB.clients.message;
    }

    // Services intent
    if (
      msg.includes("services") ||
      msg.includes("service") ||
      msg.includes("offer") ||
      msg.includes("what do you do") ||
      msg.includes("what you do") ||
      msg.includes("solutions")
    ) {
      return buildServicesReply();
    }

    // Contact intent
    if (
      msg.includes("contact") ||
      msg.includes("email") ||
      msg.includes("reach") ||
      msg.includes("phone")
    ) {
      return WEBSITE_KB.contact.message;
    }

    // Default
    return  "I’m here to help! You can ask about our services, the clients we work with, or how to contact us. For example: “What services do you offer?”";

  }

  // Avoid double-inject if script loaded twice
  if (document.getElementById("chatbot-launcher")) return;

  // Build widget HTML
  const launcher = document.createElement("button");
  launcher.id = "chatbot-launcher";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.innerHTML = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12c0 4.418-3.582 8-8 8-1.06 0-2.07-.206-2.994-.58L4 20l.86-3.44A7.963 7.963 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;

  const windowEl = document.createElement("div");
  windowEl.id = "chatbot-window";
  windowEl.innerHTML = `
    <div id="chatbot-header">
      <div id="chatbot-title">
        <div id="chatbot-dot"></div>
        <div>
          <div style="font-weight:700;font-size:14px;">Chat Support</div>
          <div style="font-size:12px;opacity:.8;">Ask anything</div>
        </div>
      </div>
      <button id="chatbot-close" aria-label="Close chat">✕</button>
    </div>

    <div id="chatbot-messages"></div>

    <div id="chatbot-inputbar">
      <input id="chatbot-input" type="text" placeholder="Type a message..." />
      <button id="chatbot-send">Send</button>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(windowEl);

  const messages = windowEl.querySelector("#chatbot-messages");
  const input = windowEl.querySelector("#chatbot-input");
  const sendBtn = windowEl.querySelector("#chatbot-send");
  const closeBtn = windowEl.querySelector("#chatbot-close");

  function addMsg(text, who) {
    const row = document.createElement("div");
    row.className = `cb-row ${who}`;
    const bubble = document.createElement("div");
    bubble.className = "cb-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  // Default greeting once per page load
  addMsg("Hi! 👋 How can I help you today?", "bot");

  function toggle(open) {
    if (open) windowEl.classList.add("open");
    else windowEl.classList.remove("open");
  }

  launcher.addEventListener("click", () => toggle(!windowEl.classList.contains("open")));
  closeBtn.addEventListener("click", () => toggle(false));

  function handleSend() {
    const text = (input.value || "").trim();
    if (!text) return;

    addMsg(text, "user");
    input.value = "";

    setTimeout(() => {
      const reply = bestMatchReply(text);
      addMsg(reply, "bot");
    }, 300);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
})();
