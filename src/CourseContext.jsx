import React, { createContext, useState } from 'react';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const enrollCourse = (course) => {
    setEnrolledCourses(prevCourses => [...prevCourses, course]);
  };

  const dropCourse = (courseNumber) => {
    setEnrolledCourses(prevCourses => 
      prevCourses.filter(course => course.courseNumber !== courseNumber)
    );
  };

  return (
    <CourseContext.Provider value={{ 
      enrolledCourses, 
      enrollCourse, 
      dropCourse,
      courseCount: enrolledCourses.length 
    }}>
      {children}
    </CourseContext.Provider>
  );
};