import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

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
      titles: { description: "This is new description" }
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
    req.flush({ ...COURSES[12], ...changes });
  });

  it("Should give an error if course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "This is new description" },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("the save course operator should fail"),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    req.flush("Save course faild", {
      status: 500,
      statusText: "Internal server error",
    });
  });

  it("Should find list of lessons" , () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(req => req.url == "/api/lessons");
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get('courseId')).toBe('12', "Not correct courseId");
    expect(req.request.params.get('filter')).toBe('', 'invaild filter params');
    expect(req.request.params.get('sortOrder')).toEqual("asc");
    expect(req.request.params.get('pageNumber')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('3');

    req.flush({payload: findLessonsForCourse(1).slice(0,3)});
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
