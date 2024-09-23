import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
        // provideHttpClientTesting()
      ],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("Should retrive all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses return");
      expect(courses.length).toBe(12, "Incorrect courses count");
      expect(courses.length).toBeGreaterThan(11, "Should be greater than 11");
      const course = courses.find((course) => course.id == 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES) });
  });

  it("Should retrive course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("No Course Retrive");
      expect(course.id).toBe(12, "Invaild Course Id");
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("Should save course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "This is new description" },
    };

    coursesService
      .saveCourse(12, changes)
      .subscribe((course) => expect(course.id).toBe(12, "Not correct id"));

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description,
      "description not changed"
    );
    req.flush({...COURSES[12], ...changes});
  });

  
  afterEach(() => {
    httpTestingController.verify();
  });
});
