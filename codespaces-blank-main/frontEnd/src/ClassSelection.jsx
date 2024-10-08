import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';


const ClassSelection = ({ selectedClass, onClassSelect, selectedStudent, onStudentSelect }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [gradeData, setGradeData] = useState({ grade: '', weight: '', description: '' });
  const [studentGrades, setStudentGrades] = useState([]); // Nový stav pro známky studenta
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/classes');
        setClasses(response.data);
      } catch (error) {
        setError('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/students/class/${selectedClass.id}`);
          setStudents(response.data);
        } catch (error) {
          setError('Failed to load students');
        }
      };

      fetchStudents();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedStudent) {
      const fetchGrades = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/grades/student/${selectedStudent.id}`);
          setStudentGrades(response.data);
        } catch (error) {
          setError('Failed to load grades');
        }
      };

      fetchGrades();
    }
  }, [selectedStudent]);

  const handleAddStudent = async () => {
    try {
      await axios.post('http://localhost:5000/students', {
        name: newStudentName,
        classId: selectedClass.id
      });
      setNewStudentName('');
      onClassSelect(selectedClass); // Refresh students
    } catch (error) {
      setError('Failed to add student');
    }
  };

  const handleAddGrade = async () => {
    try {
      await axios.post('http://localhost:5000/grades', {
        studentId: selectedStudent.id,
        ...gradeData
      });
      setGradeData({ grade: '', weight: '', description: '' });
      onStudentSelect(selectedStudent); // Refresh grades
    } catch (error) {
      setError('Failed to add grade');
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    try {
      await axios.delete(`http://localhost:5000/grades/${gradeId}`);
      onStudentSelect(selectedStudent); // Refresh grades
    } catch (error) {
      setError('Failed to delete grade');
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await axios.delete(`http://localhost:5000/students/${selectedStudent.id}`);
      onStudentSelect(null);
      onClassSelect(selectedClass); // Refresh students
    } catch (error) {
      setError('Failed to delete student');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Select Class</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id} onClick={() => onClassSelect(classItem)}>
            {classItem.name}
          </li>
        ))}
      </ul>

      {selectedClass && (
        <div>
          <h3>Students in {selectedClass.name}</h3>
          <ul>
            {students.map((student) => (
              <li key={student.id} onClick={() => onStudentSelect(student)}>
                {student.name}
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="New student name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <button onClick={handleAddStudent}>Add Student</button>

          {selectedStudent && (
            <div>
              <h4>Grades for {selectedStudent.name}</h4>
              <input
                type="number"
                placeholder="Grade (1-5)"
                value={gradeData.grade}
                onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
              />
              <input
                type="number"
                placeholder="Weight (1-10)"
                value={gradeData.weight}
                onChange={(e) => setGradeData({ ...gradeData, weight: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={gradeData.description}
                onChange={(e) => setGradeData({ ...gradeData, description: e.target.value })}
              />
              <button onClick={handleAddGrade}>Add Grade</button>

              <button onClick={handleDeleteStudent}>Delete Student</button>

              <h5>Existing Grades:</h5>
              <ul>
                {studentGrades.map((grade) => (
                  <li key={grade.id}>
                    {`Grade: ${grade.grade}, Weight: ${grade.weight}, Description: ${grade.description}`}
                    <button onClick={() => handleDeleteGrade(grade.id)}>Delete</button>
                  </li>
                ))}
              </ul>

              <div>
                <h5>Average Grade: </h5>
                <p>{selectedStudent && (
                  <span>{studentGrades.length ? (
                    <span>{(studentGrades.reduce((sum, g) => sum + g.grade * g.weight, 0) / studentGrades.reduce((sum, g) => sum + g.weight, 0)).toFixed(2)}</span>
                  ) : (
                    <span>No grades available</span>
                  )}</span>
                )}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassSelection;
