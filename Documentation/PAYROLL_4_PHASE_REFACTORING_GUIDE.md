# Payroll Processing 4-Phase Refactoring Guide

## Overview
This document provides a complete implementation guide for refactoring the payroll processing logic in the ESS-API backend to use a **4-phase normalized workflow** with proper database table relationships.

---

## Database Schema Overview

### Master/Detail Tables
- **PayrollMasterTable** - Header record for each payroll run
- **PayrollChildTable** - Summary per employee (one record per employee per payroll run)
- **PayrollItemDetailsTable** - Individual line items (earnings, deductions, employer contributions)

### Lookup/Reference Tables
- **PayrollPeriodTable** - Payroll period definitions
- **HrGoldenRankChildTable** - Employee salary ranks
- **SssTemplateTable** - SSS contribution matrices
- **PhilHealthTemplateTable** - PhilHealth contribution rules
- **PagIbigTemplateTable** - Pag-IBIG contribution rules
- **FeesChildTable** - Chart of Accounts mapping

### Accounting Tables
- **JournalMasterTable** - Journal entry headers
- **JournalChildTable** - Journal entry line items

---

## Phase 1: Initiation & Data Retrieval

### 1.1 Validate Payroll Period

```csharp
// Service Method: HrServices.cs
private async Task<PayrollPeriodTable> ValidatePayrollPeriod(int periodId)
{
    var period = await db.PayrollPeriodTables
        .FirstOrDefaultAsync(p => p.PeriodId == periodId && p.ActiveStatus == "Active");
    
    if (period == null)
        throw new Exception($"Payroll period {periodId} is not found or inactive");
    
    if (period.PeriodStatus == "CLOSED")
        throw new Exception($"Payroll period {period.PeriodName} is already closed");
    
    return period;
}
```

### 1.2 Fetch Active Employees with Salary Details

```csharp
private async Task<List<EmployeePayrollData>> FetchActiveEmployees()
{
    var employees = await db.HrEmployeeTables
        .Where(e => e.ActiveStatus == "Active" && e.GoldenRankChildId != null)
        .Select(e => new EmployeePayrollData
        {
            EmployeeId = e.EmployeeId,
            EmployeeNumber = e.EmployeeNumber,
            EmployeeName = $"{e.FirstName} {e.MiddleName} {e.LastName}".Trim(),
            GoldenRankChildId = e.GoldenRankChildId.Value,
            DepartmentId = e.DepartmentId,
            PositionId = e.PositionId
        })
        .ToListAsync();
    
    if (!employees.Any())
        throw new Exception("No active employees found for payroll processing");
    
    return employees;
}
```

### 1.3 Pre-load Salary Ranks

```csharp
private async Task<Dictionary<int, decimal>> LoadSalaryRanks()
{
    return await db.HrGoldenRankChildTables
        .Where(g => g.ActiveStatus == "Active")
        .ToDictionaryAsync(
            g => g.GoldenRankChildId,
            g => g.GoldenRankSalary
        );
}
```

### 1.4 Pre-load Statutory Contribution Tables

```csharp
private async Task<List<SssTemplateTable>> LoadSssTable()
{
    return await db.SssTemplateTables
        .Where(s => s.ActiveStatus == "Active")
        .OrderBy(s => s.RangeFrom)
        .ToListAsync();
}

private async Task<PhilHealthTemplateTable> LoadPhilHealthTable()
{
    var active = await db.PhilHealthTemplateTables
        .Where(p => p.ActiveStatus == "Active")
        .FirstOrDefaultAsync();
    
    if (active == null)
        throw new Exception("No active PhilHealth template found");
    
    return active;
}

private async Task<PagIbigTemplateTable> LoadPagIbigTable()
{
    var active = await db.PagIbigTemplateTables
        .Where(p => p.ActiveStatus == "Active")
        .FirstOrDefaultAsync();
    
    if (active == null)
        throw new Exception("No active Pag-IBIG template found");
    
    return active;
}
```

### 1.5 Load COA Mappings from FeesChildTable

