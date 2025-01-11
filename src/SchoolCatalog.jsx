import { useState, useEffect, useContext } from "react";
import { CourseContext } from './CourseContext';

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const { enrollCourse } = useContext(CourseContext); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    // Reset to first page when sorting
    setCurrentPage(1);
  };

  // Get sorted courses
  const getSortedCourses = (courses) => {
    const sortedCourses = [...courses];
    if (sortConfig.key) {
      sortedCourses.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'semesterCredits' || sortConfig.key === 'clockHours') {
          aVal = Number(aVal);
          bVal = Number(bVal);
        } else {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedCourses;
  };

  // Filter courses
  const filteredCourses = searchTerm.trim() === "" 
    ? courses 
    : courses.filter((course) => {
        const search = searchTerm.toLowerCase().trim();
        return (
          String(course.name).toLowerCase().includes(search) ||
          String(course.courseNumber).toLowerCase().includes(search)
        );
      });

  // Sort filtered courses
  const sortedAndFilteredCourses = getSortedCourses(filteredCourses);

  // Pagination calculations
  const totalPages = Math.ceil(sortedAndFilteredCourses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCourses = sortedAndFilteredCourses.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (error) {
    return <div className="error">Error loading courses: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search by course name or number"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page when searching
        }}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('trimester')} style={{ cursor: 'pointer' }}>
              Trimester{getSortIndicator('trimester')}
            </th>
            <th onClick={() => handleSort('courseNumber')} style={{ cursor: 'pointer' }}>
              Course Number{getSortIndicator('courseNumber')}
            </th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Course Name{getSortIndicator('name')}
            </th>
            <th onClick={() => handleSort('semesterCredits')} style={{ cursor: 'pointer' }}>
              Semester Credits{getSortIndicator('semesterCredits')}
            </th>
            <th onClick={() => handleSort('clockHours')} style={{ cursor: 'pointer' }}>
              Total Clock Hours{getSortIndicator('clockHours')}
            </th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <tr key={course.courseNumber}>
                <td>{course.trimester}</td>
                <td>{course.courseNumber}</td>
                <td>{course.name}</td>
                <td>{course.semesterCredits}</td>
                <td>{course.clockHours}</td>
                <td>
                  <button onClick={() => enrollCourse(course)}>Enroll</button> 
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
      <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{ marginRight: '10px' }}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}