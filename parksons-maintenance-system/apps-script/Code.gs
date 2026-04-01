// ============================================================
// PARKSONS MAINTENANCE SYSTEM - Code.gs (v3.5 FINAL)
// ============================================================

var CONFIG = {
  sheetName:        'Raw_Data',
  finalSheetName:   'Final_Data',
  emailTo:          'yogeshkp85@gmail.com',
  companyName:      'Parksons Packaging Ltd',
  timezone:         'Asia/Kolkata',
  adminPassword:    'PKS@2026',
  machineSheetName: 'Machine_Data',
  adminUsersSheet:  'Admin_Users',
  emailExportTo:    ['yogeshkp85@gmail.com', 'engg.cn@parksonspackaging.com']
};

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

var DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbyeDqlhh8beleGToHBXQgHcnm785z4xZ6sOAlS_5IHrIzZwoYlxg81wnnpbfpHbmxPA/exec';

function getBaseUrl() {
  return DEPLOYMENT_URL;
}

// 1. MENU
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Maintenance System')
    .addItem('Open Live Dashboard',    'openDashboard')
    .addItem('Open Admin Panel',       'openAdminPanel')
    .addItem('Send Email Report Now',  'sendDailyEmailReport')
    .addItem('Send Daily Data Export', 'sendDailyDataExport')
    .addSeparator()
    .addItem('Show All URLs',          'showAllUrls')
    .addItem('Test Form Submission',   'testSubmit')
    .addToUi();
}

function openDashboard() {
  var url = getBaseUrl() + '?page=dashboard';
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(
      '<script>window.open("' + url + '","_blank");google.script.host.close();<\/script>' +
      '<p style="font-family:sans-serif;padding:20px;color:#555">Opening Dashboard...</p>'
    ), 'Opening...');
}

function openAdminPanel() {
  var url = getBaseUrl() + '?page=admin';
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(
      '<script>window.open("' + url + '","_blank");google.script.host.close();<\/script>' +
      '<p style="font-family:sans-serif;padding:20px;color:#555">Opening Admin Panel...</p>'
    ), 'Opening...');
}

function showAllUrls() {
  var base = getBaseUrl();
  SpreadsheetApp.getUi().alert(
    '=== PARKSONS - YOUR CURRENT URLS ===\n\n' +
    'FORM SCRIPT_URL:\n' + base + '\n\n' +
    'Dashboard:\n' + base + '?page=dashboard\n\n' +
    'Admin Panel:\n' + base + '?page=admin\n\n' +
    'Admin Password: ' + CONFIG.adminPassword
  );
}

// 2. WEB APP ROUTER
function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var page   = params.page || '';

  if (params.payload) {
    try {
      var data = JSON.parse(decodeURIComponent(params.payload));
      writeFormSubmission(data);
    } catch(err) { Logger.log('GET payload error: ' + err); }
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  }

  if (params.action) return handleGetAction(params);
  if (page === 'dashboard') return serveDashboard();
  if (page === 'admin')     return serveAdmin();

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok', version: '3.5',
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

    var result = writeFormSubmission(data);
    return jsonResp({ status: 'success', refId: result.refId });
  } catch(err) {
    Logger.log('doPost error: ' + err);
    return jsonResp({ status: 'error', message: err.toString() });
  }
}

