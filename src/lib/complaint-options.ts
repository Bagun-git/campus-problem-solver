// Cascading dropdown data for the complaint form.
// Edit this file to add/remove categories, issues, or locations.

export const COMPLAINT_OPTIONS: Record<string, { issues: string[]; locations: string[] }> = {
  Cleanliness: {
    issues: ["Garbage not collected", "Dirty washroom", "Spilled food", "Pest issue"],
    locations: ["Hostel - Block A", "Hostel - Block B", "Classroom", "Cafeteria", "Library", "Ground"],
  },
  Discipline: {
    issues: ["Bullying", "Smoking on campus", "Noise complaint", "Misbehaviour"],
    locations: ["Hostel - Block A", "Hostel - Block B", "Classroom", "Cafeteria", "Ground"],
  },
  Sports: {
    issues: ["Equipment damaged", "Field unusable", "Coach unavailable"],
    locations: ["Cricket Ground", "Football Ground", "Indoor Hall", "Gym"],
  },
  Event: {
    issues: ["Poor arrangement", "Schedule clash", "Sound system issue"],
    locations: ["Auditorium", "Open Ground", "Classroom"],
  },
  Subject: {
    issues: ["Teacher absent", "Syllabus issue", "Exam concern", "Notes unavailable"],
    locations: ["Department - CSE", "Department - ECE", "Department - Mech", "Department - Civil", "Department - MBA"],
  },
  WiFi: {
    issues: ["No connection", "Slow speed", "Frequent disconnect"],
    locations: ["Hostel - Block A", "Hostel - Block B", "Library", "Classroom", "Cafeteria"],
  },
  Other: {
    issues: ["Other"],
    locations: ["Campus - Other"],
  },
};