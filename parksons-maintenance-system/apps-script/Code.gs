// ============================================================
// PARKSONS MAINTENANCE SYSTEM — Code.gs (v3.2 FINAL)
//
// IMPORTANT — After EVERY new deployment:
//   Run showAllUrls() from the menu to get your current URL.
//   Update SCRIPT_URL in Parksons_Maintenance_Form_v3.html
//   to match whatever URL Apps Script gives you.
//
// Files needed in this project:
//   Code.gs        ← this file
//   Dashboard.html ← dashboard template
//   Admin.html     ← admin panel template
// ============================================================

var CONFIG = {
  sheetName:      'Raw_Data',
  finalSheetName: 'Final_Data',
  emailTo:        'yogeshkp85@gmail.com',
  companyName:    'Parksons Packaging Ltd',
  timezone:       'Asia/Kolkata',
  adminPassword:  'PKS@2026'
};

// Column positions in Raw_Data (0-based: A=0, B=1...)
var COL = {
  TIMESTAMP:    0,
  REF_ID:       1,
  DATE:         2,
  SHIFT:        3,
  MACH_TYPE:    4,
  MACH_NAME:    5,
  UNIT:         6,
  PROB_TYPE:    7,
  CATEGORY:     8,
  DESCRIPTION:  9,
  ACTION:       10,
  ROOT_CAUSE:   11,
  TIME_START:   12,
  TIME_END:     13,
  DURATION:     14,
  ATTENDED_BY:  15,
  SUBMITTED_BY: 16,
  REMARKS:      17,
  STATUS:       18
};

// ── ALWAYS USE THIS for URLs — reads live deployment URL ──────
// ── DEPLOYMENT URL ────────────────────────────────────────────
// UPDATE THIS after every new deployment (clasp deploy or manual)
// Get it from: Deploy → Manage Deployments → copy the /exec URL
var DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbzsMfr4NRuSkH8zQnPxZeaw4EnBIvTHXj-4O210a2ICbD4JF6s/exec';

function getBaseUrl() {
  // Hardcoded URL is most reliable — ScriptApp.getService().getUrl()
  // can return wrong URL when called from menu or trigger context.
  // After each new deployment, update DEPLOYMENT_URL above.
  if (DEPLOYMENT_URL && DEPLOYMENT_URL.indexOf('YOUR_DEPLOYMENT_ID') === -1) {
    return DEPLOYMENT_URL;
  }
  try {
    return ScriptApp.getService().getUrl();
  } catch(e) {
    return DEPLOYMENT_URL;
  }
}

// ── 1. GOOGLE SHEET MENU ─────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Maintenance System')
    .addItem('Open Live Dashboard',   'openDashboard')
    .addItem('Open Admin Panel',      'openAdminPanel')
    .addItem('Send Email Report Now', 'sendDailyEmailReport')
    .addSeparator()
    .addItem('Show All URLs',         'showAllUrls')
    .addItem('Test Form Submission',  'testSubmit')
    .addToUi();
}

function openDashboard() {
  var url = getBaseUrl() + '?page=dashboard';
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(
      '<script>window.open("' + url + '","_blank");google.script.host.close();<\/script>' +
      '<p style="font-family:sans-serif;padding:20px;color:#555">Opening Dashboard...</p>'
    ), 'Opening...'
  );
}

function openAdminPanel() {
  var url = getBaseUrl() + '?page=admin';
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(
      '<script>window.open("' + url + '","_blank");google.script.host.close();<\/script>' +
      '<p style="font-family:sans-serif;padding:20px;color:#555">Opening Admin Panel...</p>'
    ), 'Opening...'
  );
}