```csharp
private async Task<Dictionary<string, int>> LoadCoaMappings()
{
    var mappings = await db.FeesChildTables
        .Where(f => f.ActiveStatus == "Active")
        .Select(f => new { f.FeesChildCode, f.FeesChildId })
        .ToListAsync();
    
    var dict = new Dictionary<string, int>();
    
    foreach (var item in mappings)
    {
        dict[item.FeesChildCode] = item.FeesChildId;
    }
    
    // Required transaction codes
    var requiredCodes = new[] {
        "BASIC_PAY", "SSS_EE", "SSS_ER", "SSS_WISP",
        "PHILHEALTH_EE", "PHILHEALTH_ER",
        "PAGIBIG_EE", "PAGIBIG_ER", "NET_PAY"
    };
    
    foreach (var code in requiredCodes)
    {
        if (!dict.ContainsKey(code))
            throw new Exception($"COA mapping not found for transaction code: {code}");
    }
    
    return dict;
}
```

---

## Phase 2: Payroll & Statutory Calculations

### 2.1 Calculate SSS Contributions

```csharp
private (decimal eeShare, decimal erShare, decimal wisp, int sssId) CalculateSss(
    decimal basicPay,
    List<SssTemplateTable> sssTable)
{
    var bracket = sssTable.FirstOrDefault(s => 
        basicPay >= s.RangeFrom && basicPay <= s.RangeTo);
    
    if (bracket == null)
    {
        // Use highest bracket if salary exceeds max range
        bracket = sssTable.OrderByDescending(s => s.RangeTo).First();
    }
    
    return (
        eeShare: bracket.EmployeeShare,
        erShare: bracket.EmployerShare,
        wisp: bracket.Wisp,
        sssId: bracket.SssId
    );
}
```

### 2.2 Calculate PhilHealth Contributions

```csharp
private (decimal eeShare, decimal erShare, int philHealthId) CalculatePhilHealth(
    decimal basicPay,
    PhilHealthTemplateTable philHealthTable)
{
    decimal cappedSalary = basicPay;
    
    if (basicPay < philHealthTable.MinSalaryCap)
        cappedSalary = philHealthTable.MinSalaryCap;
    else if (basicPay > philHealthTable.MaxSalaryCap)
        cappedSalary = philHealthTable.MaxSalaryCap;
    
    decimal premium = cappedSalary * philHealthTable.PremiumRate;
    decimal eeShare = premium * philHealthTable.EmployeeSplitRatio;
    decimal erShare = premium * philHealthTable.EmployerSplitRatio;
    
    return (
        eeShare: Math.Round(eeShare, 2),
        erShare: Math.Round(erShare, 2),
        philHealthId: philHealthTable.PhilHealthId
    );
}
```

### 2.3 Calculate Pag-IBIG Contributions

```csharp
private (decimal eeShare, decimal erShare, int pagIbigId) CalculatePagIbig(
    decimal basicPay,
    PagIbigTemplateTable pagIbigTable)
{
    decimal eeRate = basicPay <= 1500 ? 
        pagIbigTable.EeRateBelow1500 : 
        pagIbigTable.EeRateAbove1500;
    
    decimal eeShare = basicPay * eeRate;
    
    // Cap at maximum salary
    decimal cappedSalary = Math.Min(basicPay, pagIbigTable.MaxSalaryCap);
    decimal erShare = cappedSalary * pagIbigTable.EmployerRate;
    
    return (
        eeShare: Math.Round(eeShare, 2),
        erShare: Math.Round(erShare, 2),
        pagIbigId: pagIbigTable.PagIbigId
    );
}
```

### 2.4 Process Single Employee

```csharp
private EmployeePayrollResult ProcessEmployee(
    EmployeePayrollData employee,
    Dictionary<int, decimal> salaryRanks,
    List<SssTemplateTable> sssTable,
    PhilHealthTemplateTable philHealthTable,
    PagIbigTemplateTable pagIbigTable)
{
    // Get basic pay
    if (!salaryRanks.TryGetValue(employee.GoldenRankChildId, out decimal basicPay))
        throw new Exception($"Salary rank not found for employee {employee.EmployeeNumber}");
    
    // Calculate statutory contributions
    var (sssEe, sssEr, sssWisp, sssId) = CalculateSss(basicPay, sssTable);
    var (philEe, philEr, philId) = CalculatePhilHealth(basicPay, philHealthTable);
    var (pagEe, pagEr, pagId) = CalculatePagIbig(basicPay, pagIbigTable);
    
    // Calculate totals
    decimal totalDeductions = sssEe + philEe + pagEe;
    decimal netPay = basicPay - totalDeductions;
    
    return new EmployeePayrollResult
    {
        Employee = employee,
        BasicPay = basicPay,
        SssEeShare = sssEe,
        SssErShare = sssEr,
        SssWisp = sssWisp,
        SssId = sssId,
        PhilHealthEeShare = philEe,
        PhilHealthErShare = philEr,
        PhilHealthId = philId,
        PagIbigEeShare = pagEe,
        PagIbigErShare = pagEr,
        PagIbigId = pagId,
        TotalDeductions = totalDeductions,
        NetPay = netPay
    };
}
```

