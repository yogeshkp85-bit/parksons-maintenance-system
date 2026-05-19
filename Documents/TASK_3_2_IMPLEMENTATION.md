# Task 3.2: Predictive Maintenance Alerts - Implementation Summary

## Overview

Task 3.2 implements the Predictive Maintenance Alerts component for the Parksons Maintenance System. This feature analyzes MTBF trends to identify degrading machines and generates alerts when performance falls below thresholds.

## Implementation Details

### Functions Implemented

#### 1. `initializeAlertLogSheet()`
- **Purpose**: Create and initialize the Alert_Log sheet with proper structure
- **Input**: None
- **Output**: Boolean (true if created or already exists)
- **Features**:
  - Creates Alert_Log sheet if it doesn't exist
  - Adds headers: Timestamp, Machine_Name, Alert_Type, Current_Value, Threshold_Value, Variance_Percent, Severity, Status, Dismissed_By, Dismissed_Reason
  - Formats headers with bold and background color
  - Sets frozen rows for easy navigation

#### 2. `calculateMTBFTrend(machineType, windowDays)`
- **Purpose**: Calculate MTBF trend for a machine over rolling windows
- **Input**: 
  - `machineType` (string): Type of machine to analyze
  - `windowDays` (number, default 30): Window size in days
- **Output**: Object with:
  - `currentMTBF` (number): MTBF for current window (2 decimal places)
  - `previousMTBF` (number): MTBF for previous window (2 decimal places)
  - `declineRate` (number): Percentage change (2 decimal places)
  - `trend` (string): "DECLINING", "IMPROVING", or "STABLE"
- **Features**:
  - Uses only Approved data from Final_Data sheet
  - Calculates MTBF for current window (last windowDays)
  - Calculates MTBF for previous window (windowDays before current)
  - Calculates decline rate as percentage change
  - Determines trend based on decline rate threshold (0.5%)
  - Returns values with 2 decimal places
  - Includes performance monitoring (logs if > 5 seconds)

#### 3. `generateAlerts()`
- **Purpose**: Generate alerts based on MTBF trends and thresholds
- **Input**: None
- **Output**: Object with:
  - `status` (string): "success" or "error"
  - `alerts` (array): Array of generated alerts
  - `count` (number): Number of alerts generated
  - `duration` (string): Execution time in seconds
- **Features**:
  - Analyzes MTBF trend for all machines
  - Generates alert if MTBF declines > 20% (configurable threshold)
  - Generates alert if Availability % falls below 90%
  - Sets severity: High (>30% decline), Medium (20-30% decline), Low (<20% decline)
  - Stores alerts in Alert_Log sheet with timestamp
  - Uses only Approved data from Final_Data sheet
  - Wraps with error logging (logError)
  - Handles edge cases (empty data, invalid machines)
  - Completes within performance targets (< 5 seconds)

#### 4. `dismissAlert(alertId, reason)`
- **Purpose**: Dismiss an alert with reason
- **Input**:
  - `alertId` (number): Row number of alert in Alert_Log sheet
  - `reason` (string): Reason for dismissal
- **Output**: Object with:
  - `success` (boolean): True if successful
  - `message` (string): Status message
- **Features**:
  - Finds alert in Alert_Log sheet by row ID
  - Updates status to "Dismissed"
  - Records dismisser (current user email)
  - Records dismissal reason
  - Logs action to Error_Log sheet
  - Returns true if successful, false otherwise

#### 5. `getAlertHistory(machineType, status, limit)`
- **Purpose**: Retrieve alert history with filtering
- **Input**:
  - `machineType` (string, optional): Machine type filter (or "All")
  - `status` (string, optional): Status filter (Active|Dismissed|Resolved or "All")
  - `limit` (number): Maximum number of alerts to return
- **Output**: Array of alert objects
- **Features**:
  - Retrieves alerts from Alert_Log sheet
  - Filters by machineType if provided
  - Filters by status if provided
  - Limits results to specified count
  - Returns sorted by timestamp (most recent first)
  - Includes all alert details
  - Handles edge cases (empty data, invalid filters)

### Data Model

#### Alert_Log Sheet Structure

| Column | Type | Required | Format | Notes |
|--------|------|----------|--------|-------|
| Timestamp | String | Yes | ISO 8601 | Auto-generated, alert creation time |
| Machine_Name | String | Yes | Text | Name of machine triggering alert |
| Alert_Type | String | Yes | Text | MTBF_DECLINE, AVAILABILITY_LOW |
| Current_Value | Number | Yes | Decimal | Current metric value |
| Threshold_Value | Number | Yes | Decimal | Threshold that triggered alert |
| Variance_Percent | Number | Yes | Decimal | Percentage variance from threshold |
| Severity | String | Yes | Text | High, Medium, Low |
| Status | String | Yes | Text | Active, Dismissed, Resolved |
| Dismissed_By | String | No | Email | Admin who dismissed alert |
| Dismissed_Reason | String | No | Text | Reason for dismissal |

### Alert Types