function showAllUrls() {
  var base = getBaseUrl();
  SpreadsheetApp.getUi().alert(
    '=== PARKSONS — YOUR CURRENT URLS ===\n\n' +
    'FORM SCRIPT_URL (update in HTML form):\n' + base + '\n\n' +
    'Dashboard:\n' + base + '?page=dashboard\n\n' +
    'Admin Panel:\n' + base + '?page=admin\n\n' +
    'Admin Password: ' + CONFIG.adminPassword + '\n\n' +
    'NOTE: Copy the FORM SCRIPT_URL above and paste it\n' +
    'into Parksons_Maintenance_Form_v3.html replacing\n' +
    'the old URL in the var SCRIPT_URL = "..." line.'
  );
}

// ── 2. WEB APP ROUTER ─────────────────────────────────────────
function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var page   = params.page || '';

  // Handle GET fallback from HTML form (payload parameter)
  if (params.payload) {
    try {
      var data = JSON.parse(decodeURIComponent(params.payload));
      writeFormSubmission(data);
    } catch(err) {
      Logger.log('GET payload error: ' + err);
    }
    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  if (page === 'dashboard') return serveDashboard();
  if (page === 'admin')     return serveAdmin();

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok', version: '3.2',
      urls: {
        dashboard: getBaseUrl() + '?page=dashboard',
        admin:     getBaseUrl() + '?page=admin'
      }
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw  = e && e.postData && e.postData.contents ? e.postData.contents : null;
    var data = raw ? JSON.parse(raw) : (e && e.parameter ? e.parameter : {});
    var act  = data.action || 'submit';

    if (act === 'getPending')    return jsonResp(getPendingEntries());
    if (act === 'approve')       return jsonResp(approveEntry(data));
    if (act === 'reject')        return jsonResp(rejectEntry(data));
    if (act === 'update')        return jsonResp(updateEntry(data));
    if (act === 'updateApprove') return jsonResp(updateAndApprove(data));

    // Default: new form submission
    var result = writeFormSubmission(data);
    return jsonResp({ status: 'success', refId: result.refId });

  } catch(err) {
    Logger.log('doPost error: ' + err);
    return jsonResp({ status: 'error', message: err.toString() });
  }
}

function jsonResp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 3. SERVE DASHBOARD ────────────────────────────────────────
function serveDashboard() {
  try {
    var tpl = HtmlService.createTemplateFromFile('Dashboard');
    tpl.dataJson = JSON.stringify(getDashboardData());
    return tpl.evaluate()
      .setTitle('Parksons Maintenance Dashboard')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch(err) {
    return HtmlService.createHtmlOutput(
      '<body style="font-family:sans-serif;padding:40px;background:#0a0d13;color:#e84040">' +
      '<h2>Dashboard Error</h2><pre>' + err.toString() + '</pre></body>'
    );
  }
}

// ── 4. SERVE ADMIN PANEL ──────────────────────────────────────
function serveAdmin() {
  try {
    var tpl = HtmlService.createTemplateFromFile('Admin');
    tpl.baseUrl = getBaseUrl();
    return tpl.evaluate()
      .setTitle('Parksons Admin Panel')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch(err) {
    return HtmlService.createHtmlOutput(
      '<body style="font-family:sans-serif;padding:40px;background:#0a0d13;color:#e84040">' +
      '<h2>Admin Panel Error</h2><pre>' + err.toString() + '</pre></body>'
    );
  }
}

// ── 5. DASHBOARD DATA — APPROVED ENTRIES ONLY ─────────────────
function getDashboardData() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.finalSheetName);
  if (!sheet) return { error: 'Final_Data sheet not found', rows: [] };

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { error: null, rows: [], generated: new Date().toISOString() };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rawData = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

  var colMap = {};
  headers.forEach(function(h, i) { colMap[String(h).trim()] = i; });

  // Build status lookup from Raw_Data
  var statusMap = buildStatusMap();

  var rows = [];
  rawData.forEach(function(row) {
    var mn    = String(row[colMap['Machine_Name']] || '').trim();
    var refId = String(row[colMap['Ref_ID']]       || '').trim();
    if (!mn && !refId) return;

    // Filter: only APPROVED rows appear in dashboard
    if (refId && Object.keys(statusMap).length > 0) {
      if ((statusMap[refId] || 'PENDING_REVIEW') !== 'APPROVED') return;
    }

    var dv        = row[colMap['Date']];
    var dateStr   = fmtDate(dv);
    var monthYear = String(row[colMap['Month_Year']] || '');
    if (!monthYear && dv instanceof Date && !isNaN(dv))
      monthYear = Utilities.formatDate(dv, CONFIG.timezone, 'MMM-yy');

    var ts = row[colMap['Time_Start']] || '';
    var te = row[colMap['Time_End']]   || '';
    if (ts instanceof Date) ts = Utilities.formatDate(ts, CONFIG.timezone, 'hh:mm a');
    if (te instanceof Date) te = Utilities.formatDate(te, CONFIG.timezone, 'hh:mm a');

    rows.push({
      refId:       refId,
      date:        dateStr,
      monthYear:   monthYear,
      shift:       String(row[colMap['Shift']]        || '').replace('Thrid','Third'),
      machineType: String(row[colMap['Machine_Type']] || ''),
      machineName: mn,
      unit:        String(row[colMap['Unit']]         || ''),
      problemType: String(row[colMap['Problem_Type']] || ''),
      category:    String(row[colMap['Category']]     || ''),
      description: String(row[colMap['Description']]  || ''),
      actionTaken: String(row[colMap['Action_Taken']] || ''),
      timeStart:   String(ts),
      timeEnd:     String(te),
      minutes:     parseFloat(row[colMap['Minutes']])            || 0,
      bdFlag:      parseInt(row[colMap['BD_Flag']])              || 0,
      availableMin:parseFloat(row[colMap['Available_Time_Min']]) || 44640,
      attendedBy:  String(row[colMap['Attended_By']] || '')
    });
  });

  return { error: null, rows: rows, totalRows: rows.length, generated: new Date().toISOString() };
}

