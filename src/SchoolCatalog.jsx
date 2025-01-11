import { useState, useEffect } from "react";

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setCourses(data); // Remove validation for now to see raw data
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Simplified filtering logic
  const filteredCourses = searchTerm.trim() === "" 
    ? courses 
    : courses.filter((course) => {
        const search = searchTerm.toLowerCase().trim();
        return (
          String(course.name).toLowerCase().includes(search) ||
          String(course.courseNumber).toLowerCase().includes(search)
        );
      });

  if (error) {
    return <div className="error">Error loading courses: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search by course name or number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>Trimester</th>
            <th>Course Number</th>
            <th>Course Name</th>
            <th>Semester Credits</th>
            <th>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <tr key={course.courseNumber}>
                <td>{course.trimester}</td>
                <td>{course.courseNumber}</td>
                <td>{course.name}</td>
                <td>{course.semesterCredits}</td>
                <td>{course.clockHours}</td>
                <td>
                  <button>Enroll</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No courses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}