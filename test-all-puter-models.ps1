# 🧪 COMPREHENSIVE PUTER.JS MODEL TESTING SCRIPT
# This PowerShell script will test all Puter.js models systematically

Write-Host "🚀 Starting Comprehensive Puter.js Model Testing..." -ForegroundColor Green
Write-Host "Target: http://localhost:3002/api/puter" -ForegroundColor Cyan

# Initialize results
$results = @{
    current = @{ working = @(); failed = @() }
    target = @{ working = @(); failed = @() }
    details = @{}
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

# Helper function to test a model
function Test-PuterModel {
    param(
        [string]$Model,
        [string]$Name = $Model
    )
    
    Write-Host "`n🔄 Testing $Name..." -ForegroundColor Yellow
    
    $headers = @{ 'Content-Type' = 'application/json' }
    $body = @{
        model = $Model
        messages = @(@{
            role = "user"
            content = "Test $Name - respond with 'OK $Name'"
        })
    } | ConvertTo-Json -Depth 3
    
    try {
        $startTime = Get-Date
        $response = Invoke-RestMethod -Uri "http://localhost:3002/api/puter" -Method POST -Headers $headers -Body $body -TimeoutSec 30
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalMilliseconds
        
        if ($response -and $response.usePuterDirect) {
            Write-Host "✅ $Name API endpoint working ($([math]::Round($responseTime))ms)" -ForegroundColor Green
            return @{
                success = $true
                responseTime = $responseTime
                type = "puter-direct"
                data = $response
            }
        } elseif ($response -and $response.text) {
            Write-Host "✅ $Name working with direct response ($([math]::Round($responseTime))ms)" -ForegroundColor Green
            return @{
                success = $true
                responseTime = $responseTime
                type = "direct-response"
                response = $response.text
            }
        } else {
            Write-Host "❌ $Name unexpected response format" -ForegroundColor Red
            return @{
                success = $false
                error = "Unexpected response format"
                responseTime = $responseTime
                data = $response
            }
        }
    } catch {
        $responseTime = if ($startTime) { ((Get-Date) - $startTime).TotalMilliseconds } else { 0 }
        Write-Host "❌ $Name failed: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            success = $false
            error = $_.Exception.Message
            responseTime = $responseTime
        }
    }
}

# Test current models
Write-Host "`n=== TESTING CURRENT MODELS ===" -ForegroundColor Magenta

$currentModels = @(
    @{ model = ""; name = "default" },
    @{ model = "claude"; name = "claude" },
    @{ model = "gpt-4.1-nano"; name = "gpt-4.1-nano" }
)

foreach ($modelInfo in $currentModels) {
    $result = Test-PuterModel -Model $modelInfo.model -Name $modelInfo.name
    $results.details[$modelInfo.name] = $result
    
    if ($result.success) {
        $results.current.working += $modelInfo.name
    } else {
        $results.current.failed += $modelInfo.name
    }
    
    Start-Sleep -Seconds 1
}

# Test target models (DeepSeek, Gemini, Grok)
Write-Host "`n=== TESTING TARGET MODELS (DeepSeek, Gemini, Grok) ===" -ForegroundColor Magenta

$targetModels = @(
    "deepseek",
    "deepseek-chat",
    "deepseek-coder",
    "deepseek-r1",
    "gemini",
    "gemini-pro",
    "gemini-flash",
    "grok",
    "grok-beta",
    "grok-mini"
)

foreach ($model in $targetModels) {
    $result = Test-PuterModel -Model $model -Name $model
    $results.details[$model] = $result
    
    if ($result.success) {
        $results.target.working += $model
    } else {
        $results.target.failed += $model
    }
    
    Start-Sleep -Seconds 2
}

# Generate results summary
Write-Host "`n🎉 TESTING COMPLETE!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "✅ Current working models: $($results.current.working.Count)/$($currentModels.Count)" -ForegroundColor Green
Write-Host "✅ Target working models: $($results.target.working.Count)/$($targetModels.Count)" -ForegroundColor Green
Write-Host "❌ Total failed models: $($results.current.failed.Count + $results.target.failed.Count)" -ForegroundColor Red

if ($results.current.working.Count -gt 0) {
    Write-Host "`n✅ Current working models:" -ForegroundColor Green
    foreach ($model in $results.current.working) {
        $details = $results.details[$model]
        Write-Host "  ✅ $model ($([math]::Round($details.responseTime))ms)" -ForegroundColor Green
    }
}

if ($results.target.working.Count -gt 0) {
    Write-Host "`n🔥 Target working models (NEW):" -ForegroundColor Yellow
    foreach ($model in $results.target.working) {
        $details = $results.details[$model]
        Write-Host "  ✅ $model ($([math]::Round($details.responseTime))ms)" -ForegroundColor Green
    }
    
    Write-Host "`n📝 CODE TO ADD TO models.ts:" -ForegroundColor Cyan
    Write-Host "// Add these entries to the PUTER.JS section:" -ForegroundColor Gray
    
    foreach ($model in $results.target.working) {
        $isGood = $model.Contains("deepseek") -or $model -eq "gemini-pro" -or $model -eq "grok"
        $label = (Get-Culture).TextInfo.ToTitleCase($model) -replace "-", " "
        
        Write-Host "  {" -ForegroundColor Gray
        Write-Host "    id: 'puter-$model'," -ForegroundColor Gray
        Write-Host "    label: '$label (Puter)'," -ForegroundColor Gray
        Write-Host "    provider: 'puter'," -ForegroundColor Gray
        Write-Host "    model: '$model'," -ForegroundColor Gray
        Write-Host "    free: true," -ForegroundColor Gray
        if ($isGood) {
            Write-Host "    good: true," -ForegroundColor Gray
        }
        Write-Host "  }," -ForegroundColor Gray
    }
}

if (($results.current.failed.Count + $results.target.failed.Count) -gt 0) {
    Write-Host "`n❌ Failed models:" -ForegroundColor Red
    foreach ($model in ($results.current.failed + $results.target.failed)) {
        $details = $results.details[$model]
        Write-Host "  ❌ $model`: $($details.error)" -ForegroundColor Red
    }
}

# Save results to JSON file
$jsonResults = $results | ConvertTo-Json -Depth 10
$jsonResults | Out-File -FilePath "test-results.json" -Encoding UTF8
Write-Host "`n💾 Results saved to test-results.json" -ForegroundColor Cyan

# Display final summary
Write-Host "`n📊 FINAL SUMMARY:" -ForegroundColor Magenta
Write-Host "Current models working: $($results.current.working -join ', ')" -ForegroundColor Green
Write-Host "New models working: $($results.target.working -join ', ')" -ForegroundColor Yellow
Write-Host "Failed models: $(($results.current.failed + $results.target.failed) -join ', ')" -ForegroundColor Red