// ── 6. GET ALL ENTRIES FOR ADMIN ──────────────────────────────
function getPendingEntries() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) return { status: 'error', message: 'Raw_Data sheet not found' };

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'success', all: [], pendingCount: 0, totalCount: 0 };

  var data = sheet.getRange(2, 1, lastRow - 1, 19).getValues();
  var all  = [];

  data.forEach(function(row, i) {
    var refId = String(row[COL.REF_ID] || '').trim();
    if (!refId) return;
    var status = String(row[COL.STATUS] || 'PENDING_REVIEW').trim();
    all.push({
      rowNum:      i + 2,
      refId:       refId,
      timestamp:   fmtTimestamp(row[COL.TIMESTAMP]),
      date:        fmtDate(row[COL.DATE]),
      shift:       String(row[COL.SHIFT]        || ''),
      machineType: String(row[COL.MACH_TYPE]    || ''),
      machineName: String(row[COL.MACH_NAME]    || ''),
      unit:        String(row[COL.UNIT]         || ''),
      problemType: String(row[COL.PROB_TYPE]    || ''),
      category:    String(row[COL.CATEGORY]     || ''),
      description: String(row[COL.DESCRIPTION]  || ''),
      actionTaken: String(row[COL.ACTION]       || ''),
      rootCause:   String(row[COL.ROOT_CAUSE]   || ''),
      timeStart:   fmtTime(row[COL.TIME_START]),
      timeEnd:     fmtTime(row[COL.TIME_END]),
      duration:    String(row[COL.DURATION]     || ''),
      attendedBy:  String(row[COL.ATTENDED_BY]  || ''),
      submittedBy: String(row[COL.SUBMITTED_BY] || ''),
      remarks:     String(row[COL.REMARKS]      || ''),
      status:      status
    });
  });

  var pending = all.filter(function(e){ return e.status === 'PENDING_REVIEW'; });
  return { status: 'success', all: all, pendingCount: pending.length, totalCount: all.length };
}