function handleGetAction(params) {
  var action = params.action || '';
  var result;
  try {
    if      (action === 'getPending')        result = getPendingEntries();
    else if (action === 'approve')           result = approveEntry(params);
    else if (action === 'reject')            result = rejectEntry(params);
    else if (action === 'update')            result = updateEntry(params);
    else if (action === 'updateApprove')     result = updateAndApprove(params);
    else if (action === 'getMachineData')    result = getMachineData();
    else if (action === 'saveMachineData')   result = saveMachineData(params);
    else if (action === 'deleteMachineData') result = deleteMachineData(params);
    else if (action === 'loginAdmin')        result = loginAdmin(params);
    else if (action === 'getAdminUsers')     result = getAdminUsers();
    else if (action === 'saveAdminUser')     result = saveAdminUser(params);
    else if (action === 'deleteAdminUser')   result = deleteAdminUser(params);
    else result = { status: 'error', message: 'Unknown action: ' + action };
  } catch(err) {
    result = { status: 'error', message: err.toString() };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// 3. SERVE DASHBOARD
function serveDashboard() {
  try {
    var tpl = HtmlService.createTemplateFromFile('Dashboard');
    var dashData = getDashboardData();
    try {
      var rawS = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
      if (rawS && rawS.getLastRow() > 1) {
        var statVals = rawS.getRange(2, COL.STATUS + 1, rawS.getLastRow() - 1, 1).getValues();
        var pCount = statVals.filter(function(r){ return String(r[0]).trim() === 'PENDING_REVIEW'; }).length;
        dashData.pendingCount = pCount;
      }
    } catch(pe) { dashData.pendingCount = 0; }
    // Sanitize newlines in text fields to prevent JS injection errors
    tpl.dataJson = JSON.stringify(dashData).replace(/\n/g, ' ').replace(/\r/g, '');
    tpl.adminUrl = getBaseUrl() + '?page=admin';
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

// 4. SERVE ADMIN PANEL
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

// 5. DASHBOARD DATA
function getDashboardData() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.finalSheetName);
  if (!sheet) return { error: 'Final_Data sheet not found', rows: [] };

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { error: null, rows: [], generated: new Date().toISOString() };

  var numDataRows = Math.max(1, lastRow - 1);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rawData = sheet.getRange(2, 1, numDataRows, sheet.getLastColumn()).getValues();

  var colMap = {};
  headers.forEach(function(h, i) { colMap[String(h).trim()] = i; });

  var statusMap = buildStatusMap();
  var rows = [];

  rawData.forEach(function(row) {
    var mn    = String(row[colMap['Machine_Name']] || '').trim();
    var refId = String(row[colMap['Ref_ID']]       || '').trim();
    if (!mn && !refId) return;

    if (Object.keys(statusMap).length > 0 && refId) {
      var entryStatus = statusMap[refId];
      if (entryStatus === 'PENDING_REVIEW' || entryStatus === 'REJECTED') return;
    }

    var dv        = row[colMap['Date']];
    var dateStr   = fmtDate(dv);
    var monthYear = String(row[colMap['Month_Year']] || '');
    if (!monthYear && dv instanceof Date && !isNaN(dv))
      monthYear = Utilities.formatDate(dv, CONFIG.timezone, 'MMM-yy');
    if (!monthYear && typeof dv === 'string' && dv.match(/\d{2}\/\d{2}\/\d{4}/)) {
      try {
        var parts = dv.split('/');
        var d2 = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
        if (!isNaN(d2)) monthYear = Utilities.formatDate(d2, CONFIG.timezone, 'MMM-yy');
      } catch(e2) {}
    }

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
      description: String(row[colMap['Description']]  || '').replace(/\n/g,' ').replace(/\r/g,''),
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

// 6. GET ALL ENTRIES FOR ADMIN
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

// 7. APPROVE / REJECT / UPDATE
function approveEntry(data) { return setStatus(data, 'APPROVED'); }
function rejectEntry(data)  { return setStatus(data, 'REJECTED'); }

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
    [COL.DATE,        parseDateSafe(data.date || '')],
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

// 8. WRITE NEW FORM SUBMISSION
function writeFormSubmission(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) { sheet = ss.insertSheet(CONFIG.sheetName); setupHeaders(); }

  var now   = new Date();
  var refId = data.refId ||
    ('PKS-' + Utilities.formatDate(now, CONFIG.timezone, 'yyyyMMdd') + '-' +
              Utilities.formatDate(now, CONFIG.timezone, 'HHmmss'));

  var dateStr = parseDateSafe(data.date || '');

  sheet.appendRow([
    now, refId, dateStr,
    data.shift        || '',
    data.machineType  || '',
    data.machineName  || '',
    data.unit         || '',
    data.problemType  || '',
    data.category     || '',
    data.description  || '',
    data.actionTaken  || '',
    data.rootCause    || '',
    fmtTimeStr(data.timeStart || ''),
    fmtTimeStr(data.timeEnd   || ''),
    data.durationMin  || '',
    data.attendedBy   || '',
    data.submittedBy  || data.attendedBy || '',
    data.remarks      || '',
    'PENDING_REVIEW'
  ]);
  SpreadsheetApp.flush();
  Logger.log('Submitted: ' + refId + ' | Date: ' + dateStr + ' | Shift: ' + (data.shift||''));
  return { refId: refId };
}

// 9. HELPERS
function getRawSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
}
function getMachineSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.machineSheetName);
}
function getAdminUsersSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.adminUsersSheet);
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