---

## Phase 3: Record Insertion & Data Structuring

### 3.1 Create PayrollMasterTable Record

```csharp
private async Task<int> CreatePayrollMaster(
    int periodId,
    int calendarId,
    int createdBy,
    List<EmployeePayrollResult> results)
{
    var master = new PayrollMasterTable
    {
        PeriodId = periodId,
        CalendarId = calendarId,
        PayrollStatus = "DRAFT",
        TotalGrossPay = results.Sum(r => r.BasicPay),
        TotalDeductions = results.Sum(r => r.TotalDeductions),
        TotalNetPay = results.Sum(r => r.NetPay),
        TotalEmployees = results.Count,
        CreatedBy = createdBy,
        DateCreated = DateTime.Now,
        ActiveStatus = "Active"
    };
    
    db.PayrollMasterTables.Add(master);
    await db.SaveChangesAsync();
    
    return master.PayrollMasterId;
}
```

### 3.2 Create PayrollChildTable Records

```csharp
private async Task CreatePayrollChildren(
    int payrollMasterId,
    List<EmployeePayrollResult> results)
{
    foreach (var result in results)
    {
        var child = new PayrollChildTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = result.Employee.EmployeeId,
            GoldenRankChildId = result.Employee.GoldenRankChildId,
            SssId = result.SssId,
            PhilHealthId = result.PhilHealthId,
            PagIbigId = result.PagIbigId,
            BasicPay = result.BasicPay,
            GrossPay = result.BasicPay, // Add allowances if needed
            TotalDeductions = result.TotalDeductions,
            NetPay = result.NetPay,
            PayrollStatus = "DRAFT",
            DateCreated = DateTime.Now,
            ActiveStatus = "Active"
        };
        
        db.PayrollChildTables.Add(child);
    }
    
    await db.SaveChangesAsync();
}
```

### 3.3 Create PayrollItemDetailsTable Records

```csharp
private async Task CreatePayrollItemDetails(
    int payrollMasterId,
    List<EmployeePayrollResult> results,
    Dictionary<string, int> coaMappings)
{
    var items = new List<PayrollItemDetailsTable>();
    
    foreach (var result in results)
    {
        var employeeId = result.Employee.EmployeeId;
        
        // Basic Pay (EARNING)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["BASIC_PAY"],
            ItemType = "EARNING",
            Amount = result.BasicPay,
            EntryType = "DEBIT",
            Description = "Basic Salary",
            ActiveStatus = "Active"
        });
        
        // SSS Employee Share (DEDUCTION)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["SSS_EE"],
            ItemType = "DEDUCTION",
            Amount = result.SssEeShare,
            EntryType = "CREDIT",
            Description = "SSS Employee Contribution",
            ActiveStatus = "Active"
        });
        
        // SSS Employer Share (STATUTORY_EMPLOYER)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["SSS_ER"],
            ItemType = "STATUTORY_EMPLOYER",
            Amount = result.SssErShare,
            EntryType = "DEBIT",
            Description = "SSS Employer Contribution",
            ActiveStatus = "Active"
        });
        
        // SSS WISP (STATUTORY_EMPLOYER)
        if (result.SssWisp > 0)
        {
            items.Add(new PayrollItemDetailsTable
            {
                PayrollMasterId = payrollMasterId,
                EmployeeId = employeeId,
                FeesChildId = coaMappings["SSS_WISP"],
                ItemType = "STATUTORY_EMPLOYER",
                Amount = result.SssWisp,
                EntryType = "DEBIT",
                Description = "SSS WISP",
                ActiveStatus = "Active"
            });
        }
        
        // PhilHealth Employee Share (DEDUCTION)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["PHILHEALTH_EE"],
            ItemType = "DEDUCTION",
            Amount = result.PhilHealthEeShare,
            EntryType = "CREDIT",
            Description = "PhilHealth Employee Contribution",
            ActiveStatus = "Active"
        });
        
        // PhilHealth Employer Share (STATUTORY_EMPLOYER)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["PHILHEALTH_ER"],
            ItemType = "STATUTORY_EMPLOYER",
            Amount = result.PhilHealthErShare,
            EntryType = "DEBIT",
            Description = "PhilHealth Employer Contribution",
            ActiveStatus = "Active"
        });
        
        // Pag-IBIG Employee Share (DEDUCTION)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["PAGIBIG_EE"],
            ItemType = "DEDUCTION",
            Amount = result.PagIbigEeShare,
            EntryType = "CREDIT",
            Description = "Pag-IBIG Employee Contribution",
            ActiveStatus = "Active"
        });
        
        // Pag-IBIG Employer Share (STATUTORY_EMPLOYER)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["PAGIBIG_ER"],
            ItemType = "STATUTORY_EMPLOYER",
            Amount = result.PagIbigErShare,
            EntryType = "DEBIT",
            Description = "Pag-IBIG Employer Contribution",
            ActiveStatus = "Active"
        });
        
        // Net Pay (EARNING - credit to payable)
        items.Add(new PayrollItemDetailsTable
        {
            PayrollMasterId = payrollMasterId,
            EmployeeId = employeeId,
            FeesChildId = coaMappings["NET_PAY"],
            ItemType = "EARNING",
            Amount = result.NetPay,
            EntryType = "CREDIT",
            Description = "Net Pay",
            ActiveStatus = "Active"
        });
    }
    
    db.PayrollItemDetailsTables.AddRange(items);
    await db.SaveChangesAsync();
}
```