// ── 7. APPROVE / REJECT / UPDATE ──────────────────────────────
function approveEntry(data) {
  return setStatus(data, 'APPROVED');
}
function rejectEntry(data) {
  return setStatus(data, 'REJECTED');
}
function setStatus(data, statusValue) {
  var sheet  = getRawSheet();
  var rowNum = parseInt(data.rowNum, 10);
  if (!sheet || rowNum < 2) return { status: 'error', message: 'Invalid row' };
  sheet.getRange(rowNum, COL.STATUS + 1).setValue(statusValue);
  SpreadsheetApp.flush();
  return { status: 'success', message: statusValue, refId: data.refId };
}

function updateEntry(data) {
  var sheet  = getRawSheet();
  var rowNum = parseInt(data.rowNum, 10);
  if (!sheet || rowNum < 2) return { status: 'error', message: 'Invalid row' };
  writeEdits(sheet, rowNum, data);
  SpreadsheetApp.flush();
  return { status: 'success', message: 'Saved (still pending)', refId: data.refId };
}

function updateAndApprove(data) {
  var sheet  = getRawSheet();
  var rowNum = parseInt(data.rowNum, 10);
  if (!sheet || rowNum < 2) return { status: 'error', message: 'Invalid row' };
  writeEdits(sheet, rowNum, data);
  sheet.getRange(rowNum, COL.STATUS + 1).setValue('APPROVED');
  SpreadsheetApp.flush();
  return { status: 'success', message: 'Updated & Approved', refId: data.refId };
}

function writeEdits(sheet, rowNum, data) {
  var pairs = [
    [COL.DATE,        data.date        || ''],
    [COL.SHIFT,       data.shift       || ''],
    [COL.MACH_TYPE,   data.machineType || ''],
    [COL.MACH_NAME,   data.machineName || ''],
    [COL.UNIT,        data.unit        || ''],
    [COL.PROB_TYPE,   data.problemType || ''],
    [COL.CATEGORY,    data.category    || ''],
    [COL.DESCRIPTION, data.description || ''],
    [COL.ACTION,      data.actionTaken || ''],
    [COL.ROOT_CAUSE,  data.rootCause   || ''],
    [COL.TIME_START,  fmtTimeStr(data.timeStart || '')],
    [COL.TIME_END,    fmtTimeStr(data.timeEnd   || '')],
    [COL.DURATION,    data.duration    || ''],
    [COL.ATTENDED_BY, data.attendedBy  || ''],
    [COL.REMARKS,     data.remarks     || '']
  ];
  pairs.forEach(function(p) {
    if (p[1] !== undefined && p[1] !== '') {
      sheet.getRange(rowNum, p[0] + 1).setValue(p[1]);
    }
  });
}

// ── 8. WRITE NEW FORM SUBMISSION ──────────────────────────────
function writeFormSubmission(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) { sheet = ss.insertSheet(CONFIG.sheetName); setupHeaders(); }

  var now   = new Date();
  var refId = data.refId ||
    ('PKS-' + Utilities.formatDate(now, CONFIG.timezone, 'yyyyMMdd') + '-' +
              Utilities.formatDate(now, CONFIG.timezone, 'HHmmss'));

  // Fix date: form sends YYYY-MM-DD, parse safely for IST timezone
  var dateStr = parseDateSafe(data.date || '');

  sheet.appendRow([
    now,                                         // A Timestamp
    refId,                                       // B Ref_ID
    dateStr,                                     // C Date
    data.shift        || '',                     // D Shift
    data.machineType  || '',                     // E Machine_Type
    data.machineName  || '',                     // F Machine_Name
    data.unit         || '',                     // G Unit
    data.problemType  || '',                     // H Problem_Type
    data.category     || '',                     // I Category
    data.description  || '',                     // J Description
    data.actionTaken  || '',                     // K Action_Taken
    data.rootCause    || '',                     // L Root_Cause
    fmtTimeStr(data.timeStart || ''),            // M Time_Start
    fmtTimeStr(data.timeEnd   || ''),            // N Time_End
    data.durationMin  || '',                     // O Duration_Min
    data.attendedBy   || '',                     // P Attended_By
    data.submittedBy  || data.attendedBy || '',  // Q Submitted_By
    data.remarks      || '',                     // R Remarks
    'PENDING_REVIEW'                             // S Status
  ]);
  SpreadsheetApp.flush();
  Logger.log('Submitted: ' + refId + ' | Date: ' + dateStr + ' | Shift: ' + (data.shift||''));
  return { refId: refId };
}