1. **MTBF_DECLINE**: Machine MTBF declines > 20% over rolling 30-day windows
   - Severity: High (>30%), Medium (20-30%), Low (<20%)
   - Threshold: 20% decline (configurable)

2. **AVAILABILITY_LOW**: Machine availability falls below 90%
   - Severity: High (<80%), Medium (80-85%), Low (85-90%)
   - Threshold: 90% (configurable)

### Integration Points

- **Error Logging**: All functions wrap with error logging (logError)
- **Version Control**: Uses existing Versions sheet for deployment tracking
- **Financial Year Filter**: Respects existing FY logic (Apr 1 → Mar 31)
- **Sheet Access**: Uses existing sheet access patterns (getApprovedEntries, filterEntries)
- **KPI Calculation**: Integrates with KPI functions from Task 3.1 (calculateKPIsFromEntries)

### Error Handling

All functions include:
- Input validation
- Try-catch blocks with error logging
- Graceful degradation (returns empty/default values on error)
- Performance monitoring (logs if execution exceeds thresholds)

### Performance Characteristics

- **Alert Generation**: < 5 seconds for all machines
- **MTBF Trend Calculation**: < 1 second per machine
- **Alert History Retrieval**: < 1 second for 50 alerts
- **Dismissal**: < 500ms per alert

## Testing

### Test Coverage

The implementation includes 15 comprehensive tests:

#### Unit Tests
1. `test_calculateMTBFTrend_basic` - Basic functionality
2. `test_calculateMTBFTrend_invalidInputs` - Invalid input handling
3. `test_calculateMTBFTrend_decimalPrecision` - 2 decimal place precision
4. `test_initializeAlertLogSheet_creation` - Sheet creation and headers
5. `test_generateAlerts_basic` - Basic alert generation
6. `test_generateAlerts_alertStructure` - Alert object structure validation
7. `test_generateAlerts_performance` - Performance target validation
8. `test_dismissAlert_basic` - Alert dismissal functionality
9. `test_dismissAlert_invalidInputs` - Invalid input handling
10. `test_getAlertHistory_basic` - History retrieval
11. `test_getAlertHistory_filterByStatus` - Status filtering
12. `test_getAlertHistory_sortingByTimestamp` - Timestamp sorting
13. `test_getAlertHistory_limitParameter` - Limit parameter validation

#### Property-Based Tests
14. `test_calculateMTBFTrend_declineRateProperty` - Decline rate calculation correctness
15. `test_generateAlerts_consistencyProperty` - Alert generation consistency

### Running Tests

Execute the test suite:
```javascript
runAllPredictiveAlertsTests()
```

Individual tests can be run:
```javascript
test_calculateMTBFTrend_basic()
test_generateAlerts_basic()
test_dismissAlert_basic()
test_getAlertHistory_basic()
```

## Files Modified/Created

### Modified Files
- `Maintenance_System/src/Code.gs` - Added 5 new functions + 1 test function

### New Files
- `Maintenance_System/src/Code.test.gs` - Comprehensive test suite (15 tests)
- `Maintenance_System/TASK_3_2_IMPLEMENTATION.md` - This documentation

## Deployment Checklist

- [x] Functions implemented with proper error handling
- [x] Alert_Log sheet structure defined and initialized
- [x] MTBF trend calculation with rolling windows
- [x] Alert generation with severity levels
- [x] Alert dismissal with audit trail
- [x] Alert history retrieval with filtering
- [x] Comprehensive test suite (15 tests)
- [x] Performance monitoring and logging
- [x] Integration with existing error logging system
- [x] Documentation complete

## Usage Examples

### Generate Alerts
```javascript
var result = generateAlerts();
Logger.log('Generated ' + result.count + ' alerts');
```

### Calculate MTBF Trend
```javascript
var trend = calculateMTBFTrend('PrintKBA1', 30);
Logger.log('MTBF Trend: ' + trend.trend + ' (' + trend.declineRate + '% decline)');
```

### Get Alert History
```javascript
var alerts = getAlertHistory('PrintKBA1', 'Active', 10);
Logger.log('Active alerts for PrintKBA1: ' + alerts.length);
```

### Dismiss Alert
```javascript
var result = dismissAlert(5, 'Maintenance scheduled');
if (result.success) {
  Logger.log('Alert dismissed successfully');
}
```

## Next Steps

1. **Task 3.3**: Implement Custom Report Generation
2. **Task 3.4**: Implement PDF/Excel Export
3. **Task 3.5**: Implement Machine Performance Benchmarking
4. **Task 3.6**: Implement Shift-Wise Performance Comparison
5. **Task 3.7**: Implement Alert Configuration UI
6. **Task 3.8**: Implement Scheduled Report Delivery

## Notes

- All functions use only Approved data from Final_Data sheet
- MTBF decline threshold is configurable (default 20%)
- Availability threshold is configurable (default 90%)
- All timestamps are in ISO 8601 format
- All numeric values are rounded to 2 decimal places
- Performance targets are < 5 seconds for alert generation
- Error logging is integrated with existing Error_Log sheet
- Version control is integrated with existing Versions sheet