function parseDateSafe(dateStr) {
  if (!dateStr) return '';
  var m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), 12, 0, 0);
  var m2 = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m2) return new Date(parseInt(m2[3]), parseInt(m2[2]) - 1, parseInt(m2[1]), 12, 0, 0);
  try { var d = new Date(dateStr); if (!isNaN(d)) return d; } catch(e) {}
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

// 10. SETUP HEADERS
function setupHeaders() {
  var sheet = getRawSheet() || SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.sheetName);
  var h = ['Timestamp','Ref_ID','Date','Shift','Machine_Type','Machine_Name','Unit',
           'Problem_Type','Category','Description','Action_Taken','Root_Cause',
           'Time_Start','Time_End','Duration_Min','Attended_By','Submitted_By','Remarks','Status'];
  sheet.getRange(1,1,1,h.length).setValues([h])
    .setFontWeight('bold').setBackground('#0a0d13').setFontColor('#f0a500');
  sheet.setFrozenRows(1);
}

// 11. TEST SUBMIT
function testSubmit() {
  var r = writeFormSubmission({
    date:'2026-03-28', shift:'First Shift', machineType:'PRINTING',
    machineName:'PrintKBA1', unit:'Feeder', problemType:'Electrical',
    category:'Breakdown', description:'Test v3.5',
    actionTaken:'Test OK', rootCause:'Test', timeStart:'09:00:00',
    timeEnd:'09:30:00', durationMin:30, attendedBy:'YogeshK',
    submittedBy:'YogeshK', remarks:'v3.5 test'
  });
  SpreadsheetApp.getUi().alert('Test submitted! Ref: ' + r.refId);
}

