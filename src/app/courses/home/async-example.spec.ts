import { fakeAsync, flush, tick } from "@angular/core/testing";

describe("Async testing examples", () => {
  it("Async testing example with jasmine done", (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Async test example - setTimeout()", fakeAsync(
    () => {
      let test = false;

      setTimeout(() => {
        test = true;
      }, 1000);

      // tick(1000);
      flush();
      expect(test).toBeTruthy();
    })
  );

  it("Async test example - plain promise", () => {
    let test = false;
    console.log("Creating promise");

    setTimeout(() => {
      console.log("first statement triggers");
    });

    setTimeout(() => {
      console.log("second statement triggers");
    });

    Promise.resolve().then(() => {
      console.log("promise evaluated successfully");
      return Promise.resolve();
    }).then(() => {
      console.log("first promise evaluated successfully");
      test = true;
    });

    console.log("Running the asseration");
    expect(test).toBeTruthy();

    // setTimeout(() => {
    //   done();
    // }, 2000);
  });
});
