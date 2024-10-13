import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

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
    }
  ));

  it("Async test example - plain promise", fakeAsync(
    () => {
      let test = false;
      console.log("Creating promise");

      setTimeout(() => {
        console.log("first statement triggers");
      });

      setTimeout(() => {
        console.log("second statement triggers");
      });

      Promise.resolve()
        .then(() => {
          console.log("promise evaluated successfully");
          return Promise.resolve();
        })
        .then(() => {
          console.log("first promise evaluated successfully");
          test = true;
        }
      );

      flushMicrotasks();
      console.log("Running the asseration");
      expect(test).toBeTruthy();
      tick(500);
    }
  ));

  it("Async test example promises + setTimeout", fakeAsync(
    () => {
      let counter = 0;

      Promise.resolve().then(() => {
        counter += 15;

        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

      expect(counter).toBe(0);
      flushMicrotasks();
      expect(counter).toBe(15);
      tick(500);
      expect(counter).toBe(15);
      tick(500);
      expect(counter).toBe(16);
    }
  ));

  it("Async test example - Observables", fakeAsync(
    () => {
      let test = false;
      console.log("Creating observable");

      const test$ = of(test).pipe(delay(1000));

      test$.subscribe(() => {
        test = true;
      });

      tick(1000);
      console.log("Asseration called");
      expect(test).toBe(true);
    })
  );
});
