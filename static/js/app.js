/*
  OptOut client-side application logic.

  Important privacy rule:
  - All letter generation happens in JavaScript in the browser.
  - localStorage stores only countdown metadata:
    sentDate, companyIds, requestTypes.
  - Names and email addresses are never persisted.
*/

(function () {
  "use strict";

  var data = window.OPT_OUT_DATA;

  if (!data) {
    return;
  }

  var companies = data.companies;
  var citations = data.citations;
  var requestTypes = data.requestTypes;
  var translations = data.translations;

  var STORAGE_KEY = "optout_sent";
  var DEFAULT_RIGHTS = ["RIGHT_TO_DELETE", "OPT_OUT_SALE", "LIMIT_SENSITIVE", "OPT_OUT_PROFILING"];
  var GUIDE_DEFAULT_RIGHTS = ["RIGHT_TO_DELETE", "OPT_OUT_SALE"];
  var BATCH_EMAIL_SUBJECT = "CCPA/CPRA Privacy Rights Request";

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function addBusinessDays(date, days) {
    var result = new Date(date);
    var added = 0;

    while (added < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        added += 1;
      }
    }

    return result;
  }

  function differenceInCalendarDays(a, b) {
    return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
  }

  function formatDate(date, lang) {
    return date.toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function isRequestType(value) {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(citations, value);
  }

  function getDeadlineDate(sentDate, selectedRequestTypes) {
    var sent = startOfDay(typeof sentDate === "string" ? new Date(sentDate) : sentDate);

    if (!isValidDate(sent)) {
      return sent;
    }

    if (!selectedRequestTypes || selectedRequestTypes.length === 0) {
      return addDays(sent, 45);
    }

    return selectedRequestTypes.reduce(function (latest, requestType) {
      var citation = citations[requestType];
      var candidate = citation.deadlineType === "business"
        ? addBusinessDays(sent, citation.deadlineDays)
        : addDays(sent, citation.deadlineDays);
      return candidate.getTime() > latest.getTime() ? candidate : latest;
    }, sent);
  }

  function getDeadlineWindowDays(sentDate, selectedRequestTypes) {
    var sent = startOfDay(typeof sentDate === "string" ? new Date(sentDate) : sentDate);
    var deadline = getDeadlineDate(sent, selectedRequestTypes);

    if (!isValidDate(sent) || !isValidDate(deadline)) {
      return 45;
    }

    return differenceInCalendarDays(deadline, sent);
  }

  function getDaysRemaining(sentDate, selectedRequestTypes) {
    var deadline = getDeadlineDate(sentDate, selectedRequestTypes);
    return differenceInCalendarDays(deadline, startOfDay(new Date()));
  }

  function getSentRecord() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      var parsed = JSON.parse(raw);
      var sentDate = typeof parsed.sentDate === "string" ? new Date(parsed.sentDate) : null;
      var companyIds = Array.isArray(parsed.companyIds) ? parsed.companyIds.filter(function (value) {
        return typeof value === "string";
      }) : [];
      var storedRequestTypes = Array.isArray(parsed.requestTypes) ? parsed.requestTypes.filter(isRequestType) : [];

      if (!sentDate || !isValidDate(sentDate) || companyIds.length === 0) {
        return null;
      }

      return {
        sentDate: sentDate.toISOString(),
        companyIds: companyIds,
        requestTypes: storedRequestTypes
      };
    } catch (_error) {
      return null;
    }
  }

  function markAsSent(companyIds, selectedRequestTypes) {
    var record = {
      sentDate: startOfDay(new Date()).toISOString(),
      companyIds: companyIds,
      requestTypes: selectedRequestTypes
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (_error) {
      // Browser storage may be unavailable. The rest of the tool still works.
    }
  }

  function clearSentRecord() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Ignore storage failures in restricted browsers.
    }
  }

  function getSelectedCompanies(selectedCompanyIds) {
    return companies.filter(function (company) {
      return selectedCompanyIds.indexOf(company.id) !== -1;
    });
  }

  function getBatchRecipientEmails(selectedCompanies) {
    return selectedCompanies
      .map(function (company) { return company.privacyEmail; })
      .filter(function (email) { return Boolean(email); });
  }

  function getRequestParagraphs(selectedRequestTypes) {
    var paragraphs = [];

    if (selectedRequestTypes.indexOf("RIGHT_TO_KNOW") !== -1) {
      paragraphs.push("RIGHT TO KNOW (" + citations.RIGHT_TO_KNOW.statute + "): I request that you disclose to me: (1) the categories of personal information you have collected about me; (2) the specific pieces of personal information you have collected about me; (3) the categories of sources from which the personal information was collected; (4) the business or commercial purpose for collecting, selling, or sharing my personal information; (5) the categories of third parties to whom you have disclosed my personal information; and (6) if you have sold or shared my personal information, the categories of personal information sold or shared and the categories of third parties to whom it was sold or shared.");
    }

    if (selectedRequestTypes.indexOf("RIGHT_TO_DELETE") !== -1) {
      paragraphs.push("RIGHT TO DELETE (" + citations.RIGHT_TO_DELETE.statute + "): I request that you delete any and all personal information you have collected from me or about me. I further request that you direct any service providers or contractors with whom you have shared my personal information to delete my personal information from their records as well.");
    }

    if (selectedRequestTypes.indexOf("RIGHT_TO_CORRECT") !== -1) {
      paragraphs.push("RIGHT TO CORRECT (" + citations.RIGHT_TO_CORRECT.statute + "): I request that you correct any inaccurate personal information you maintain about me. If your records contain information about me that was obtained through surveillance, data aggregation, or scraping without my knowledge or consent, I dispute the accuracy and completeness of such information in its entirety.");
    }

    if (selectedRequestTypes.indexOf("OPT_OUT_SALE") !== -1) {
      paragraphs.push("OPT-OUT OF SALE AND SHARING (" + citations.OPT_OUT_SALE.statute + "): I direct you to stop selling and/or sharing my personal information with third parties, effective immediately. This includes any sharing of personal information for cross-context behavioral advertising, targeted advertising, or any form of profiling. This opt-out must be applied to all personal information you hold about me, including data obtained from any source.");
    }

    if (selectedRequestTypes.indexOf("LIMIT_SENSITIVE") !== -1) {
      paragraphs.push("LIMIT USE OF SENSITIVE PERSONAL INFORMATION (" + citations.LIMIT_SENSITIVE.statute + "): I direct you to limit your use and disclosure of my sensitive personal information to only that which is necessary to perform the services or provide the goods reasonably expected. Sensitive personal information includes, but is not limited to: precise geolocation data; racial or ethnic origin; immigration or citizenship status; biometric information; and contents of communications. You are to cease any processing of my sensitive personal information beyond what is strictly necessary.");
    }

    if (selectedRequestTypes.indexOf("OPT_OUT_PROFILING") !== -1) {
      paragraphs.push("OPT-OUT OF AUTOMATED DECISION-MAKING AND PROFILING (" + citations.OPT_OUT_PROFILING.statute + "): I opt out of any automated decision-making technology, including profiling, that you use to process my personal information. This includes any AI-powered risk scoring, predictive analytics, behavioral analysis, or pattern recognition that produces legal or similarly significant effects. I request that you stop subjecting my personal information to automated processing for these purposes immediately.");
    }

    return paragraphs.join("\n\n");
  }

  function generateBatchLetter(payload) {
    var today = formatDate(new Date(), "en");
    var companyList = payload.companies.map(function (company) {
      return "- " + company.name;
    }).join("\n");

    return today + "\n\n" +
      "To Whom It May Concern:\n\n" +
      "I am writing to exercise my rights under the California Consumer Privacy Act of 2018 (\"CCPA\"), as amended by the California Privacy Rights Act of 2020 (\"CPRA\"), codified at California Civil Code sections 1798.100 through 1798.199.100.\n\n" +
      "Your company is subject to the CCPA/CPRA because it does business in the State of California and meets one or more of the applicability thresholds set forth in Cal. Civ. Code \u00A7 1798.140(d). Your collection, processing, sale, and/or sharing of personal information \u2014 including through surveillance technologies, data aggregation, and automated decision-making systems \u2014 triggers obligations under this law.\n\n" +
      "I hereby make the following requests:\n\n" +
      getRequestParagraphs(payload.requestTypes) + "\n\n" +
      "VERIFICATION: For purposes of verifying my identity in connection with this request, my name is " + payload.senderName + " and my email address is " + payload.senderEmail + ". I declare under penalty of perjury that I am the consumer whose personal information is the subject of this request.\n\n" +
      "LEGAL OBLIGATIONS AND DEADLINES: Under the CCPA/CPRA, you are required to respond to this request within forty-five (45) calendar days of receipt. If you require an extension, you must notify me within the initial 45-day period and may extend by no more than an additional 45 calendar days. For opt-out requests under \u00A7 1798.120 and \u00A7 1798.121, you must comply within fifteen (15) business days.\n\n" +
      "You may not discriminate against me for exercising these rights, as prohibited by Cal. Civ. Code \u00A7 1798.125.\n\n" +
      "NOTICE OF INTENT: If you fail to respond to this request within the statutory deadline, I intend to file a complaint with the California Privacy Protection Agency (CPPA) and/or the California Attorney General's Office. Under CPRA, the 30-day right-to-cure period has been eliminated for most violations, and the CPPA has independent enforcement authority with penalties of up to $2,500 per violation, or $7,500 per intentional violation or violation involving minors.\n\n" +
      "I look forward to your timely response.\n\n" +
      "Sincerely,\n\n" +
      payload.senderName + "\n" +
      payload.senderEmail;
  }

  function generateComplaintLetter(payload, sentDate) {
    var today = formatDate(new Date(), "en");
    var originalDate = formatDate(sentDate, "en");

    return today + "\n\n" +
      payload.senderName + "\n" +
      payload.senderEmail + "\n\n" +
      "TO:\nCalifornia Privacy Protection Agency\n2101 Arena Boulevard\nSacramento, CA 95834\ncomplaints@cppa.ca.gov\n\n" +
      "AND:\n\nOffice of the Attorney General\nCalifornia Department of Justice\nAttn: Public Inquiry Unit\nP.O. Box 944255\nSacramento, CA 94244-2550\n\n" +
      "RE: COMPLAINT \u2014 FAILURE TO RESPOND TO CCPA/CPRA PRIVACY RIGHTS REQUEST\n\n" +
      "Dear California Privacy Protection Agency and Office of the Attorney General:\n\n" +
      "I am filing this complaint regarding " + payload.company.name + "'s failure to comply with the California Consumer Privacy Act / California Privacy Rights Act.\n\n" +
      "FACTS:\n\n" +
      "1. On " + originalDate + ", I submitted a verifiable consumer request to " + payload.company.name + " exercising the following rights under the CCPA/CPRA:\n" +
      payload.requestTypes.map(function (type) {
        return "   - " + citations[type].label + " (" + citations[type].statute + ")";
      }).join("\n") + "\n\n" +
      "2. The request was sent to:\n   " + (payload.company.privacyEmail ? "Email: " + payload.company.privacyEmail : "") + "\n   " + (payload.company.privacyAddress || payload.company.name) + "\n\n" +
      "3. As of " + today + ", the applicable statutory response deadline has elapsed, and " + payload.company.name + " has:\n   [ ] Failed to respond entirely\n   [ ] Failed to provide a complete response\n   [ ] Failed to acknowledge receipt within the statutory period\n   (Please check all that apply)\n\n" +
      "4. " + payload.company.name + " is known to collect and process personal information for the following purposes: " + payload.company.knownContracts.join("; ") + ".\n\n" +
      "LEGAL BASIS:\n\n" +
      "Under Cal. Civ. Code \u00A7 1798.105, \u00A7 1798.110, \u00A7 1798.120, \u00A7 1798.121, and related provisions, businesses are required to respond within the applicable statutory deadlines, including 45 calendar days for access, deletion, correction, and similar requests, and 15 business days for opt-out and sensitive-information limitation requests. The CPRA eliminated the 30-day cure period for most violations (effective January 1, 2023). The CPPA has independent enforcement authority under Cal. Civ. Code \u00A7 1798.199.40 et seq.\n\n" +
      "Each failure to respond to a consumer request constitutes a separate violation, subject to penalties of up to $2,500 per violation, or $7,500 per intentional violation.\n\n" +
      "REQUESTED ACTION:\n\nI respectfully request that your office:\n1. Investigate " + payload.company.name + "'s failure to comply with the CCPA/CPRA;\n2. Take appropriate enforcement action; and\n3. Ensure that " + payload.company.name + " fulfills its statutory obligations.\n\n" +
      "I have attached a copy of my original request for your reference.\n\n" +
      "Sincerely,\n\n" +
      payload.senderName + "\n" +
      payload.senderEmail + "\n\n" +
      "Enclosure: Original CCPA/CPRA request dated " + originalDate;
  }

  function buildMailtoUrl(payload) {
    var emails = getBatchRecipientEmails(payload.companies);
    if (emails.length === 0) {
      return "";
    }

    return "mailto:" + payload.senderEmail +
      "?subject=" + encodeURIComponent(BATCH_EMAIL_SUBJECT) +
      "&bcc=" + emails.join(",") +
      "&body=" + encodeURIComponent(generateBatchLetter(payload));
  }

  function copyText(text, button, defaultLabel, copiedLabel) {
    navigator.clipboard.writeText(text).then(function () {
      button.textContent = copiedLabel;
      window.setTimeout(function () {
        button.textContent = defaultLabel;
      }, 2000);
    }).catch(function () {
      window.alert("Clipboard access is unavailable. Use download instead.");
    });
  }

  function downloadText(filename, text) {
    var blob = new Blob([text], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function buildCompanyGroups(lang) {
    var labels = {
      surveillance: translations[lang].catSurveillance,
      dataBrokers: translations[lang].catDataBrokers,
      telecom: translations[lang].catTelecom
    };

    return ["surveillance", "dataBrokers", "telecom"].map(function (category) {
      var items = companies.filter(function (company) {
        return company.category === category;
      }).map(function (company) {
        var logoUrl = "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(company.domain || "") + "&sz=32";
        return (
          "<div class=\"company-reference-item company-card rounded-2xl border border-line bg-page/30\" data-company-item=\"" + escapeHtml(company.id) + "\">" +
            "<div class=\"company-card-row\">" +
              "<input data-company-id=\"" + escapeHtml(company.id) + "\" type=\"checkbox\" class=\"company-card-checkbox\">" +
              "<button type=\"button\" data-company-trigger=\"" + escapeHtml(company.id) + "\" aria-expanded=\"false\" class=\"company-reference-trigger company-card-trigger\">" +
                "<span class=\"company-card-meta\">" +
                  "<img src=\"" + logoUrl + "\" alt=\"\" width=\"32\" height=\"32\" class=\"company-card-logo\" loading=\"lazy\">" +
                  "<span class=\"company-card-name font-semibold text-ink\">" + escapeHtml(company.name) + "</span>" +
                "</span>" +
              "</button>" +
            "</div>" +
          "</div>"
        );
      }).join("");

      return (
        "<div class=\"space-y-3\">" +
          "<h3 class=\"text-xs uppercase tracking-[0.2em] text-muted\">" + escapeHtml(labels[category]) + "</h3>" +
          "<div class=\"company-group-grid\">" + items + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function buildRightsList(selectedRights) {
    return requestTypes.map(function (type) {
      var citation = citations[type];
      var checked = selectedRights.indexOf(type) !== -1 ? " checked" : "";

      return (
        "<label class=\"block rounded border border-line p-4 transition hover:border-ice\">" +
          "<span class=\"flex items-start gap-3\">" +
            "<input data-right-type=\"" + escapeHtml(type) + "\" type=\"checkbox\" class=\"mt-1 h-4 w-4\"" + checked + ">" +
            "<span class=\"block\">" +
              "<span class=\"block text-sm font-medium text-ink\">" + escapeHtml(citation.label) + "</span>" +
              "<span class=\"mt-1 block text-sm leading-7 text-muted\">" + escapeHtml(citation.shortDescription) + "</span>" +
            "</span>" +
          "</span>" +
        "</label>"
      );
    }).join("");
  }

  function renderIndexPage() {
    var root = $("index-experience");
    var tooltip = $("company-reference-tooltip");
    var tooltipContent = $("company-reference-tooltip-content");

    if (!root) {
      return;
    }

    var dockTimer = null;
    var state = {
      lang: null,
      selectedCompanyIds: [],
      selectedRights: DEFAULT_RIGHTS.slice(),
      generatedLetter: "",
      complaintLetter: "",
      sentRecord: getSentRecord(),
      overdueCompanyIds: [],
      activeTooltipId: null,
      pinnedTooltipId: null,
      activeStepKey: "companies"
    };
    var stepOrder = [
      { key: "companies", id: "step-companies" },
      { key: "rights", id: "step-rights" },
      { key: "info", id: "step-info" },
      { key: "generate", id: "step-generate" }
    ];

    function clearDockTimer() {
      if (dockTimer !== null) {
        window.clearTimeout(dockTimer);
        dockTimer = null;
      }
    }

    function setVisible(id, visible) {
      var element = $(id);
      if (element) {
        element.classList.toggle("hidden-panel", !visible);
      }
    }

    function setFlowState(mode) {
      root.setAttribute("data-flow-state", mode);
      if (mode === "countdown") {
        root.setAttribute("data-card-face", "countdown");
      } else if (mode === "picker" || mode === "holding") {
        root.setAttribute("data-card-face", "intro");
      } else {
        root.setAttribute("data-card-face", "compact");
      }
    }

    function updateLanguageButtons() {
      ["en", "es"].forEach(function (lang) {
        var compactButton = $("lang-toggle-" + lang);
        if (compactButton) {
          compactButton.setAttribute("aria-pressed", state.lang === lang ? "true" : "false");
        }
      });
    }

    function syncTooltipTriggers(activeKey) {
      document.querySelectorAll("[data-company-trigger]").forEach(function (trigger) {
        var triggerKey = trigger.getAttribute("data-company-trigger");
        trigger.setAttribute("aria-expanded", activeKey && triggerKey === activeKey ? "true" : "false");
      });

      var rightsTrigger = $("rights-reference-trigger");
      if (rightsTrigger) {
        rightsTrigger.setAttribute("aria-expanded", activeKey === "rights" ? "true" : "false");
      }
    }

    function getCompanyById(companyId) {
      return companies.find(function (company) {
        return company.id === companyId;
      }) || null;
    }

    function getLocalizedCompanyDetails(companyId) {
      var localizedCompanies = data.companyCopy && data.companyCopy[state.lang];

      if (!localizedCompanies) {
        return null;
      }

      return localizedCompanies[companyId] || null;
    }

    function buildCompanyTooltipHtml(companyId) {
      var company = getCompanyById(companyId);
      var copy = text();

      if (!company) {
        return "";
      }

      var localized = getLocalizedCompanyDetails(companyId) || {};
      var description = localized.description || company.description;
      var knownContracts = localized.knownContracts || company.knownContracts;
      var dataTypes = localized.dataTypes || company.dataTypes;

      return (
        "<p class=\"leading-6 text-muted\">" +
          "<span class=\"company-reference-kicker\">" + escapeHtml(copy.companyDescriptionLabel) + "</span><br>" +
          escapeHtml(description) +
        "</p>" +
        "<p class=\"mt-3 leading-6 text-muted\">" +
          "<span class=\"company-reference-kicker\">" + escapeHtml(copy.companyContractsLabel) + "</span><br>" +
          escapeHtml(knownContracts.join(", ")) +
        "</p>" +
        "<p class=\"mt-3 leading-6 text-muted\">" +
          "<span class=\"company-reference-kicker\">" + escapeHtml(copy.companyDataLabel) + "</span><br>" +
          escapeHtml(dataTypes.join(", ")) +
        "</p>"
      );
    }

    function buildRightsTooltipHtml() {
      var copy = text();

      return (
        "<p class=\"company-reference-kicker\">" + escapeHtml(copy.rightsPlainTitle) + "</p>" +
        "<p class=\"mt-2 leading-6 text-muted\">" + escapeHtml(copy.rightsPlainCopy) + "</p>"
      );
    }

    function setTooltipPosition(x, y) {
      if (!tooltip) {
        return;
      }

      tooltip.style.left = "0px";
      tooltip.style.top = "0px";

      var rect = tooltip.getBoundingClientRect();
      var gutter = 12;
      var left = x + 18;
      var top = y + 18;

      if (left + rect.width > window.innerWidth - gutter) {
        left = x - rect.width - 18;
      }

      if (top + rect.height > window.innerHeight - gutter) {
        top = y - rect.height - 18;
      }

      left = Math.max(gutter, Math.min(left, window.innerWidth - rect.width - gutter));
      top = Math.max(gutter, Math.min(top, window.innerHeight - rect.height - gutter));

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    }

    function showTooltip(key, html, x, y, pinned) {
      if (!tooltip) {
        return;
      }

      state.activeTooltipId = key;
      state.pinnedTooltipId = pinned ? key : null;
      if (tooltipContent) {
        tooltipContent.innerHTML = html;
      }
      syncTooltipTriggers(key);
      tooltip.classList.add("is-visible");
      tooltip.setAttribute("aria-hidden", "false");
      setTooltipPosition(x, y);
    }

    function hideTooltip() {
      if (!tooltip) {
        return;
      }

      state.activeTooltipId = null;
      state.pinnedTooltipId = null;
      tooltip.classList.remove("is-visible");
      tooltip.setAttribute("aria-hidden", "true");
      syncTooltipTriggers(null);
    }

    function hasHoverPointer() {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }

    function startDockSequence() {
      clearDockTimer();
      setFlowState("holding");
      dockTimer = window.setTimeout(function () {
        setFlowState("docked");
      }, 1500);
    }

    function selectedCompanies() {
      return getSelectedCompanies(state.selectedCompanyIds);
    }

    function text() {
      return translations[state.lang || "en"];
    }

    function prefersReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function hasIdentityInfo() {
      return Boolean($("sender-name").value.trim() && $("sender-email").value.trim());
    }

    function isStepComplete(stepKey) {
      if (stepKey === "companies") {
        return state.selectedCompanyIds.length > 0;
      }
      if (stepKey === "rights") {
        return state.selectedRights.length > 0;
      }
      if (stepKey === "info") {
        return hasIdentityInfo();
      }
      if (stepKey === "generate") {
        return Boolean(state.generatedLetter);
      }
      return false;
    }

    function updateStepNav() {
      var copy = text();
      var labels = {
        companies: copy.stepCompanies,
        rights: copy.stepRights,
        info: copy.stepInfo,
        generate: copy.stepGenerate
      };

      document.querySelectorAll("[data-step-nav]").forEach(function (link, index) {
        var stepKey = link.getAttribute("data-step-nav");
        var active = state.activeStepKey === stepKey;
        var complete = isStepComplete(stepKey);
        var badge = link.querySelector("[data-step-badge]");
        var label = link.querySelector("[data-step-label]");
        var status = link.querySelector("[data-step-status]");

        link.classList.toggle("is-current", active);
        link.classList.toggle("is-complete", !active && complete);
        link.setAttribute("aria-current", active ? "step" : "false");

        if (badge) {
          badge.textContent = (!active && complete) ? "\u2713" : String(index + 1);
        }

        if (label && labels[stepKey]) {
          label.textContent = labels[stepKey];
        }

        if (status) {
          if (active) {
            status.textContent = copy.stepCurrent;
            status.hidden = false;
          } else if (complete) {
            status.textContent = copy.stepDone;
            status.hidden = false;
          } else {
            status.textContent = "";
            status.hidden = true;
          }
        }
      });
    }

    function updateActiveStepFromScroll() {
      if ($("generator").classList.contains("hidden-panel")) {
        state.activeStepKey = "companies";
        updateStepNav();
        return;
      }

      var offset = window.innerWidth >= 1024 ? 160 : 220;
      var currentKey = stepOrder[0].key;

      stepOrder.forEach(function (step) {
        var section = $(step.id);
        if (section && section.getBoundingClientRect().top <= offset) {
          currentKey = step.key;
        }
      });

      state.activeStepKey = currentKey;
      updateStepNav();
    }

    function revealGenerator() {
      setVisible("how-it-works-panel", true);
      setVisible("generator", true);

      window.requestAnimationFrame(function () {
        $("how-it-works-panel").scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start"
        });
        updateActiveStepFromScroll();
      });
    }

    function syncEmailLinks() {
      var copy = text();
      var selected = selectedCompanies();
      var payload = {
        senderName: $("sender-name").value.trim(),
        senderEmail: $("sender-email").value.trim(),
        companies: selected,
        requestTypes: state.selectedRights.slice()
      };
      var mailtoUrl = payload.senderName && payload.senderEmail && selected.length > 0
        ? buildMailtoUrl(payload)
        : "";

      [
        { element: $("open-email"), enabledLabel: copy.openEmail },
        { element: $("send-email-link"), enabledLabel: copy.sendEmailAction }
      ].forEach(function (entry) {
        if (!entry.element) {
          return;
        }

        entry.element.href = mailtoUrl || "#";
        entry.element.textContent = mailtoUrl ? entry.enabledLabel : copy.noEmail;
        entry.element.setAttribute("aria-disabled", mailtoUrl ? "false" : "true");
        entry.element.classList.toggle("is-disabled-link", !mailtoUrl);
      });
    }

    function syncGenerateButton() {
      var copy = text();
      var name = $("sender-name").value.trim();
      var email = $("sender-email").value.trim();
      var canGenerate = state.selectedCompanyIds.length > 0 && state.selectedRights.length > 0 && name && email;
      $("generate-letter").disabled = !canGenerate;
      $("generate-letter").textContent = copy.generate + (state.selectedCompanyIds.length ? " " + copy.forGenerating + " " + state.selectedCompanyIds.length : "");
      syncEmailLinks();
      updateStepNav();
    }

    function syncStartCountdownButton() {
      $("start-countdown").disabled = !$("confirm-sent").checked;
    }

    function updateOverdueButton() {
      var name = $("overdue-name").value.trim();
      var email = $("overdue-email").value.trim();
      $("generate-complaint").disabled = !(state.overdueCompanyIds.length > 0 && name && email);
    }

    function renderCompanyInputs() {
      $("company-groups").innerHTML = buildCompanyGroups(state.lang);
      document.querySelectorAll("[data-company-id]").forEach(function (box) {
        var companyId = box.getAttribute("data-company-id");
        box.checked = state.selectedCompanyIds.indexOf(companyId) !== -1;
        box.addEventListener("change", function () {
          if (box.checked) {
            if (state.selectedCompanyIds.indexOf(companyId) === -1) {
              state.selectedCompanyIds.push(companyId);
            }
          } else {
            state.selectedCompanyIds = state.selectedCompanyIds.filter(function (value) {
              return value !== companyId;
            });
          }
          syncGenerateButton();
        });
      });

      document.querySelectorAll("[data-company-trigger]").forEach(function (button) {
        var companyId = button.getAttribute("data-company-trigger");
        button.addEventListener("mouseenter", function (event) {
          if (!hasHoverPointer()) {
            return;
          }

          showTooltip(companyId, buildCompanyTooltipHtml(companyId), event.clientX, event.clientY, false);
        });

        button.addEventListener("mousemove", function (event) {
          if (!hasHoverPointer() || state.pinnedTooltipId) {
            return;
          }

          if (state.activeTooltipId !== companyId) {
            showTooltip(companyId, buildCompanyTooltipHtml(companyId), event.clientX, event.clientY, false);
            return;
          }

          setTooltipPosition(event.clientX, event.clientY);
        });

        button.addEventListener("mouseleave", function () {
          if (!hasHoverPointer() || state.pinnedTooltipId === companyId) {
            return;
          }

          hideTooltip();
        });

        button.addEventListener("focus", function () {
          var rect = button.getBoundingClientRect();
          showTooltip(companyId, buildCompanyTooltipHtml(companyId), rect.left + (rect.width / 2), rect.bottom, false);
        });

        button.addEventListener("blur", function () {
          if (!state.pinnedTooltipId) {
            hideTooltip();
          }
        });

        button.addEventListener("click", function (event) {
          var rect = button.getBoundingClientRect();
          event.preventDefault();

          if (hasHoverPointer()) {
            showTooltip(companyId, buildCompanyTooltipHtml(companyId), rect.left + (rect.width / 2), rect.bottom, false);
            return;
          }

          if (state.pinnedTooltipId === companyId) {
            hideTooltip();
            return;
          }

          showTooltip(companyId, buildCompanyTooltipHtml(companyId), rect.left + (rect.width / 2), rect.bottom, true);
        });
      });
    }

    function renderRightsInputs() {
      $("rights-list").innerHTML = buildRightsList(state.selectedRights);
      document.querySelectorAll("[data-right-type]").forEach(function (box) {
        var type = box.getAttribute("data-right-type");
        box.addEventListener("change", function () {
          if (box.checked) {
            if (state.selectedRights.indexOf(type) === -1) {
              state.selectedRights.push(type);
            }
          } else {
            state.selectedRights = state.selectedRights.filter(function (value) {
              return value !== type;
            });
          }
          syncGenerateButton();
        });
      });
    }

    function bindRightsTooltipTrigger() {
      var trigger = $("rights-reference-trigger");

      if (!trigger) {
        return;
      }

      trigger.addEventListener("mouseenter", function (event) {
        if (!hasHoverPointer()) {
          return;
        }

        showTooltip("rights", buildRightsTooltipHtml(), event.clientX, event.clientY, false);
      });

      trigger.addEventListener("mousemove", function (event) {
        if (!hasHoverPointer() || state.pinnedTooltipId) {
          return;
        }

        if (state.activeTooltipId !== "rights") {
          showTooltip("rights", buildRightsTooltipHtml(), event.clientX, event.clientY, false);
          return;
        }

        setTooltipPosition(event.clientX, event.clientY);
      });

      trigger.addEventListener("mouseleave", function () {
        if (!hasHoverPointer() || state.pinnedTooltipId === "rights") {
          return;
        }

        hideTooltip();
      });

      trigger.addEventListener("focus", function () {
        var rect = trigger.getBoundingClientRect();
        showTooltip("rights", buildRightsTooltipHtml(), rect.left + (rect.width / 2), rect.bottom, false);
      });

      trigger.addEventListener("blur", function () {
        if (!state.pinnedTooltipId) {
          hideTooltip();
        }
      });

      trigger.addEventListener("click", function (event) {
        var rect = trigger.getBoundingClientRect();
        event.preventDefault();

        if (hasHoverPointer()) {
          showTooltip("rights", buildRightsTooltipHtml(), rect.left + (rect.width / 2), rect.bottom, false);
          return;
        }

        if (state.pinnedTooltipId === "rights") {
          hideTooltip();
          return;
        }

        showTooltip("rights", buildRightsTooltipHtml(), rect.left + (rect.width / 2), rect.bottom, true);
      });
    }

    function renderCountdown() {
      var copy = text();

      if (!state.sentRecord) {
        setVisible("countdown-panel", false);
        setVisible("overdue-panel", false);
        if (!state.lang) {
          setFlowState("picker");
        }
        return;
      }

      clearDockTimer();
      hideTooltip();
      setVisible("explanation-panel", false);
      setVisible("how-it-works-panel", false);
      setVisible("generator", false);
      setVisible("letter-output", false);

      var sentDate = new Date(state.sentRecord.sentDate);
      var totalWindowDays = getDeadlineWindowDays(sentDate, state.sentRecord.requestTypes);
      var deadlineDate = getDeadlineDate(sentDate, state.sentRecord.requestTypes);
      var daysLeft = getDaysRemaining(state.sentRecord.sentDate, state.sentRecord.requestTypes);
      var notifiedCompanies = getSelectedCompanies(state.sentRecord.companyIds);

      if (daysLeft < 0) {
        setVisible("countdown-panel", false);
        setVisible("overdue-panel", true);
        setFlowState("overdue");
        $("times-up-title").textContent = copy.timesUp;
        $("times-up-copy").textContent = copy.overduePre + Math.abs(daysLeft) + copy.overduePost;
        $("overdue-prompt").textContent = copy.overduePrompt;
        $("overdue-note").textContent = copy.overdueNote;
        $("overdue-name-label").textContent = copy.fullName;
        $("overdue-email-label").textContent = copy.email;
        $("generate-complaint").textContent = copy.generateComplaint;
        $("complaint-heading").textContent = copy.complaintTitle;
        $("copy-complaint").textContent = copy.copy;
        $("download-complaint").textContent = copy.download;
        $("cppa-title").textContent = copy.fileCPPA;
        $("cppa-note").textContent = copy.fileCPPANote;
        $("ag-title").textContent = copy.fileAG;
        $("ag-note").textContent = copy.fileAGNote;
        $("start-over-overdue").textContent = copy.startOver;
        $("overdue-company-list").innerHTML = notifiedCompanies.map(function (company) {
          return (
            "<label class=\"block rounded border border-line p-4 transition hover:border-ice\">" +
              "<span class=\"flex items-start gap-3\">" +
                "<input data-overdue-id=\"" + escapeHtml(company.id) + "\" type=\"checkbox\" class=\"mt-1 h-4 w-4\">" +
                "<span class=\"text-sm text-ink\">" + escapeHtml(company.name) + "</span>" +
              "</span>" +
            "</label>"
          );
        }).join("");

        document.querySelectorAll("[data-overdue-id]").forEach(function (box) {
          var companyId = box.getAttribute("data-overdue-id");
          box.addEventListener("change", function () {
            if (box.checked) {
              if (state.overdueCompanyIds.indexOf(companyId) === -1) {
                state.overdueCompanyIds.push(companyId);
              }
            } else {
              state.overdueCompanyIds = state.overdueCompanyIds.filter(function (value) {
                return value !== companyId;
              });
            }
            updateOverdueButton();
          });
        });

        updateOverdueButton();
        return;
      }

      setVisible("overdue-panel", false);
      setVisible("countdown-panel", true);
      setFlowState("countdown");
      $("countdown-status").textContent = state.lang === "es" ? "PLAZO LEGAL EN CURSO" : "LEGAL DEADLINE ACTIVE";
      $("countdown-number").textContent = String(daysLeft);
      $("countdown-copy").textContent = daysLeft === 1 ? copy.dayLeft : copy.daysLeft;
      $("countdown-dates").textContent = copy.sentOn + " " + formatDate(sentDate, state.lang) + " · " + copy.deadline + " " + formatDate(deadlineDate, state.lang);
      $("companies-notified").textContent = state.lang === "es"
        ? "EMPRESAS LEGALMENTE OBLIGADAS A RESPONDER"
        : "COMPANIES LEGALLY OBLIGATED TO RESPOND";
      $("countdown-legal-notice").textContent = state.lang === "es"
        ? "Las siguientes empresas han recibido su solicitud de derechos de privacidad bajo CCPA/CPRA y est\u00e1n legalmente obligadas a responder dentro del plazo indicado. El incumplimiento constituye una violaci\u00f3n sujeta a multas de hasta $7,500 por infracci\u00f3n."
        : "The following companies have been served your CCPA/CPRA privacy rights request and are legally obligated to respond within the deadline above. Failure to comply constitutes a violation subject to penalties of up to $7,500 per infraction.";
      $("countdown-note").textContent = copy.countdownNote;
      $("start-over").textContent = copy.startOver;
      $("notified-company-list").innerHTML = notifiedCompanies.map(function (company) {
        var logoUrl = "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(company.domain || "") + "&sz=32";
        return "<span class=\"inline-flex items-center gap-2 rounded border border-red-600/30 bg-red-600/5 px-3 py-2 text-sm font-medium text-ink\">" +
          "<img src=\"" + logoUrl + "\" alt=\"\" width=\"16\" height=\"16\" class=\"shrink-0 rounded\" loading=\"lazy\">" +
          escapeHtml(company.name) + "</span>";
      }).join("");

      var progress = ((totalWindowDays - daysLeft) / totalWindowDays) * 100;
      $("countdown-bar").style.width = Math.max(0, Math.min(100, progress)) + "%";
      $("countdown-bar").className = "h-full rounded-full " + (daysLeft <= 5 ? "bg-red-500" : (daysLeft <= 15 ? "bg-yellow-500" : "bg-green-500"));
    }

    function renderTexts() {
      if (!state.lang) {
        return;
      }

      var copy = text();
      $("red-card-kicker").textContent = copy.cardLabel;
      $("red-card-tagline").textContent = copy.tagline;
      $("red-card-subtitle").textContent = copy.cardIntroSubtitle || copy.subtitle;
      $("red-card-compact-subtitle").textContent = copy.cardLabel;
      $("compact-language-label").textContent = copy.compactLanguageLabel;
      $("hero-title").textContent = copy.tagline;
      $("hero-subtitle").textContent = copy.subtitle;
      $("open-source-label").textContent = copy.openSourceLabel;
      $("what-is-title").textContent = copy.whatIsTitle;
      $("what-is-copy").textContent = copy.whatIs;
      $("how-title").textContent = copy.howTitle;
      $("how-copy").textContent = copy.how;
      $("how-it-works-title").textContent = copy.howTitle;
      $("how-step-1-title").textContent = copy.howStep1Title;
      $("how-step-1-copy").textContent = copy.howStep1Copy;
      $("how-step-2-title").textContent = copy.howStep2Title;
      $("how-step-2-copy").textContent = copy.howStep2Copy;
      $("how-step-3-title").textContent = copy.howStep3Title;
      $("how-step-3-copy").textContent = copy.howStep3Copy;
      $("what-not-title").textContent = copy.whatNotTitle;
      $("what-not-list").innerHTML = [copy.whatNot1, copy.whatNot2, copy.whatNot3, copy.whatNot4].map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("");
      $("who-title").textContent = copy.whoTitle;
      $("who-copy").textContent = copy.who;
      $("legal-disclaimer-top").textContent = copy.legalDisclaimer;
      $("plain-rights-title").textContent = copy.rightsPlainTitle;
      $("companies-heading").textContent = copy.selectCompanies;
      $("select-all-companies").textContent = copy.selectAll + " (" + companies.length + ")";
      $("rights-heading").textContent = copy.yourRights;
      $("rights-note").textContent = copy.rightsNote;
      $("info-heading").textContent = copy.yourInfo;
      $("info-note").textContent = copy.infoNote;
      $("name-label").textContent = copy.fullName;
      $("email-label").textContent = copy.email;
      $("letter-heading").textContent = copy.yourLetter;
      $("review-note").textContent = copy.reviewNote;
      $("subject-label").textContent = copy.emailSubject + ": ";
      $("email-subject").textContent = BATCH_EMAIL_SUBJECT;
      $("bcc-label").textContent = copy.emailBcc + ": ";
      $("bcc-explain").textContent = copy.bccExplain;
      $("copy-letter").textContent = copy.copy;
      $("download-letter").textContent = copy.download;
      $("send-it-step-label").textContent = copy.sendItStep;
      $("send-it-title").textContent = copy.sendItTitle;
      $("send-it-intro").textContent = copy.sendItIntro;
      $("send-email-title").textContent = copy.sendEmailTitle;
      $("send-email-copy").textContent = copy.sendEmailCopy;
      $("send-print-title").textContent = copy.sendPrintTitle;
      $("send-print-copy").textContent = copy.sendPrintCopy;
      $("send-complaint-title").textContent = copy.sendComplaintTitle;
      $("send-complaint-copy").textContent = copy.sendComplaintCopy;
      $("send-cppa-label").textContent = copy.sendComplaintCPPA;
      $("send-ag-label").textContent = copy.sendComplaintAG;
      $("sent-label").textContent = copy.iSentIt;
      $("sent-description").textContent = copy.iSentItDesc;
      $("start-countdown").textContent = copy.startCountdown;
      $("legal-disclaimer-bottom").textContent = copy.legalDisclaimer;
      $("sender-name").placeholder = copy.fullName;
      $("sender-email").placeholder = copy.email;

      $("get-started").textContent = copy.getStarted;
      updateLanguageButtons();

      renderCompanyInputs();
      renderRightsInputs();
      syncGenerateButton();
      syncEmailLinks();
      updateStepNav();
      renderCountdown();
    }

    function generateLetter() {
      var name = $("sender-name").value.trim();
      var email = $("sender-email").value.trim();
      var selected = selectedCompanies();
      var payload = {
        senderName: name,
        senderEmail: email,
        companies: selected,
        requestTypes: state.selectedRights.slice()
      };
      var copy = text();
      var portalOnly = selected.filter(function (company) {
        return !company.privacyEmail;
      });

      state.generatedLetter = generateBatchLetter(payload);
      $("generated-letter").value = state.generatedLetter;
      $("bcc-emails").textContent = getBatchRecipientEmails(selected).join(", ");
      syncEmailLinks();

      if (portalOnly.length > 0) {
        $("no-email-warning").innerHTML = escapeHtml(copy.noEmailWarning) + " " + portalOnly.map(function (company) {
          if (company.privacyUrl) {
            return "<a href=\"" + escapeHtml(company.privacyUrl) + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline text-red-400 hover:text-ink\">" + escapeHtml(company.name) + "</a>";
          }
          return escapeHtml(company.name);
        }).join(", ");
        setVisible("no-email-warning", true);
      } else {
        setVisible("no-email-warning", false);
      }

      setVisible("letter-output", true);
      $("confirm-sent").checked = false;
      syncStartCountdownButton();
      updateStepNav();
    }

    function resetState() {
      clearDockTimer();
      hideTooltip();
      clearSentRecord();
      state.sentRecord = null;
      state.generatedLetter = "";
      state.complaintLetter = "";
      state.selectedCompanyIds = [];
      state.selectedRights = DEFAULT_RIGHTS.slice();
      state.overdueCompanyIds = [];

      $("sender-name").value = "";
      $("sender-email").value = "";
      $("overdue-name").value = "";
      $("overdue-email").value = "";
      $("generated-letter").value = "";
      $("complaint-letter").value = "";
      $("confirm-sent").checked = false;

      setVisible("letter-output", false);
      setVisible("complaint-output", false);
      setVisible("countdown-panel", false);
      setVisible("overdue-panel", false);
      setVisible("explanation-panel", true);
      setVisible("how-it-works-panel", false);
      setVisible("generator", false);
      state.activeStepKey = "companies";
      setFlowState("docked");
      renderTexts();
    }

    function setLang(lang, options) {
      options = options || {};
      var firstSelection = !state.lang;
      state.lang = lang;
      try { localStorage.setItem("optout_lang", lang); } catch (_e) {}
      renderTexts();
      translatePage(lang);

      if (state.sentRecord) {
        renderCountdown();
        return;
      }

      if (options.skipDockAnimation) {
        setFlowState("docked");
        hideTooltip();
        return;
      }

      if (firstSelection || root.getAttribute("data-flow-state") === "picker" || root.getAttribute("data-flow-state") === "holding") {
        setVisible("explanation-panel", true);
        setVisible("how-it-works-panel", false);
        setVisible("generator", false);
        setVisible("letter-output", false);
        state.activeStepKey = "companies";
        startDockSequence();
        return;
      }

      setFlowState("docked");
      hideTooltip();
    }

    $("lang-en").addEventListener("click", function () { setLang("en"); });
    $("lang-es").addEventListener("click", function () { setLang("es"); });
    $("lang-toggle-en").addEventListener("click", function () { setLang("en", { skipDockAnimation: true }); });
    $("lang-toggle-es").addEventListener("click", function () { setLang("es", { skipDockAnimation: true }); });

    $("get-started").addEventListener("click", revealGenerator);

    $("select-all-companies").addEventListener("click", function () {
      state.selectedCompanyIds = companies.map(function (company) {
        return company.id;
      });
      renderCompanyInputs();
      syncGenerateButton();
    });

    $("sender-name").addEventListener("input", syncGenerateButton);
    $("sender-email").addEventListener("input", syncGenerateButton);
    $("generate-letter").addEventListener("click", generateLetter);
    $("confirm-sent").addEventListener("change", syncStartCountdownButton);
    document.querySelectorAll("[data-step-nav]").forEach(function (link) {
      link.addEventListener("click", function () {
        state.activeStepKey = link.getAttribute("data-step-nav") || "companies";
        updateStepNav();
      });
    });
    bindRightsTooltipTrigger();

    $("start-countdown").addEventListener("click", function () {
      markAsSent(state.selectedCompanyIds.slice(), state.selectedRights.slice());
      state.sentRecord = getSentRecord();
      state.overdueCompanyIds = [];
      renderCountdown();
    });

    $("copy-letter").addEventListener("click", function () {
      copyText(state.generatedLetter, $("copy-letter"), text().copy, text().copied);
    });

    $("download-letter").addEventListener("click", function () {
      downloadText("optout-ccpa-request.txt", state.generatedLetter);
    });

    $("generate-complaint").addEventListener("click", function () {
      var complaintRights = state.sentRecord.requestTypes.length ? state.sentRecord.requestTypes.slice() : ["RIGHT_TO_DELETE", "OPT_OUT_SALE"];
      var sentDate = new Date(state.sentRecord.sentDate);
      var letters = getSelectedCompanies(state.overdueCompanyIds).map(function (company) {
        return generateComplaintLetter({
          senderName: $("overdue-name").value.trim(),
          senderEmail: $("overdue-email").value.trim(),
          company: company,
          requestTypes: complaintRights
        }, sentDate);
      });

      state.complaintLetter = letters.join("\n\n" + "=".repeat(60) + "\n\n");
      $("complaint-letter").value = state.complaintLetter;
      setVisible("complaint-output", true);
    });

    $("copy-complaint").addEventListener("click", function () {
      copyText(state.complaintLetter, $("copy-complaint"), text().copy, text().copied);
    });

    $("download-complaint").addEventListener("click", function () {
      downloadText("optout-complaint.txt", state.complaintLetter);
    });

    $("overdue-name").addEventListener("input", updateOverdueButton);
    $("overdue-email").addEventListener("input", updateOverdueButton);
    $("start-over").addEventListener("click", resetState);
    $("start-over-overdue").addEventListener("click", resetState);
    document.addEventListener("click", function (event) {
      if (!event.target.closest("[data-company-item]") &&
          !event.target.closest("#company-reference-tooltip") &&
          !event.target.closest("#rights-reference-trigger")) {
        hideTooltip();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideTooltip();
      }
    });
    window.addEventListener("resize", function () {
      hideTooltip();
      updateActiveStepFromScroll();
    });
    window.addEventListener("scroll", function () {
      if (state.pinnedTooltipId) {
        hideTooltip();
      }
      updateActiveStepFromScroll();
    }, true);

    // Restore saved language — only auto-advance if there's an active countdown
    var savedLang = null;
    try { savedLang = localStorage.getItem("optout_lang"); } catch (_e) {}
    if (state.sentRecord) {
      // Active countdown — skip the picker and show countdown directly
      setLang(savedLang === "es" ? "es" : "en", { skipDockAnimation: true });
      return;
    }
    setFlowState("picker");
  }

  function renderGuidePage() {
    if (!$("guide-rights-list")) {
      return;
    }

    var trackerState = {
      selectedRights: GUIDE_DEFAULT_RIGHTS.slice(),
      selectedComplaintRights: GUIDE_DEFAULT_RIGHTS.slice(),
      complaintLetter: ""
    };

    function renderGuideRights(containerId, selectedValues, inputName) {
      $(containerId).innerHTML = requestTypes.map(function (type) {
        var citation = citations[type];
        var checked = selectedValues.indexOf(type) !== -1 ? " checked" : "";

        return (
          "<label class=\"block text-sm text-neutral-300\">" +
            "<span class=\"flex items-start gap-3 rounded border border-line p-3\">" +
              "<input data-guide-name=\"" + escapeHtml(inputName) + "\" data-guide-type=\"" + escapeHtml(type) + "\" type=\"checkbox\" class=\"mt-1 h-4 w-4\"" + checked + ">" +
              "<span>" +
                "<span class=\"block text-ink\">" + escapeHtml(citation.label) + "</span>" +
                "<span class=\"mt-1 block leading-7 text-muted\">" + escapeHtml(citation.shortDescription) + "</span>" +
              "</span>" +
            "</span>" +
          "</label>"
        );
      }).join("");
    }

    function refreshTracker() {
      var rawDate = $("guide-sent-date").value;
      if (!rawDate) {
        $("guide-deadline-card").classList.add("hidden-panel");
        return;
      }

      var sentDate = new Date(rawDate + "T00:00:00");
      if (!isValidDate(sentDate)) {
        $("guide-deadline-card").classList.add("hidden-panel");
        return;
      }

      var deadline = getDeadlineDate(sentDate, trackerState.selectedRights);
      var daysRemaining = getDaysRemaining(sentDate.toISOString(), trackerState.selectedRights);
      var totalWindowDays = getDeadlineWindowDays(sentDate, trackerState.selectedRights);
      var progress = daysRemaining < 0 ? 100 : ((totalWindowDays - daysRemaining) / totalWindowDays) * 100;

      $("guide-deadline-card").classList.remove("hidden-panel");
      $("guide-deadline-badge").textContent = daysRemaining < 0 ? "OVERDUE by " + Math.abs(daysRemaining) + " days" : daysRemaining + " days remaining";
      $("guide-deadline-date").textContent = "Deadline: " + formatDate(deadline, "en");
      $("guide-deadline-bar").style.width = Math.max(0, Math.min(100, progress)) + "%";
      $("guide-deadline-bar").className = "h-full rounded-full " + (daysRemaining < 0 ? "bg-red-500" : (daysRemaining <= 10 ? "bg-yellow-500" : "bg-green-500"));
      $("guide-deadline-help").textContent = daysRemaining < 0
        ? "The statutory response deadline has passed. If the company did not respond, you can use the complaint generator below."
        : "This calculation uses the longest applicable deadline among the rights you selected.";
    }

    function refreshComplaintButton() {
      var companyId = $("guide-company").value;
      var rawDate = $("guide-complaint-date").value;
      var name = $("guide-name").value.trim();
      var email = $("guide-email").value.trim();
      var canGenerate = Boolean(companyId && rawDate && name && email && trackerState.selectedComplaintRights.length > 0);

      if (canGenerate) {
        canGenerate = getDaysRemaining(new Date(rawDate + "T00:00:00").toISOString(), trackerState.selectedComplaintRights) < 0;
      }

      $("guide-generate-complaint").disabled = !canGenerate;
    }

    renderGuideRights("guide-rights-list", trackerState.selectedRights, "tracker");
    renderGuideRights("guide-complaint-rights", trackerState.selectedComplaintRights, "complaint");

    $("guide-company").innerHTML += companies.map(function (company) {
      return "<option value=\"" + escapeHtml(company.id) + "\">" + escapeHtml(company.name) + "</option>";
    }).join("");

    document.addEventListener("change", function (event) {
      var target = event.target;
      if (!target || !target.matches("[data-guide-type]")) {
        return;
      }

      var listName = target.getAttribute("data-guide-name");
      var type = target.getAttribute("data-guide-type");
      var values = listName === "tracker" ? trackerState.selectedRights : trackerState.selectedComplaintRights;

      if (target.checked) {
        if (values.indexOf(type) === -1) {
          values.push(type);
        }
      } else if (values.length > 1) {
        if (listName === "tracker") {
          trackerState.selectedRights = values.filter(function (value) { return value !== type; });
        } else {
          trackerState.selectedComplaintRights = values.filter(function (value) { return value !== type; });
        }
      } else {
        target.checked = true;
      }

      refreshTracker();
      refreshComplaintButton();
    });

    $("guide-sent-date").addEventListener("input", refreshTracker);
    $("guide-company").addEventListener("change", refreshComplaintButton);
    $("guide-complaint-date").addEventListener("input", refreshComplaintButton);
    $("guide-name").addEventListener("input", refreshComplaintButton);
    $("guide-email").addEventListener("input", refreshComplaintButton);

    $("guide-generate-complaint").addEventListener("click", function () {
      var company = companies.find(function (item) {
        return item.id === $("guide-company").value;
      });
      var sentDate = new Date($("guide-complaint-date").value + "T00:00:00");

      trackerState.complaintLetter = generateComplaintLetter({
        senderName: $("guide-name").value.trim(),
        senderEmail: $("guide-email").value.trim(),
        company: company,
        requestTypes: trackerState.selectedComplaintRights.slice()
      }, sentDate);

      $("guide-complaint-letter").value = trackerState.complaintLetter;
      $("guide-complaint-output").classList.remove("hidden-panel");
    });

    $("guide-copy-complaint").addEventListener("click", function () {
      copyText(trackerState.complaintLetter, $("guide-copy-complaint"), "Copy", "Copied");
    });

    $("guide-download-complaint").addEventListener("click", function () {
      downloadText("guide-complaint.txt", trackerState.complaintLetter);
    });

    refreshTracker();
    refreshComplaintButton();
  }

  // ==============================
  // Page-wide i18n for guide + resources
  // ==============================
  var pageStrings = {
    // Guide page
    guide_label: { en: "Legal guide", es: "Gu\u00eda legal" },
    guide_title: { en: "Know your rights and track deadlines", es: "Conoce tus derechos y rastrea los plazos" },
    guide_intro: { en: "This page explains the legal timeline behind OptOut, helps you calculate a response deadline, and lets you draft a complaint if a company fails to respond.", es: "Esta p\u00e1gina explica los plazos legales, te ayuda a calcular la fecha l\u00edmite de respuesta y te permite redactar una queja si una empresa no responde." },
    guide_disclaimer: { en: "This tool generates template letters based on published California statutes. It is not legal advice, does not create an attorney-client relationship, and does not send any personal information to the server.", es: "Esta herramienta genera cartas basadas en leyes de California. No es asesor\u00eda legal, no crea una relaci\u00f3n abogado-cliente y no env\u00eda informaci\u00f3n personal al servidor." },
    guide_nav_rights: { en: "Know your rights", es: "Tus derechos" },
    guide_nav_sending: { en: "How to send", es: "C\u00f3mo enviar" },
    guide_nav_tracker: { en: "Deadline tracker", es: "Rastreador de plazos" },
    guide_nav_complaint: { en: "Complaint generator", es: "Generador de quejas" },
    guide_nav_filing: { en: "How to file", es: "C\u00f3mo presentar" },
    guide_nav_support: { en: "Support orgs", es: "Organizaciones" },
    guide_rights_title: { en: "Know your rights", es: "Conoce tus derechos" },
    guide_rights_p1: { en: "The California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), grants privacy rights to California residents. However, many companies process privacy requests broadly rather than risk non-compliance, and many states now have similar privacy laws. Sending a CCPA-style request creates a paper trail and puts a company on notice even if you are not a California resident.", es: "La Ley de Privacidad del Consumidor de California (CCPA), enmendada por la CPRA, otorga derechos de privacidad a residentes de California. Sin embargo, muchas empresas procesan todas las solicitudes para evitar incumplimiento. Enviar una solicitud estilo CCPA crea un registro y pone a la empresa sobre aviso." },
    guide_rights_p2: { en: "Most AI surveillance companies meet the CCPA thresholds: over $25 million in annual revenue, or buying, selling, or sharing data on 100,000 or more consumers. When they receive a valid request, they are required to respond within the applicable deadline.", es: "La mayor\u00eda de las empresas de vigilancia con IA cumplen los umbrales de la CCPA: m\u00e1s de $25 millones en ingresos anuales, o comprar, vender o compartir datos de 100,000 o m\u00e1s consumidores." },
    guide_deadlines_title: { en: "Key deadlines", es: "Plazos clave" },
    guide_deadline_45: { en: "45 calendar days: Right to Know, Delete, Correct, and Opt Out of Profiling.", es: "45 d\u00edas calendario: Derecho a Saber, Eliminar, Corregir y Excluir del Perfilado." },
    guide_deadline_15: { en: "15 business days: Opt Out of Sale/Sharing and Limit Sensitive Personal Information.", es: "15 d\u00edas h\u00e1biles: Excluir de Venta/Compartici\u00f3n y Limitar Informaci\u00f3n Sensible." },
    guide_deadline_ext: { en: "Companies may request one 45-day extension, but they must notify you within the initial response period.", es: "Las empresas pueden solicitar una extensi\u00f3n de 45 d\u00edas, pero deben notificarte dentro del per\u00edodo inicial." },
    guide_penalty: { en: "If a company fails to respond within the deadline, you can file a complaint with the California Privacy Protection Agency (CPPA) and/or the California Attorney General. Civil penalties can reach up to $2,500 per violation, or $7,500 per intentional violation.", es: "Si una empresa no responde dentro del plazo, puedes presentar una queja ante la CPPA y/o el Fiscal General de California. Las multas pueden llegar a $2,500 por violaci\u00f3n, o $7,500 por violaci\u00f3n intencional." },
    guide_send_title: { en: "How to send your letter", es: "C\u00f3mo enviar tu carta" },
    guide_send_email: { en: "Option 1: Email", es: "Opci\u00f3n 1: Email" },
    guide_send_email_p: { en: "Use the company's privacy email address and keep a copy in your sent folder as proof.", es: "Usa el correo de privacidad de la empresa y guarda una copia como prueba." },
    guide_send_portal: { en: "Option 2: Privacy portal", es: "Opci\u00f3n 2: Portal de privacidad" },
    guide_send_portal_p: { en: "Some companies require submission through an online portal. Paste the letter into the form and save screenshots.", es: "Algunas empresas requieren env\u00edo por portal. Pega la carta en el formulario y guarda capturas." },
    guide_send_mail: { en: "Option 3: Certified mail", es: "Opci\u00f3n 3: Correo certificado" },
    guide_send_mail_p: { en: "Certified mail creates the clearest proof of delivery and gives you a physical record of timing.", es: "El correo certificado crea la prueba m\u00e1s clara de entrega." },
    guide_tracker_title: { en: "Deadline tracker", es: "Rastreador de plazos" },
    guide_tracker_desc: { en: "Enter the date you sent your letter and select the rights you requested. The calculation uses the same business-day and calendar-day rules as the main tool.", es: "Ingresa la fecha en que enviaste tu carta y selecciona los derechos solicitados." },
    guide_tracker_date: { en: "Date you sent the letter", es: "Fecha de env\u00edo de la carta" },
    guide_tracker_rights: { en: "Rights you requested", es: "Derechos solicitados" },
    guide_complaint_title: { en: "Complaint generator", es: "Generador de quejas" },
    guide_complaint_desc: { en: "If a company missed the deadline, generate a formal complaint letter to the CPPA and the California Attorney General.", es: "Si una empresa no cumpli\u00f3 el plazo, genera una carta de queja formal para la CPPA y el Fiscal General." },
    guide_complaint_company: { en: "Company", es: "Empresa" },
    guide_complaint_select: { en: "Select a company...", es: "Selecciona una empresa..." },
    guide_complaint_date: { en: "Date you sent the original letter", es: "Fecha de env\u00edo de la carta original" },
    guide_complaint_rights: { en: "Rights you requested", es: "Derechos solicitados" },
    guide_complaint_name: { en: "Your name", es: "Tu nombre" },
    guide_complaint_email: { en: "Your email", es: "Tu correo" },
    guide_complaint_btn: { en: "Generate complaint letter", es: "Generar carta de queja" },
    guide_complaint_copy: { en: "Copy", es: "Copiar" },
    guide_complaint_download: { en: "Download", es: "Descargar" },
    guide_file_title: { en: "How to file a complaint", es: "C\u00f3mo presentar una queja" },
    guide_file_step1: { en: "Step 1: File with the CPPA", es: "Paso 1: Presentar ante la CPPA" },
    guide_file_step1_p: { en: "The CPPA has independent enforcement authority and can impose fines of $2,500 to $7,500 per violation.", es: "La CPPA tiene autoridad de ejecuci\u00f3n independiente y puede imponer multas de $2,500 a $7,500 por violaci\u00f3n." },
    guide_file_step2: { en: "Step 2: File with the California Attorney General", es: "Paso 2: Presentar ante el Fiscal General" },
    guide_file_step2_p: { en: "The Attorney General has concurrent enforcement authority and may use complaints in pattern-of-practice investigations.", es: "El Fiscal General tiene autoridad concurrente y puede usar las quejas en investigaciones." },
    guide_file_step3: { en: "Step 3: Keep records", es: "Paso 3: Guardar registros" },
    guide_file_step3_p: { en: "Save your original letter, proof of delivery, screenshots, complaint drafts, and any company responses. Keep dates organized.", es: "Guarda tu carta original, prueba de entrega, capturas, borradores de quejas y respuestas. Mant\u00e9n las fechas organizadas." },
    guide_support_title: { en: "Support organizations", es: "Organizaciones de apoyo" },
    guide_support_note: { en: "This page does not collect or store any personal information. Any complaint text you generate is created locally in your browser.", es: "Esta p\u00e1gina no recopila ni almacena informaci\u00f3n personal. Todo se genera localmente en tu navegador." },
    // Resources page
    res_label: { en: "Resources", es: "Recursos" },
    res_title: { en: "Further reading and practical help", es: "Lectura adicional y ayuda pr\u00e1ctica" },
    res_intro: { en: "optout.fyi covers one piece of a broader privacy strategy. These references can help you remove data from brokers, understand immigrant data rights, and improve your digital security.", es: "optout.fyi cubre una parte de una estrategia m\u00e1s amplia de privacidad. Estos recursos pueden ayudarte a eliminar datos de corredores, entender tus derechos y mejorar tu seguridad digital." },
    res_disclaimer: { en: "This page contains only static links and explanations. No data collection, no accounts, and no user tracking.", es: "Esta p\u00e1gina solo contiene enlaces est\u00e1ticos. Sin recopilaci\u00f3n de datos, sin cuentas, sin rastreo." },
    res_nav_brokers: { en: "Data broker opt-outs", es: "Exclusi\u00f3n de corredores" },
    res_nav_advocacy: { en: "Advocacy", es: "Defensa" },
    res_nav_security: { en: "Digital security", es: "Seguridad digital" },
    res_nav_why: { en: "Why this matters", es: "Por qu\u00e9 importa" },
    res_brokers_title: { en: "Data broker opt-outs", es: "Exclusi\u00f3n de corredores de datos" },
    res_brokers_desc: { en: "Guides and registries for removing your personal information from data brokers that sell to law enforcement and immigration agencies.", es: "Gu\u00edas y registros para eliminar tu informaci\u00f3n personal de corredores de datos que venden a agencias de inmigraci\u00f3n." },
    res_advocacy_title: { en: "Advocacy and immigrant data rights", es: "Defensa y derechos de datos de inmigrantes" },
    res_advocacy_desc: { en: "Organizations documenting how commercial data is used in immigration enforcement and fighting surveillance practices.", es: "Organizaciones que documentan c\u00f3mo se usan datos comerciales en la aplicaci\u00f3n de leyes de inmigraci\u00f3n." },
    res_security_title: { en: "Digital security links", es: "Enlaces de seguridad digital" },
    res_security_desc: { en: "Practical guides for higher-risk communities, including immigrants, activists, and journalists.", es: "Gu\u00edas pr\u00e1cticas para comunidades de alto riesgo, incluidos inmigrantes, activistas y periodistas." },
    res_why_title: { en: "Why this matters", es: "Por qu\u00e9 esto importa" },
    res_why_p1: { en: "AI surveillance companies collect data from public records, social media, cell phone location pings, license plate readers, utility records, and many other sources. That data can be packaged into products used to locate, profile, and target immigrants.", es: "Las empresas de vigilancia con IA recopilan datos de registros p\u00fablicos, redes sociales, ubicaci\u00f3n de celulares, lectores de placas y muchas otras fuentes. Esos datos pueden usarse para localizar, perfilar y atacar a inmigrantes." },
    res_why_p2: { en: "Exercising your privacy rights is one step. Opting out of data brokers, securing communications, and understanding your digital footprint are part of the same broader defense.", es: "Ejercer tus derechos de privacidad es un paso. Excluirte de corredores de datos, asegurar tus comunicaciones y entender tu huella digital son parte de la misma defensa." },
    res_why_note: { en: "optout.fyi does not endorse or verify every third-party site listed here. Review those organizations and decide what is appropriate for your situation.", es: "optout.fyi no respalda ni verifica cada sitio listado aqu\u00ed. Revisa esas organizaciones y decide qu\u00e9 es apropiado para tu situaci\u00f3n." },
    res_about_title: { en: "About this tool", es: "Acerca de esta herramienta" },
    res_about_p: { en: "optout.fyi generates template letters based on published California statutes (CCPA/CPRA). It is not legal advice and does not create an attorney-client relationship.", es: "optout.fyi genera cartas basadas en leyes publicadas de California (CCPA/CPRA). No es asesor\u00eda legal." },
    res_inspired: { en: "Inspired by the ILRC Red Cards \u2014 know your rights, assert your rights.", es: "Inspirado en las Tarjetas Rojas del ILRC \u2014 conoce tus derechos, ejerce tus derechos." },
    // Footer
    footer_zero: { en: "Zero data collected. Everything runs in your browser.", es: "Cero datos recopilados. Todo funciona en tu navegador." }
  };

  function translatePage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (pageStrings[key] && pageStrings[key][lang]) {
        el.textContent = pageStrings[key][lang];
      }
    });
    // Footer
    var footerText = document.querySelector("[data-i18n-footer]");
    if (footerText && pageStrings.footer_zero) {
      footerText.textContent = pageStrings.footer_zero[lang];
    }
  }

  function initializePage() {
    renderIndexPage();
    renderGuidePage();
    // Apply saved language to guide/resources/footer
    var lang = "en";
    try { lang = localStorage.getItem("optout_lang") || "en"; } catch (_e) {}
    if (lang !== "en" && lang !== "es") lang = "en";
    translatePage(lang);
  }

  document.addEventListener("DOMContentLoaded", initializePage);
})();