// 12. EMAIL REPORT
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
  var subj   = CONFIG.companyName + ' - Daily Maintenance Report - ' +
               Utilities.formatDate(yest, CONFIG.timezone, 'dd MMM yyyy');

  var body =
    '<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto">' +
    '<div style="background:#0a0d13;color:#f0a500;padding:22px 24px">' +
    '<h2 style="margin:0;font-size:20px;letter-spacing:2px">PARKSONS MAINTENANCE REPORT</h2>' +
    '<p style="margin:6px 0 0;color:#6b7a99;font-size:12px">' +
      Utilities.formatDate(yest,CONFIG.timezone,'EEEE, dd MMMM yyyy') + '</p></div>' +
    '<div style="background:#fff;padding:22px 24px;border:1px solid #e0e0e0;border-top:none">' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">' +
    '<tr><td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Total Entries</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px;color:#2d7bf4">' + yRows.length + '</td>' +
    '<td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Breakdowns</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px;color:#e84040">' + bdRows.length + '</td></tr>' +
    '<tr><td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Total Downtime</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px">' + (tot/60).toFixed(1) + ' hrs</td>' +
    '<td style="background:#f9f9f9;padding:12px;border:1px solid #eee;font-size:12px;color:#666">Avg MTTR</td>' +
    '<td style="padding:12px;border:1px solid #eee;font-weight:bold;font-size:18px;color:#f0a500">' + mttr + ' min</td></tr>' +
    '</table>' +
    '<div style="display:flex;gap:12px">' +
    '<a href="' + base + '?page=dashboard" style="flex:1;display:block;padding:13px;background:#0a0d13;color:#f0a500;text-align:center;text-decoration:none;font-weight:bold;font-size:13px;border-radius:5px">View Dashboard</a>' +
    '<a href="' + base + '?page=admin" style="flex:1;display:block;padding:13px;background:#2d7bf4;color:#fff;text-align:center;text-decoration:none;font-weight:bold;font-size:13px;border-radius:5px">Open Admin Panel</a>' +
    '</div></div></div>';

  MailApp.sendEmail({to: CONFIG.emailTo, subject: subj, htmlBody: body});
  SpreadsheetApp.getUi().alert('Email sent to ' + CONFIG.emailTo);
}
// Set trigger: Triggers -> sendDailyEmailReport -> Time-driven -> Day timer -> 8am-9am

