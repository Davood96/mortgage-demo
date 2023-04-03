import {
  calculatePayment,
  parseAndValidateParams,
} from "../src/calculator.service";

describe("Unit Tests", () => {
  it("Monthly Payment", () => {
    const actualResult = calculatePayment({
      propertyPrice: 100_000,
      amortizationPeriod: 5,
      annualInterestRate: 2,
      downPayment: 0,
      schedule: "monthly",
    });

    // Used https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx as an oracle
    // Precision will likely be off, so check if in same ballpark amount
    expect(Math.floor(Number(actualResult))).toBeCloseTo(1752);
  });

  it("Biweekly Payment", () => {
    const actualResult = calculatePayment({
      propertyPrice: 100_000,
      amortizationPeriod: 5,
      annualInterestRate: 2,
      downPayment: 0,
      schedule: "bi-weekly",
    });

    // Used https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx as an oracle
    // Precision will likely be off, so check if in same ballpark amount
    expect(Math.floor(Number(actualResult))).toBeCloseTo(808);
  });

  it("Accelerated Biweekly Payment", () => {
    const actualResult = calculatePayment({
      propertyPrice: 100_000,
      amortizationPeriod: 5,
      annualInterestRate: 2,
      downPayment: 0,
      schedule: "accelerated-bi-weekly",
    });

    // Used https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx as an oracle
    // Precision will likely be off, so check if in same ballpark amount
    expect(Math.floor(Number(actualResult))).toBeCloseTo(876);
  });

  it("Catch Type Errors with Input Params", () => {
    expect(parseAndValidateParams({}).success).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000a",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "0",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5a",
        annualInterestRate: "2",
        downPayment: "0",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "2a",
        downPayment: "0",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "0a",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "0",
        schedule: "weekly",
      }).success
    ).toBeFalsy();
  });

  it("Catch Boundary Errors with Input Params", () => {
    expect(
      parseAndValidateParams({
        propertyPrice: "-1",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "0",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "0",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "0",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "4",
        annualInterestRate: "2",
        downPayment: "-1",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "4",
        annualInterestRate: "2",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "31",
        annualInterestRate: "2",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "30",
        annualInterestRate: "2",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "0.00999",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "0.01",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "101",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "100",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();
  });

  it("Catch Semantic Errors with Input Params", () => {
    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "5",
        downPayment: "100000.0001",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "5",
        downPayment: "100000.01",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5.0001",
        annualInterestRate: "2",
        downPayment: "5000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "100000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "0",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "500000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "25000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "500000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "24999.99",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "999999",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "74999.99",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "999999",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "74999.89",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();

    expect(
      parseAndValidateParams({
        propertyPrice: "1000000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "200000",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeTruthy();

    expect(
      parseAndValidateParams({
        propertyPrice: "1000000",
        amortizationPeriod: "5",
        annualInterestRate: "2",
        downPayment: "199999.99",
        schedule: "accelerated-bi-weekly",
      }).success
    ).toBeFalsy();
  });
});
