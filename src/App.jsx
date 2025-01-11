import SchoolCatalog from "./SchoolCatalog";
import Header from "./Header";
import ClassSchedule from "./ClassSchedule";
import { CourseProvider } from './CourseContext';

export default function App() {
  return (
    <CourseProvider> 
      <div>
        <Header />
        <SchoolCatalog />
        <ClassSchedule />
      </div>
    </CourseProvider>
  );
}