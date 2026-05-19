// Complete PM Schedule Data with ALL machines from master list

function createPMScheduleSheetComplete() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pmSheet = ss.getSheetByName('PM_Schedule');
  
  if (pmSheet) {
    SpreadsheetApp.getUi().alert('PM_Schedule sheet already exists!');
    return;
  }
  
  try {
    pmSheet = ss.insertSheet('PM_Schedule');
    
    // Create headers
    var headers = ['Machine_ID', 'Machine_Name', 'Section', 'Department', 'Frequency', 'Year', 'Yearly_Compliance', 'Notes'];
    pmSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Add ALL machines from master list organized by section and department
    var sampleData = [
      // PRINTING SECTION (12 machines)
      ['MNT/PR/001', 'Heidelberg CX 1', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/PR/002', 'Heidelberg CX 2', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/PR/003', 'KBA 1', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/PR/004', 'KBA 2', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/PR/005', 'KBA 3', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/PR/006', 'Roland', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/PR/007', 'Gravure', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/PR/008', 'Albo', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/PR/009', 'UV Coater', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/PR/010', 'Sheeter', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/PR/011', 'CTP', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/PR/012', 'Sample Making', 'Printing', 'Printing Plant', 'Monthly', '2025-26', 33, ''],
      
      // CORRUGATION SECTION (6 machines)
      ['MNT/COR/001', 'Champion', 'Corrugation', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/COR/002', 'BHS', 'Corrugation', 'Converting Plant', 'Monthly', '2025-26', 58, ''],
      ['MNT/COR/003', 'Lamify 1 Old', 'Corrugation', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/COR/004', 'Lamify 2 New', 'Corrugation', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/COR/005', 'Glue Kitchen', 'Corrugation', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/COR/006', 'N Flute', 'Corrugation', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      
      // NON FLUTED DIE CUTTING SECTION (12 machines)
      ['MNT/NF/001', 'Blanker 1', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 83, ''],
      ['MNT/NF/002', 'Blanker 2', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 83, ''],
      ['MNT/NF/003', 'BM Foil', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 58, ''],
      ['MNT/NF/004', 'BMA Foil', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 58, ''],
      ['MNT/NF/005', 'Yoko', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 58, ''],
      ['MNT/NF/006', 'Die Cutting 8', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/NF/007', 'Nova 1', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 83, ''],
      ['MNT/NF/008', 'Nova 2', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 92, ''],
      ['MNT/NF/009', 'Nova 5', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 58, ''],
      ['MNT/NF/010', 'Nova 6', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/NF/011', 'Spanthera 1', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/NF/012', 'Spanthera 2', 'Non Fluted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 92, ''],
      
      // NON FLUTED PASTING SECTION (8 machines)
      ['MNT/NF/013', 'Alpina', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 58, ''],
      ['MNT/NF/014', 'Expertfold', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/NF/015', 'Media 68', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/NF/016', 'VisionFold', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/NF/017', 'Fuego', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/NF/018', 'Mistral', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/NF/019', 'Blankwiser', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/NF/020', 'Other', 'Non Fluted Pasting', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      
      // LAMINATION SECTION (4 machines)
      ['MNT/LAM/001', 'YILI', 'Lamination', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/LAM/002', 'Slitter', 'Lamination', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/LAM/003', 'Perfecta', 'Lamination', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/LAM/004', 'Faida', 'Lamination', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      
      // FLUTTED DIE CUTTING SECTION (4 machines)
      ['MNT/FL/001', 'Novacut 3', 'Flutted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/FL/002', 'Novacut 4', 'Flutted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/FL/003', 'SP 102 Diecut', 'Flutted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/FL/004', 'SP 102', 'Flutted Die Cutting', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      
      // FLUTTED PASTING SECTION (5 machines)
      ['MNT/FL/005', 'LILA 1', 'Flutted Pasting', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/FL/006', 'LILA 2', 'Flutted Pasting', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/FL/007', 'Paktek 1', 'Flutted Pasting', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/FL/008', 'Paktek 2', 'Flutted Pasting', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/FL/009', 'Lamina Glueline', 'Flutted Pasting', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      
      // HAND PUNCHING SECTION (5 machines)
      ['MNT/HP/001', 'ACME', 'Hand Punching', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/HP/002', 'Bharat', 'Hand Punching', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/HP/003', 'Heido', 'Hand Punching', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/HP/004', 'Robus', 'Hand Punching', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/HP/005', 'Auto Strapping', 'Hand Punching', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      
      // LIQUID LINE SECTION (6 machines)
      ['MNT/LL/001', 'Fortuna', 'Liquid Line', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/LL/002', 'Sheeter', 'Liquid Line', 'Converting Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/LL/003', 'Slitter', 'Liquid Line', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/LL/004', 'Blanker 1', 'Liquid Line', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/LL/005', 'Fortuna Old', 'Liquid Line', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/LL/006', 'Fortuna New', 'Liquid Line', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      
      // OTHERS SECTION (12 machines)
      ['MNT/OTH/001', 'Window Patching 1', 'Others', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/OTH/002', 'Window Patching 2', 'Others', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/OTH/003', 'Offline Blanker', 'Others', 'Converting Plant', 'Monthly', '2025-26', 42, ''],
      ['MNT/OTH/004', 'Batch Counter', 'Others', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/OTH/005', 'Auto Print Sorting 1', 'Others', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/OTH/006', 'Auto Print Sorting 2', 'Others', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      ['MNT/OTH/007', 'Poker Card', 'Others', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/OTH/008', 'Label Pasting 1', 'Others', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/OTH/009', 'Label Pasting 2', 'Others', 'Converting Plant', 'Monthly', '2025-26', 67, ''],
      ['MNT/OTH/010', 'Label Pasting 3', 'Others', 'Converting Plant', 'Monthly', '2025-26', 50, ''],
      ['MNT/OTH/011', 'Ink Matching Mixt 1', 'Others', 'Printing Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/OTH/012', 'Ink Matching Mixt 2', 'Others', 'Printing Plant', 'Monthly', '2025-26', 25, ''],
      
      // UTILITY SECTION (4 machines)
      ['MNT/UTL/001', 'Compressor Converting', 'Utility', 'Converting Plant', 'Quarterly', '2025-26', 50, ''],
      ['MNT/UTL/002', 'Electricity Down Converting', 'Utility', 'Converting Plant', 'Quarterly', '2025-26', 50, ''],
      ['MNT/UTL/003', 'Compressor Printing', 'Utility', 'Printing Plant', 'Quarterly', '2025-26', 50, ''],
      ['MNT/UTL/004', 'Electricity Down Printing', 'Utility', 'Printing Plant', 'Quarterly', '2025-26', 50, ''],
      
      // SCRAP SECTION (3 machines)
      ['MNT/SCR/001', 'Scrap Cutting 1', 'Scrap', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/SCR/002', 'Scrap Cutting 2', 'Scrap', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      ['MNT/SCR/003', 'Scrap Cutting 3', 'Scrap', 'Converting Plant', 'Monthly', '2025-26', 25, ''],
      
      // GMP LAMINATION SECTION (1 machine)
      ['MNT/GMP/001', 'GFM Lamination', 'GMP Lamination', 'Converting Plant', 'Monthly', '2025-26', 33, ''],
      
      // ELECTRICAL PANELS SECTION (4 machines)
      ['MNT/ELE/001', 'LT Room Panel', 'Electrical Panel', 'Utility', 'Quarterly', '2025-26', 50, ''],
      ['MNT/ELE/002', 'HVAC Room Panel', 'Electrical Panel', 'Utility', 'Quarterly', '2025-26', 50, ''],
      ['MNT/ELE/003', 'Machine Panel', 'Electrical Panel', 'Utility', 'Quarterly', '2025-26', 50, ''],
      ['MNT/ELE/004', 'Main Incomer', 'Electrical Panel', 'Utility', 'Quarterly', '2025-26', 50, '']
    ];
    
    pmSheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
    pmSheet.autoResizeColumns(1, headers.length);
    
    SpreadsheetApp.getUi().alert('✅ PM_Schedule sheet created with ALL ' + sampleData.length + ' machines!\n\nOrganized by:\n- Printing Plant (12 + 2 = 14 machines)\n- Converting Plant (6+12+8+4+4+5+5+12+3+1+4 = 64 machines)\n- Utility (4 machines)\n\nTotal: 82 machines\n\nYou can now access the PM Compliance page.');
    Logger.log('PM_Schedule sheet created successfully with ' + sampleData.length + ' machines');
  } catch(err) {
    SpreadsheetApp.getUi().alert('❌ Error creating PM_Schedule sheet:\n' + err.toString());
    Logger.log('Error: ' + err.toString());
  }
}
