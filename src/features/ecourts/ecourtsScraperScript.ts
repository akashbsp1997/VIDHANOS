/**
 * Injected into the eCourts WebView on demand (never runs automatically). Best-effort DOM
 * scraping only — the eCourts case-status page template varies by state/High Court/district
 * and can change without notice, so every step is wrapped in try/catch and a parse failure
 * simply reports `ok: false` rather than crashing the WebView or the app. This is a
 * human-in-the-loop convenience: the user searches and solves the CAPTCHA themselves: this
 * script only reads the resulting page after they've done so.
 */
export const ECOURTS_SCRAPER_SCRIPT = `
(function () {
  try {
    function normalize(text) {
      return (text || '').replace(/\\s+/g, ' ').trim();
    }

    function collectLabelValuePairs() {
      var pairs = {};
      var rows = document.querySelectorAll('table tr');
      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll('td, th');
        if (cells.length >= 2) {
          var label = normalize(cells[0].innerText).replace(/[:：]\\s*$/, '').toLowerCase();
          var valueCell = cells.length >= 3 ? cells[2] : cells[1];
          var value = normalize(valueCell ? valueCell.innerText : '');
          if (label && value && label.length < 60) {
            pairs[label] = value;
          }
        }
      }
      return pairs;
    }

    function findByKeywords(pairs, keywords) {
      for (var key in pairs) {
        for (var i = 0; i < keywords.length; i++) {
          if (key.indexOf(keywords[i]) !== -1) return pairs[key];
        }
      }
      return null;
    }

    function collectHearingHistory() {
      var tables = document.querySelectorAll('table');
      var history = [];
      for (var t = 0; t < tables.length; t++) {
        var headerText = normalize(tables[t].querySelectorAll('tr')[0] ? tables[t].querySelectorAll('tr')[0].innerText : '').toLowerCase();
        var looksLikeHistory =
          (headerText.indexOf('date') !== -1) &&
          (headerText.indexOf('purpose') !== -1 || headerText.indexOf('business') !== -1 || headerText.indexOf('order') !== -1);
        if (!looksLikeHistory) continue;

        var rows = tables[t].querySelectorAll('tr');
        for (var r = 1; r < rows.length; r++) {
          var cells = rows[r].querySelectorAll('td');
          if (cells.length < 2) continue;
          var rowText = [];
          for (var c = 0; c < cells.length; c++) rowText.push(normalize(cells[c].innerText));
          if (rowText.join('').length > 0) history.push(rowText);
        }
      }
      return history;
    }

    var pairs = collectLabelValuePairs();

    var data = {
      petitionerName: findByKeywords(pairs, ['petitioner', 'applicant', 'complainant']),
      respondentName: findByKeywords(pairs, ['respondent', 'opponent', 'accused', 'defendant']),
      cnrNumber: findByKeywords(pairs, ['cnr number', 'cnr no', 'cnr']),
      filingNumber: findByKeywords(pairs, ['filing number', 'filing no']),
      filingDate: findByKeywords(pairs, ['filing date']),
      registrationNumber: findByKeywords(pairs, ['registration number', 'registration no']),
      caseType: findByKeywords(pairs, ['case type', 'type of case']),
      forumName: findByKeywords(pairs, ['court name', 'coram', 'court']),
      judgeName: findByKeywords(pairs, ['judge', 'coram']),
      caseStatus: findByKeywords(pairs, ['case status', 'status']),
      stage: findByKeywords(pairs, ['stage', 'purpose of hearing', 'next purpose']),
      nextHearingDate: findByKeywords(pairs, ['next hearing date', 'next date']),
      hearingHistory: collectHearingHistory(),
      pageTitle: normalize(document.title),
    };

    var hasAnyData = Object.keys(data).some(function (key) {
      var value = data[key];
      return value && (typeof value !== 'object' || value.length > 0);
    });

    if (!hasAnyData) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ ok: false, error: 'no_recognizable_data' }));
      return;
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ ok: true, data: data }));
  } catch (e) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
  }
  true;
})();
`;