// MACHINE DATA
var MACHINES_DEFAULT = {
  "PRINTING": {
    "PrintKBA1": ["Feeder","PU1","PU2","PU3","PU4","PU5","PU6","Coating","Uvlights / IR light","Delivery","Technotrans","Compressor"],
    "PrintKBA2": ["Feeder","PU1","PU2","PU3","PU4","PU5","PU6","Coating","Uvlights / IR light","Delivery","Technotrans","Compressor"],
    "PrintKBA3": ["Feeder","PU1","PU2","PU3","PU4","PU5","PU6","PU7","Coating","Uvlights / IR light","Delivery","Technotrans","Compressor"],
    "HeidelbergCX1": ["Feeder","PU1","PU2","PU3","PU4","PU5","PU6","PU7","Coating","Uvlights / IR light","Delivery","Technotrans","Compressor"],
    "HeidelbergCX2": ["Feeder","PU1","PU2","PU3","PU4","PU5","PU6","PU7","Coating","Uvlights / IR light","Delivery","Technotrans","Compressor"],
    "Roland": ["Feeder","PU1","PU2","Coating","Uvlights / IR light","Delivery","Technotrans","Compressor"],
    "GRAVIER": ["Feeder","PU1","Coating","Uvlights / IR light","Delivery","Compressor"],
    "Albo": ["Comapctor","Turner","Blower"],
    "UVcoater": ["Feeder","Infeedunit","Conveyor","Uvlights","Delivery","Coating unit"],
    "Sheeter": ["Reelstand","Helicalcutter","Conveyor","Delivery","Suctionblower","Ductcollector"],
    "CTP": ["Plateexposer","Plateprocessor"],
    "Printingplant": ["Electricity Down","Compressor","Chiller water supply","Technotrans water","DG set"],
    "Samplemaking": ["cuuting head","Travel motor","Bed","Compressor"]
  },
  "CORRUGATION": {
    "Champion": ["MillRollstand","Splicer","Singlefacer","Steamsupply","Feeder","Helicalcutter","Stacker"],
    "BHSCORRU": ["MillRollstand","Splicer","Singlefacer","Steamsupply","Feeder","Helicalcutter","Stacker"],
    "Lamify1Old": ["Sheetfeeder","Flutefeeder","Laminationunit","Belttransfer","Stacker"],
    "Lamify2New": ["Sheetfeeder","Flutefeeder","Laminationunit","Belttransfer","Stacker"],
    "Gluekitchen": ["Mixing tank","Cuastic tank","supply pump"],
    "Nflute": ["MillRollstand","Splicer","Singlefacer","Steamsupply","Feeder","Helicalcutter"]
  },
  "NFDIECUTTING": {
    "Blanker1": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "Blanker2": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "BMFOIL": ["Feeder","Die platten","Delivery","Gripperbar","Foilstamping","Blanking"],
    "BMAFOIL": ["Feeder","Die platten","Delivery","Gripperbar","Foilstamping","Blanking"],
    "YOKO": ["Feeder","Die platten","Delivery","Gripperbar","Foilstamping","Blanking"],
    "DIECUTTING8": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "NOVA1": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "NOVA2": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "NOVA5": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "NOVA6": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "Spanthera1": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"],
    "Spanthera2": ["Feeder","Die platten","Delivery","Gripperbar","Stripping","Blanking"]
  },
  "NFPASTING": {
    "Alpina": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer","Delivery"],
    "Expertfold": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer","Delivery"],
    "Media68": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer","Delivery"],
    "VisionFold": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer","Delivery"],
    "Fuego": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer","Delivery"],
    "Mistral": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer","Delivery"],
    "Blankwiser": ["Feeder","Alingmentunit","Glueunit","Folder","Delivery"],
    "Other": ["Airalunit"]
  },
  "LAMINATION": {
    "YILI": ["Feeder","Heating roller","Pressing","Knifecutter","Delivery"],
    "SLITTER": ["Unwinder","Rewinder","Cutter","Crane motor"],
    "PERFECTA": ["Feedingtable","CuttingKnife","Pressing","BackGauge","HydrualicPump","MainDriveClutch"],
    "FAIDA": ["Feedingtable","CuttingKnife","Pressing","BackGauge","HydrualicPump","MainDriveClutch"]
  },
  "FLDIECUTTING": {
    "NOVACUT3": ["Feeder","Dieplatten","Delivery","Gripperbar","Stripping"],
    "NOVACUT4": ["Feeder","Dieplatten","Delivery","Gripperbar","Stripping"],
    "SP102Diecut": ["Feeder","Dieplatten","Delivery","Gripperbar","Stripping"],
    "SP102": ["Feeder","Dieplatten","Delivery","Gripperbar","Stripping"]
  },
  "FLPASTING": {
    "LILA1": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer"],
    "LILA2": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer"],
    "PAKTEK1": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer"],
    "PAKTEK2": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer"],
    "LaminaGlueline": ["Feeder","Alingmentunit","Prebreaker","Glueunit","HSSsystem","Folder","Transfer"]
  },
  "HANDPUNCING": {
    "ACME": ["Maindriveclutch","DiePlatten"],
    "BHARAT": ["Maindriveclutch","DiePlatten"],
    "HEIDO": ["Maindriveclutch","DiePlatten"],
    "Robus": ["Sensor"],
    "Autostrapping": ["Strapping head","Heater"]
  },
  "LIQUIDLINE": {
    "Fortuna": ["Feeder","Blower","Scaving","Chiller","Burner","Folder","Transfer","Metaldetector","Tapping","Register unit"],
    "Sheeter": ["Reelstand","Helicalcutter","Conveyor","Delivery","Suctionblower","Ductcollector"],
    "Slitter": ["Unwinder","Rewinder","Cutter"],
    "Blanker1": ["Feeder","Die platten","Delivery","Gripperbar","Stripping"]
  },
  "OTHERS": {
    "WindowPatching1": ["Machine"],"WindowPatching2": ["Machine"],
    "OfflineBlanker": ["Machine"],"BatchCounter": ["Machine"],
    "AutoPrintSorting1": ["Machine"],"AutoPrintSorting2": ["Machine"],
    "PokerCard": ["Machine"],"LablePasting1": ["Machine"],
    "LablePasting2": ["Machine"],"LablePasting3": ["Machine"],
    "InkmatchingMixt1": ["Machine"],"InkmatchingMixt2": ["Machine"]
  },
  "Convertingplant": {
    "Compressor": ["Main compressor","Backup compressor"],
    "Electricitydown": ["Main supply","DG Set","Transformer"]
  },
  "Printingplant": {
    "Utility": ["Electricity Down","Compressor","Chiller water supply","Technotrans water","DG set"],
    "Electricitydown": ["Main supply","DG Set"],
    "Compressor": ["Main compressor","Backup compressor"]
  },
  "SCRAP": {
    "ScrapCutting1": ["Machine"],"ScrapCutting2": ["Machine"],"ScrapCutting3": ["Machine"]
  }
};