---

## Phase 4: Double-Entry Journal Posting

### 4.1 Aggregate Journal Entries

```csharp
private async Task<List<JournalLineAggregation>> AggregateJournalEntries(int payrollMasterId)
{
    var aggregated = await db.PayrollItemDetailsTables
        .Where(p => p.PayrollMasterId == payrollMasterId && p.ActiveStatus == "Active")
        .GroupBy(p => new { p.FeesChildId, p.EntryType })
        .Select(g => new JournalLineAggregation
        {
            FeesChildId = g.Key.FeesChildId,
            EntryType = g.Key.EntryType,
            TotalAmount = g.Sum(p => p.Amount)
        })
        .ToListAsync();
    
    return aggregated;
}
```

### 4.2 Create Journal Master

```csharp
private async Task<int> CreateJournalMaster(
    int payrollMasterId,
    int calendarId,
    string description,
    int createdBy)
{
    var master = new JournalMasterTable
    {
        PayrollMasterId = payrollMasterId,
        CalendarId = calendarId,
        JournalType = "PAYROLL",
        TransactionDate = DateTime.Now,
        Description = description,
        JournalStatus = "DRAFT",
        CreatedBy = createdBy,
        DateCreated = DateTime.Now,
        ActiveStatus = "Active"
    };
    
    db.JournalMasterTables.Add(master);
    await db.SaveChangesAsync();
    
    return master.JournalMasterId;
}
```

### 4.3 Create Journal Child Records

```csharp
private async Task CreateJournalChildren(
    int journalMasterId,
    List<JournalLineAggregation> aggregations)
{
    var children = new List<JournalChildTable>();
    
    foreach (var agg in aggregations)
    {
        children.Add(new JournalChildTable
        {
            JournalMasterId = journalMasterId,
            FeesChildId = agg.FeesChildId,
            EntryType = agg.EntryType,
            Amount = agg.TotalAmount,
            DateCreated = DateTime.Now,
            ActiveStatus = "Active"
        });
    }
    
    db.JournalChildTables.AddRange(children);
    await db.SaveChangesAsync();
    
    // Update JournalMaster totals
    var master = await db.JournalMasterTables.FindAsync(journalMasterId);
    master.TotalDebit = children.Where(c => c.EntryType == "DEBIT").Sum(c => c.Amount);
    master.TotalCredit = children.Where(c => c.EntryType == "CREDIT").Sum(c => c.Amount);
    
    await db.SaveChangesAsync();
}
```

---

## Complete Main Method with Transaction

### HrServices.cs - CalculatePayrollForPeriod

