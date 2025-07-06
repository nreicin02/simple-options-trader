
const mockData = {
  AAPL: {
    overview: {
      Symbol: 'AAPL',
      AssetType: 'Common Stock',
      Name: 'Apple Inc',
      Description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables and accessories worldwide.',
      CIK: '320193',
      Exchange: 'NASDAQ',
      Currency: 'USD',
      Country: 'USA',
      Sector: 'TECHNOLOGY',
      Industry: 'ELECTRONIC COMPUTERS',
      Address: 'ONE APPLE PARK WAY, CUPERTINO, CA, US',
      FiscalYearEnd: 'September',
      LatestQuarter: '2024-03-31',
      MarketCapitalization: '3000000000000',
      EBITDA: '120000000000',
      PERatio: '28.5',
      PEGRatio: '2.1',
      BookValue: '4.5',
      DividendPerShare: '0.96',
      DividendYield: '0.5',
      EPS: '6.5',
      RevenuePerShareTTM: '25.8',
      ProfitMargin: '25.2',
      OperatingMarginTTM: '30.1',
      ReturnOnAssetsTTM: '18.5',
      ReturnOnEquityTTM: '150.2',
      RevenueTTM: '385000000000',
      GrossProfitTTM: '170000000000',
      DilutedEPSTTM: '6.5',
      QuarterlyEarningsGrowthYOY: '0.08',
      QuarterlyRevenueGrowthYOY: '0.04',
      AnalystTargetPrice: '210.00',
      TrailingPE: '28.5',
      ForwardPE: '25.2',
      PriceToBookRatio: '35.2',
      EVToRevenue: '7.8',
      EVToEBITDA: '25.0',
      Beta: '1.2',
      '52WeekHigh': '220.00',
      '52WeekLow': '150.00',
      '50DayMovingAverage': '200.00',
      '200DayMovingAverage': '180.00',
      SharesOutstanding: '15000000000',
      DividendDate: '2024-05-16',
      ExDividendDate: '2024-05-10'
    },
    incomeStatement: {
      symbol: 'AAPL',
      annualReports: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedCurrency: 'USD',
          grossProfit: '170000000000',
          totalRevenue: '385000000000',
          costOfRevenue: '215000000000',
          costofGoodsAndServicesSold: '215000000000',
          operatingIncome: '115000000000',
          sellingGeneralAndAdministrative: '25000000000',
          researchAndDevelopment: '30000000000',
          operatingExpenses: '55000000000',
          investmentIncomeNet: '5000000000',
          netInterestIncome: '5000000000',
          interestIncome: '6000000000',
          interestExpense: '1000000000',
          nonInterestIncome: '2000000000',
          otherNonOperatingIncome: '1000000000',
          depreciation: '15000000000',
          depreciationAndAmortization: '15000000000',
          incomeBeforeTax: '120000000000',
          incomeTaxExpense: '25000000000',
          interestAndDebtExpense: '1000000000',
          netIncomeFromContinuingOps: '95000000000',
          comprehensiveIncomeNetOfTax: '95000000000',
          ebit: '115000000000',
          ebitda: '130000000000',
          netIncome: '95000000000'
        }
      ],
      quarterlyReports: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedCurrency: 'USD',
          grossProfit: '45000000000',
          totalRevenue: '95000000000',
          costOfRevenue: '50000000000',
          costofGoodsAndServicesSold: '50000000000',
          operatingIncome: '28000000000',
          sellingGeneralAndAdministrative: '6000000000',
          researchAndDevelopment: '8000000000',
          operatingExpenses: '14000000000',
          investmentIncomeNet: '1200000000',
          netInterestIncome: '1200000000',
          interestIncome: '1500000000',
          interestExpense: '300000000',
          nonInterestIncome: '500000000',
          otherNonOperatingIncome: '300000000',
          depreciation: '4000000000',
          depreciationAndAmortization: '4000000000',
          incomeBeforeTax: '29200000000',
          incomeTaxExpense: '6000000000',
          interestAndDebtExpense: '300000000',
          netIncomeFromContinuingOps: '23200000000',
          comprehensiveIncomeNetOfTax: '23200000000',
          ebit: '28000000000',
          ebitda: '32000000000',
          netIncome: '23200000000'
        }
      ]
    },
    balanceSheet: {
      symbol: 'AAPL',
      annualReports: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedCurrency: 'USD',
          totalAssets: '350000000000',
          totalCurrentAssets: '150000000000',
          cashAndCashEquivalentsAtCarryingValue: '50000000000',
          cashAndShortTermInvestments: '60000000000',
          inventory: '8000000000',
          currentNetReceivables: '30000000000',
          totalNonCurrentAssets: '200000000000',
          propertyPlantEquipmentNet: '80000000000',
          accumulatedDepreciationAmortizationPPE: '40000000000',
          intangibleAssets: '20000000000',
          intangibleAssetsExcludingGoodwill: '15000000000',
          goodwill: '5000000000',
          investments: '100000000000',
          longTermInvestments: '80000000000',
          shortTermInvestments: '20000000000',
          otherCurrentAssets: '20000000000',
          otherNonCurrentAssets: '20000000000',
          totalLiabilities: '250000000000',
          totalCurrentLiabilities: '100000000000',
          currentAccountsPayable: '40000000000',
          deferredRevenue: '20000000000',
          currentDebt: '15000000000',
          shortTermDebt: '15000000000',
          totalNonCurrentLiabilities: '150000000000',
          capitalLeaseObligations: '5000000000',
          longTermDebt: '100000000000',
          currentLongTermDebt: '15000000000',
          longTermDebtNoncurrent: '85000000000',
          shortLongTermDebtTotal: '115000000000',
          otherCurrentLiabilities: '25000000000',
          otherNonCurrentLiabilities: '45000000000',
          totalShareholderEquity: '100000000000',
          treasuryStock: '50000000000',
          retainedEarnings: '80000000000',
          commonStock: '70000000000',
          commonStockSharesOutstanding: '15000000000'
        }
      ],
      quarterlyReports: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedCurrency: 'USD',
          totalAssets: '350000000000',
          totalCurrentAssets: '150000000000',
          cashAndCashEquivalentsAtCarryingValue: '50000000000',
          cashAndShortTermInvestments: '60000000000',
          inventory: '8000000000',
          currentNetReceivables: '30000000000',
          totalNonCurrentAssets: '200000000000',
          propertyPlantEquipmentNet: '80000000000',
          accumulatedDepreciationAmortizationPPE: '40000000000',
          intangibleAssets: '20000000000',
          intangibleAssetsExcludingGoodwill: '15000000000',
          goodwill: '5000000000',
          investments: '100000000000',
          longTermInvestments: '80000000000',
          shortTermInvestments: '20000000000',
          otherCurrentAssets: '20000000000',
          otherNonCurrentAssets: '20000000000',
          totalLiabilities: '250000000000',
          totalCurrentLiabilities: '100000000000',
          currentAccountsPayable: '40000000000',
          deferredRevenue: '20000000000',
          currentDebt: '15000000000',
          shortTermDebt: '15000000000',
          totalNonCurrentLiabilities: '150000000000',
          capitalLeaseObligations: '5000000000',
          longTermDebt: '100000000000',
          currentLongTermDebt: '15000000000',
          longTermDebtNoncurrent: '85000000000',
          shortLongTermDebtTotal: '115000000000',
          otherCurrentLiabilities: '25000000000',
          otherNonCurrentLiabilities: '45000000000',
          totalShareholderEquity: '100000000000',
          treasuryStock: '50000000000',
          retainedEarnings: '80000000000',
          commonStock: '70000000000',
          commonStockSharesOutstanding: '15000000000'
        }
      ]
    },
    cashFlow: {
      symbol: 'AAPL',
      annualReports: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedCurrency: 'USD',
          operatingCashflow: '120000000000',
          paymentsForOperatingActivities: '50000000000',
          proceedsFromOperatingActivities: '170000000000',
          changeInOperatingIncome: '10000000000',
          changeInNetIncome: '8000000000',
          changeInAccountReceivables: '5000000000',
          changeInInventory: '2000000000',
          changeInCashAndCashEquivalents: '15000000000',
          changeInAccountPayables: '3000000000',
          changeInPrepaidExpenses: '1000000000',
          changeInOperatingActivities: '10000000000',
          capitalExpenditures: '20000000000',
          profitLoss: '95000000000',
          cashflowFromInvestment: '25000000000',
          cashflowFromFinancing: '50000000000',
          netIncome: '95000000000'
        }
      ],
      quarterlyReports: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedCurrency: 'USD',
          operatingCashflow: '30000000000',
          paymentsForOperatingActivities: '12000000000',
          proceedsFromOperatingActivities: '42000000000',
          changeInOperatingIncome: '2500000000',
          changeInNetIncome: '2000000000',
          changeInAccountReceivables: '1200000000',
          changeInInventory: '500000000',
          changeInCashAndCashEquivalents: '4000000000',
          changeInAccountPayables: '800000000',
          changeInPrepaidExpenses: '300000000',
          changeInOperatingActivities: '2500000000',
          capitalExpenditures: '5000000000',
          profitLoss: '23200000000',
          cashflowFromInvestment: '6000000000',
          cashflowFromFinancing: '12000000000',
          netIncome: '23200000000'
        }
      ]
    },
    earnings: {
      symbol: 'AAPL',
      annualEarnings: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedDate: '2024-05-02',
          reportedEPS: '6.50',
          estimatedEPS: '6.45',
          surprise: '0.05',
          surprisePercentage: '0.77'
        },
        {
          fiscalDateEnding: '2023-12-31',
          reportedDate: '2024-02-01',
          reportedEPS: '7.20',
          estimatedEPS: '7.15',
          surprise: '0.05',
          surprisePercentage: '0.70'
        }
      ],
      quarterlyEarnings: [
        {
          fiscalDateEnding: '2024-03-31',
          reportedDate: '2024-05-02',
          reportedEPS: '1.55',
          estimatedEPS: '1.50',
          surprise: '0.05',
          surprisePercentage: '3.33'
        },
        {
          fiscalDateEnding: '2023-12-31',
          reportedDate: '2024-02-01',
          reportedEPS: '1.80',
          estimatedEPS: '1.75',
          surprise: '0.05',
          surprisePercentage: '2.86'
        }
      ]
    }
  }
};

export function getMockData(symbol: string, type: string) {
  if (mockData[symbol as keyof typeof mockData]) {
    return mockData[symbol as keyof typeof mockData][type as keyof typeof mockData.AAPL];
  }
  return {};
}