function seedMachineDataIfEmpty() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.machineSheetName);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.machineSheetName);
    sheet.getRange(1,1,1,3).setValues([['machine_type','machine_name','units']])
      .setFontWeight('bold').setBackground('#0a0d13').setFontColor('#f0a500');
    sheet.setFrozenRows(1);
  }
  if (sheet.getLastRow() > 1) return;
  var rows = [];
  Object.keys(MACHINES_DEFAULT).forEach(function(type) {
    Object.keys(MACHINES_DEFAULT[type]).forEach(function(name) {
      rows.push([type, name, MACHINES_DEFAULT[type][name].join(',')]);
    });
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, 3).setValues(rows);
}

function getMachineData() {
  seedMachineDataIfEmpty();
  var sheet = getMachineSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'success', machines: {} };
  var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  var machines = {};
  data.forEach(function(row) {
    var type  = String(row[0] || '').trim();
    var name  = String(row[1] || '').trim();
    var units = String(row[2] || '').trim();
    if (!type || !name) return;
    if (!machines[type]) machines[type] = {};
    machines[type][name] = units ? units.split(',').map(function(u){ return u.trim(); }) : [];
  });
  return { status: 'success', machines: machines };
}

function saveMachineData(params) {
  seedMachineDataIfEmpty();
  var sheet = getMachineSheet();
  var type  = String(params.machineType || '').trim();
  var name  = String(params.machineName || '').trim();
  var units = String(params.units       || '').trim();
  if (!type || !name) return { status: 'error', message: 'machineType and machineName required' };
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][1]).trim() === name) {
        sheet.getRange(i + 2, 1, 1, 3).setValues([[type, name, units]]);
        SpreadsheetApp.flush();
        return { status: 'success' };
      }
    }
  }
  sheet.appendRow([type, name, units]);
  SpreadsheetApp.flush();
  return { status: 'success' };
}

function deleteMachineData(params) {
  var sheet = getMachineSheet();
  if (!sheet) return { status: 'error', message: 'Machine_Data sheet not found' };
  var name    = String(params.machineName || '').trim();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'success' };
  var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][1]).trim() === name) {
      sheet.deleteRow(i + 2);
      SpreadsheetApp.flush();
      return { status: 'success' };
    }
  }
  return { status: 'success' };
}

// ADMIN USERS
function seedAdminUsersIfEmpty() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.adminUsersSheet);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.adminUsersSheet);
    sheet.getRange(1,1,1,4).setValues([['name','email','password','level']])
      .setFontWeight('bold').setBackground('#0a0d13').setFontColor('#f0a500');
    sheet.setFrozenRows(1);
  }
  if (sheet.getLastRow() > 1) return;
  sheet.appendRow(['YogeshK', 'yogeshkp85@gmail.com', 'PKS@2026', 'superadmin']);
}

