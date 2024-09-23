// spec ==> specification
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    calculator = new CalculatorService(loggerSpy);
  });

  it("It should add two numbers", () => {
    // const logger = new LoggerService();
    // spyOn(logger, 'log');
    // const calculatorService = new CalculatorService(logger);

    const result = calculator.add(2, 3);

    expect(result).toBe(5, "unexpected add result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    // pending();
    // fail();
  });

  it("It should subtract two numbers", () => {
    const calculator = new CalculatorService(new LoggerService());

    const result = calculator.subtract(5, 3);

    expect(result).toBe(2, "Unexpected subtract result");
  });
});