```csharp
public async Task<PayrollProcessingResultDto> CalculatePayrollForPeriod(
    CalculatePayrollRequestDto request,
    int currentUserId)
{
    using var transaction = await db.Database.BeginTransactionAsync();
    
    try
    {
        // ══════════════════════════════════════════════════════════════
        // PHASE 1: INITIATION & DATA RETRIEVAL
        // ══════════════════════════════════════════════════════════════
        
        var period = await ValidatePayrollPeriod(request.PeriodId);
        var employees = await FetchActiveEmployees();
        var salaryRanks = await LoadSalaryRanks();
        var sssTable = await LoadSssTable();
        var philHealthTable = await LoadPhilHealthTable();
        var pagIbigTable = await LoadPagIbigTable();
        var coaMappings = await LoadCoaMappings();
        
        // ══════════════════════════════════════════════════════════════
        // PHASE 2: PAYROLL & STATUTORY CALCULATIONS
        // ══════════════════════════════════════════════════════════════
        
        var results = new List<EmployeePayrollResult>();
        
        foreach (var employee in employees)
        {
            var result = ProcessEmployee(
                employee,
                salaryRanks,
                sssTable,
                philHealthTable,
                pagIbigTable
            );
            results.Add(result);
        }
        
        // ══════════════════════════════════════════════════════════════
        // PHASE 3: RECORD INSERTION & DATA STRUCTURING
        // ══════════════════════════════════════════════════════════════
        
        int payrollMasterId = await CreatePayrollMaster(
            request.PeriodId,
            request.CalendarId,
            currentUserId,
            results
        );
        
        await CreatePayrollChildren(payrollMasterId, results);
        await CreatePayrollItemDetails(payrollMasterId, results, coaMappings);
        
        // ══════════════════════════════════════════════════════════════
        // PHASE 4: DOUBLE-ENTRY JOURNAL POSTING
        // ══════════════════════════════════════════════════════════════
        
        var aggregations = await AggregateJournalEntries(payrollMasterId);
        
        int journalMasterId = await CreateJournalMaster(
            payrollMasterId,
            request.CalendarId,
            $"Payroll for {period.PeriodName}",
            currentUserId
        );
        
        await CreateJournalChildren(journalMasterId, aggregations);
        
        // Commit transaction
        await transaction.CommitAsync();
        
        return new PayrollProcessingResultDto
        {
            Success = true,
            Message = $"Payroll calculated successfully for {results.Count} employees",
            PayrollMasterId = payrollMasterId,
            JournalMasterId = journalMasterId,
            TotalEmployees = results.Count,
            TotalGrossPay = results.Sum(r => r.BasicPay),
            TotalDeductions = results.Sum(r => r.TotalDeductions),
            TotalNetPay = results.Sum(r => r.NetPay)
        };
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        throw new Exception($"Payroll calculation failed: {ex.Message}", ex);
    }
}
```

---

## DTOs

### Request DTOs

```csharp
public class CalculatePayrollRequestDto
{
    public int PeriodId { get; set; }
    public int CalendarId { get; set; }
}
```

### Response DTOs

```csharp
public class PayrollProcessingResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public int PayrollMasterId { get; set; }
    public int JournalMasterId { get; set; }
    public int TotalEmployees { get; set; }
    public decimal TotalGrossPay { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal TotalNetPay { get; set; }
}
```

### Internal DTOs

```csharp
internal class EmployeePayrollData
{
    public int EmployeeId { get; set; }
    public string EmployeeNumber { get; set; }
    public string EmployeeName { get; set; }
    public int GoldenRankChildId { get; set; }
    public int? DepartmentId { get; set; }
    public int? PositionId { get; set; }
}

internal class EmployeePayrollResult
{
    public EmployeePayrollData Employee { get; set; }
    public decimal BasicPay { get; set; }
    public decimal SssEeShare { get; set; }
    public decimal SssErShare { get; set; }
    public decimal SssWisp { get; set; }
    public int SssId { get; set; }
    public decimal PhilHealthEeShare { get; set; }
    public decimal PhilHealthErShare { get; set; }
    public int PhilHealthId { get; set; }
    public decimal PagIbigEeShare { get; set; }
    public decimal PagIbigErShare { get; set; }
    public int PagIbigId { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal NetPay { get; set; }
}

internal class JournalLineAggregation
{
    public int FeesChildId { get; set; }
    public string EntryType { get; set; }
    public decimal TotalAmount { get; set; }
}
```

