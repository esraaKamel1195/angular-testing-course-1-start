import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient } from "@angular/common/http";
import { CoursesService } from "../services/courses.service";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { HomeComponent } from "./home.component";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(async () => {
    const coursesSeriveceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    await TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [{ provide: CoursesService, useValue: coursesSeriveceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  });

  it("Should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("Should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of beginner tabs");
  });

  it("Should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of advanced tabs");
  });

  it("Should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs");
  });

  it("Should display advanced courses when tab clicked", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
      expect(cardTitles).toBeTruthy();
      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Unexpected number of courses"
      );
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    });
  }));
});