// ── 9. HELPERS ─────────────────────────────────────────────────
function getRawSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
}

function buildStatusMap() {
  var map   = {};
  var sheet = getRawSheet();
  if (!sheet || sheet.getLastRow() < 2) return map;
  var data  = sheet.getRange(2, 1, sheet.getLastRow() - 1, 19).getValues();
  data.forEach(function(row) {
    var refId = String(row[COL.REF_ID] || '').trim();
    if (refId) map[refId] = String(row[COL.STATUS] || 'PENDING_REVIEW').trim();
  });
  return map;
}

// Safely parse date string from HTML date input (YYYY-MM-DD)
// Avoids UTC/IST timezone shift that causes "previous day" bug
function parseDateSafe(dateStr) {
  if (!dateStr) return '';
  // Already formatted as dd/MM/yyyy — return as-is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  // Format: YYYY-MM-DD (from HTML date input)
  var m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return m[3] + '/' + m[2] + '/' + m[1]; // → dd/MM/yyyy (no timezone conversion)
  // Try as Date object fallback
  try {
    var d = new Date(dateStr);
    if (!isNaN(d)) return Utilities.formatDate(d, CONFIG.timezone, 'dd/MM/yyyy');
  } catch(e) {}
  return dateStr;
}

function fmtDate(v) {
  if (!v) return '';
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, CONFIG.timezone, 'dd/MM/yyyy');
  if (typeof v === 'number' && v > 0) {
    try { return Utilities.formatDate(new Date((v-25569)*86400000), CONFIG.timezone, 'dd/MM/yyyy'); } catch(e) {}
  }
  return String(v);
}

function fmtTimestamp(v) {
  if (!v) return '';
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, CONFIG.timezone, 'dd/MM/yyyy HH:mm');
  return String(v);
}

function fmtTime(v) {
  if (!v) return '';
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, CONFIG.timezone, 'HH:mm');
  return String(v).replace(/^'/, '');
}

function fmtTimeStr(ts) {
  if (!ts) return '';
  var c = String(ts).replace(/'/g,'').trim();
  if (c.indexOf('GMT') > -1) {
    var m = c.match(/(\d{1,2}):(\d{2}):(\d{2})/);
    if (m) return "'" + zp(m[1]) + ':' + zp(m[2]) + ':' + m[3];
  }
  var p = c.split(':');
  if (p.length >= 2) {
    var h  = parseInt(p[0], 10);
    var mm = zp(p[1]);
    if (c.toUpperCase().indexOf('PM') > -1 && h < 12) h += 12;
    if (c.toUpperCase().indexOf('AM') > -1 && h === 12) h = 0;
    return "'" + zp(h) + ':' + mm + ':' + (p[2] ? p[2].replace(/\D/g,'').substring(0,2) : '00');
  }
  return "'" + c;
}

function zp(n) { return String(n).padStart(2,'0'); }

// ── 10. SETUP HEADERS ─────────────────────────────────────────
function setupHeaders() {
  var sheet = getRawSheet() || SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.sheetName);
  var h = ['Timestamp','Ref_ID','Date','Shift','Machine_Type','Machine_Name','Unit',
           'Problem_Type','Category','Description','Action_Taken','Root_Cause',
           'Time_Start','Time_End','Duration_Min','Attended_By','Submitted_By','Remarks','Status'];
  sheet.getRange(1,1,1,h.length).setValues([h])
    .setFontWeight('bold').setBackground('#0a0d13').setFontColor('#f0a500');
  sheet.setFrozenRows(1);
}

