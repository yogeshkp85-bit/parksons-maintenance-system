// Complete PM Schedule Data with ALL machines from master list - Formatted like Excel

function createPMScheduleSheetComplete() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pmSheet = ss.getSheetByName('PM_Schedule');
  
  if (pmSheet) {
    SpreadsheetApp.getUi().alert('PM_Schedule sheet already exists!');
    return;
  }
  
  try {
    pmSheet = ss.insertSheet('PM_Schedule');
    
    // Create headers matching Excel format
    var headers = ['Sr. No', 'Section', 'Machine / Equipment Name', 'Machine / Equipment ID No', 'Date of Installation', 'Under Warranty', 
                   'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Yearly %'];
    
    pmSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    var headerRange = pmSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1e2a3d');
    headerRange.setFontColor('#f0a500');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setBorder(true, true, true, true, true, true);
    
    // Add all 86 machines from master list with proper formatting
    var sampleData = [
      // PRINTING SECTION
      [1, 'Printing', 'Heidelberg printing machine - CX 1', 'MNT/PR/001', '28.11.2015', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [2, 'Printing', 'Heidelberg printing machine - CX 2', 'MNT/PR/002', '30.05.2016', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [3, 'Printing', 'KBA printing machine - KBA 1', 'MNT/PR/003', '08.06.2019', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [4, 'Printing', 'KBA printing machine - KBA 2', 'MNT/PR/004', '01.04.2015', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [5, 'Printing', 'KBA printing machine - KBA 3', 'MNT/PR/005', '01.04.2012', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [6, 'Printing', 'Roland Printing machine', 'MNT/PR/006', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [7, 'Printing', 'WEN CHYUAN UV Coater machine', 'MNT/LM/002', '01.04.2016', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [8, 'Printing', 'Gravure Coating machine', 'MNT/PR/007', '01.04.2020', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [9, 'Printing', 'Albo Machine - Pile Turner', 'MNT/PR/008', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [10, 'Printing', 'Sheeter machine', 'MNT/PR/009', '01.04.2012', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [11, 'Printing', 'CTP', 'MNT/PR/010', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [12, 'Printing', 'Sample Making', 'MNT/PR/011', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      
      // CORRUGATION SECTION
      [13, 'Corrugation', 'Champion', 'MNT/COR/001', '01.04.2020', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [14, 'Corrugation', 'BHS Corrogation machine', 'MNT/COR/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 58],
      [15, 'Corrugation', 'Lamify 1 Laminator machine Old', 'MNT/COR/003', '20.03.2018', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [16, 'Corrugation', 'Lamify 2 Laminator machine New', 'MNT/COR/004', '20.03.2018', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [17, 'Corrugation', 'Glue Kitchen', 'MNT/COR/005', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [18, 'Corrugation', 'N Flute Corrogation machine', 'MNT/COR/006', '01.08.2017', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      
      // NON FLUTED DIE CUTTING SECTION
      [19, 'Non Fluted Die Cutting', 'Bobst Novacut Blanker (106 ER) - 1', 'MNT/NF/001', '01.04.2016', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 83],
      [20, 'Non Fluted Die Cutting', 'Bobst Novacut Blanker (106 ER 3.0) - 2', 'MNT/NF/002', '26.07.2019', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 83],
      [21, 'Non Fluted Die Cutting', 'Bobst Foil stamping (SP104 BM) machine', 'MNT/NF/003', '05.01.2018', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 58],
      [22, 'Non Fluted Die Cutting', 'Bobst Foil stamping (SP104 BMA) machine', 'MNT/NF/004', '05.01.2018', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 58],
      [23, 'Non Fluted Die Cutting', 'Yoco Foil stamping (JY105T) machine', 'MNT/NF/005', '01.04.2008', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 58],
      [24, 'Non Fluted Die Cutting', 'Die Cutting 8', 'MNT/NF/006', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [25, 'Non Fluted Die Cutting', 'Bobst Novacut (106 E) - 1', 'MNT/NF/007', '01.04.2014', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 83],
      [26, 'Non Fluted Die Cutting', 'Bobst Novacut (106 E) - 2', 'MNT/NF/008', '01.04.2012', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 92],
      [27, 'Non Fluted Die Cutting', 'Bobst Novacut (106 E 3.0) - 5', 'MNT/NF/009', '20.07.2019', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 58],
      [28, 'Non Fluted Die Cutting', 'Bobst Novacut (106 E 3.0) - 6', 'MNT/NF/010', '01.12.2020', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [29, 'Non Fluted Die Cutting', 'Bobst Spanthera (106 LE) - 1', 'MNT/NF/011', '01.04.2007', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [30, 'Non Fluted Die Cutting', 'Bobst Spanthera (106 LE) - 2', 'MNT/NF/012', '01.04.2007', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 92],
      
      // NON FLUTED PASTING SECTION
      [31, 'Non Fluted Pasting', 'Bobst folder gluer - Alpina (75II - A1)', 'MNT/NF/013', '01.04.2007', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 58],
      [32, 'Non Fluted Pasting', 'Bobst folder gluer - ExpertFold (80 - A2)', 'MNT/NF/014', '01.04.2016', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [33, 'Non Fluted Pasting', 'Bobst folder gluer - Media (68III - A2)', 'MNT/NF/015', '01.04.2014', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [34, 'Non Fluted Pasting', 'Bobst folder gluer - VisionFold (80 - A1)', 'MNT/NF/016', '01.04.2008', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [35, 'Non Fluted Pasting', 'Bobst folder gluer - Fuego (80 - A2)', 'MNT/NF/017', '01.04.2007', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [36, 'Non Fluted Pasting', 'Bobst folder gluer - Mistral (110 - A2)', 'MNT/NF/018', '01.04.2008', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [37, 'Non Fluted Pasting', 'SHUN XIN LONG Offline Blanker machine', 'MNT/NF/019', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [38, 'Non Fluted Pasting', 'Other', 'MNT/NF/020', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      
      // LAMINATION SECTION
      [39, 'Lamination', 'YIILEE', 'MNT/LAM/001', '01.04.2016', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [40, 'Lamination', 'Slitter', 'MNT/LAM/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [41, 'Lamination', 'Perfecta cutting machine', 'MNT/LAM/003', '01.04.2007', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [42, 'Lamination', 'Fida cutting machine', 'MNT/LAM/004', '01.04.2008', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      
      // FLUTTED DIE CUTTING SECTION
      [43, 'Flutted Die Cutting', 'Bobst Novacut (106 E) - 3', 'MNT/FL/001', '01.04.2014', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [44, 'Flutted Die Cutting', 'Bobst Novacut (106 E) - 4', 'MNT/FL/002', '15.09.2017', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [45, 'Flutted Die Cutting', 'Bobst SP 102 (E II) machine', 'MNT/FL/003', '01.04.1996', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [46, 'Flutted Die Cutting', 'SP 102', 'MNT/FL/004', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      
      // FLUTTED PASTING SECTION
      [47, 'Flutted Pasting', 'Bobst folder gluer - LILA 1 (106 A2)', 'MNT/FL/005', '01.04.2012', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [48, 'Flutted Pasting', 'Bobst folder gluer - LILA 2 (106 A2)', 'MNT/FL/006', '01.04.2019', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [49, 'Flutted Pasting', 'Folder gluer - PAKTEK (D14-1050)', 'MNT/FL/007', '01.04.2012', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [50, 'Flutted Pasting', 'Folder gluer - PAKTEK 2', 'MNT/FL/008', '01.04.2012', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [51, 'Flutted Pasting', 'Lamina Glueline', 'MNT/FL/009', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      
      // HAND PUNCHING SECTION
      [52, 'Hand Punching', 'ACME Hand punching machine', 'MNT/HP/001', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [53, 'Hand Punching', 'BHARAT Hand punching machine', 'MNT/HP/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [54, 'Hand Punching', 'HEIDO Hand punching machine', 'MNT/HP/003', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [55, 'Hand Punching', 'Robus machine', 'MNT/HP/004', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [56, 'Hand Punching', 'Auto Strapping', 'MNT/HP/005', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      
      // LIQUID LINE SECTION
      [57, 'Liquid Line', 'IPBM folder gluer - Fortuna NEW', 'MNT/LL/001', '-', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [58, 'Liquid Line', 'Sheeter', 'MNT/LL/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [59, 'Liquid Line', 'Slitter', 'MNT/LL/003', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [60, 'Liquid Line', 'Blanker 1', 'MNT/LL/004', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [61, 'Liquid Line', 'IPBM folder gluer - Fortuna old', 'MNT/LL/005', '01.02.2017', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [62, 'Liquid Line', 'Fortuna New', 'MNT/LL/006', '-', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      
      // OTHERS SECTION
      [63, 'Others', 'Window patching machine - 1', 'MNT/OTH/001', '-', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [64, 'Others', 'Window patching machine - 2', 'MNT/OTH/002', '-', 'YES', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [65, 'Others', 'Offline Blanker', 'MNT/OTH/003', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 42],
      [66, 'Others', 'Batch Counter', 'MNT/OTH/004', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [67, 'Others', 'Auto print sorting machine - 1', 'MNT/OTH/005', '01.01.2019', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [68, 'Others', 'Auto print sorting machine - 2', 'MNT/OTH/006', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [69, 'Others', 'Poker Card', 'MNT/OTH/007', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [70, 'Others', 'Label pasting machine - 1', 'MNT/OTH/008', '01.01.2019', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [71, 'Others', 'Label pasting machine - 2', 'MNT/OTH/009', '01.01.2019', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 67],
      [72, 'Others', 'Label pasting machine - 3', 'MNT/OTH/010', '01.01.2019', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [73, 'Others', 'Ink Matching Mixt 1', 'MNT/OTH/011', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [74, 'Others', 'Ink Matching Mixt 2', 'MNT/OTH/012', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      
      // UTILITY SECTION
      [75, 'Utility', 'Compressor Converting Plant', 'MNT/UTL/001', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [76, 'Utility', 'Electricity Down Converting Plant', 'MNT/UTL/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [77, 'Utility', 'Compressor Printing Plant', 'MNT/UTL/003', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [78, 'Utility', 'Electricity Down Printing Plant', 'MNT/UTL/004', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      
      // SCRAP SECTION
      [79, 'Scrap', 'Scrap Cutting 1', 'MNT/SCR/001', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [80, 'Scrap', 'Scrap Cutting 2', 'MNT/SCR/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      [81, 'Scrap', 'Scrap Cutting 3', 'MNT/SCR/003', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 25],
      
      // GMP & ELECTRICAL SECTION
      [82, 'GMP Lamination', 'GFM Lamination', 'MNT/GMP/001', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 33],
      [83, 'Electrical Panel', 'LT Room Panel', 'MNT/ELE/001', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [84, 'Electrical Panel', 'HVAC Room Panel', 'MNT/ELE/002', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [85, 'Electrical Panel', 'Machine Panel', 'MNT/ELE/003', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50],
      [86, 'Electrical Panel', 'Main Incomer', 'MNT/ELE/004', '-', 'NO', '', '', '', '', '', '', '', '', '', '', '', '', 50]
    ];
    
    pmSheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
    
    // Format data rows
    var dataRange = pmSheet.getRange(2, 1, sampleData.length, headers.length);
    dataRange.setBackground('#ffffff');
    dataRange.setFontColor('#000000');
    dataRange.setFontSize(10);
    dataRange.setHorizontalAlignment('center');
    dataRange.setVerticalAlignment('middle');
    dataRange.setBorder(true, true, true, true, false, false);
    
    // Alternate row colors for better readability
    for (var i = 2; i <= sampleData.length + 1; i++) {
      if (i % 2 === 0) {
        pmSheet.getRange(i, 1, 1, headers.length).setBackground('#f5f5f5');
      }
    }
    
    // Set column widths
    pmSheet.setColumnWidth(1, 50);  // Sr. No
    pmSheet.setColumnWidth(2, 100); // Section
    pmSheet.setColumnWidth(3, 250); // Machine Name
    pmSheet.setColumnWidth(4, 130); // Machine ID
    pmSheet.setColumnWidth(5, 130); // Installation Date
    pmSheet.setColumnWidth(6, 100); // Warranty
    
    // Month columns
    for (var j = 7; j <= 24; j++) {
      pmSheet.setColumnWidth(j, 85);
    }
    
    pmSheet.setColumnWidth(25, 80); // Yearly %
    
    // Freeze header row
    pmSheet.setFrozenRows(1);
    
    SpreadsheetApp.getUi().alert('✅ PM_Schedule sheet created with ALL ' + sampleData.length + ' machines!\n\nFormatted like your Excel file with:\n- Machine details (Sr. No, Section, Name, ID, Installation Date, Warranty)\n- Month-wise columns (Apr 2025 - Mar 2026)\n- Yearly compliance %\n- Professional formatting with borders and colors\n\nYou can now access the PM Compliance page.');
    Logger.log('PM_Schedule sheet created successfully with ' + sampleData.length + ' machines');
  } catch(err) {
    SpreadsheetApp.getUi().alert('❌ Error creating PM_Schedule sheet:\n' + err.toString());
    Logger.log('Error: ' + err.toString());
  }
}