function loginAdmin(params) {
  seedAdminUsersIfEmpty();
  var sheet = getAdminUsersSheet();
  var level = String(params.level || '').trim().toLowerCase();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'error', message: 'Invalid credentials' };
  var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

  if (level === 'supervisor') {
    var pwd = String(params.password || '').trim();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][3]).trim() === 'supervisor' && String(data[i][2]).trim() === pwd) {
        return { status: 'success', user: { name: String(data[i][0]), email: String(data[i][1]), level: 'supervisor' } };
      }
    }
  } else {
    var email = String(params.email || '').trim().toLowerCase();
    var pwd2  = String(params.password || '').trim();
    for (var j = 0; j < data.length; j++) {
      if (String(data[j][1]).trim().toLowerCase() === email &&
          String(data[j][2]).trim() === pwd2 &&
          String(data[j][3]).trim() === 'superadmin') {
        return { status: 'success', user: { name: String(data[j][0]), email: String(data[j][1]), level: 'superadmin' } };
      }
    }
  }
  return { status: 'error', message: 'Invalid credentials' };
}

function getAdminUsers() {
  seedAdminUsersIfEmpty();
  var sheet = getAdminUsersSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'success', users: [] };
  var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  var users = data.map(function(row) {
    return { name: String(row[0]), email: String(row[1]), level: String(row[3]) };
  });
  return { status: 'success', users: users };
}

function saveAdminUser(params) {
  seedAdminUsersIfEmpty();
  var sheet = getAdminUsersSheet();
  var name  = String(params.name     || '').trim();
  var email = String(params.email    || '').trim();
  var pwd   = String(params.password || '').trim();
  var level = String(params.level    || 'supervisor').trim();
  if (!name || !pwd) return { status: 'error', message: 'name and password required' };
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][1]).trim().toLowerCase() === email.toLowerCase()) {
        sheet.getRange(i + 2, 1, 1, 4).setValues([[name, email, pwd, level]]);
        SpreadsheetApp.flush();
        return { status: 'success' };
      }
    }
  }
  sheet.appendRow([name, email, pwd, level]);
  SpreadsheetApp.flush();
  return { status: 'success' };
}

function deleteAdminUser(params) {
  var email = String(params.email || '').trim().toLowerCase();
  if (email === 'yogeshkp85@gmail.com') {
    return { status: 'error', message: 'Cannot delete super admin' };
  }
  var sheet = getAdminUsersSheet();
  if (!sheet) return { status: 'error', message: 'Admin_Users sheet not found' };
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'success' };
  var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][1]).trim().toLowerCase() === email) {
      sheet.deleteRow(i + 2);
      SpreadsheetApp.flush();
      return { status: 'success' };
    }
  }
  return { status: 'success' };
}

// 13. DAILY CSV DATA EXPORT
// Set trigger: Triggers -> sendDailyDataExport -> Time-driven -> Day timer -> 8am-9am IST
function sendDailyDataExport() {
  try {
    var sheet    = getRawSheet();
    var today    = Utilities.formatDate(new Date(), CONFIG.timezone, 'dd/MM/yyyy');
    var filename = 'raw_data_' + Utilities.formatDate(new Date(), CONFIG.timezone, 'yyyyMMdd') + '.csv';
    var subject  = 'Parksons Maintenance - Daily Data Export - ' + today;

    var csvRows = (!sheet || sheet.getLastRow() < 1)
      ? [['No data available']]
      : sheet.getDataRange().getValues();

    var csvStr = csvRows.map(function(row) {
      return row.map(function(cell) {
        var val = cell instanceof Date
          ? Utilities.formatDate(cell, CONFIG.timezone, 'dd/MM/yyyy HH:mm:ss')
          : String(cell);
        if (val.indexOf(',') > -1 || val.indexOf('"') > -1 || val.indexOf('\n') > -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(',');
    }).join('\n');

    var blob       = Utilities.newBlob(csvStr, 'text/csv', filename);
    var recipients = CONFIG.emailExportTo.join(',');

    MailApp.sendEmail({
      to:          recipients,
      subject:     subject,
      body:        'Please find attached the full maintenance data export for ' + today + '.\n\nParksons Maintenance System',
      attachments: [blob]
    });
    Logger.log('Daily export sent to: ' + recipients + ' | File: ' + filename);
  } catch(err) {
    Logger.log('sendDailyDataExport error: ' + err.toString());
  }
}