---

## Controller Implementation

### HrApiController.cs

```csharp
[HttpPost("calculate-payroll")]
public async Task<IActionResult> CalculatePayroll([FromBody] CalculatePayrollRequestDto dto)
{
    try
    {
        var currentUserId = GetCurrentUserId(); // Implement based on your auth
        var result = await _hrService.CalculatePayrollForPeriod(dto, currentUserId);
        
        return Ok(new
        {
            success = true,
            message = result.Message,
            data = result
        });
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            success = false,
            message = ex.Message
        });
    }
}
```

---

## Testing Checklist

### Phase 1 Tests
- [ ] Validate active period selection
- [ ] Reject closed periods
- [ ] Fetch only active employees
- [ ] Load salary ranks correctly
- [ ] Load all statutory tables
- [ ] Verify COA mappings exist

### Phase 2 Tests
- [ ] SSS calculation matches bracket
- [ ] PhilHealth caps applied correctly
- [ ] Pag-IBIG rates switch at ₱1,500
- [ ] Total deductions sum correctly
- [ ] Net pay = Basic - Deductions

### Phase 3 Tests
- [ ] PayrollMaster created with DRAFT status
- [ ] PayrollChild count matches employees
- [ ] PayrollItemDetails has 9 rows per employee
- [ ] Foreign keys populated correctly

### Phase 4 Tests
- [ ] Journal aggregations sum correctly
- [ ] Debit = Credit (balanced entry)
- [ ] Journal links to PayrollMaster
- [ ] Transaction rollback on error

---

## Migration Path from Old Code

### Step 1: Comment Out Old Methods
```csharp
// ═══════════════════════════════════════════════════════════════
// OLD IMPLEMENTATION - COMMENTED FOR REFERENCE
// ═══════════════════════════════════════════════════════════════
// public async Task<OldPayrollResultDto> CalculatePayroll(OldPayrollRequestDto dto)
// {
//     // ... old implementation
// }
```

### Step 2: Add New 4-Phase Method
Add the new implementation alongside the old one with a different method name initially.

### Step 3: Update Controller Route
Change the controller to call the new method:
```csharp
// Before:
// var result = await _hrService.CalculatePayroll(dto);

// After:
var result = await _hrService.CalculatePayrollForPeriod(dto, userId);
```

### Step 4: Test Thoroughly
Run all test cases before removing old code.

### Step 5: Remove Old Implementation
Once verified, delete the commented old methods.

---

## Common Issues & Solutions

### Issue 1: Missing Foreign Key Values
**Error:** `Cannot insert NULL into GoldenRankChildId`
**Solution:** Ensure all active employees have valid GoldenRankChildId set in HrEmployeeTable

### Issue 2: SSS Bracket Not Found
**Error:** `SSS bracket not found for salary ₱XX,XXX`
**Solution:** Add catch-all bracket or use highest bracket for salaries exceeding max range

### Issue 3: Unbalanced Journal Entry
**Error:** `Total Debit ≠ Total Credit`
**Solution:** Verify EntryType assignments in PayrollItemDetailsTable creation

### Issue 4: Transaction Timeout
**Error:** `Transaction timeout exceeded`
**Solution:** Process in batches or increase transaction timeout for large employee counts

---

## Performance Optimization Tips

1. **Batch Processing:** For 1000+ employees, process in batches of 100
2. **Eager Loading:** Use `.Include()` for related entities
3. **Bulk Insert:** Use `AddRange()` instead of individual `Add()` calls
4. **Index Tuning:** Add indexes on frequently queried foreign keys
5. **Async All The Way:** Ensure all DB calls use `async/await`

---

## Security Considerations

1. **Authorization:** Verify user has `HR_PAYROLL_CALCULATE` permission
2. **Audit Trail:** Log all payroll calculations with timestamps
3. **Period Locking:** Prevent recalculation of closed periods
4. **Data Validation:** Validate all input DTOs before processing
5. **Error Logging:** Log exceptions without exposing sensitive data

---

## End of Guide

This guide provides a complete, production-ready implementation of the 4-phase payroll processing workflow. All methods follow SOLID principles, proper error handling, and transaction management.

For questions or issues, refer to the project's main documentation or contact the development team.