// ── 11. TEST SUBMIT ───────────────────────────────────────────
function testSubmit() {
  var r = writeFormSubmission({
    date:'2026-03-28', shift:'First Shift', machineType:'PRINTING',
    machineName:'PrintKBA1', unit:'Feeder', problemType:'Electrical',
    category:'Breakdown', description:'Test v3.2 - date fix test',
    actionTaken:'Test OK', rootCause:'Test', timeStart:'09:00:00',
    timeEnd:'09:30:00', durationMin:30, attendedBy:'YogeshK',
    submittedBy:'YogeshK', remarks:'v3.2 test'
  });
  SpreadsheetApp.getUi().alert(
    'Test submitted! Ref: ' + r.refId +
    '\n\nCheck Raw_Data — Column C (Date) should show: 28/03/2026' +
    '\nColumn D (Shift) should show: First Shift' +
    '\n\nThen open Admin Panel to approve.\n\n' +
    'Your Admin Panel URL:\n' + getBaseUrl() + '?page=admin'
  );
}

// ── 12. EMAIL REPORT ──────────────────────────────────────────
function sendDailyEmailReport() {
  var data   = getDashboardData();
  var rows   = data.rows || [];
  var yest   = new Date(); yest.setDate(yest.getDate()-1);
  var yStr   = Utilities.formatDate(yest, CONFIG.timezone, 'dd/MM/yyyy');
  var yRows  = rows.filter(function(r){return r.date===yStr;});
  var bdRows = yRows.filter(function(r){return r.category==='Breakdown';});
  var tot    = yRows.reduce(function(s,r){return s+(r.minutes||0);},0);
  var mttr   = bdRows.length>0 ? Math.round(bdRows.reduce(function(s,r){return s+r.minutes;},0)/bdRows.length) : 0;
  var base   = getBaseUrl();
  var subj   = CONFIG.companyName+' — Daily Maintenance Report — '+
               Utilities.formatDate(yest,CONFIG.timezone,'dd MMM yyyy');

  var body =
    '<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto">' +
    '<div style="background:#0a0d13;color:#f0a500;padding:22px 24px">' +
    '<h2 style="margin:0;font-size:20px;letter-spacing:2px">PARKSONS MAINTENANCE REPORT</h2>' +
    '<p style="margin:6px 0 0;color:#6b7a99;font-size:12px">'+
      Utilities.formatDate(yest,CONFIG.timezone,'EEEE, dd MMMM yyyy')+'</p></div>' +
    '<div style="background:#fff;padding:22px 24px;border:1px solid #e0e0e0;border-top:none">' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">' +
    '<tr><td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Total Entries</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px;color:#2d7bf4">'+yRows.length+'</td>' +
    '<td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Breakdowns</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px;color:#e84040">'+bdRows.length+'</td></tr>' +
    '<tr><td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Total Downtime</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px">'+(tot/60).toFixed(1)+' hrs</td>' +
    '<td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Avg MTTR</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px;color:#f0a500">'+mttr+' min</td></tr>' +
    '</table>' +
    '<div style="display:flex;gap:12px">' +
    '<a href="'+base+'?page=dashboard" style="flex:1;display:block;padding:13px;background:#0a0d13;color:#f0a500;text-align:center;text-decoration:none;font-weight:bold;font-size:13px;border-radius:5px">View Dashboard</a>' +
    '<a href="'+base+'?page=admin" style="flex:1;display:block;padding:13px;background:#2d7bf4;color:#fff;text-align:center;text-decoration:none;font-weight:bold;font-size:13px;border-radius:5px">Open Admin Panel</a>' +
    '</div></div></div>';

  MailApp.sendEmail({to:CONFIG.emailTo, subject:subj, htmlBody:body});
  SpreadsheetApp.getUi().alert('Email sent to '+CONFIG.emailTo);
}

// Set trigger: Triggers → sendDailyEmailReport → Time-driven → Day timer → 8am–9am
