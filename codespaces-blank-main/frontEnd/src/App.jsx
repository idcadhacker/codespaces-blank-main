import React, { useState } from 'react';
import ClassSelection from './ClassSelection'; // Relativní cesta

function App() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSelectedStudent(null); // Reset při změně třídy
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div>
      <h1>Class and Student Management</h1>
      <ClassSelection
        selectedClass={selectedClass}
        onClassSelect={handleClassSelect}
        selectedStudent={selectedStudent}
        onStudentSelect={handleStudentSelect}
      />
    </div>
  );
}

export default App;
